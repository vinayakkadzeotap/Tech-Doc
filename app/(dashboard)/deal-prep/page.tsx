'use client';

import { useState } from 'react';
import { DEAL_PREP_INDUSTRIES } from '@/lib/utils/deal-prep';
import Card from '@/components/ui/Card';
import { ArrowRight, BookOpen, Swords, MessageSquare, Play, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function DealPrepPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = DEAL_PREP_INDUSTRIES.find((i) => i.id === selectedId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Deal Prep</h1>
        <p className="text-sm text-text-muted mt-1">
          Industry-specific preparation guides for sales conversations
        </p>
      </div>

      {!selected ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEAL_PREP_INDUSTRIES.map((industry) => (
            <button
              key={industry.id}
              onClick={() => setSelectedId(industry.id)}
              className="text-left group"
            >
              <Card className="!p-5 h-full hover:-translate-y-0.5 hover:shadow-card transition-all duration-200">
                <div className="text-3xl mb-3">{industry.icon}</div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-brand-blue transition-colors">
                  {industry.name}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  {industry.description}
                </p>
                <div className="flex items-center gap-1 mt-3 text-xs text-brand-blue font-medium">
                  Prepare <ArrowRight size={12} />
                </div>
              </Card>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronLeft size={16} /> Back to industries
          </button>

          {/* Industry header */}
          <Card className="!p-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{selected.icon}</span>
              <div>
                <h2 className="text-xl font-extrabold">{selected.name}</h2>
                <p className="text-sm text-text-secondary mt-1">{selected.description}</p>
              </div>
            </div>
          </Card>

          {/* Talking Points */}
          <Card>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <MessageSquare size={16} className="text-brand-blue" />
              Key Talking Points
            </h3>
            <div className="space-y-3">
              {selected.talkingPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-bg-primary/50 border border-border">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-xs font-bold text-brand-blue">
                    {i + 1}
                  </span>
                  <p className="text-sm text-text-secondary leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommended Modules */}
          <Card>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-green-400" />
              Recommended Study Modules
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {selected.recommendedModules.map((moduleId) => (
                <Link
                  key={moduleId}
                  href={`/learn`}
                  className="flex items-center gap-2 p-3 rounded-xl bg-bg-primary/50 border border-border hover:border-brand-blue/30 transition-colors text-sm text-text-secondary hover:text-text-primary"
                >
                  <BookOpen size={14} className="text-text-muted flex-shrink-0" />
                  <span className="font-medium">{moduleId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Battle Cards */}
          <Card>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <Swords size={16} className="text-brand-amber" />
              Relevant Battle Cards
            </h3>
            <div className="flex flex-wrap gap-2">
              {selected.battleCardIds.map((cardId) => (
                <Link
                  key={cardId}
                  href="/battle-cards"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-amber/10 border border-brand-amber/20 text-sm font-medium text-brand-amber hover:bg-brand-amber/20 transition-colors"
                >
                  <Swords size={14} />
                  {cardId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Link>
              ))}
            </div>
          </Card>

          {/* Demo Flow */}
          <Card>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <Play size={16} className="text-purple-400" />
              Suggested Demo Flow
            </h3>
            <div className="space-y-2">
              {selected.demoFlow.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center text-xs font-bold text-purple-400">
                    {i + 1}
                  </span>
                  <p className="text-sm text-text-secondary pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
