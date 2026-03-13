'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Plus,
  MessageCircle,
  Trash2,
  Loader2,
  Bot,
  User,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import ChatMarkdown from './ChatMarkdown';

interface ChatSession {
  id: string;
  title: string;
  skill_ids: string[];
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  matched_skills?: string[];
  docs_augmented?: boolean;
  created_at?: string;
}

const STARTER_PROMPTS = [
  {
    label: 'Build an audience segment',
    prompt: 'How do I build a high-value audience segment for a retention campaign?',
    icon: '🎯',
  },
  {
    label: 'Detect churn risk',
    prompt: 'Help me identify customers showing churn signals in the last 30 days',
    icon: '⚠️',
  },
  {
    label: 'Find lookalike prospects',
    prompt: 'Find customers similar to our top 10% spenders for audience expansion',
    icon: '🔍',
  },
  {
    label: 'Analyze a trend',
    prompt: 'Why did our engagement rate drop last quarter? Help me investigate.',
    icon: '📊',
  },
  {
    label: 'Design a customer journey',
    prompt: 'Recommend a cart abandonment recovery journey with optimal timing and triggers',
    icon: '🗺️',
  },
  {
    label: 'Get started with CDP',
    prompt: 'I\'m new to the Zeotap CDP. What can I do and where should I start?',
    icon: '🚀',
  },
];

const SKILL_LABELS: Record<string, string> = {
  'cdp-audience-finder': 'Audience',
  'cdp-churn-finder': 'Churn',
  'cdp-data-analyzer': 'Analysis',
  'cdp-data-enricher': 'Enrichment',
  'cdp-data-manager': 'Data Ops',
  'cdp-data-scientist': 'ML/AI',
  'cdp-health-diagnostics': 'Health',
  'cdp-journey-recommender': 'Journeys',
  'cdp-lookalike-finder': 'Lookalike',
  'cdp-metadata-explorer': 'Metadata',
  'cdp-marketing-suite': 'CDP Guide',
  'retail-marketing-suite': 'Retail',
  'gaming-marketing-suite': 'Gaming',
  'telecom-marketing-suite': 'Telecom',
  'healthcare-marketing-suite': 'Healthcare',
  'media-marketing-suite': 'Media',
  'automotive-marketing-suite': 'Automotive',
  'bfsi-marketing-suite': 'BFSI',
  'travel-marketing-suite': 'Travel',
};

