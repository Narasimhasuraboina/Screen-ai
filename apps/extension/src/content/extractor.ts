import { extractPageContentFromDocument } from '../services/pageExtractor';

// Listen for messages from popup or sidepanel
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'EXTRACT_PAGE_CONTENT') {
    try {
      const pageData = extractPageContentFromDocument(document);
      sendResponse({ success: true, data: pageData });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract content from webpage';
      sendResponse({ success: false, error: errorMessage });
    }
  }
  return true; // Keep message channel open for asynchronous reply
});

