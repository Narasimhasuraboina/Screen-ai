import React from 'react';
import { Shield, Lock, EyeOff, Terminal, Key } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  return (
    <section id="privacy" style={{ background: '#090B11', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#10B981',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '8px',
            }}
          >
            <Shield size={14} /> Privacy & Security Architecture
          </div>
          <h2
            className="text-gradient"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}
          >
            Transparent By Design. Zero Sneaky Tracking.
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '15px' }}>
            We believe your browsing history and private thoughts belong to you. ScreenAI was
            architected with strict privacy boundaries from line one.
          </p>
        </div>

        {/* Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <EyeOff size={20} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
              User-Initiated Analysis Only
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              ScreenAI does not monitor background browsing or silently send URLs to any server. Content is extracted and dispatched to the AI backend <strong>only</strong> when you explicitly request a summary or submit a question.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
              <Key size={20} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
              No API Keys in Client Bundles
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Your LLM credentials never enter the extension package or client-side JavaScript. All AI provider requests are securely dispatched by your self-hosted backend, completely isolating secrets.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4' }}>
              <Lock size={20} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
              Form & Password Sanitization
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The extraction pipeline explicitly ignores and strips all HTML form inputs, password fields, cookie banners, navigation menus, and hidden elements before sending data for AI processing.
            </p>
          </div>
        </div>

        {/* AI Provider Transparency Note */}
        <div
          style={{
            maxWidth: '1000px',
            margin: '32px auto 0',
            padding: '16px 20px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: 'var(--text-secondary)' }}>Note on External AI Providers:</strong> When configured with external models (e.g. OpenAI or Google Gemini), extracted text is processed according to that specific provider’s API data policies. ScreenAI does not operate a secondary tracking database or monetize browsing sessions.
        </div>
      </div>
    </section>
  );
};

