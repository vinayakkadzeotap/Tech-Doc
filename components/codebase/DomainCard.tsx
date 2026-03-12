'use client';

import Link from 'next/link';
import {
  Fingerprint,
  Database,
  Users,
  Send,
  Layout,
  Brain,
  HardDrive,
  BarChart3,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import type { Domain } from '@/lib/utils/codebase/types';

const ICON_MAP: Record<string, LucideIcon> = {
  Fingerprint,
  Database,
  Users,
  Send,
  Layout,
  Brain,
  HardDrive,
  BarChart3,
  Shield,
};

export default function DomainCard({ domain }: { domain: Domain }) {
  const Icon = ICON_MAP[domain.icon] || Database;
  const repoCount = domain.repos.length;
  const languages = Array.from(new Set(domain.repos.map((r) => r.language)));

  return (
    <Link
      href={`/codebase/${domain.id}`}
      className="group relative flex flex-col gap-3 p-5 rounded-2xl bg-bg-surface border border-border hover:border-border-strong hover:shadow-lg transition-all duration-300"
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ backgroundColor: domain.color }}
      />
      <div className="flex items-start justify-between">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ backgroundColor: `${domain.color}15` }}
        >
          <Icon size={20} style={{ color: domain.color }} />
        </div>
        <span className="text-xs font-medium text-text-muted bg-bg-elevated px-2 py-0.5 rounded-full">
          {repoCount} {repoCount === 1 ? 'repo' : 'repos'}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-text-primary group-hover:text-brand-blue transition-colors">
          {domain.title}
        </h3>
        <p className="text-xs text-text-muted mt-1 line-clamp-2">
          {domain.description}
        </p>
      </div>
      {languages.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto">
          {languages.slice(0, 4).map((lang) => (
            <span
              key={lang}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-bg-elevated text-text-secondary"
            >
              {lang}
            </span>
          ))}
          {languages.length > 4 && (
            <span className="text-[10px] text-text-muted">
              +{languages.length - 4}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
