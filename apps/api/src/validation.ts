import { z } from 'zod';

export const pageContentSchema = z.object({
  url: z.string().url('Invalid URL format'),
  title: z.string().min(1, 'Title is required').max(500),
  domain: z.string().min(1, 'Domain is required'),
  description: z.string().max(2000).optional(),
  author: z.string().max(200).optional(),
  publishedTime: z.string().max(100).optional(),
  headings: z.array(
    z.object({
      level: z.number().int().min(1).max(6),
      text: z.string().max(500),
    })
  ).default([]),
  mainText: z.string().min(10, 'Webpage content is too short or empty to analyze'),
  wordCount: z.number().int().nonnegative().default(0),
  readingTimeMinutes: z.number().int().positive().default(1),
  codeSnippets: z.array(
    z.object({
      language: z.string().optional(),
      code: z.string().max(10000),
    })
  ).default([]),
  links: z.array(
    z.object({
      text: z.string().max(300),
      href: z.string().max(2000),
    })
  ).default([]),
  category: z.enum(['article', 'documentation', 'github', 'news', 'educational', 'general']).default('general'),
  extractedAt: z.number().default(() => Date.now()),
  truncated: z.boolean().optional(),
});

export const summarizeRequestSchema = z.object({
  page: pageContentSchema,
  mode: z.enum(['quick', 'detailed', 'takeaways']).default('quick'),
  customPrompt: z.string().max(1000).optional(),
});

export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().max(10000),
  timestamp: z.number().default(() => Date.now()),
  isPageGrounded: z.boolean().optional(),
  references: z.array(z.string()).optional(),
});

export const chatRequestSchema = z.object({
  page: pageContentSchema,
  messages: z.array(chatMessageSchema).default([]),
  question: z.string().min(1, 'Question cannot be empty').max(2000),
});

