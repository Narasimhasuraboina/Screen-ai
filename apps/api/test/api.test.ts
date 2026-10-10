import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { WebpageContent } from '@screenai/shared';

const app = createApp();

const samplePage: WebpageContent = {
  url: 'https://example.com/docs/react-hooks',
  title: 'Understanding React Hooks Architecture',
  domain: 'example.com',
  description: 'A deep dive into how React hooks work under the hood.',
  author: 'Dan Abramov',
  headings: [
    { level: 1, text: 'Understanding React Hooks Architecture' },
    { level: 2, text: 'The Fiber Dispatcher and Memory Cells' },
    { level: 2, text: 'Rules of Hooks and Static Analysis' },
  ],
  mainText:
    'React hooks allow functional components to maintain state without writing classes. Hooks rely on a linked list of hook cells attached to the currently rendering fiber. When useState is called, it inspects the current dispatcher. You must never call hooks inside loops or conditions because the order of hook calls must remain deterministic between renders. This architecture simplifies lifecycle logic and code reuse across large frontends.',
  wordCount: 75,
  readingTimeMinutes: 1,
  codeSnippets: [
    {
      language: 'typescript',
      code: 'const [count, setCount] = useState(0);',
    },
  ],
  links: [{ text: 'Official Documentation', href: 'https://react.dev' }],
  category: 'documentation',
  extractedAt: Date.now(),
};

describe('ScreenAI API Endpoints', () => {
  it('GET /api/health should respond with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('provider');
    expect(res.body).toHaveProperty('model');
    expect(res.body).toHaveProperty('version');
  });

  it('POST /api/summarize should generate quick summary and takeaways', async () => {
    const res = await request(app)
      .post('/api/summarize')
      .send({
        page: samplePage,
        mode: 'quick',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('summary');
    expect(res.body).toHaveProperty('mode', 'quick');
    expect(res.body).toHaveProperty('keyTakeaways');
    expect(Array.isArray(res.body.keyTakeaways)).toBe(true);
    expect(res.body.keyTakeaways.length).toBeGreaterThan(0);
  });

  it('POST /api/summarize should generate detailed summary with structured sections', async () => {
    const res = await request(app)
      .post('/api/summarize')
      .send({
        page: samplePage,
        mode: 'detailed',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('summary');
    expect(res.body).toHaveProperty('mode', 'detailed');
    expect(res.body).toHaveProperty('keySections');
    expect(res.body).toHaveProperty('whyItMatters');
  });

  it('POST /api/summarize should reject invalid input with 400', async () => {
    const res = await request(app)
      .post('/api/summarize')
      .send({
        page: {
          url: 'invalid-url',
          // missing title, mainText, etc.
        },
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  it('POST /api/chat should answer questions grounded in page context', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        page: samplePage,
        messages: [],
        question: 'Explain why hooks cannot be used in loops',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('reply');
    expect(res.body).toHaveProperty('isPageGrounded', true);
  });

  it('POST /api/chat should answer beginner questions with structured simplicity', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        page: samplePage,
        messages: [],
        question: 'Explain like I am a beginner',
      });

    expect(res.status).toBe(200);
    expect(res.body.reply.toLowerCase()).toContain('beginner');
    expect(res.body.isPageGrounded).toBe(true);
  });

  it('GET /api/unknown should return 404', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('code', 'NOT_FOUND');
  });
});

