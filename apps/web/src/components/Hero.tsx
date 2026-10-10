import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  Shield,
  Layers,
  CheckCircle2,
  Globe,
  Code2,
} from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section style={{ paddingTop: '70px', paddingBottom: '90px', position: 'relative' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Release / Category Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '999px',
            padding: '5px 14px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#C4B5FD',
            marginBottom: '24px',
          }}
        >
          <Sparkles size={13} color="#A78BFA" />
          <span>Next-Gen Chromium Browser Assistant · Manifest V3</span>
        </div>

        {/* Primary Headline */}
        <h1
          className="text-gradient"
          style={{
            fontSize: 'clamp(38px, 6vw, 68px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: '900px',
            margin: '0 auto 20px',
          }}
        >
          Understand the web. <br />
          <span className="text-gradient-brand">Instantly.</span>
        </h1>

        {/* Supporting Message */}
        <p
          style={{
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 36px',
            lineHeight: 1.6,
          }}
        >
          An AI companion that turns the pages you browse into clear summaries, useful
          insights, and answers you can actually understand — right in your browser side panel.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            marginBottom: '48px',
          }}
        >
          <a
            href="#install"
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: '15px' }}
          >
            <span>Get ScreenAI for Chrome & Edge</span>
            <ArrowRight size={16} />
          </a>

          <a
            href="#demo"
            className="btn-secondary"
            style={{ padding: '12px 22px', fontSize: '15px' }}
          >
            <Play size={15} color="var(--brand-cyan)" />
            <span>Try Interactive Demo</span>
          </a>
        </div>

        {/* Trust & Spec Indicators */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            fontSize: '12.5px',
            color: 'var(--text-muted)',
            marginBottom: '60px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={14} color="#10B981" />
            <span>Zero Background Tracking</span>
          </div>
          <span>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="#8B5CF6" />
            <span>Chrome Side Panel API</span>
          </div>
          <span>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} color="#06B6D4" />
            <span>Grounded Anti-Hallucination Engine</span>
          </div>
        </div>

        {/* Visual Hero Mockup: Simulated Browser with Side Panel */}
        <div
          className="glass-card"
          style={{
            maxWidth: '1060px',
            margin: '0 auto',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Simulated Browser Chrome */}
          <div
            style={{
              background: '#12151F',
              padding: '10px 16px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            {/* Window control dots */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
            </div>

            {/* URL Omnibox */}
            <div
              style={{
                flex: 1,
                maxWidth: '520px',
                background: '#090A0F',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '4px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11.5px',
                color: 'var(--text-secondary)',
              }}
            >
              <Globe size={12} color="var(--brand-cyan)" />
              <span style={{ color: '#E2E8F0' }}>https://arxiv.org/html/2402.01283</span>
              <span style={{ color: 'var(--text-muted)' }}>— FlashAttention-3 Technical Paper</span>
            </div>

            {/* Browser toolbar extension icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                color: 'var(--text-secondary)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  color: '#C4B5FD',
                }}
              >
                <Sparkles size={12} color="#A78BFA" />
                <span style={{ fontWeight: 600 }}>ScreenAI Side Panel</span>
              </div>
            </div>
          </div>

          {/* Browser Interior: Article on Left (65%), Side Panel on Right (35%) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.8fr 1.2fr',
              minHeight: '460px',
              textAlign: 'left',
              background: '#0B0D14',
            }}
          >
            {/* Left: Webpage content */}
            <div
              style={{
                padding: '24px 28px',
                borderRight: '1px solid var(--border-subtle)',
                background: '#090B10',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>arXiv:2402.01283 [cs.LG]</span>
                <span>•</span>
                <span>Artificial Intelligence & Systems</span>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
                FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-Precision
              </h2>

              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Multi-head attention has become the foundational compute bottleneck of modern transformer language models. FlashAttention-3 introduces algorithmic asynchrony between GPU tensor cores and asynchronous memory copy units (TMA), achieving up to 1.8x speedup over FlashAttention-2 on NVIDIA Hopper H100 architectures.
              </p>

              <div
                style={{
                  background: '#07080D',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#93C5FD',
                }}
              >
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>// CUDA Warp-Specialized Kernel Execution</div>
                <div>tma_load_async(smem_q, gmem_q);</div>
                <div>warpgroup_mma_async(accum, smem_q, smem_k);</div>
                <div>warpgroup_wait();</div>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                By interleaving FP8 low-precision GEMM operations with incoherent block softmax quantizations, numerical stability is preserved across 64k context windows without degradation...
              </p>
            </div>

            {/* Right: ScreenAI Side Panel Preview */}
            <div
              style={{
                background: '#121520',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Side panel header */}
              <div
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#161A28',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="var(--brand-purple)" />
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#FFF' }}>ScreenAI</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981' }} />
                  Page Analyzed
                </div>
              </div>

              {/* Side panel body */}
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11.5px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--brand-cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Quick Summary
                </div>

                <div
                  style={{
                    background: '#181E2F',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#E2E8F0',
                    lineHeight: 1.5,
                  }}
                >
                  This paper introduces FlashAttention-3, which speeds up Transformer attention on Hopper GPUs by 1.8x. It overlaps GPU tensor core computations with memory transfers using hardware asynchrony, and stabilizes FP8 low precision across 64,000-token context windows.
                </div>

                <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--brand-purple)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '4px' }}>
                  Core Takeaways
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--brand-purple)' }}>•</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <strong>1.8x speedup:</strong> Reaches 850 TFLOPs/s on H100 GPUs.
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--brand-purple)' }}>•</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <strong>Asynchronous hardware:</strong> Exploits TMA & warp specialization.
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--brand-purple)' }}>•</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <strong>FP8 stability:</strong> Handles long contexts without precision loss.
                    </span>
                  </div>
                </div>

                {/* Simulated prompt interaction */}
                <div
                  style={{
                    marginTop: '8px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#C4B5FD' }}>
                    &quot;Explain TMA like I&apos;m a beginner&quot;
                  </span>
                  <ArrowRight size={12} color="#A78BFA" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

