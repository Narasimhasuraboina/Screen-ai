import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RotateCw,
  Lightbulb,
  Compass,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { WebpageContent, SummaryMode, SummarizeResponse } from '@screenai/shared';
import { extensionApi } from '../services/api';
import { MarkdownRenderer } from './MarkdownRenderer';

interface SummaryTabProps {
  page: WebpageContent | null;
  summaryData: SummarizeResponse | null;
  setSummaryData: (data: SummarizeResponse | null) => void;
  selectedMode: SummaryMode;
  setSelectedMode: (mode: SummaryMode) => void;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({
  page,
  summaryData,
  setSummaryData,
  selectedMode,
  setSelectedMode,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (modeToUse: SummaryMode = selectedMode) => {
    if (!page) {
      setError('Please navigate to a readable webpage and scan the page first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await extensionApi.summarizePage({
        page,
        mode: modeToUse,
      });
      setSummaryData(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate summary.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (mode: SummaryMode) => {
    setSelectedMode(mode);
    if (page) {
      handleGenerate(mode);
    }
  };

  const handleCopy = () => {
    if (!summaryData) return;
    let fullText = summaryData.summary;
    if (summaryData.keyTakeaways && summaryData.keyTakeaways.length > 0) {
      fullText += '\n\nKey Takeaways:\n' + summaryData.keyTakeaways.map((t) => `• ${t}`).join('\n');
    }
    if (summaryData.whyItMatters) {
      fullText += `\n\nWhy this matters:\n${summaryData.whyItMatters}`;
    }
    if (summaryData.whatToExploreNext) {
      fullText += `\n\nWhat to explore next:\n${summaryData.whatToExploreNext}`;
    }

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Mode Switcher */}
      <div style={{ background: 'var(--bg-surface-elevated)', padding: '3px', borderRadius: '8px', display: 'flex', border: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => handleModeChange('quick')}
          style={{
            flex: 1,
            padding: '6px 4px',
            fontSize: '11px',
            fontWeight: selectedMode === 'quick' ? 600 : 500,
            background: selectedMode === 'quick' ? 'var(--accent-brand)' : 'transparent',
            color: selectedMode === 'quick' ? '#FFFFFF' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Quick
        </button>
        <button
          onClick={() => handleModeChange('detailed')}
          style={{
            flex: 1,
            padding: '6px 4px',
            fontSize: '11px',
            fontWeight: selectedMode === 'detailed' ? 600 : 500,
            background: selectedMode === 'detailed' ? 'var(--accent-brand)' : 'transparent',
            color: selectedMode === 'detailed' ? '#FFFFFF' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Detailed
        </button>
        <button
          onClick={() => handleModeChange('takeaways')}
          style={{
            flex: 1,
            padding: '6px 4px',
            fontSize: '11px',
            fontWeight: selectedMode === 'takeaways' ? 600 : 500,
            background: selectedMode === 'takeaways' ? 'var(--accent-brand)' : 'transparent',
            color: selectedMode === 'takeaways' ? '#FFFFFF' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Takeaways
        </button>
      </div>

      {/* Generate / Regenerate Button */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => handleGenerate()}
          className="btn-primary"
          style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
          disabled={isLoading || !page}
        >
          {isLoading ? (
            <>
              <RotateCw size={13} className="animate-spin-slow" />
              <span>Analyzing Page Content...</span>
            </>
          ) : (
            <>
              <Sparkles size={13} />
              <span>{summaryData ? 'Regenerate Summary' : 'Generate Summary'}</span>
            </>
          )}
        </button>

        {summaryData && (
          <button
            onClick={handleCopy}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '11.5px', gap: '4px' }}
            title="Copy summary to clipboard"
          >
            {copied ? (
              <>
                <Check size={13} color="#10B981" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '8px', padding: '10px 12px', color: '#FCA5A5', fontSize: '11.5px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 600, marginBottom: '2px' }}>Analysis Error</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', width: '80%' }} />
          <div style={{ height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', width: '95%' }} />
          <div style={{ height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', width: '70%' }} />
          <div style={{ height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', width: '85%' }} />
        </div>
      )}

      {/* Summary Output */}
      {summaryData && !isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Main Summary Box */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
            <MarkdownRenderer content={summaryData.summary} />
          </div>

          {/* Key Takeaways */}
          {summaryData.keyTakeaways && summaryData.keyTakeaways.length > 0 && (
            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                <CheckCircle2 size={13} />
                <span>Key Takeaways</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {summaryData.keyTakeaways.map((takeaway, i) => (
                  <li key={i} style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Sections (Detailed mode) */}
          {summaryData.keySections && summaryData.keySections.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Section Breakdown
              </div>
              {summaryData.keySections.map((sec, i) => (
                <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '10px 12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '12px', color: '#FFF', marginBottom: '4px' }}>
                    {sec.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {sec.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Why This Matters */}
          {summaryData.whyItMatters && (
            <div style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 600, color: '#C4B5FD', marginBottom: '4px' }}>
                <Lightbulb size={13} />
                <span>Why This Matters</span>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                {summaryData.whyItMatters}
              </p>
            </div>
          )}

          {/* What To Explore Next */}
          {summaryData.whatToExploreNext && (
            <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 600, color: '#67E8F9', marginBottom: '4px' }}>
                <Compass size={13} />
                <span>What To Explore Next</span>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                {summaryData.whatToExploreNext}
              </p>
            </div>
          )}

          {/* References & Confidence Note */}
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '4px' }}>
            {summaryData.references && summaryData.references.length > 0 && (
              <div>
                <span>Source Grounding: </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {summaryData.references.join(' • ')}
                </span>
              </div>
            )}
            {summaryData.confidenceNote && (
              <div style={{ fontStyle: 'italic' }}>{summaryData.confidenceNote}</div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!summaryData && !isLoading && !error && (
        <div style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border-subtle)', borderRadius: '8px', padding: '30px 16px', textAlign: 'center' }}>
          <Sparkles size={24} color="var(--accent-brand)" style={{ marginBottom: '10px' }} />
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#FFF', marginBottom: '4px' }}>
            Ready to summarize
          </h3>
          <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', maxWidth: '240px', margin: '0 auto 12px' }}>
            Select a mode above and click Generate to extract the core ideas from this page.
          </p>
        </div>
      )}
    </div>
  );
};

