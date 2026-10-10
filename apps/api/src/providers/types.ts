import {
  SummarizeRequest,
  SummarizeResponse,
  ChatRequest,
  ChatResponse,
} from '@screenai/shared';

export interface AiProviderAdapter {
  readonly name: string;
  readonly model: string;
  readonly isConfigured: boolean;
  summarize(request: SummarizeRequest): Promise<SummarizeResponse>;
  chat(request: ChatRequest): Promise<ChatResponse>;
}

