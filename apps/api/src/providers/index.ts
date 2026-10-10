import { config } from '../config';
import { AiProviderAdapter } from './types';
import { MockAiProvider } from './mockProvider';
import { OpenAiCompatibleProvider } from './openaiProvider';
import { GeminiProvider } from './geminiProvider';

export function createAiProvider(): AiProviderAdapter {
  const { aiProvider, aiApiKey, aiModel, aiBaseUrl } = config;

  // If no API key is provided or explicit mock mode, use the intelligent MockAiProvider
  if (!aiApiKey || aiApiKey === 'mock' || aiApiKey === 'your_ai_api_key_here') {
    return new MockAiProvider();
  }

  if (aiProvider === 'gemini') {
    return new GeminiProvider(aiApiKey, aiModel);
  }

  // Default: OpenAI or OpenAI-compatible (Ollama, Groq, OpenRouter, Perplexity, etc.)
  return new OpenAiCompatibleProvider(aiApiKey, aiModel, aiBaseUrl);
}

export * from './types';
export * from './mockProvider';
export * from './openaiProvider';
export * from './geminiProvider';

