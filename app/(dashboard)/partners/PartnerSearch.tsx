'use client';

import { useState } from 'react';
import { Search, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import type { Partner } from '@/lib/utils/partners';

const TYPE_COLORS: Record<string, string> = {
  'Cloud Partner': '#3b82f6',
  'Technology Partner': '#f59e0b',
  'Data Partner': '#a855f7',
  'Integration Partner': '#10b981',
  'Agency Partner': '#ec4899',
};

export default function PartnerSearch({ partners }: { partners: Partner[] }) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = query
    ? partners.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.type.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : partners;

  return (
    <>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search partners by name, type, or capability..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-blue transition-colors"
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((partner) => {
          const isExpanded = expanded === partner.id;
          const color = TYPE_COLORS[partner.type] || '#6366f1';

          return (
            <Card key={partner.id} className="!p-0 overflow-hidden">
              <button
                onClick={() => setExpanded(isExpanded ? null : partner.id)}
                className="w-full text-left p-5 flex items-start gap-4 hover:bg-bg-hover/50 transition-colors"
              >
                <span className="text-3xl">{partner.logo}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-text-primary">{partner.name}</h3>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {partner.type}
                    </span>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-bg-elevated text-text-muted"
                    >
                      {partner.integrationLevel}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">{partner.description}</p>
                </div>
                {isExpanded ? (
                  <ChevronUp size={18} className="text-text-muted mt-1 shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-text-muted mt-1 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-border p-5 space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                      Capabilities
                    </h4>
                    <ul className="space-y-1.5">
                      {partner.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="text-brand-green mt-0.5">•</span>
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                      Co-Sell Talking Points
                    </h4>
                    <ul className="space-y-1.5">
                      {partner.coSellPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="text-brand-blue mt-0.5">→</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 rounded-2xl border border-dashed border-border">
            <p className="text-sm text-text-muted">No partners match &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </div>
    </>
  );
}
