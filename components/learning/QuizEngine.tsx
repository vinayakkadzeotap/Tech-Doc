'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { trackEvent } from '@/lib/utils/analytics';

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuizData {
  id: string;
  title: string;
  description: string;
  passScore: number;
  questions: QuizQuestion[];
}

interface Props {
  quiz: QuizData;
  onClose: () => void;
}

export default function QuizEngine({ quiz, onClose }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { show } = useToast();

  const q = quiz.questions[currentQ];
  const answered = answers[q?.id] !== undefined;
  const isLast = currentQ === quiz.questions.length - 1;

  const selectAnswer = (idx: number) => {
    if (answered) return;
    setAnswers((prev) => ({ ...prev, [q.id]: idx }));
  };

  const submitQuiz = async () => {
    setSaving(true);
    const correct = quiz.questions.filter((q) => answers[q.id] === q.correct).length;
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
    router.refresh();
  };

  if (showResults) {
    const correct = quiz.questions.filter((q) => answers[q.id] === q.correct).length;
    const pct = Math.round((correct / quiz.questions.length) * 100);
    const passed = pct >= quiz.passScore;

    return (
      <div className="text-center py-6 space-y-4">
        <div className="text-6xl">{passed ? '🎉' : '📚'}</div>
        <div className={`text-6xl font-extrabold ${passed ? 'text-brand-green' : 'text-brand-amber'}`}>
          {pct}%
        </div>
        <h3 className="text-xl font-bold">{passed ? 'Passed!' : 'Keep Learning!'}</h3>
        <p className="text-sm text-text-secondary">
          {correct} of {quiz.questions.length} correct &middot; Pass mark: {quiz.passScore}%
        </p>
        <p className="text-sm text-text-muted max-w-sm mx-auto">
          {passed
            ? "Great work! You've demonstrated solid understanding."
            : 'Review the modules and try again — you can retake anytime.'}
        </p>

        <div className="flex justify-center gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={() => {
              setAnswers({});
              setCurrentQ(0);
              setShowResults(false);
            }}
          >
            Retake Quiz
          </Button>
          {passed && (
            <Button onClick={onClose}>
              Continue
            </Button>
          )}
        </div>

        {/* Breakdown */}
        <div className="text-left border-t border-border pt-4 mt-6 space-y-2">
          {quiz.questions.map((q, i) => {
            const isCorrect = answers[q.id] === q.correct;
            return (
              <div key={q.id} className="flex items-start gap-2 text-sm">
                <span className={isCorrect ? 'text-brand-green font-bold' : 'text-red-400 font-bold'}>
                  {isCorrect ? '✓' : '✗'}
                </span>
                <span className="text-text-muted">
                  Q{i + 1}: {q.text.length > 80 ? q.text.slice(0, 80) + '...' : q.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">{quiz.title}</h3>
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-brand-blue to-brand-purple rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + (answered ? 1 : 0)) / quiz.questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-text-muted">
          Question {currentQ + 1} of {quiz.questions.length}
        </span>
      </div>

      {/* Question */}
      <p className="text-base font-semibold mb-5 leading-relaxed">{q.text}</p>

      {/* Options */}
      <div className="space-y-2.5 mb-5">
        {q.options.map((opt, i) => {
          let optClass = 'border-border bg-white/[0.03] hover:border-brand-blue/40 hover:bg-brand-blue/[0.06]';
          if (answered) {
            if (i === q.correct) optClass = 'border-brand-green bg-brand-green/10 text-green-300';
            else if (answers[q.id] === i) optClass = 'border-red-500 bg-red-500/[0.08] text-red-300';
            else optClass = 'border-border bg-white/[0.02] opacity-50';
          }

          return (
            <button
              key={i}
              onClick={() => selectAnswer(i)}
              disabled={answered}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left text-sm transition-all duration-200
                ${optClass}
                ${!answered ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <span className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-xs font-bold flex-shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {answered && i === q.correct && <span className="text-brand-green font-bold">✓</span>}
              {answered && answers[q.id] === i && i !== q.correct && <span className="text-red-400 font-bold">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className="px-4 py-3 rounded-xl bg-brand-blue/[0.07] border border-brand-blue/20 text-sm text-text-accent leading-relaxed mb-5">
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        {currentQ > 0 ? (
          <Button variant="secondary" size="sm" onClick={() => setCurrentQ((c) => c - 1)}>
            ← Previous
          </Button>
        ) : (
          <div />
        )}
        {answered && (
          isLast ? (
            <Button onClick={submitQuiz} loading={saving}>
              Submit Quiz →
            </Button>
          ) : (
            <Button onClick={() => setCurrentQ((c) => c + 1)}>
              Next →
            </Button>
          )
        )}
      </div>
    </div>
  );
}
