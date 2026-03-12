'use client';

import { Shield } from 'lucide-react';

interface SSOButtonProps {
  onClick: () => void;
  className?: string;
}

export default function SSOButton({ onClick, className = '' }: SSOButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-bg-primary/50 text-sm text-text-secondary hover:text-text-primary hover:border-border-strong transition-all ${className}`}
    >
      <Shield size={16} />
      Enterprise SSO
    </button>
  );
}
