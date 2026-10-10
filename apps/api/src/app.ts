import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import {
  truncateText,
  HealthResponse,
  ApiErrorResponse,
} from '@screenai/shared';
import { config } from './config';
import { createAiProvider } from './providers';
import { summarizeRequestSchema, chatRequestSchema } from './validation';

export function createApp() {
  const app = express();
  const provider = createAiProvider();

  // Helmet with relaxed cross-origin settings for extension & web communication
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configuration
  const allowedOrigins = [
    config.webOrigin,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, unit tests)
        if (!origin) return callback(null, true);

        // Allow any chrome-extension or edge-extension origin
        if (
          origin.startsWith('chrome-extension://') ||
          origin.startsWith('moz-extension://')
        ) {
          if (config.extensionId) {
            if (origin === `chrome-extension://${config.extensionId}`) {
              return callback(null, true);
            }
            return callback(new Error('Extension origin not authorized by configuration'));
          }
          return callback(null, true);
        }

        // Check configured web origins or localhost
        if (
          allowedOrigins.includes(origin) ||
          origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:')
        ) {
          return callback(null, true);
        }

        callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
    })
  );

  app.use(express.json({ limit: '2mb' }));

  // Rate Limiter
  const apiLimiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many requests. Please wait a moment before sending another request.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  });

  // Health Endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    const health: HealthResponse = {
      status: 'ok',
      provider: provider.name,
      model: provider.model,
      hasKey: provider.isConfigured && provider.name !== 'mock',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
    res.json(health);
  });

  // Summarize Endpoint
  app.post(
    '/api/summarize',
    apiLimiter,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = summarizeRequestSchema.parse(req.body);

        // Truncate if main text exceeds max allowed characters to protect AI token limits
        if (validated.page.mainText.length > config.maxContentChars) {
          const { text, truncated } = truncateText(
            validated.page.mainText,
            config.maxContentChars
          );
          validated.page.mainText = text;
          validated.page.truncated = truncated;
        }

        const result = await provider.summarize(validated);
        res.json(result);
      } catch (err) {
        next(err);
      }
    }
  );

  // Chat Endpoint
  app.post(
    '/api/chat',
    apiLimiter,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = chatRequestSchema.parse(req.body);

        // Truncate if main text exceeds max allowed characters
        if (validated.page.mainText.length > config.maxContentChars) {
          const { text, truncated } = truncateText(
            validated.page.mainText,
            config.maxContentChars
          );
          validated.page.mainText = text;
          validated.page.truncated = truncated;
        }

        const result = await provider.chat(validated);
        res.json(result);
      } catch (err) {
        next(err);
      }
    }
  );

  // 404 Route handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: `Endpoint not found: ${req.method} ${req.path}`,
      code: 'NOT_FOUND',
    } satisfies ApiErrorResponse);
  });

  // Global Error Handler
  app.use(
    (err: unknown, req: Request, res: Response, _next: NextFunction) => {
      if (err instanceof ZodError) {
        const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        return res.status(400).json({
          error: `Invalid request data: ${messages}`,
          code: 'VALIDATION_ERROR',
          details: err.flatten(),
        } satisfies ApiErrorResponse);
      }

      if (err instanceof Error) {
        // Safe user-friendly message without leaking stack traces or credentials
        const status = err.message.includes('not allowed by CORS') ? 403 : 500;
        return res.status(status).json({
          error: err.message,
          code: 'INTERNAL_ERROR',
        } satisfies ApiErrorResponse);
      }

      return res.status(500).json({
        error: 'An unexpected internal server error occurred.',
        code: 'UNKNOWN_ERROR',
      } satisfies ApiErrorResponse);
    }
  );

  return app;
}

