import React from 'react';
import {
  Sparkles,
  ListOrdered,
  MessageSquare,
  HelpCircle,
  Code2,
  FileCheck,
  Shield,
  Layers,
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Sparkles size={20} color="var(--brand-purple)" />,
      title: 'Multi-Mode Instant Summaries',
      description:
        'Choose between a punchy 3-to-5 sentence Quick summary, a detailed architectural breakdown, or high-impact bulleted Key Takeaways.',
    },
    {
      icon: <ListOrdered size={20} color="var(--brand-cyan)" />,
      title: 'Scannable Key Takeaways',
      description:
        'Extracts the foundational ideas with explicit "Why this matters" context and "What to explore next" suggestions.',
    },
    {
      icon: <MessageSquare size={20} color="#10B981" />,
      title: 'Contextual In-Page Chat',
      description:
        'Ask questions directly about the active tab without copy-pasting text. ScreenAI retains session memory for the current URL.',
    },
    {
      icon: <HelpCircle size={20} color="#F59E0B" />,
      title: 'Beginner-Friendly Explanations',
      description:
        'Request explanations formatted for newcomers. Translates dense academic papers and technical specs into clear analogies.',
    },
    {
      icon: <Code2 size={20} color="#818CF8" />,
      title: 'Code & Documentation Assistance',
      description:
        'Identifies code blocks in documentation and GitHub repositories, explaining API call signatures, prerequisites, and logic flow.',
    },
    {
      icon: <FileCheck size={20} color="#34D399" />,
      title: 'Grounded & Anti-Hallucination',
      description:
        'Distinguishes page-grounded claims from general knowledge. If an article doesn’t state a fact, ScreenAI explicitly says so.',
    },
    {
      icon: <Shield size={20} color="#F43F5E" />,
      title: 'Privacy By Design',
      description:
        'User-initiated processing only. Zero background scraping, zero tracking of browsing history, and zero form input harvesting.',
    },
    {
      icon: <Layers size={20} color="#38BDF8" />,
      title: 'Category-Adaptive Intelligence',
      description:
        'Tailors analysis based on whether you are browsing technical documentation, a GitHub repo, news report, or blog essay.',
    },
  ];

  return (
    <section id="features" style={{ background: '#090B12', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--brand-cyan)',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '8px',
            }}
          >
            Capabilities
          </div>
          <h1></h1>
          <h2
            className="text-gradient"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}
          >
            Engineered for Deep Web Comprehension
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '15px' }}>
            Built specifically to solve the information overload of modern internet research.
          </p>
        </div>

        {/* Feature Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: 'rgba(15, 18, 27, 0.6)',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {f.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

