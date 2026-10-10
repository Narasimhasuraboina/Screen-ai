import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  RotateCw,
  FileText,
  BookOpen,
  Newspaper,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Lightbulb,
  Compass,
} from 'lucide-react';

interface SampleArticle {
  id: string;
  category: 'documentation' | 'article' | 'news';
  title: string;
  source: string;
  author: string;
  date: string;
  content: string;
  codeSnippet?: { lang: string; code: string };
  quickSummary: string;
  takeaways: string[];
  whyItMatters: string;
  whatToExploreNext: string;
}

const SAMPLE_ARTICLES: SampleArticle[] = [
  {
    id: 'react-19',
    category: 'documentation',
    title: 'React 19 Server Actions and useOptimistic Hook Architecture',
    source: 'react.dev/reference/rsc',
    author: 'React Core Team',
    date: '2024 Release Notes',
    content: `React 19 introduces Server Actions as first-class asynchronous mutations. By executing code on the server while managing client transitions smoothly, developers eliminate boilerplate API glue code.

The useOptimistic hook allows interfaces to update immediately before network roundtrips complete. When an action executes, the optimistic state is applied instantaneously. If the action succeeds, the server response replaces it; if the server rejects, React rolls back cleanly without inconsistent UI flicker.

To maintain security, Server Actions are automatically bound with encrypted closure parameters and CSRF validation headers.`,
    codeSnippet: {
      lang: 'tsx',
      code: `async function updateNameAction(formData: FormData) {
  'use server';
  const name = formData.get('name');
  await db.user.update({ where: { id: userId }, data: { name } });
}`,
    },
    quickSummary:
      'React 19 introduces first-class Server Actions and the useOptimistic hook. This architecture eliminates boilerplate API handlers by allowing direct server mutation execution, while providing instantaneous UI updates that cleanly roll back if a network request fails.',
    takeaways: [
      'Zero API Glue: Server Actions run directly on the backend via RPC.',
      'Optimistic Rendering: useOptimistic updates client UI before server confirmation.',
      'Automatic Rollback: Failed network requests cleanly restore original state.',
      'Encrypted Security: Built-in CSRF headers and parameter encryption.',
    ],
    whyItMatters:
      'Greatly reduces web application latency and eliminates hundreds of lines of boilerplate fetch and mutation logic.',
    whatToExploreNext:
      'Inspect Next.js App Router integration, form action pending states, and server component caching primitives.',
  },
  {
    id: 'ai-agents',
    category: 'article',
    title: 'Self-Correcting Autonomous Agents in High-Frequency Algorithmic Execution',
    source: 'mit.edu/csail/ai-market-agents',
    author: 'Dr. Elena Rostova',
    date: 'March 2025',
    content: `Modern financial markets execute trades in microsecond windows. Autonomous LLM-based reasoning systems have traditionally been too slow for latency-critical order books.

However, hybrid hierarchical architectures are transforming execution. High-level reasoning models formulate risk boundaries and macro policies every few seconds, while compiled C++ execution kernels enforce sub-millisecond safety invariants.

When unexpected volatility surges, the reflection engine triggers a self-correcting prompt iteration, re-evaluating liquidity pools across fragmented decentralized exchanges.`,
    quickSummary:
      'This research presents a hierarchical architecture pairing macro-level LLM reasoning with sub-millisecond compiled C++ execution. This allows autonomous systems to adjust trading strategies dynamically while strictly enforcing microsecond safety constraints during volatile market swings.',
    takeaways: [
      'Hierarchical Pairing: Slow strategic LLMs govern ultra-fast C++ kernels.',
      'Self-Correction Loop: Real-time reflection engine detects liquidity shocks.',
      'Microsecond Invariants: Safety bounds prevent catastrophic automated drawdowns.',
    ],
    whyItMatters:
      'Bridges the gap between flexible artificial reasoning and strict real-time execution safety in mission-critical environments.',
    whatToExploreNext:
      'Study hierarchical reinforcement learning, formal verification of safety invariants, and latency benchmarks.',
  },
  {
    id: 'quantum-comp',
    category: 'news',
    title: 'Topological Quantum Breakthrough: Coherence Times Extended by 100x',
    source: 'techcrunch.com/hardware/quantum-milestone',
    author: 'Marcus Vance',
    date: 'October 2025',
    content: `Researchers at the Quantum Nano-Systems Laboratory have demonstrated Majorana zero-mode braiding in a scalable semiconductor-superconductor nanowire lattice.

Previous superconducting qubits suffered from phase decoherence in under 100 microseconds. The new topological lattice achieved a sustained coherence duration of over 10 milliseconds at 20 millikelvin temperatures.

Industry experts note that fault-tolerant topological quantum error correction requires far fewer physical qubits than classical transmon architectures.`,
    quickSummary:
      'Researchers achieved a 100x increase in qubit coherence duration (reaching 10 milliseconds) using Majorana zero-modes in topological nanowires. This breakthrough significantly reduces the physical qubit overhead needed for fault-tolerant quantum error correction.',
    takeaways: [
      '100x Coherence Increase: Reaches 10ms stability at 20 millikelvin.',
      'Majorana Zero-Modes: Braiding protects quantum information geometrically.',
      'Lower Hardware Overhead: Exponentially fewer error-correction qubits required.',
    ],
    whyItMatters:
      'Moves fault-tolerant quantum computing closer to practical viability by tackling the decoherence challenge.',
    whatToExploreNext:
      'Explore topological error correction codes, cryogenic dilution refrigerator engineering, and commercial roadmaps.',
  },
];

