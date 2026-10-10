import React, { useState } from 'react';
import {
  Terminal,
  Download,
  Copy,
  Check,
  Chrome,
  Server,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const InstallGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const steps = [
    {
      num: 1,
      title: 'Build the Extension Package',
      desc: 'Build the Chromium Manifest V3 extension bundle to the dist-extension/ directory.',
      code: 'npm install\nnpm run build:extension',
      id: 'step1',
    },
    {
      num: 2,
      title: 'Start the ScreenAI Backend',
      desc: 'Launch the API server on port 3001. If AI_API_KEY is not set, it runs in local intelligent fallback mode.',
      code: 'npm run dev:api',
      id: 'step2',
    },
    {
      num: 3,
      title: 'Load Unpacked into Chrome or Edge',
      desc: 'Open chrome://extensions or edge://extensions, enable "Developer mode", click "Load unpacked", and select the dist-extension folder in this project.',
      id: 'step3',
    },
    {
      num: 4,
      title: 'Pin & Browse',
      desc: 'Pin the ScreenAI icon to your browser toolbar. Navigate to any article or doc page and open the assistant side panel!',
      id: 'step4',
    },
  ];

  return (
    <section id="install">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--brand-purple)',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '8px',
            }}
          >
            <Download size={14} /> Quick Installation
          </div>
          <h2
            className="text-gradient"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}
          >
            Install ScreenAI in 2 Minutes
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', fontSize: '15px' }}>
            ScreenAI is fully open-source and runs directly on your machine. Load the unpacked
            extension into Google Chrome, Microsoft Edge, or any Chromium browser.
          </p>
        </div>

        {/* Steps Grid */}
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {steps.map((s) => (
            <div
              key={s.id}
              className="glass-card"
              style={{
                padding: '24px',
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--brand-cyan)',
                  fontWeight: 800,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {s.num}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: s.code ? '10px' : '0' }}>
                  {s.desc}
                </p>

                {s.code && (
                  <div
                    style={{
                      background: '#07090E',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12.5px',
                      color: '#93C5FD',
                    }}
                  >
                    <pre style={{ margin: 0 }}>
                      <code>{s.code}</code>
                    </pre>
                    <button
                      onClick={() => handleCopy(s.code, s.id)}
                      className="btn-ghost"
                      style={{ padding: '4px 8px', fontSize: '11px', gap: '4px' }}
                    >
                      {copiedCode === s.id ? (
                        <>
                          <Check size={12} color="#10B981" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Development & Production Note */}
        <div
          style={{
            maxWidth: '900px',
            margin: '24px auto 0',
            padding: '16px 20px',
            background: 'rgba(139, 92, 246, 0.06)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#FFFFFF' }}>Store Status:</strong> ScreenAI is distributed as a developer-loadable package. No Chrome Web Store account or telemetry is required.
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <span>View Source on GitHub</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
};

