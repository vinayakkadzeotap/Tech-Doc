'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';
import KnowledgeCheck from '@/components/learning/KnowledgeCheck';
import RefresherMode from '@/components/learning/RefresherMode';
import { type KnowledgeQuestion } from '@/lib/utils/knowledge-checks';
import { type RefresherCard } from '@/lib/utils/refresher-data';

interface ModuleExtrasProps {
  moduleId: string;
  questions: KnowledgeQuestion[] | null;
  refresherCards: RefresherCard[] | null;
}

export default function ModuleExtras({ moduleId, questions, refresherCards }: ModuleExtrasProps) {
  const [showRefresher, setShowRefresher] = useState(false);

  if (!questions && !refresherCards) return null;

  return (
    <div className="space-y-6 mb-8">
      {/* Refresher toggle */}
      {refresherCards && !showRefresher && (
        <button
          onClick={() => setShowRefresher(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-amber/10 border border-brand-amber/20 text-sm font-medium text-brand-amber hover:bg-brand-amber/20 transition-colors"
        >
          <Zap size={16} />
          Quick Refresher
        </button>
      )}

      {showRefresher && refresherCards && (
        <RefresherMode cards={refresherCards} onClose={() => setShowRefresher(false)} />
      )}

      {/* Knowledge Check */}
      {questions && <KnowledgeCheck moduleId={moduleId} questions={questions} />}
    </div>
  );
}
