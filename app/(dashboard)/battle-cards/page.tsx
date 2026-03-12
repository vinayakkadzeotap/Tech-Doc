'use client';

import { useState, useMemo } from 'react';
import { BATTLE_CARDS, type BattleCard } from '@/lib/utils/battle-cards';
import Card from '@/components/ui/Card';
import { Search, ChevronDown, ChevronUp, CheckCircle, XCircle, Minus, Swords, Shield, Target, MessageSquare } from 'lucide-react';

function HeadToHeadTable({ rows }: { rows: BattleCard['headToHead'] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-2 px-2 text-text-muted font-medium">Feature</th>
          <th className="text-center py-2 px-2 text-brand-blue font-medium">Zeotap</th>
          <th className="text-center py-2 px-2 text-text-muted font-medium">Competitor</th>
          <th className="text-center py-2 px-2 w-8"></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.feature} className="border-b border-border/30">
            <td className="py-2 px-2 font-medium text-text-secondary">{row.feature}</td>
            <td className="text-center py-2 px-2 text-text-primary">{row.zeotap}</td>
            <td className="text-center py-2 px-2 text-text-secondary">{row.competitor}</td>
            <td className="text-center py-2 px-2">
              {row.winner === 'zeotap' ? <CheckCircle size={16} className="text-green-400 mx-auto" /> :
               row.winner === 'competitor' ? <XCircle size={16} className="text-red-400 mx-auto" /> :
               <Minus size={16} className="text-text-muted mx-auto" />}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function BattleCardsPage() {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    if (!search.trim()) return BATTLE_CARDS;
    const q = search.toLowerCase();
    return BATTLE_CARDS.filter((card) =>
      card.competitor.toLowerCase().includes(q) ||
      card.overview.toLowerCase().includes(q) ||
      card.differentiators.some((d) => d.toLowerCase().includes(q)) ||
      card.headToHead.some((h) => h.feature.toLowerCase().includes(q))
    );
  }, [search]);

  const getTab = (cardId: string) => activeTab[cardId] || 'overview';
  const setTab = (cardId: string, tab: string) => setActiveTab((prev) => ({ ...prev, [cardId]: tab }));

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Target },
    { key: 'compare', label: 'Head-to-Head', icon: Swords },
    { key: 'talk', label: 'Talk Track', icon: MessageSquare },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Swords size={24} className="text-brand-amber" />
          Competitive Battle Cards
        </h1>
        <p className="text-sm text-text-muted mt-1">Quick-reference comparison cards for sales calls</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search competitors, features, differentiators..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-bg-surface/50 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
        />
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((card) => {
          const isExpanded = expandedId === card.id;
          const currentTab = getTab(card.id);
          const wins = card.headToHead.filter((h) => h.winner === 'zeotap').length;
          const losses = card.headToHead.filter((h) => h.winner === 'competitor').length;

          return (
            <Card key={card.id} className="!p-0 overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : card.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-bg-primary/20 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-amber/20 to-brand-rose/20 border border-brand-amber/20 flex items-center justify-center">
                    <Shield size={24} className="text-brand-amber" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{card.competitor}</h3>
                    <p className="text-xs text-text-muted">{card.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 font-medium">{wins} wins</span>
                    <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 font-medium">{losses} losses</span>
                  </div>
                  {isExpanded ? <ChevronUp size={20} className="text-text-muted" /> : <ChevronDown size={20} className="text-text-muted" />}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-border">
                  {/* Tabs */}
                  <div className="flex border-b border-border">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setTab(card.id, tab.key)}
                        className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                          currentTab === tab.key
                            ? 'border-brand-blue text-brand-blue'
                            : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                      >
                        <tab.icon size={14} />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-5">
                    {currentTab === 'overview' && (
                      <div className="space-y-5">
                        <p className="text-sm text-text-secondary leading-relaxed">{card.overview}</p>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">Zeotap Differentiators</h4>
                            <ul className="space-y-2">
                              {card.differentiators.map((d, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                  <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                  {d}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Their Weaknesses</h4>
                            <ul className="space-y-2">
                              {card.weaknesses.map((w, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                  <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                                  {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentTab === 'compare' && (
                      <HeadToHeadTable rows={card.headToHead} />
                    )}

                    {currentTab === 'talk' && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Recommended Talk Track</h4>
                        {card.talkingPoints.map((point, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-bg-primary/50 border border-border">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-xs font-bold text-brand-blue">{i + 1}</span>
                            <p className="text-sm text-text-secondary leading-relaxed">{point}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Swords size={48} className="mx-auto text-text-muted/30 mb-4" />
          <p className="text-text-muted">No battle cards match &quot;{search}&quot;</p>
        </div>
      )}
    </div>
  );
}
