import React from 'react';
import { Compass, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Browse any webpage',
      description:
        'Read documentation, GitHub repos, technical whitepapers, or long-form essays as you normally do in Chrome or Edge.',
      icon: <Compass size={22} color="var(--brand-cyan)" />,
      tag: 'Zero Copy-Pasting',
    },
    {
      number: '02',
      title: 'Open ScreenAI Side Panel',
      description:
        'Click the ScreenAI icon in your browser toolbar. The assistant scans the main article body and instantly creates clean summaries and takeaways.',
      icon: <Sparkles size={22} color="var(--brand-purple)" />,
      tag: 'One-Click Extraction',
    },
    {
      number: '03',
      title: 'Ask questions & understand',
      description:
        'Ask follow-up questions, request beginner analogies, decode code snippets, or test yourself with study questions — all grounded in the page text.',
      icon: <MessageSquare size={22} color="#10B981" />,
      tag: 'Page-Grounded AI',
    },
  ];

  return (
    <section id="how-it-works">
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
            The Workflow
          </div>
          <h2
            className="text-gradient"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}
          >
            Browse → Understand → Ask → Learn
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '15px' }}>
            No more switching tabs, copying 5,000 words into a generic chat prompt, or losing your reading flow.
          </p>
        </div>

        {/* Step Sequence Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            position: 'relative',
          }}
        >
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '32px 26px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.icon}
                </div>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: 'rgba(255, 255, 255, 0.12)',
                  }}
                >
                  {step.number}
                </span>
              </div>

              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--brand-cyan)',
                    background: 'rgba(6, 182, 212, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    marginBottom: '8px',
                  }}
                >
                  {step.tag}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