export default function CDPAssistantChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  // Load sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/cdp-assistant?sessions=true');
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch {
      // silently fail
    }
  };

  const loadSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setMessages([]);
    setStreamingContent('');
    try {
      const res = await fetch(`/api/cdp-assistant?session_id=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      // silently fail
    }
  };

  const startNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setStreamingContent('');
    setMatchedSkills([]);
    inputRef.current?.focus();
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await fetch('/api/cdp-assistant', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        startNewChat();
      }
    } catch {
      // silently fail
    }
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isStreaming) return;

    setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    // Optimistically add user message
    const userMsg: ChatMessage = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/cdp-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSessionId,
          message: messageText,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const event = JSON.parse(line);

            if (event.type === 'content') {
              accumulated += event.text;
              setStreamingContent(accumulated);

              // Set session ID from first response
              if (event.session_id && !activeSessionId) {
                setActiveSessionId(event.session_id);
              }
            } else if (event.type === 'done') {
              setMatchedSkills(event.matched_skills || []);
              // Finalize — add assistant message
              setMessages((prev) => [
                ...prev,
                {
                  role: 'assistant',
                  content: accumulated,
                  matched_skills: event.matched_skills,
                  docs_augmented: event.docs_augmented,
                },
              ]);
              setStreamingContent('');
              // Refresh sessions list
              fetchSessions();
            } else if (event.type === 'error') {
              setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `Error: ${event.error}` },
              ]);
              setStreamingContent('');
            }
          } catch {
            // Skip malformed JSON lines
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
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          ${sidebarOpen ? 'w-72' : 'w-0'}
          flex-shrink-0 border-r border-border bg-bg-secondary/50 transition-all duration-300 overflow-hidden
        `}
      >
        <div className="w-72 h-full flex flex-col">
          {/* New Chat Button */}
          <div className="p-3 border-b border-border">
            <button
              onClick={startNewChat}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                bg-gradient-to-r from-brand-blue to-brand-indigo text-white
                hover:shadow-glow active:scale-[0.98] transition-all duration-200"
            >
              <Plus size={16} />
              New Chat
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.length === 0 && (
              <p className="text-xs text-text-muted text-center py-8">
                No conversations yet
              </p>
            )}
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`
                  group flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all
                  ${activeSessionId === session.id
                    ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }
                `}
                onClick={() => loadSession(session.id)}
              >
                <MessageCircle size={14} className="flex-shrink-0" />
                <span className="flex-1 truncate">{session.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-bg-primary/50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <ChevronLeft
              size={18}
              className={`transition-transform duration-200 ${!sidebarOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">CDP Assistant</h2>
              <p className="text-[11px] text-text-muted">Powered by Zeotap CDP Skills</p>
            </div>
          </div>
          {matchedSkills.length > 0 && (
            <div className="flex gap-1.5 ml-auto">
              {matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-brand-purple/10 text-brand-purple border border-brand-purple/20"
                >
                  {SKILL_LABELS[skill] || skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {isEmptyState ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center mb-6">
                <Sparkles size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Zeotap CDP Assistant
              </h2>
              <p className="text-sm text-text-muted text-center max-w-md mb-8">
                Ask me anything about customer data, audience segmentation, churn analysis,
                journey optimization, and more. Powered by 19 specialized CDP skills.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {STARTER_PROMPTS.map((starter) => (
                  <button
                    key={starter.label}
                    onClick={() => sendMessage(starter.prompt)}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-bg-surface/50
                      hover:border-brand-blue/30 hover:bg-bg-hover text-left transition-all group"
                  >
                    <span className="text-lg">{starter.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-text-primary group-hover:text-brand-blue transition-colors">
                        {starter.label}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                        {starter.prompt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6" role="log" aria-live="polite">
              {messages.map((msg, idx) => (
                <MessageBubble key={idx} message={msg} />
              ))}
              {streamingContent && (
                <MessageBubble
                  message={{ role: 'assistant', content: streamingContent }}
                  isStreaming
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-bg-primary/80 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Ask a question"
                  placeholder="Ask about audiences, churn, journeys, data quality..."
                  rows={1}
                  className="w-full resize-none bg-bg-surface/50 border border-border rounded-xl px-4 py-3 pr-12
                    text-sm text-text-primary placeholder:text-text-muted
                    focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/50
                    transition-all max-h-32"
                  style={{
                    height: 'auto',
                    minHeight: '44px',
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                  }}
                  disabled={isStreaming}
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isStreaming}
                className={`
                  flex-shrink-0 p-3 rounded-xl transition-all duration-200 focus-ring
                  ${input.trim() && !isStreaming
                    ? 'bg-gradient-to-r from-brand-blue to-brand-indigo text-white hover:shadow-glow active:scale-[0.98]'
                    : 'bg-bg-elevated text-text-muted cursor-not-allowed'
                  }
                `}
              >
                {isStreaming ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <p className="text-[10px] text-text-muted text-center mt-2">
              CDP Assistant uses AI to provide guidance based on Zeotap skill documentation. Always validate recommendations with your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  isStreaming = false,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div
        className={`
          max-w-[85%] rounded-2xl px-4 py-3
          ${isUser
            ? 'bg-gradient-to-r from-brand-blue to-brand-indigo text-white'
            : 'bg-bg-elevated border border-border'
          }
        `}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ChatMarkdown content={message.content} />
        )}
        {!isUser && (message.matched_skills?.length || message.docs_augmented) && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-border/30">
            {message.matched_skills?.map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan"
              >
                {SKILL_LABELS[skill] || skill}
              </span>
            ))}
            {message.docs_augmented && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Enhanced with Zeotap Docs
              </span>
            )}
          </div>
        )}
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-brand-blue rounded-sm animate-pulse ml-0.5" />
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-bg-elevated border border-border flex items-center justify-center">
          <User size={14} className="text-text-secondary" />
        </div>
      )}
    </div>
  );
}
