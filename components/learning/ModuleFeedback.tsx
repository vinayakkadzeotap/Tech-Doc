'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';

interface Props {
  trackId: string;
  moduleId: string;
}

const ISSUE_TYPES = [
  { value: '', label: 'Select issue type (optional)' },
  { value: 'typo', label: 'Typo or grammar' },
  { value: 'unclear', label: 'Unclear explanation' },
  { value: 'outdated', label: 'Outdated content' },
  { value: 'missing', label: 'Missing information' },
  { value: 'other', label: 'Other' },
];

export default function ModuleFeedback({ trackId, moduleId }: Props) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [issueType, setIssueType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const contentId = `${trackId}/${moduleId}`;

  // Check if feedback already submitted for this module
  useEffect(() => {
    fetch('/api/feedback')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const existing = data.find(
            (f: { content_type: string; content_id: string }) =>
              f.content_type === 'module' && f.content_id === contentId
          );
          if (existing) setAlreadySubmitted(true);
        }
      })
      .catch(() => {});
  }, [contentId]);

  const handleSubmit = useCallback(async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: 'module',
          content_id: contentId,
          rating,
          comment,
          issue_type: issueType,
        }),
      });
      setSubmitted(true);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }, [rating, comment, issueType, contentId]);

  if (alreadySubmitted || submitted) {
    return (
      <div className="mt-8 p-5 rounded-2xl border border-border bg-bg-surface/50 text-center">
        <CheckCircle size={24} className="mx-auto mb-2 text-green-500" />
        <p className="text-sm font-semibold text-text-primary">
          {submitted ? 'Thanks for your feedback!' : 'You already rated this module'}
        </p>
        <p className="text-xs text-text-muted mt-1">
          Your feedback helps us improve the learning experience.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-5 rounded-2xl border border-border bg-bg-surface/50">
      <h3 className="text-sm font-bold text-text-primary mb-1">Rate this module</h3>
      <p className="text-xs text-text-muted mb-4">
        How helpful was this content? Your feedback shapes future updates.
      </p>

      {/* Star rating */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="p-0.5 transition-transform hover:scale-110"
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <Star
              size={22}
              className={
                star <= (hoveredStar || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-white/20'
              }
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-xs text-text-muted ml-2">
            {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
          </span>
        )}
      </div>

      {/* Show comment area after rating */}
      {rating > 0 && (
        <div className="space-y-3 animate-fade-in">
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg bg-bg-elevated border border-border text-text-secondary focus:outline-none focus:border-brand-blue"
          >
            {ISSUE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Any additional thoughts? (optional)"
            rows={2}
            className="w-full text-xs px-3 py-2 rounded-lg bg-bg-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-blue resize-none"
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-xs font-semibold rounded-lg hover:bg-brand-blue/90 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={12} />
                Submit Feedback
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
