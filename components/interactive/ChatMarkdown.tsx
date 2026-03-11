'use client';

import { useMemo } from 'react';

interface ChatMarkdownProps {
  content: string;
}

export default function ChatMarkdown({ content }: ChatMarkdownProps) {
  const rendered = useMemo(() => parseMarkdown(content), [content]);

  return (
    <div className="prose prose-invert prose-sm max-w-none space-y-3">
      {rendered}
    </div>
  );
}

function parseMarkdown(text: string) {
  // Split by code fences
  const parts = text.split(/(```[\s\S]*?```)/g);
  const elements: React.ReactNode[] = [];

  parts.forEach((part, i) => {
    if (part.startsWith('```')) {
      // Code block
      const match = part.match(/^```(\w+)?\n([\s\S]*?)\n?```$/);
      const lang = match?.[1] || '';
      const code = match?.[2] || part.slice(3, -3);
      elements.push(
        <div key={i} className="relative group">
          {lang && (
            <span className="absolute top-2 right-2 text-[10px] font-mono text-text-muted bg-bg-primary/80 px-1.5 py-0.5 rounded">
              {lang}
            </span>
          )}
          <pre className="bg-bg-primary/60 border border-border rounded-xl p-4 overflow-x-auto">
            <code className="text-xs font-mono text-text-primary leading-relaxed whitespace-pre">
              {code}
            </code>
          </pre>
        </div>
      );
    } else if (part.trim()) {
      // Regular text — render inline markdown
      elements.push(
        <div key={i} className="space-y-2">
          {renderTextBlocks(part)}
        </div>
      );
    }
  });

  return elements;
}

function renderTextBlocks(text: string) {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];
  let blockKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={blockKey++} className="list-disc list-inside space-y-1 text-text-secondary">
          {listItems.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      flushList();
      blocks.push(
        <h4 key={blockKey++} className="text-sm font-semibold text-text-primary mt-3">
          {renderInline(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList();
      blocks.push(
        <h3 key={blockKey++} className="text-base font-bold text-text-primary mt-4">
          {renderInline(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      flushList();
      blocks.push(
        <h2 key={blockKey++} className="text-lg font-bold text-text-primary mt-4">
          {renderInline(trimmed.slice(2))}
        </h2>
      );
    }
    // List items
    else if (trimmed.match(/^[-*•]\s/)) {
      listItems.push(trimmed.replace(/^[-*•]\s/, ''));
    }
    // Numbered list
    else if (trimmed.match(/^\d+\.\s/)) {
      listItems.push(trimmed.replace(/^\d+\.\s/, ''));
    }
    // Table rows (basic support)
    else if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      if (trimmed.match(/^\|[\s-|]+\|$/)) continue; // Skip separator rows
      const cells = trimmed.split('|').filter(Boolean).map((c) => c.trim());
      blocks.push(
        <div key={blockKey++} className="flex gap-4 text-xs text-text-secondary py-1 border-b border-border/30">
          {cells.map((cell, j) => (
            <span key={j} className="flex-1">{renderInline(cell)}</span>
          ))}
        </div>
      );
    }
    // Regular paragraph
    else {
      flushList();
      blocks.push(
        <p key={blockKey++} className="text-text-secondary leading-relaxed">
          {renderInline(trimmed)}
        </p>
      );
    }
  }

  flushList();
  return blocks;
}

function renderInline(text: string): React.ReactNode {
  // Process inline markdown: bold, italic, code, links
  const parts: React.ReactNode[] = [];
  // Split by inline code, bold, italic patterns
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('`')) {
      parts.push(
        <code key={match.index} className="bg-bg-primary/60 text-brand-cyan px-1.5 py-0.5 rounded text-xs font-mono">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**')) {
      parts.push(
        <strong key={match.index} className="text-text-primary font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*')) {
      parts.push(
        <em key={match.index} className="text-text-accent italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a key={match.index} href={linkMatch[2]} className="text-brand-blue hover:underline" target="_blank" rel="noopener noreferrer">
            {linkMatch[1]}
          </a>
        );
      }
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}
