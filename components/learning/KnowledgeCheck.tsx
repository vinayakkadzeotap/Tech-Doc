'use client';

import { useState } from 'react';
import { type KnowledgeQuestion } from '@/lib/utils/knowledge-checks';
import { CheckCircle, XCircle, Brain } from 'lucide-react';

interface KnowledgeCheckProps {
  moduleId: string;
  questions: KnowledgeQuestion[];
}

export default function KnowledgeCheck({ questions }: KnowledgeCheckProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleAnswer = (qIdx: number, optIdx: number) => {
    if (revealed[qIdx]) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setRevealed((prev) => ({ ...prev, [qIdx]: true }));
  };

  const answeredCount = Object.keys(revealed).length;
  const correctCount = Object.entries(answers).filter(
    ([qIdx, optIdx]) => questions[Number(qIdx)].correct === optIdx
  ).length;

  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={20} className="text-brand-purple" />
        <h3 className="font-bold text-lg">Quick Knowledge Check</h3>
        {answeredCount === questions.length && (
          <span className={`ml-auto text-sm font-medium px-3 py-1 rounded-full ${
            correctCount === questions.length
              ? 'bg-green-500/10 text-green-400'
              : 'bg-amber-500/10 text-amber-400'
          }`}>
            {correctCount}/{questions.length} correct
          </span>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const isRevealed = revealed[qIdx];
          const selectedOpt = answers[qIdx];
          const isCorrect = selectedOpt === q.correct;

          return (
            <div key={qIdx} className="bg-bg-primary/50 rounded-xl border border-border p-4">
              <p className="text-sm font-medium text-text-primary mb-3">
                <span className="text-brand-purple font-bold mr-2">Q{qIdx + 1}.</span>
                {q.text}
              </p>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  let optClass = 'border-border hover:border-brand-blue/30 hover:bg-brand-blue/5 cursor-pointer';

                  if (isRevealed) {
                    if (optIdx === q.correct) {
                      optClass = 'border-green-500/40 bg-green-500/10';
                    } else if (optIdx === selectedOpt && !isCorrect) {
                      optClass = 'border-red-500/40 bg-red-500/10';
                    } else {
                      optClass = 'border-border/50 opacity-50 cursor-default';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswer(qIdx, optIdx)}
                      disabled={isRevealed}
                      className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all flex items-center gap-2 ${optClass}`}
                    >
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-medium flex-shrink-0 opacity-50">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-text-primary">{opt}</span>
                      {isRevealed && optIdx === q.correct && <CheckCircle size={16} className="ml-auto text-green-400 flex-shrink-0" />}
                      {isRevealed && optIdx === selectedOpt && !isCorrect && <XCircle size={16} className="ml-auto text-red-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {isRevealed && (
                <div className={`mt-3 px-3 py-2 rounded-lg text-sm ${
                  isCorrect ? 'bg-green-500/10 text-green-300' : 'bg-amber-500/10 text-amber-300'
                }`}>
                  {isCorrect ? '✓ Correct! ' : '✗ Not quite. '}
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
