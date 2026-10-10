import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Sparkles,
  MessageSquare,
  Settings,
} from 'lucide-react';
import {
  WebpageContent,
  SummaryMode,
  SummarizeResponse,
  ChatMessage,
  HealthResponse,
} from '@screenai/shared';
import { Header } from '../components/Header';
import { PageIdentityBanner } from '../components/PageIdentityBanner';
import { OverviewTab } from '../components/OverviewTab';
import { SummaryTab } from '../components/SummaryTab';
import { ChatTab } from '../components/ChatTab';
import { SettingsTab } from '../components/SettingsTab';
import { extensionApi } from '../services/api';

type TabType = 'overview' | 'summary' | 'chat' | 'settings';

export const SidePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [activeTabUrl, setActiveTabUrl] = useState<string>('');
  const [activeTabTitle, setActiveTabTitle] = useState<string>('');
  const [page, setPage] = useState<WebpageContent | null>(null);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  // Summaries & Chat state
  const [summaryMode, setSummaryMode] = useState<SummaryMode>('quick');
  const [summaryData, setSummaryData] = useState<SummarizeResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Backend Health
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Check backend health on mount
  useEffect(() => {
    extensionApi
      .checkHealth()
      .then((h) => {
        setBackendHealth(h);
        setBackendError(null);
      })
      .catch((err) => {
        setBackendHealth(null);
        setBackendError(err instanceof Error ? err.message : 'Cannot connect');
      });
  }, []);

  // Extraction logic from active tab
  const extractActiveTabContent = useCallback(async () => {
    if (typeof chrome === 'undefined' || !chrome.tabs) return;

    setIsExtracting(true);
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs[0];

      if (!currentTab || !currentTab.id) {
        setIsExtracting(false);
        return;
      }

      setActiveTabUrl(currentTab.url || '');
      setActiveTabTitle(currentTab.title || '');

      // Browser internal pages cannot be injected
      if (
        !currentTab.url ||
        currentTab.url.startsWith('chrome://') ||
        currentTab.url.startsWith('edge://') ||
        currentTab.url.startsWith('chrome-extension://')
      ) {
        setPage(null);
        setIsExtracting(false);
        return;
      }

      // Try sending message to content script
      chrome.tabs.sendMessage(
        currentTab.id,
        { action: 'EXTRACT_PAGE_CONTENT' },
        async (response) => {
          if (chrome.runtime.lastError || !response || !response.success) {
            // Content script not ready; execute directly via scripting API
            try {
              if (chrome.scripting) {
                const results = await chrome.scripting.executeScript({
                  target: { tabId: currentTab.id! },
                  func: () => {
                    // Quick inline extractor fallback
                    const url = window.location.href;
                    const domain = window.location.hostname;
                    const title = document.title || 'Untitled';
                    const mainText = (
                      document.querySelector('article, main, [role="main"]') || document.body
                    ).innerText.slice(0, 40000);

                    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
                      .slice(0, 15)
                      .map((h) => ({
                        level: parseInt(h.tagName.replace('H', ''), 10) || 2,
                        text: (h.textContent || '').trim(),
                      }))
                      .filter((h) => h.text.length > 2);

                    const words = mainText.split(/\s+/).filter(Boolean);

                    return {
                      url,
                      domain,
                      title,
                      headings,
                      mainText,
                      wordCount: words.length,
                      readingTimeMinutes: Math.max(1, Math.ceil(words.length / 200)),
                      codeSnippets: [],
                      links: [],
                      category: 'general',
                      extractedAt: Date.now(),
                    };
                  },
                });

                if (results && results[0] && results[0].result) {
                  setPage(results[0].result as WebpageContent);
                  setIsStale(false);
                }
              }
            } catch (injectErr) {
              console.warn('Script injection failed:', injectErr);
            }
          } else {
            setPage(response.data);
            setIsStale(false);
          }
          setIsExtracting(false);
        }
      );
    } catch (err) {
      console.warn('Error extracting active tab:', err);
      setIsExtracting(false);
    }
  }, []);

  // Initial tab query
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0]) {
          setActiveTabUrl(tabs[0].url || '');
          setActiveTabTitle(tabs[0].title || '');
          extractActiveTabContent();
        }
      });
    }
  }, [extractActiveTabContent]);

  // Listen for tab switches or URL updates from background service worker
  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.runtime) return;

    const listener = (message: { action: string; tabId: number; url?: string; title?: string }) => {
      if (message.action === 'TAB_CHANGED' || message.action === 'TAB_UPDATED') {
        if (message.url && message.url !== activeTabUrl) {
          setActiveTabUrl(message.url);
          if (message.title) setActiveTabTitle(message.title);
          // Flag as stale so user is notified and old summary isn't masqueraded as new
          setIsStale(true);
        }
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [activeTabUrl]);

  const handleAnalyzeNewPage = () => {
    // Reset old session so stale content is wiped
    setSummaryData(null);
    setMessages([]);
    setIsStale(false);
    extractActiveTabContent();
  };

  const handleSelectOverviewAction = (tab: 'summary' | 'chat', mode?: SummaryMode) => {
    if (mode) setSummaryMode(mode);
    setActiveTab(tab);
  };

  const domain = page?.domain || (activeTabUrl ? new URL(activeTabUrl).hostname : '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-base)' }}>
      {/* Top Header */}
      <Header
        domain={domain}
        backendHealth={backendHealth}
        backendError={backendError}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Page Identity & Tab Nav Banner */}
      <PageIdentityBanner
        page={page}
        activeTabUrl={activeTabUrl}
        isStale={isStale}
        isLoading={isExtracting}
        onRefresh={extractActiveTabContent}
        onAnalyzeNewPage={handleAnalyzeNewPage}
      />

      {/* Navigation Segmented Control */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            flex: 1,
            padding: '9px 4px',
            fontSize: '11.5px',
            fontWeight: activeTab === 'overview' ? 600 : 500,
            background: 'transparent',
            color: activeTab === 'overview' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid var(--accent-brand)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
          }}
        >
          <FileText size={13} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          style={{
            flex: 1,
            padding: '9px 4px',
            fontSize: '11.5px',
            fontWeight: activeTab === 'summary' ? 600 : 500,
            background: 'transparent',
            color: activeTab === 'summary' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'summary' ? '2px solid var(--accent-brand)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
          }}
        >
          <Sparkles size={13} />
          <span>Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          style={{
            flex: 1,
            padding: '9px 4px',
            fontSize: '11.5px',
            fontWeight: activeTab === 'chat' ? 600 : 500,
            background: 'transparent',
            color: activeTab === 'chat' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'chat' ? '2px solid var(--accent-brand)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
          }}
        >
          <MessageSquare size={13} />
          <span>Ask AI</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '9px 12px',
            fontSize: '11.5px',
            fontWeight: activeTab === 'settings' ? 600 : 500,
            background: 'transparent',
            color: activeTab === 'settings' ? 'var(--accent-brand)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'settings' ? '2px solid var(--accent-brand)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Settings"
        >
          <Settings size={13} />
        </button>
      </div>

      {/* Main Tab Views */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'overview' && (
          <OverviewTab page={page} onSelectAction={handleSelectOverviewAction} />
        )}
        {activeTab === 'summary' && (
          <SummaryTab
            page={page}
            summaryData={summaryData}
            setSummaryData={setSummaryData}
            selectedMode={summaryMode}
            setSelectedMode={setSummaryMode}
          />
        )}
        {activeTab === 'chat' && (
          <ChatTab page={page} messages={messages} setMessages={setMessages} />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            backendHealth={backendHealth}
            setBackendHealth={setBackendHealth}
            setBackendError={setBackendError}
          />
        )}
      </main>
    </div>
  );
};

