import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  webOrigin: process.env.WEB_ORIGIN || 'http://localhost:5173',
  extensionId: process.env.EXTENSION_ID || '',
  aiProvider: (process.env.AI_PROVIDER || 'openai').toLowerCase(),
  aiApiKey: process.env.AI_API_KEY || '',
  aiModel: process.env.AI_MODEL || (process.env.AI_PROVIDER === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini'),
  aiBaseUrl: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '60', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  maxContentChars: parseInt(process.env.MAX_CONTENT_CHARS || '50000', 10),
};

