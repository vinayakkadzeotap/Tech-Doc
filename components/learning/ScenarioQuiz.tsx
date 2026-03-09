'use client';

import { useState, useCallback } from 'react';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/utils/analytics';

/* ─── Question Types ─── */

export interface MCQuestion {
  type: 'mc';
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface OrderingQuestion {
  type: 'ordering';
  id: string;
  text: string;
  items: string[];           // displayed shuffled
  correctOrder: string[];    // the right order
  explanation: string;
}

export interface ScenarioQuestion {
  type: 'scenario';
  id: string;
  scenario: string;          // rich scenario text
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  hint?: string;
}

export interface MatchingQuestion {
  type: 'matching';
  id: string;
  text: string;
  pairs: { left: string; right: string }[];
  explanation: string;
}

export type AnyQuestion = MCQuestion | OrderingQuestion | ScenarioQuestion | MatchingQuestion;

export interface ScenarioQuizData {
  id: string;
  title: string;
  description: string;
  passScore: number;
  icon: string;
  color: string;
  questions: AnyQuestion[];
}

/* ─── Helpers ─── */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Main Component ─── */

interface Props {
  quiz: ScenarioQuizData;
  onClose: () => void;
}

export default function ScenarioQuiz({ quiz, onClose }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { show } = useToast();

  const q = quiz.questions[currentQ];
  const answered = answers[q?.id] !== undefined;
  const isLast = currentQ === quiz.questions.length - 1;

  const isCorrect = useCallback((question: AnyQuestion, answer: unknown): boolean => {
    switch (question.type) {
      case 'mc':
      case 'scenario':
        return answer === question.correct;
      case 'ordering':
        return JSON.stringify(answer) === JSON.stringify(question.correctOrder);
      case 'matching': {
        const ans = answer as Record<string, string>;
        return question.pairs.every(p => ans[p.left] === p.right);
      }
      default:
        return false;
    }
  }, []);

  const submitQuiz = async () => {
    setSaving(true);
    const correct = quiz.questions.filter(q => isCorrect(q, answers[q.id])).length;
    const percentage = Math.round((correct / quiz.questions.length) * 100);
    const passed = percentage >= quiz.passScore;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from('quiz_attempts').insert({
        user_id: user.id,
        quiz_id: quiz.id,
        score: correct,
        total: quiz.questions.length,
        percentage,
        passed,
        answers,
      });

      if (percentage === 100) {
        await supabase.from('badges').upsert(
          { user_id: user.id, badge_id: 'quiz_ace' },
          { onConflict: 'user_id,badge_id' }
        );
        show({ message: 'Achievement Unlocked: Quiz Ace!', icon: '🎯', color: '#f59e0b' });
      }
    }

    trackEvent('quiz_completed', { quizId: quiz.id, percentage, passed, score: correct });
    setSaving(false);
    setShowResults(true);
  };

