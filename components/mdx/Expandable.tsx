'use client';

import { useState } from 'react';

interface ExpandableProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Expandable({ title, children, defaultOpen = false }: ExpandableProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="my-4 border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-text-primary hover:bg-bg-hover transition-colors"
      >
        <span>{title}</span>
        <span className={`text-text-muted text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border-subtle [&>p]:mb-3 [&>ul]:mb-3 [&>ul]:ml-4 [&>ul>li]:mb-1">
          {children}
        </div>
      )}
    </div>
  );
}
