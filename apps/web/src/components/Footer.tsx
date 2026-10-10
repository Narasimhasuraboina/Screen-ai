import React from 'react';
import { Sparkles, Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: '#06070B',
        borderTop: '1px solid var(--border-subtle)',
        padding: '60px 0 40px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '36px',
            marginBottom: '48px',
          }}
        >
          {/* Brand Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={16} color="#FFF" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '17px', color: '#FFF' }}>
                Screen<span style={{ color: 'var(--brand-purple)' }}>AI</span>
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The privacy-conscious, context-aware AI browser companion. Built for engineers, researchers, and curious minds.
            </p>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <a href="#demo" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Interactive Demo
                </a>
              </li>
              <li>
                <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Product Features
                </a>
              </li>
              <li>
                <a href="#install" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Installation Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture Col */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
              Architecture
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <a href="#privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Privacy Model
                </a>
              </li>
              <li>
                <span style={{ color: 'var(--text-muted)' }}>Chromium Manifest V3</span>
              </li>
              <li>
                <span style={{ color: 'var(--text-muted)' }}>Chrome Side Panel API</span>
              </li>
              <li>
                <span style={{ color: 'var(--text-muted)' }}>Local AI Mock Engine</span>
              </li>
            </ul>
          </div>

          {/* Open Source Col */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
              Community
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none' }}
                >
                  <Github size={14} />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a href="#install" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Developer Setup
                </a>
              </li>
              <li>
                <span style={{ color: 'var(--text-muted)' }}>MIT License</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <div>© {new Date().getFullYear()} ScreenAI. Open-source under MIT License.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Engineered with React, TypeScript & Manifest V3</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

