import React from 'react';
import { Sparkles, Settings, Globe } from 'lucide-react';
import { HealthResponse } from '@screenai/shared';

interface HeaderProps {
  domain: string;
  backendHealth: HealthResponse | null;
  backendError: string | null;
  activeTab: 'overview' | 'summary' | 'chat' | 'settings';
  setActiveTab: (tab: 'overview' | 'summary' | 'chat' | 'settings') => void;
}

export const Header: React.FC<HeaderProps> = ({
  domain,
  backendHealth,
  backendError,
  activeTab,
  setActiveTab,
}) => {
  const isConnected = !!backendHealth && !backendError;
  const isMock = backendHealth?.provider === 'mock' || !backendHealth?.hasKey;

  return (
    <header className="glass-panel" style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 2px 6px rgba(139,92,246,0.3)' }}>
          <Sparkles size={15} />
        </div>
        <div>
          <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #FFFFFF, #D1D5DB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ScreenAI
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Domain Badge */}
        {domain && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', background: 'var(--bg-surface-elevated)', padding: '3px 8px', borderRadius: '12px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={domain}>
            <Globe size={11} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{domain}</span>
          </div>
        )}

        {/* Backend Status Dot */}
        <button
          onClick={() => setActiveTab('settings')}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 6px', borderRadius: '6px' }}
          title={
            isConnected
              ? isMock
                ? 'Backend: Connected (Intelligent Local Engine)'
                : `Backend: Connected (${backendHealth.provider}/${backendHealth.model})`
              : `Backend: Offline (${backendError || 'Cannot connect'})`
          }
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isConnected ? (isMock ? '#F59E0B' : '#10B981') : '#F43F5E',
              boxShadow: isConnected
                ? isMock
                  ? '0 0 6px rgba(245, 158, 11, 0.6)'
                  : '0 0 6px rgba(16, 185, 129, 0.6)'
                : '0 0 6px rgba(244, 63, 94, 0.6)',
            }}
          />
        </button>

        {/* Settings button */}
        <button
          onClick={() => setActiveTab(activeTab === 'settings' ? 'overview' : 'settings')}
          className="btn-ghost"
          style={{ padding: '5px', color: activeTab === 'settings' ? 'var(--accent-brand)' : 'var(--text-secondary)' }}
          title="Settings & Connection"
        >
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
};

