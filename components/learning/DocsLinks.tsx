'use client';

import { BookOpen, ExternalLink } from 'lucide-react';
import { getModuleDocsUrls } from '@/lib/utils/docs-links';

interface DocsLinksProps {
  moduleId: string;
}

export default function DocsLinks({ moduleId }: DocsLinksProps) {
  const docsBaseUrl = process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL;
  const links = getModuleDocsUrls(moduleId);

  // Don't render if no docs URL configured or no links for this module
  if (!docsBaseUrl || links.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 p-4 rounded-xl border border-border bg-bg-surface/30">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={16} className="text-brand-cyan" />
        <h3 className="text-sm font-semibold text-text-primary">Related Documentation</h3>
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
          Zeotap Docs
        </span>
      </div>
      <div className="space-y-2">
        {links.map((link) => (
          <a
            key={link.path}
            href={link.fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-brand-cyan hover:bg-brand-cyan/5 transition-colors group"
          >
            <ExternalLink size={14} className="flex-shrink-0 text-text-muted group-hover:text-brand-cyan transition-colors" />
            <span className="flex-1 truncate">{link.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