export const InteractiveDemo: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<SampleArticle>(SAMPLE_ARTICLES[0]);
  const [activeTab, setActiveTab] = useState<'summary' | 'chat'>('summary');
  const [mode, setMode] = useState<'quick' | 'takeaways' | 'detailed'>('quick');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Hello! I have extracted **"${SAMPLE_ARTICLES[0].title}"**. Ask me anything about its content, code snippets, or architectural trade-offs!`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSelectArticle = (art: SampleArticle) => {
    setSelectedArticle(art);
    setChatMessages([
      {
        role: 'assistant',
        text: `Switched context to **"${art.title}"**. How can I help you understand this document?`,
      },
    ]);
  };

  const handleSendChat = (questionText: string = chatInput) => {
    const q = questionText.trim();
    if (!q) return;

    const lower = q.toLowerCase();
    let reply = `Based on **${selectedArticle.title}**: The document focuses on core architectural design.`;

    if (lower.includes('beginner') || lower.includes('5') || lower.includes('simple')) {
      reply = `### In Simple Terms:\nImagine you want to update something on a website: normally your computer asks the server and waits for an answer before changing what you see. **${selectedArticle.title}** solves this by letting the screen update immediately, and if something goes wrong later, it simply steps backward without breaking!`;
    } else if (lower.includes('code') || lower.includes('syntax')) {
      if (selectedArticle.codeSnippet) {
        reply = `### Code Explanation:\nThe snippet shows how an action is marked with \`'use server'\`. React compiles this into a secure remote procedure call, allowing server database mutations without setting up manual API routes!`;
      } else {
        reply = `I reviewed **${selectedArticle.title}**, but no code blocks are present in this text. It is a research analysis focused on theoretical concepts and benchmarks.`;
      }
    } else if (lower.includes('why') || lower.includes('matter') || lower.includes('benefit')) {
      reply = `### Why this matters:\n${selectedArticle.whyItMatters}`;
    } else {
      reply = `According to the text from **${selectedArticle.source}**:\n\n${selectedArticle.takeaways[0]} Furthermore, ${selectedArticle.takeaways[1]}\n\n*(Verified grounded in visible text)*`;
    }

    setChatMessages((prev) => [
      ...prev,
      { role: 'user', text: q },
      { role: 'assistant', text: reply },
    ]);
    setChatInput('');
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(
      `${selectedArticle.quickSummary}\n\nKey Takeaways:\n${selectedArticle.takeaways.join('\n')}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="demo" style={{ background: '#090B11', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
            <Sparkles size={14} /> Interactive Experience
          </div>
          <h2
            className="text-gradient"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}
          >
            Try ScreenAI right in your browser
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '15px' }}>
            Experience how the extension extracts, summarizes, and answers questions on live content.
            This demonstration runs locally without requiring an API key.
          </p>
        </div>

        {/* Demo Playground Box */}
        <div
          className="glass-card"
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Top Bar: Sample Article Switcher & Demo Notice */}
          <div
            style={{
              background: '#131622',
              padding: '12px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                SIMULATE BROWSING:
              </span>
              {SAMPLE_ARTICLES.map((art) => (
                <button
                  key={art.id}
                  onClick={() => handleSelectArticle(art)}
                  style={{
                    background: selectedArticle.id === art.id ? 'var(--brand-purple)' : '#1A1E2C',
                    color: selectedArticle.id === art.id ? '#FFFFFF' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '11.5px',
                    fontWeight: selectedArticle.id === art.id ? 600 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {art.category === 'documentation' && <BookOpen size={12} />}
                  {art.category === 'article' && <FileText size={12} />}
                  {art.category === 'news' && <Newspaper size={12} />}
                  <span>{art.title.slice(0, 24)}...</span>
                </button>
              ))}
            </div>

            <div
              style={{
                fontSize: '11px',
                color: '#6EE7B7',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '3px 8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <ShieldCheck size={13} color="#10B981" />
              <span>Interactive Demonstration · No API Key Required</span>
            </div>
          </div>

          {/* Interior Split: Simulated Webpage vs Simulated ScreenAI Side Panel */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              minHeight: '520px',
            }}
          >
            {/* Left: Webpage Content */}
            <div
              style={{
                padding: '28px',
                background: '#0B0D15',
                borderRight: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                <span>{selectedArticle.source}</span>
                <span>•</span>
                <span>By {selectedArticle.author}</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
                {selectedArticle.title}
              </h3>

              <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {selectedArticle.content}
              </div>

              {selectedArticle.codeSnippet && (
                <div style={{ marginTop: '8px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#06070B' }}>
                  <div style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.03)', fontSize: '11px', color: 'var(--brand-cyan)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {selectedArticle.codeSnippet.lang}
                  </div>
                  <pre style={{ margin: 0, padding: '12px', fontSize: '11.5px', color: '#93C5FD', fontFamily: 'var(--font-mono)' }}>
                    <code>{selectedArticle.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Right: ScreenAI Side Panel UI */}
            <div
              style={{
                background: '#121520',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '12px 16px',
                  background: '#161A28',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={14} color="#FFF" />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#FFF' }}>ScreenAI</span>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => setActiveTab('summary')}
                    style={{
                      background: activeTab === 'summary' ? 'var(--brand-purple)' : 'transparent',
                      color: activeTab === 'summary' ? '#FFF' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    style={{
                      background: activeTab === 'chat' ? 'var(--brand-purple)' : 'transparent',
                      color: activeTab === 'chat' ? '#FFF' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Ask AI
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'summary' ? (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto' }}>
                  {/* Mode Selector */}
                  <div style={{ display: 'flex', background: '#1A1E2C', padding: '3px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => setMode('quick')}
                      style={{
                        flex: 1,
                        padding: '5px',
                        fontSize: '11px',
                        border: 'none',
                        borderRadius: '4px',
                        background: mode === 'quick' ? 'var(--brand-purple)' : 'transparent',
                        color: mode === 'quick' ? '#FFF' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Quick
                    </button>
                    <button
                      onClick={() => setMode('detailed')}
                      style={{
                        flex: 1,
                        padding: '5px',
                        fontSize: '11px',
                        border: 'none',
                        borderRadius: '4px',
                        background: mode === 'detailed' ? 'var(--brand-purple)' : 'transparent',
                        color: mode === 'detailed' ? '#FFF' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Detailed
                    </button>
                    <button
                      onClick={() => setMode('takeaways')}
                      style={{
                        flex: 1,
                        padding: '5px',
                        fontSize: '11px',
                        border: 'none',
                        borderRadius: '4px',
                        background: mode === 'takeaways' ? 'var(--brand-purple)' : 'transparent',
                        color: mode === 'takeaways' ? '#FFF' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Takeaways
                    </button>
                  </div>

                  {/* Summary Card */}
                  <div style={{ background: '#181C2B', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--brand-cyan)', textTransform: 'uppercase' }}>
                        {mode.toUpperCase()} SYNTHESIS
                      </span>
                      <button
                        onClick={handleCopySummary}
                        className="btn-ghost"
                        style={{ padding: '2px 6px', fontSize: '11px', gap: '4px' }}
                      >
                        {copied ? (
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

                    <p style={{ fontSize: '12.5px', color: '#E2E8F0', lineHeight: 1.55 }}>
                      {selectedArticle.quickSummary}
                    </p>
                  </div>

                  {/* Key Takeaways */}
                  {(mode === 'takeaways' || mode === 'detailed') && (
                    <div style={{ background: '#181C2B', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 600, color: '#C4B5FD', marginBottom: '8px' }}>
                        <CheckCircle2 size={13} color="var(--brand-purple)" />
                        <span>Key Takeaways</span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {selectedArticle.takeaways.map((point, i) => (
                          <li key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Why this matters */}
                  {mode === 'detailed' && (
                    <div style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '8px', padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#C4B5FD', marginBottom: '4px' }}>
                        <Lightbulb size={12} />
                        <span>Why This Matters</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {selectedArticle.whyItMatters}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                  {/* Chat messages */}
                  <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        style={{
                          alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                          maxWidth: '90%',
                          padding: '8px 12px',
                          borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                          background: msg.role === 'user' ? 'var(--brand-purple)' : '#181C2B',
                          border: msg.role === 'user' ? 'none' : '1px solid var(--border-subtle)',
                          color: '#FFF',
                          fontSize: '12px',
                          lineHeight: 1.45,
                        }}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  {/* Preset Prompt Suggestions */}
                  <div style={{ padding: '8px 14px', background: '#10131E', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
                    <button
                      onClick={() => handleSendChat("Explain like I'm 5")}
                      className="btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '10.5px', whiteSpace: 'nowrap' }}
                    >
                      Explain like I&apos;m 5
                    </button>
                    <button
                      onClick={() => handleSendChat('Explain code snippet')}
                      className="btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '10.5px', whiteSpace: 'nowrap' }}
                    >
                      Explain code
                    </button>
                    <button
                      onClick={() => handleSendChat('Why does this matter?')}
                      className="btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '10.5px', whiteSpace: 'nowrap' }}
                    >
                      Why it matters?
                    </button>
                  </div>

                  {/* Chat input */}
                  <div style={{ padding: '10px 14px', background: '#131622', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                      placeholder="Ask about this article..."
                      style={{
                        flex: 1,
                        background: '#0B0D15',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '7px 10px',
                        color: '#FFF',
                        fontSize: '12px',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={() => handleSendChat()}
                      className="btn-primary"
                      style={{ padding: '7px 10px', fontSize: '12px' }}
                    >
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

