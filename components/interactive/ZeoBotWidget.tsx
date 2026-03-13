'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  X,
  Loader2,
  Bot,
  User,
  Sparkles,
  Minimize2,
} from 'lucide-react';
import ChatMarkdown from './ChatMarkdown';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  docs_augmented?: boolean;
}

export default function ZeoBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isStreaming) return;

    setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    const userMsg: ChatMessage = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/cdp-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: messageText,
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const event = JSON.parse(line);

            if (event.type === 'content') {
              accumulated += event.text;
              setStreamingContent(accumulated);
              if (event.session_id && !sessionId) {
                setSessionId(event.session_id);
              }
            } else if (event.type === 'done') {
              setMessages((prev) => [
                ...prev,
                {
                  role: 'assistant',
                  content: accumulated,
                  docs_augmented: event.docs_augmented,
                },
              ]);
              setStreamingContent('');
            } else if (event.type === 'error') {
              setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `Error: ${event.error}` },
              ]);
              setStreamingContent('');
            }
          } catch {
            // Skip malformed lines
          }
        }
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Something went wrong';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, an error occurred: ${errMsg}` },
      ]);
      setStreamingContent('');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isEmptyState = messages.length === 0 && !streamingContent;

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl
            bg-gradient-to-r from-brand-blue to-brand-indigo text-white font-bold text-sm
            shadow-xl hover:shadow-2xl hover:scale-105 active:scale-[0.98]
            transition-all duration-200 animate-fade-in"
          aria-label="Open ZEOBOT"
        >
          <Bot size={20} />
          ZEOBOT
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px] max-h-[80vh] flex flex-col
          bg-bg-primary border border-border rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border
            bg-gradient-to-r from-brand-blue to-brand-indigo">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">ZEOBOT</h3>
                <p className="text-[10px] text-white/70">Powered by Zeotap Docs</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close ZEOBOT"
            >
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto">
            {isEmptyState ? (
              <div className="flex flex-col items-center justify-center h-full px-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center mb-4">
                  <Sparkles size={24} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-text-primary mb-1">Hi! I'm ZEOBOT</h3>
                <p className="text-xs text-text-muted text-center mb-5">
                  Ask me anything about the Zeotap CDP — audiences, data, integrations, and more.
                </p>
                <div className="space-y-2 w-full">
                  {[
                    { label: 'What is Zeotap CDP?', icon: '🚀' },
                    { label: 'How do I build an audience?', icon: '🎯' },
                    { label: 'Tell me about identity resolution', icon: '🔗' },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() => sendMessage(s.label)}
                      className="flex items-center gap-2.5 w-full p-3 rounded-xl border border-border
                        bg-bg-surface/50 hover:border-brand-blue/30 hover:bg-bg-hover
                        text-left text-xs font-medium text-text-secondary transition-all"
                    >
                      <span>{s.icon}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-4 py-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
                        <Bot size={12} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-brand-blue to-brand-indigo text-white'
                          : 'bg-bg-elevated border border-border'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <ChatMarkdown content={msg.content} />
                      )}
                      {msg.docs_augmented && msg.role === 'assistant' && (
                        <div className="mt-2 pt-1.5 border-t border-border/30">
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Powered by Zeotap Docs
                          </span>
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-bg-elevated border border-border flex items-center justify-center">
                        <User size={12} className="text-text-secondary" />
                      </div>
                    )}
                  </div>
                ))}
                {streamingContent && (
                  <div className="flex gap-2.5">
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
                      <Bot size={12} className="text-white" />
                    </div>
                    <div className="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed bg-bg-elevated border border-border">
                      <ChatMarkdown content={streamingContent} />
                      <span className="inline-block w-1.5 h-3.5 bg-brand-blue rounded-sm animate-pulse ml-0.5" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border bg-bg-primary/80 p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Ask ZEOBOT a question"
                placeholder="Ask about Zeotap CDP..."
                rows={1}
                className="flex-1 resize-none bg-bg-surface/50 border border-border rounded-xl px-3.5 py-2.5
                  text-[13px] text-text-primary placeholder:text-text-muted
                  focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/50
                  transition-all max-h-24"
                style={{ height: 'auto', minHeight: '40px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 96) + 'px';
                }}
                disabled={isStreaming}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isStreaming}
                className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-200 ${
                  input.trim() && !isStreaming
                    ? 'bg-gradient-to-r from-brand-blue to-brand-indigo text-white hover:shadow-glow active:scale-[0.98]'
                    : 'bg-bg-elevated text-text-muted cursor-not-allowed'
                }`}
              >
                {isStreaming ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