  /* ─── Results ─── */
  if (showResults) {
    const correct = quiz.questions.filter(q => isCorrect(q, answers[q.id])).length;
    const pct = Math.round((correct / quiz.questions.length) * 100);
    const passed = pct >= quiz.passScore;

    return (
      <div className="text-center py-6 space-y-4">
        <div className="text-6xl">{passed ? '🎉' : '📚'}</div>
        <div className={`text-6xl font-extrabold ${passed ? 'text-brand-green' : 'text-brand-amber'}`}>{pct}%</div>
        <h3 className="text-xl font-bold">{passed ? 'Passed!' : 'Keep Learning!'}</h3>
        <p className="text-sm text-text-secondary">
          {correct} of {quiz.questions.length} correct &middot; Pass mark: {quiz.passScore}%
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Button variant="secondary" onClick={() => { setAnswers({}); setCurrentQ(0); setShowResults(false); }}>
            Retake
          </Button>
          {passed && <Button onClick={onClose}>Continue</Button>}
        </div>
        <div className="text-left border-t border-border pt-4 mt-6 space-y-2">
          {quiz.questions.map((q, i) => {
            const ok = isCorrect(q, answers[q.id]);
            return (
              <div key={q.id} className="flex items-start gap-2 text-sm">
                <span className={ok ? 'text-brand-green font-bold' : 'text-red-400 font-bold'}>{ok ? '✓' : '✗'}</span>
                <div>
                  <span className="text-text-muted">Q{i + 1}: </span>
                  <span className="text-text-secondary">{q.type === 'scenario' ? q.question : q.type === 'ordering' || q.type === 'matching' ? q.text : q.text}</span>
                  {!ok && <p className="text-xs text-text-muted mt-1 italic">{q.explanation}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─── Question Renderer ─── */
  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((currentQ + (answered ? 1 : 0)) / quiz.questions.length) * 100}%`,
              background: `linear-gradient(90deg, ${quiz.color}, ${quiz.color}cc)`,
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">Question {currentQ + 1} of {quiz.questions.length}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-text-muted capitalize">{q.type}</span>
        </div>
      </div>

      {/* Render by type */}
      {q.type === 'mc' && <MCQuestionView q={q} answer={answers[q.id] as number | undefined} onAnswer={(a) => setAnswers(p => ({ ...p, [q.id]: a }))} />}
      {q.type === 'scenario' && <ScenarioQuestionView q={q} answer={answers[q.id] as number | undefined} onAnswer={(a) => setAnswers(p => ({ ...p, [q.id]: a }))} showHint={showHint} onToggleHint={() => setShowHint(!showHint)} />}
      {q.type === 'ordering' && <OrderingQuestionView q={q} answer={answers[q.id] as string[] | undefined} onAnswer={(a) => setAnswers(p => ({ ...p, [q.id]: a }))} />}
      {q.type === 'matching' && <MatchingQuestionView q={q} answer={answers[q.id] as Record<string, string> | undefined} onAnswer={(a) => setAnswers(p => ({ ...p, [q.id]: a }))} />}

      {/* Explanation */}
      {answered && (
        <div className="px-4 py-3 rounded-xl bg-brand-blue/[0.07] border border-brand-blue/20 text-sm text-text-accent leading-relaxed mb-5 mt-4">
          <strong>{isCorrect(q, answers[q.id]) ? '✓ Correct! ' : '✗ Not quite. '}</strong>{q.explanation}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-4">
        {currentQ > 0 ? <Button variant="secondary" size="sm" onClick={() => { setCurrentQ(c => c - 1); setShowHint(false); }}>← Previous</Button> : <div />}
        {answered && (isLast ? <Button onClick={submitQuiz} loading={saving}>Submit Quiz →</Button> : <Button onClick={() => { setCurrentQ(c => c + 1); setShowHint(false); }}>Next →</Button>)}
      </div>
    </div>
  );
}

/* ─── MC Question (same as original) ─── */
function MCQuestionView({ q, answer, onAnswer }: { q: MCQuestion; answer?: number; onAnswer: (i: number) => void }) {
  const answered = answer !== undefined;
  return (
    <div>
      <p className="text-base font-semibold mb-5 leading-relaxed">{q.text}</p>
      <div className="space-y-2.5">{q.options.map((opt, i) => {
        let cls = 'border-border bg-white/[0.03] hover:border-brand-blue/40';
        if (answered) {
          if (i === q.correct) cls = 'border-brand-green bg-brand-green/10 text-green-300';
          else if (answer === i) cls = 'border-red-500 bg-red-500/[0.08] text-red-300';
          else cls = 'border-border bg-white/[0.02] opacity-50';
        }
        return (
          <button key={i} onClick={() => !answered && onAnswer(i)} disabled={answered}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left text-sm transition-all ${cls} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}>
            <span className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-xs font-bold flex-shrink-0">{String.fromCharCode(65 + i)}</span>
            <span className="flex-1">{opt}</span>
          </button>
        );
      })}</div>
    </div>
  );
}

/* ─── Scenario Question ─── */
function ScenarioQuestionView({ q, answer, onAnswer, showHint, onToggleHint }: { q: ScenarioQuestion; answer?: number; onAnswer: (i: number) => void; showHint: boolean; onToggleHint: () => void }) {
  const answered = answer !== undefined;
  return (
    <div>
      <div className="px-4 py-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-5">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <span>🎭</span> Scenario
        </div>
        <p className="text-sm text-text-primary leading-relaxed">{q.scenario}</p>
      </div>
      {q.hint && (
        <button onClick={onToggleHint} className="text-xs text-brand-blue hover:underline mb-3 block">
          {showHint ? 'Hide hint' : '💡 Show hint'}
        </button>
      )}
      {showHint && q.hint && (
        <div className="text-xs text-text-muted italic px-3 py-2 rounded-lg bg-brand-blue/5 border border-brand-blue/10 mb-3">{q.hint}</div>
      )}
      <p className="text-base font-semibold mb-4">{q.question}</p>
      <div className="space-y-2.5">{q.options.map((opt, i) => {
        let cls = 'border-border bg-white/[0.03] hover:border-amber-500/40';
        if (answered) {
          if (i === q.correct) cls = 'border-brand-green bg-brand-green/10 text-green-300';
          else if (answer === i) cls = 'border-red-500 bg-red-500/[0.08] text-red-300';
          else cls = 'border-border bg-white/[0.02] opacity-50';
        }
        return (
          <button key={i} onClick={() => !answered && onAnswer(i)} disabled={answered}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left text-sm transition-all ${cls} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}>
            <span className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-xs font-bold flex-shrink-0">{String.fromCharCode(65 + i)}</span>
            <span className="flex-1">{opt}</span>
          </button>
        );
      })}</div>
    </div>
  );
}

/* ─── Ordering Question ─── */
function OrderingQuestionView({ q, answer, onAnswer }: { q: OrderingQuestion; answer?: string[]; onAnswer: (a: string[]) => void }) {
  const [items, setItems] = useState<string[]>(() => shuffle(q.items));
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const submitted = answer !== undefined;

  const moveItem = (from: number, to: number) => {
    if (submitted) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
  };

  const handleSubmitOrder = () => {
    onAnswer(items);
  };

  return (
    <div>
      <p className="text-base font-semibold mb-2 leading-relaxed">{q.text}</p>
      <p className="text-xs text-text-muted mb-4">Drag items or use arrows to reorder, then confirm.</p>
      <div className="space-y-2">
        {items.map((item, i) => {
          let bg = 'bg-white/[0.03] border-border';
          if (submitted) {
            bg = q.correctOrder[i] === item
              ? 'bg-brand-green/10 border-brand-green'
              : 'bg-red-500/[0.08] border-red-500';
          }
          if (dragIdx === i) bg += ' ring-2 ring-brand-blue';

          return (
            <div
              key={item}
              draggable={!submitted}
              onDragStart={() => setDragIdx(i)}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={() => { if (dragIdx !== null) { moveItem(dragIdx, i); setDragIdx(null); } }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${bg} ${!submitted ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              <span className="w-6 h-6 rounded-md bg-white/[0.08] flex items-center justify-center text-xs font-bold text-text-muted flex-shrink-0">
                {i + 1}
              </span>
              <span className="flex-1">{item}</span>
              {!submitted && (
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => i > 0 && moveItem(i, i - 1)} className="text-text-muted hover:text-text-primary text-xs px-1" disabled={i === 0}>▲</button>
                  <button onClick={() => i < items.length - 1 && moveItem(i, i + 1)} className="text-text-muted hover:text-text-primary text-xs px-1" disabled={i === items.length - 1}>▼</button>
                </div>
              )}
              {submitted && (
                <span className={q.correctOrder[i] === item ? 'text-brand-green' : 'text-red-400'}>
                  {q.correctOrder[i] === item ? '✓' : '✗'}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {!submitted && (
        <Button size="sm" className="mt-4" onClick={handleSubmitOrder}>Confirm Order</Button>
      )}
      {submitted && !items.every((item, i) => q.correctOrder[i] === item) && (
        <div className="mt-3 text-xs text-text-muted">
          <strong>Correct order:</strong> {q.correctOrder.map((item, i) => `${i + 1}. ${item}`).join(' → ')}
        </div>
      )}
    </div>
  );
}

/* ─── Matching Question ─── */
function MatchingQuestionView({ q, answer, onAnswer }: { q: MatchingQuestion; answer?: Record<string, string>; onAnswer: (a: Record<string, string>) => void }) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const submitted = answer !== undefined;
  const [shuffledRight] = useState(() => shuffle(q.pairs.map(p => p.right)));

  const handleLeftClick = (left: string) => {
    if (submitted) return;
    setSelectedLeft(left);
  };

  const handleRightClick = (right: string) => {
    if (submitted || !selectedLeft) return;
    const next = { ...matches, [selectedLeft]: right };
    setMatches(next);
    setSelectedLeft(null);

    // Auto-submit when all matched
    if (Object.keys(next).length === q.pairs.length) {
      onAnswer(next);
    }
  };

  const allCorrect = submitted && q.pairs.every(p => answer?.[p.left] === p.right);

  return (
    <div>
      <p className="text-base font-semibold mb-2 leading-relaxed">{q.text}</p>
      <p className="text-xs text-text-muted mb-4">Click a term on the left, then its match on the right.</p>
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-2">
          {q.pairs.map(p => {
            const matched = submitted || matches[p.left];
            const isSelected = selectedLeft === p.left;
            let cls = 'border-border bg-white/[0.03]';
            if (isSelected) cls = 'border-brand-blue bg-brand-blue/10 ring-2 ring-brand-blue';
            else if (submitted && answer?.[p.left] === p.right) cls = 'border-brand-green bg-brand-green/10';
            else if (submitted) cls = 'border-red-500 bg-red-500/[0.08]';
            else if (matched) cls = 'border-brand-blue/30 bg-brand-blue/5';

            return (
              <button key={p.left} onClick={() => handleLeftClick(p.left)} disabled={submitted}
                className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${cls} ${!submitted ? 'cursor-pointer' : 'cursor-default'}`}>
                <span className="font-medium">{p.left}</span>
                {matches[p.left] && <span className="text-xs text-brand-blue ml-2">→ {matches[p.left]}</span>}
              </button>
            );
          })}
        </div>
        {/* Right column */}
        <div className="space-y-2">
          {shuffledRight.map(right => {
            const usedBy = Object.entries(matches).find(([, v]) => v === right)?.[0];
            const isUsed = !!usedBy;
            let cls = 'border-border bg-white/[0.03]';
            if (submitted) {
              const correctPair = q.pairs.find(p => p.right === right);
              if (correctPair && answer?.[correctPair.left] === right) cls = 'border-brand-green bg-brand-green/10';
              else cls = 'border-border bg-white/[0.02] opacity-50';
            } else if (isUsed) cls = 'border-brand-blue/30 bg-brand-blue/5 opacity-60';

            return (
              <button key={right} onClick={() => handleRightClick(right)} disabled={submitted || (isUsed && !selectedLeft)}
                className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${cls} ${!submitted && selectedLeft ? 'cursor-pointer hover:border-brand-blue/40' : 'cursor-default'}`}>
                {right}
              </button>
            );
          })}
        </div>
      </div>
      {submitted && !allCorrect && (
        <div className="mt-3 text-xs text-text-muted">
          <strong>Correct matches:</strong> {q.pairs.map(p => `${p.left} → ${p.right}`).join(', ')}
        </div>
      )}
    </div>
  );
}
