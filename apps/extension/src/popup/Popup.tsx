import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { extensionApi } from '../services/api';
import { HealthResponse } from '@screenai/shared';

export const Popup: React.FC = () => {
  const [pageTitle, setPageTitle] = useState('');
  const [pageDomain, setPageDomain] = useState('');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0]) {
          setPageTitle(tabs[0].title || 'Active Tab');
          if (tabs[0].url) {
            try {
              setPageDomain(new URL(tabs[0].url).hostname);
            } catch {
              setPageDomain('');
            }
          }
        }
      });
    }

    extensionApi
      .checkHealth()
      .then((h) => setHealth(h))
      .catch((err) => setHealthError(err instanceof Error ? err.message : 'Offline'));
  }, []);

  const handleOpenSidePanel = async () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0] && tabs[0].id && chrome.sidePanel && chrome.sidePanel.open) {
        chrome.sidePanel.open({ tabId: tabs[0].id });
        window.close();
      }
    }
  };

  return (
    <div style={{ width: '320px', padding: '16px', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', lineHeight: 1.2 }}>ScreenAI</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>AI Browser Assistant</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
          {health ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '10.5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
              Ready
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F43F5E', fontSize: '10.5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F43F5E' }} />
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Active Webpage Card */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
          Active Webpage
        </div>
        <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }} title={pageTitle}>
          {pageTitle || 'No active tab'}
        </div>
        {pageDomain && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <Globe size={11} />
            <span>{pageDomain}</span>
          </div>
        )}
      </div>

      {/* Primary CTA */}
      <button
        onClick={handleOpenSidePanel}
        className="btn-primary"
        style={{ width: '100%', padding: '10px', fontSize: '12.5px', gap: '6px' }}
      >
        <Sparkles size={14} />
        <span>Open Side Panel Assistant</span>
      </button>

      {/* Tip */}
      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
        💡 Click the ScreenAI icon in your toolbar to toggle the side panel anytime while browsing.
      </div>
    </div>
  );
};

