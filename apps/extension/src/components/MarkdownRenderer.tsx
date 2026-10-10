import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Simple, safe Markdown parser tailored for assistant output
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code key={i} style={{ fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.08)', padding: '2px 4px', borderRadius: '4px', fontSize: '11px', color: '#E2E8F0' }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={i} style={{ color: '#FFFFFF', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={i} style={{ color: 'var(--text-secondary)' }}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  // Split content into blocks (code blocks vs regular paragraphs/headings)
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="markdown-content" style={{ fontSize: '12.5px', lineHeight: 1.55 }}>
      {blocks.map((block, index) => {
        if (!block.trim()) return null;

        // Code block
        if (block.startsWith('```') && block.endsWith('```')) {
          const lines = block.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          let language = '';
          let codeText = '';

          if (/^[a-zA-Z0-9_-]+$/.test(firstLine)) {
            language = firstLine;
            codeText = lines.slice(1).join('\n');
          } else {
            codeText = lines.join('\n');
          }

          return (
            <div key={index} style={{ margin: '10px 0', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#0D1017' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 10px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-subtle)', fontSize: '10.5px', color: 'var(--text-muted)' }}>
                <span>{language || 'code'}</span>
                <button
                  onClick={() => handleCopyCode(codeText, index)}
                  className="btn-ghost"
                  style={{ padding: '2px 6px', fontSize: '10.5px', gap: '4px' }}
                >
                  {copiedIndex === index ? (
                    <>
                      <Check size={11} color="#10B981" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={11} /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre style={{ margin: 0, padding: '10px', overflowX: 'auto', fontSize: '11px', fontFamily: 'var(--font-mono)', lineHeight: 1.45, color: '#E2E8F0' }}>
                <code>{codeText}</code>
              </pre>
            </div>
          );
        }

        // Regular block with lines
        const lines = block.split('\n');
        return (
          <div key={index}>
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lineIdx} style={{ height: '6px' }} />;

              // Headings
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={lineIdx} style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginTop: '10px', marginBottom: '4px' }}>
                    {renderFormattedText(trimmed.slice(4))}
                  </h3>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={lineIdx} style={{ fontSize: '13.5px', fontWeight: 600, color: '#FFFFFF', marginTop: '12px', marginBottom: '6px' }}>
                    {renderFormattedText(trimmed.slice(3))}
                  </h2>
                );
              }
              if (trimmed.startsWith('# ')) {
                return (
                  <h1 key={lineIdx} style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginTop: '14px', marginBottom: '8px' }}>
                    {renderFormattedText(trimmed.slice(2))}
                  </h1>
                );
              }

              // Bullet points
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={lineIdx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '4px', paddingLeft: '4px' }}>
                    <span style={{ color: 'var(--accent-brand)', fontSize: '14px', lineHeight: 1 }}>•</span>
                    <span style={{ flex: 1 }}>{renderFormattedText(trimmed.slice(2))}</span>
                  </div>
                );
              }

              // Numbered list
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={lineIdx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '4px', paddingLeft: '4px' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '11px', minWidth: '16px' }}>{numMatch[1]}.</span>
                    <span style={{ flex: 1 }}>{renderFormattedText(numMatch[2])}</span>
                  </div>
                );
              }

              // Blockquotes
              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote key={lineIdx} style={{ borderLeft: '3px solid var(--accent-brand)', paddingLeft: '8px', color: 'var(--text-secondary)', margin: '6px 0', fontStyle: 'italic' }}>
                    {renderFormattedText(trimmed.slice(2))}
                  </blockquote>
                );
              }

              // Standard paragraph
              return (
                <p key={lineIdx} style={{ marginBottom: '6px' }}>
                  {renderFormattedText(trimmed)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

