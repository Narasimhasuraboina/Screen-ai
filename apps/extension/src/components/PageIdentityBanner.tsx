import React from 'react';
import { RotateCw, AlertCircle, FileText, Code2, BookOpen, Newspaper, Compass } from 'lucide-react';
import { WebpageContent } from '@screenai/shared';

interface PageIdentityBannerProps {
  page: WebpageContent | null;
  activeTabUrl: string;
  isStale: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  onAnalyzeNewPage: () => void;
}

export const PageIdentityBanner: React.FC<PageIdentityBannerProps> = ({
  page,
  activeTabUrl,
  isStale,
  isLoading,
  onRefresh,
  onAnalyzeNewPage,
}) => {
  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case 'documentation':
        return <BookOpen size={12} color="#06B6D4" />;
      case 'github':
        return <Code2 size={12} color="#8B5CF6" />;
      case 'news':
        return <Newspaper size={12} color="#F59E0B" />;
      case 'article':
        return <FileText size={12} color="#10B981" />;
      default:
        return <Compass size={12} color="#9CA3AF" />;
    }
  };

  const getCategoryLabel = (cat?: string) => {
    switch (cat) {
      case 'documentation':
        return 'Technical Docs';
      case 'github':
        return 'GitHub Repository';
      case 'news':
        return 'News Report';
      case 'article':
        return 'Article / Blog';
      case 'educational':
        return 'Educational';
      default:
        return 'Webpage';
    }
  };

  return (
    <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '12px 14px' }}>
      {/* If page is stale because user navigated to another URL */}
      {isStale && (
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#FCD34D' }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>Active tab navigated to a new page</span>
          </div>
          <button
            onClick={onAnalyzeNewPage}
            className="btn-primary"
            style={{ fontSize: '11px', padding: '4px 8px', height: '26px' }}
          >
            Update Context
          </button>
        </div>
      )}

      {page ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
            <h1
              style={{
                fontSize: '13.5px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.35,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              title={page.title}
            >
              {page.title}
            </h1>

            <button
              onClick={onRefresh}
              className="btn-ghost"
              style={{ padding: '4px', flexShrink: 0 }}
              title="Re-extract active page content"
              disabled={isLoading}
            >
              <RotateCw size={13} className={isLoading ? 'animate-spin-slow' : ''} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-surface-elevated)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              {getCategoryIcon(page.category)}
              <span>{getCategoryLabel(page.category)}</span>
            </div>

            <span>•</span>
            <span>{page.wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>~{page.readingTimeMinutes} min read</span>

            {page.truncated && (
              <span style={{ color: '#F59E0B', fontSize: '10.5px' }} title="Truncated to fit model limits">
                (Truncated)
              </span>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {activeTabUrl.startsWith('chrome://') || activeTabUrl.startsWith('edge://')
              ? 'Browser system page (Cannot be analyzed)'
              : 'No page content extracted yet'}
          </div>
          <button
            onClick={onRefresh}
            className="btn-secondary"
            style={{ fontSize: '11px', padding: '4px 8px' }}
            disabled={isLoading || activeTabUrl.startsWith('chrome://')}
          >
            <RotateCw size={12} className={isLoading ? 'animate-spin-slow' : ''} />
            Scan Page
          </button>
        </div>
      )}
    </div>
  );
};

