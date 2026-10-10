export type PageCategory =
  | 'article'
  | 'documentation'
  | 'github'
  | 'news'
  | 'educational'
  | 'general';

export interface HeadingItem {
  level: number;
  text: string;
}

export interface CodeSnippet {
  language?: string;
  code: string;
}

export interface LinkItem {
  text: string;
  href: string;
}

export interface WebpageContent {
  url: string;
  title: string;
  domain: string;
  description?: string;
  author?: string;
  publishedTime?: string;
  headings: HeadingItem[];
  mainText: string;
  wordCount: number;
  readingTimeMinutes: number;
  codeSnippets: CodeSnippet[];
  links: LinkItem[];
  category: PageCategory;
  extractedAt: number;
  truncated?: boolean;
}

export type SummaryMode = 'quick' | 'detailed' | 'takeaways';

export interface SummarizeRequest {
  page: WebpageContent;
  mode: SummaryMode;
  customPrompt?: string;
}

export interface KeySection {
  title: string;
  content: string;
}

export interface SummarizeResponse {
  summary: string;
  mode: SummaryMode;
  mainTopic?: string;
  keyTakeaways: string[];
  whyItMatters?: string;
  whatToExploreNext?: string;
  keySections?: KeySection[];
  references?: string[];
  confidenceNote?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isPageGrounded?: boolean;
  references?: string[];
}

export interface ChatRequest {
  page: WebpageContent;
  messages: ChatMessage[];
  question: string;
}

export interface ChatResponse {
  reply: string;
  isPageGrounded: boolean;
  references?: string[];
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  provider: string;
  model: string;
  hasKey: boolean;
  version: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
}

