import React, { useState, useEffect } from 'react';
import {
  Server,
  Shield,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  ExternalLink,
} from 'lucide-react';
import { HealthResponse } from '@screenai/shared';
import { storage } from '../services/storage';
import { extensionApi } from '../services/api';

interface SettingsTabProps {
  backendHealth: HealthResponse | null;
  setBackendHealth: (h: HealthResponse | null) => void;
  setBackendError: (e: string | null) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  backendHealth,
  setBackendHealth,
  setBackendError,
}) => {
  const [apiUrl, setApiUrl] = useState('http://localhost:3001');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    storage.getSettings().then((s) => setApiUrl(s.apiUrl));
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setStatusMessage(null);
    try {
      await storage.saveSettings({ apiUrl });
      const health = await extensionApi.checkHealth();
      setBackendHealth(health);
      setBackendError(null);
      setStatusMessage('Connected successfully to ScreenAI Backend!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setBackendHealth(null);
      setBackendError(msg);
      setStatusMessage(`Error: ${msg}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await storage.saveSettings({ apiUrl });
      setStatusMessage('Settings saved.');
      handleTestConnection();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
      {/* Backend Server Configuration */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#FFF', marginBottom: '8px' }}>
          <Server size={14} color="var(--accent-brand)" />
          <span>Backend API Server</span>
        </div>

        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          ScreenAI communicates with your local or self-hosted backend. Secret API keys remain securely on the server.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <label style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              SERVER URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:3001"
              style={{
                width: '100%',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '7px 10px',
                color: '#FFF',
                fontSize: '12px',
                outline: 'none',
                fontFamily: 'var(--font-mono)',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button
              onClick={handleTestConnection}
              className="btn-primary"
              style={{ flex: 1, padding: '7px 10px', fontSize: '11.5px', gap: '4px' }}
              disabled={isTesting}
            >
              {isTesting ? (
                <>
                  <RotateCw size={12} className="animate-spin-slow" /> Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
            <button
              onClick={handleSave}
              className="btn-secondary"
              style={{ padding: '7px 12px', fontSize: '11.5px' }}
              disabled={isSaving}
            >
              Save
            </button>
          </div>

          {statusMessage && (
            <div
              style={{
                fontSize: '11px',
                padding: '6px 8px',
                borderRadius: '4px',
                background: statusMessage.startsWith('Error')
                  ? 'rgba(244, 63, 94, 0.1)'
                  : 'rgba(16, 185, 129, 0.1)',
                color: statusMessage.startsWith('Error') ? '#FCA5A5' : '#6EE7B7',
                border: `1px solid ${statusMessage.startsWith('Error') ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
              }}
            >
              {statusMessage}
            </div>
          )}
        </div>

        {/* Live Server Details */}
        {backendHealth && (
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <span style={{ color: '#10B981', fontWeight: 600 }}>Active (v{backendHealth.version})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Provider:</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{backendHealth.provider}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Model:</span>
              <span style={{ color: 'var(--text-primary)' }}>{backendHealth.model}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>AI Key Status:</span>
              <span style={{ color: backendHealth.hasKey ? '#10B981' : '#F59E0B' }}>
                {backendHealth.hasKey ? 'Configured' : 'Local Fallback Engine'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Guarantees */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#FFF', marginBottom: '8px' }}>
          <Shield size={14} color="#10B981" />
          <span>Privacy & Security Guarantees</span>
        </div>

        <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <li>
            <strong style={{ color: '#FFF' }}>User-Initiated Processing:</strong> Webpage text is analyzed ONLY when you explicitly click Summarize or send a question.
          </li>
          <li>
            <strong style={{ color: '#FFF' }}>Zero Background Tracking:</strong> ScreenAI never uploads pages in the background or monitors your browsing habits.
          </li>
          <li>
            <strong style={{ color: '#FFF' }}>No Credential Scraping:</strong> Form inputs, passwords, and user-entered personal data are completely stripped before processing.
          </li>
          <li>
            <strong style={{ color: '#FFF' }}>Anti-Prompt-Injection:</strong> Webpage content is treated as untrusted external data to guard against injection attempts.
          </li>
        </ul>
      </div>

      {/* Information Footer */}
      <div style={{ textAlign: 'center', fontSize: '10.5px', color: 'var(--text-muted)', paddingTop: '4px' }}>
        ScreenAI Assistant v1.0.0 · Chromium Manifest V3
      </div>
    </div>
  );
};

