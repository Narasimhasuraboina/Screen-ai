import {
  WebpageContent,
  HeadingItem,
  CodeSnippet,
  LinkItem,
  detectPageCategory,
  estimateReadingTime,
} from '@screenai/shared';

export function extractPageContentFromDocument(doc: Document = document): WebpageContent {
  const url = window.location.href;
  const domain = window.location.hostname;
  const title = (doc.title || 'Untitled Webpage').trim();

  // Meta description & author
  const metaDesc =
    doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
    doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
    '';

  const metaAuthor =
    doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
    doc.querySelector('meta[property="article:author"]')?.getAttribute('content') ||
    '';

  const publishedTime =
    doc.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
    doc.querySelector('time')?.getAttribute('datetime') ||
    '';

  // Identify main semantic container
  const candidateSelectors = [
    'article',
    '[role="article"]',
    'main',
    '[role="main"]',
    '.markdown-body',
    '.article-content',
    '.post-content',
    '.entry-content',
    '.content',
    '#content',
  ];

  let mainContainer: Element | null = null;
  for (const selector of candidateSelectors) {
    const el = doc.querySelector(selector);
    if (el && (el.textContent || '').trim().length > 300) {
      mainContainer = el;
      break;
    }
  }

  // Fallback to body
  const rootElement = mainContainer || doc.body;

  // Clone so we don't mutate active page
  const clone = rootElement.cloneNode(true) as HTMLElement;

  // Strip noise
  const noiseSelectors = [
    'script',
    'style',
    'noscript',
    'iframe',
    'svg',
    'canvas',
    'nav',
    'header',
    'footer',
    'aside',
    'form',
    'input',
    'button',
    'select',
    'textarea',
    '[role="navigation"]',
    '[role="banner"]',
    '[role="complementary"]',
    '[aria-hidden="true"]',
    '.cookie-banner',
    '.consent-banner',
    '.ad',
    '.advertisement',
    '.sidebar',
    '.nav',
    '.menu',
  ];

  noiseSelectors.forEach((selector) => {
    clone.querySelectorAll(selector).forEach((el) => el.remove());
  });

  // Extract headings
  const headings: HeadingItem[] = [];
  rootElement.querySelectorAll('h1, h2, h3').forEach((el) => {
    const text = (el.textContent || '').trim();
    if (text.length > 2 && text.length < 200) {
      const level = parseInt(el.tagName.replace('H', ''), 10) || 2;
      headings.push({ level, text });
    }
  });

  // Extract code snippets
  const codeSnippets: CodeSnippet[] = [];
  rootElement.querySelectorAll('pre code, pre').forEach((el) => {
    const code = (el.textContent || '').trim();
    if (code.length > 20 && code.length < 5000) {
      const className = el.className || el.parentElement?.className || '';
      const match = className.match(/language-(\w+)|lang-(\w+)/);
      const language = match ? match[1] || match[2] : undefined;
      codeSnippets.push({ language, code });
    }
  });

  // Extract links
  const links: LinkItem[] = [];
  rootElement.querySelectorAll('a[href]').forEach((el) => {
    const a = el as HTMLAnchorElement;
    const text = (a.textContent || '').trim();
    const href = a.href;
    if (text.length > 3 && href && !href.startsWith('javascript:')) {
      if (links.length < 15 && !links.some((l) => l.href === href)) {
        links.push({ text: text.slice(0, 100), href });
      }
    }
  });

  // Clean raw text
  let rawText = clone.innerText || clone.textContent || '';
  rawText = rawText
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const words = rawText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTimeMinutes = estimateReadingTime(wordCount);
  const category = detectPageCategory(url, title, rawText);

  return {
    url,
    title,
    domain,
    description: metaDesc || undefined,
    author: metaAuthor || undefined,
    publishedTime: publishedTime || undefined,
    headings: headings.slice(0, 20),
    mainText: rawText,
    wordCount,
    readingTimeMinutes,
    codeSnippets: codeSnippets.slice(0, 5),
    links,
    category,
    extractedAt: Date.now(),
  };
}

