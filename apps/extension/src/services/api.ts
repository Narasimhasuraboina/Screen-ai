import {
  SummarizeRequest,
  SummarizeResponse,
  ChatRequest,
  ChatResponse,
  HealthResponse,
} from '@screenai/shared';
import { storage } from './storage';

export class ExtensionApiService {
  private async getBaseUrl(): Promise<string> {
    const settings = await storage.getSettings();
    return settings.apiUrl.replace(/\/+$/, '');
  }

  async checkHealth(): Promise<HealthResponse> {
    const baseUrl = await this.getBaseUrl();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(`${baseUrl}/api/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) {
        throw new Error(`Backend returned status ${res.status}`);
      }
      return (await res.json()) as HealthResponse;
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          throw new Error('Connection timed out. Ensure the ScreenAI backend is running.');
        }
        throw new Error(`Cannot connect to ScreenAI backend at ${baseUrl}: ${err.message}`);
      }
      throw new Error('Cannot connect to ScreenAI backend.');
    }
  }

  async summarizePage(request: SummarizeRequest): Promise<SummarizeResponse> {
    const baseUrl = await this.getBaseUrl();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const res = await fetch(`${baseUrl}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        const message = errorJson?.error || `Summarization failed (Status ${res.status})`;
        throw new Error(message);
      }

      return (await res.json()) as SummarizeResponse;
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          throw new Error('Summarization request timed out. Please try again.');
        }
        throw err;
      }
      throw new Error('An unexpected error occurred while generating summary.');
    }
  }

  async askQuestion(request: ChatRequest): Promise<ChatResponse> {
    const baseUrl = await this.getBaseUrl();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        const message = errorJson?.error || `Chat request failed (Status ${res.status})`;
        throw new Error(message);
      }

      return (await res.json()) as ChatResponse;
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          throw new Error('Chat request timed out. Please try again.');
        }
        throw err;
      }
      throw new Error('An unexpected error occurred during chat.');
    }
  }
}

export const extensionApi = new ExtensionApiService();

