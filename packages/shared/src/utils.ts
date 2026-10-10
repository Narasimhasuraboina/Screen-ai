import { PageCategory } from './types';

export function detectPageCategory(
  url: string,
  title: string = '',
  text: string = ''
): PageCategory {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();

    // GitHub
    if (hostname.includes('github.com') || hostname.includes('gitlab.com')) {
      return 'github';
    }

    // Documentation
    if (
      hostname.includes('docs.') ||
      pathname.includes('/docs') ||
      pathname.includes('/documentation') ||
      pathname.includes('/api-ref') ||
      pathname.includes('/guide') ||
      hostname.includes('developer.') ||
      hostname.includes('gitbook.io') ||
      hostname.includes('readthedocs.io') ||
      hostname.includes('learn.microsoft.com')
    ) {
      return 'documentation';
    }

    // News
    if (
      hostname.includes('news') ||
      hostname.includes('cnn.com') ||
      hostname.includes('bbc.') ||
      hostname.includes('reuters.com') ||
      hostname.includes('nytimes.com') ||
      hostname.includes('theverge.com') ||
      hostname.includes('techcrunch.com') ||
      pathname.includes('/news/') ||
      pathname.includes('/breaking/')
    ) {
      return 'news';
    }

    // Educational / Academia / Tutorials
    if (
      hostname.endsWith('.edu') ||
      hostname.includes('coursera.org') ||
      hostname.includes('khanacademy.org') ||
      hostname.includes('freecodecamp.org') ||
      hostname.includes('wikipedia.org') ||
      pathname.includes('/tutorial') ||
      pathname.includes('/learn/') ||
      pathname.includes('/course/')
    ) {
      return 'educational';
    }

    // Articles & Blogs
    if (
      hostname.includes('medium.com') ||
      hostname.includes('substack.com') ||
      hostname.includes('dev.to') ||
      pathname.includes('/blog/') ||
      pathname.includes('/post/') ||
      pathname.includes('/article/') ||
      pathname.includes('/story/') ||
      text.length > 1500
    ) {
      return 'article';
    }
  } catch {
    // If invalid URL, fallback to heuristic checks on title and text
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('docs') || lowerTitle.includes('guide')) {
      return 'documentation';
    }
  }

  return 'general';
}

export function estimateReadingTime(wordCount: number): number {
  // Average reading speed: 200 words per minute
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function truncateText(
  text: string,
  maxLength: number
): { text: string; truncated: boolean } {
  if (text.length <= maxLength) {
    return { text, truncated: false };
  }
  const sliced = text.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(' ');
  const cleanCut = lastSpace > maxLength * 0.8 ? sliced.slice(0, lastSpace) : sliced;
  return {
    text: cleanCut + '\n\n[Note: Page content truncated to fit model capacity]',
    truncated: true,
  };
}

