import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Trash2,
  Sparkles,
  RotateCw,
  ShieldCheck,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { WebpageContent, ChatMessage } from '@screenai/shared';
import { extensionApi } from '../services/api';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatTabProps {
  page: WebpageContent | null;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const ChatTab: React.FC<ChatTabProps> = ({ page, messages, setMessages }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (queryToSend: string = input) => {
    const trimmed = queryToSend.trim();
    if (!trimmed || isLoading || !page) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await extensionApi.askQuestion({
        page,
        messages: newMessages,
        question: trimmed,
      });

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: Date.now(),
        isPageGrounded: response.isPageGrounded,
        references: response.references,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to retrieve answer.';
      const errorAssistantMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Error:** ${errMsg}\n\nPlease verify that the ScreenAI backend is running on your machine.`,
        timestamp: Date.now(),
        isPageGrounded: false,
      };
      setMessages((prev) => [...prev, errorAssistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const promptSuggestions = [
    "Explain like I'm a beginner",
    'What is the most important point?',
    page?.codeSnippets.length ? 'Explain the code on this page' : 'What is the main conclusion?',
    'What are the prerequisites or requirements?',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-brand)', marginBottom: '10px' }}>
              <Sparkles size={18} />
            </div>
            <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: '#FFF', marginBottom: '4px' }}>
              Context-Aware Q&A
            </h3>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', maxWidth: '240px', marginBottom: '16px' }}>
              Ask anything about &quot;{page?.title || 'this page'}&quot;. ScreenAI grounds its answers in the extracted text.
            </p>

            {/* Quick Suggestions Chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left', marginBottom: '2px' }}>
                Suggested Prompts
              </div>
              {promptSuggestions.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="btn-secondary"
                  style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '7px 10px', fontSize: '11.5px', gap: '6px', color: 'var(--text-primary)' }}
                >
                  <Sparkles size={11} color="var(--accent-cyan)" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    maxWidth: isUser ? '85%' : '95%',
                    padding: isUser ? '8px 12px' : '10px 14px',
                    borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: isUser ? 'var(--accent-brand)' : 'var(--bg-surface-elevated)',
                    border: isUser ? 'none' : '1px solid var(--border-subtle)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    wordBreak: 'break-word',
                  }}
                >
                  {isUser ? (
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                  ) : (
                    <div>
                      <MarkdownRenderer content={msg.content} />

                      {/* Grounding & References Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '10px', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {msg.isPageGrounded ? (
                            <>
                              <ShieldCheck size={11} color="#10B981" />
                              <span style={{ color: '#10B981' }}>Grounded in Page</span>
                            </>
                          ) : (
                            <>
                              <HelpCircle size={11} color="#F59E0B" />
                              <span style={{ color: '#F59E0B' }}>General Knowledge</span>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => handleCopyMessage(msg.content, msg.id)}
                          className="btn-ghost"
                          style={{ padding: '2px 4px', fontSize: '10px', gap: '3px' }}
                          title="Copy answer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check size={10} color="#10B981" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy size={10} /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px 12px 12px 2px', maxWidth: '85%', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            <RotateCw size={13} className="animate-spin-slow" color="var(--accent-brand)" />
            <span>Formulating answer grounded in page text...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Control Area */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        {messages.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
            <button
              onClick={() => setMessages([])}
              className="btn-ghost"
              style={{ fontSize: '10.5px', color: 'var(--text-muted)', padding: '2px 6px', gap: '4px' }}
              title="Clear conversation"
            >
              <Trash2 size={11} /> Clear chat
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={page ? 'Ask about this webpage... (Enter to send)' : 'Scan page to chat'}
            disabled={!page || isLoading}
            rows={1}
            style={{
              flex: 1,
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 10px',
              color: 'var(--text-primary)',
              fontSize: '12px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: 1.4,
              maxHeight: '100px',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading || !page}
            className="btn-primary"
            style={{ padding: '8px', height: '34px', width: '34px', borderRadius: '8px', flexShrink: 0 }}
            title="Send question"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

