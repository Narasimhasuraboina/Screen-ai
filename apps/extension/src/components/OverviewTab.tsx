import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  MessageSquare,
  ListOrdered,
  ChevronDown,
  ChevronRight,
  Code,
  ExternalLink,
} from 'lucide-react';
import { WebpageContent, SummaryMode } from '@screenai/shared';

interface OverviewTabProps {
  page: WebpageContent | null;
  onSelectAction: (tab: 'summary' | 'chat', mode?: SummaryMode) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ page, onSelectAction }) => {
  const [showHeadings, setShowHeadings] = useState(true);
  const [showCode, setShowCode] = useState(false);

  if (!page) {
    return (
      <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '8px', fontSize: '13px' }}>No webpage content loaded.</p>
        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
          Navigate to an article, repository, or documentation page and click &quot;Scan Page&quot;.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Quick Launch Cards */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Quick Actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={() => onSelectAction('summary', 'quick')}
            className="btn-secondary"
            style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: '4px', height: 'auto' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-brand)', fontWeight: 600, fontSize: '12px' }}>
              <Sparkles size={13} /> Quick Summary
            </div>
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
              Core idea in 3-5 sentences
            </span>
          </button>

          <button
            onClick={() => onSelectAction('summary', 'takeaways')}
            className="btn-secondary"
            style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: '4px', height: 'auto' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '12px' }}>
              <ListOrdered size={13} /> Key Takeaways
            </div>
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
              Bulleted points & takeaways
            </span>
          </button>
        </div>

        <button
          onClick={() => onSelectAction('chat')}
          className="btn-secondary"
          style={{ width: '100%', marginTop: '8px', padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px' }}
        >
          <MessageSquare size={13} color="var(--accent-brand)" />
          <span>Ask Questions About This Page</span>
        </button>
      </div>

      {/* Page Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>WORDS</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>{page.wordCount.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>HEADINGS</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>{page.headings.length}</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CODE BLOCKS</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>{page.codeSnippets.length}</div>
        </div>
      </div>

      {/* Headings Outline */}
      {page.headings.length > 0 && (
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-surface)' }}>
          <button
            onClick={() => setShowHeadings(!showHeadings)}
            style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-surface-elevated)', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={13} color="var(--text-secondary)" />
              <span>Page Outline ({page.headings.length} sections)</span>
            </div>
            {showHeadings ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {showHeadings && (
            <div style={{ padding: '8px 12px', maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {page.headings.map((h, i) => (
                <div
                  key={i}
                  style={{
                    paddingLeft: `${Math.max(0, (h.level - 1) * 12)}px`,
                    fontSize: '11px',
                    color: h.level === 1 ? '#FFF' : 'var(--text-secondary)',
                    fontWeight: h.level === 1 ? 600 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={h.text}
                >
                  <span style={{ color: 'var(--text-muted)', marginRight: '4px' }}>
                    {'#'.repeat(h.level)}
                  </span>
                  {h.text}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Code Snippets Section (if any detected) */}
      {page.codeSnippets.length > 0 && (
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-surface)' }}>
          <button
            onClick={() => setShowCode(!showCode)}
            style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-surface-elevated)', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code size={13} color="var(--accent-brand)" />
              <span>Detected Code Snippets ({page.codeSnippets.length})</span>
            </div>
            {showCode ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {showCode && (
            <div style={{ padding: '8px 12px', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {page.codeSnippets.map((c, i) => (
                <div key={i} style={{ background: '#0D1017', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '8px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                    {c.language || 'Snippet'}
                  </div>
                  <pre style={{ margin: 0, fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: '#E2E8F0', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '100px', overflowY: 'auto' }}>
                    {c.code.slice(0, 300)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Page Links */}
      {page.links.length > 0 && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 600 }}>Top Extracted Links:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {page.links.slice(0, 4).map((l, i) => (
              <a
                key={i}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: 'var(--accent-cyan)', textDecoration: 'none', background: 'rgba(6, 182, 212, 0.08)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(6, 182, 212, 0.2)' }}
              >
                <span>{l.text}</span>
                <ExternalLink size={10} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

