'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';
import { Bookmark, MessageSquare, StickyNote } from 'lucide-react';

interface Props {
  trackId: string;
  moduleId: string;
}

export default function ModuleToolbar({ trackId, moduleId }: Props) {
  const [bookmarked, setBookmarked] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState<Array<{ id: string; content: string; updated_at: string }>>([]);
  const [saving, setSaving] = useState(false);
  const { show } = useToast();
  const contentId = `${trackId}/${moduleId}`;

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check bookmark status
      const { data: bm } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_type', 'module')
        .eq('content_id', contentId)
        .maybeSingle();
      setBookmarked(!!bm);

      // Load notes
      const { data: userNotes } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', contentId)
        .order('updated_at', { ascending: false });
      if (userNotes) setNotes(userNotes);
    }
    load();
  }, [contentId]);

  const toggleBookmark = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (bookmarked) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('content_type', 'module')
        .eq('content_id', contentId);
      setBookmarked(false);
      show({ message: 'Bookmark removed', icon: '🔖', color: '#94a3b8' });
    } else {
      await supabase.from('bookmarks').upsert({
        user_id: user.id,
        content_type: 'module',
        content_id: contentId,
      }, { onConflict: 'user_id,content_type,content_id' });
      setBookmarked(true);
      show({ message: 'Module bookmarked!', icon: '🔖', color: '#3b82f6' });
    }
  };

  const submitFeedback = async () => {
    if (rating === 0) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('feedback').insert({
      user_id: user.id,
      content_type: 'module',
      content_id: contentId,
      rating,
      comment,
    });

    setSaving(false);
    setShowFeedback(false);
    setRating(0);
    setComment('');
    show({ message: 'Thanks for your feedback!', icon: '💬', color: '#10b981' });
  };

  const saveNote = async () => {
    if (!noteContent.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase.from('notes').insert({
      user_id: user.id,
      module_id: contentId,
      content: noteContent,
    }).select();

    if (data?.[0]) {
      setNotes((prev) => [data[0], ...prev]);
    }
    setSaving(false);
    setNoteContent('');
    show({ message: 'Note saved!', icon: '📝', color: '#a855f7' });
  };

  const deleteNote = async (id: string) => {
    const supabase = createClient();
    await supabase.from('notes').delete().eq('id', id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    show({ message: 'Note deleted', icon: '🗑️', color: '#94a3b8' });
  };

  return (
    <div className="mb-6">
      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleBookmark}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
            ${bookmarked
              ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/30'
              : 'bg-bg-surface/50 text-text-muted border border-border hover:border-border-strong'
            }
          `}
        >
          <Bookmark size={14} fill={bookmarked ? 'currentColor' : 'none'} />
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
        <button
          onClick={() => { setShowNotes(!showNotes); setShowFeedback(false); }}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
            ${showNotes
              ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/30'
              : 'bg-bg-surface/50 text-text-muted border border-border hover:border-border-strong'
            }
          `}
        >
          <StickyNote size={14} />
          Notes {notes.length > 0 && `(${notes.length})`}
        </button>
        <button
          onClick={() => { setShowFeedback(!showFeedback); setShowNotes(false); }}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
            ${showFeedback
              ? 'bg-brand-green/10 text-brand-green border border-brand-green/30'
              : 'bg-bg-surface/50 text-text-muted border border-border hover:border-border-strong'
            }
          `}
        >
          <MessageSquare size={14} />
          Feedback
        </button>
      </div>

      {/* Notes panel */}
      {showNotes && (
        <div className="mt-4 p-4 rounded-2xl bg-bg-surface/50 border border-border space-y-3 animate-fade-in">
          <h4 className="text-sm font-bold">Your Notes</h4>
          <div className="flex gap-2">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 bg-bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              rows={2}
            />
            <button
              onClick={saveNote}
              disabled={saving || !noteContent.trim()}
              className="px-4 py-2 bg-brand-purple/20 text-brand-purple rounded-xl text-xs font-semibold hover:bg-brand-purple/30 transition-colors disabled:opacity-50"
            >
              Save
            </button>
          </div>
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-bg-elevated/50 rounded-xl border border-border-subtle">
              <p className="text-sm text-text-primary whitespace-pre-wrap">{note.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-text-muted">
                  {new Date(note.updated_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-[10px] text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-xs text-text-muted text-center py-2">No notes yet</p>
          )}
        </div>
      )}

      {/* Feedback panel */}
      {showFeedback && (
        <div className="mt-4 p-4 rounded-2xl bg-bg-surface/50 border border-border space-y-3 animate-fade-in">
          <h4 className="text-sm font-bold">Rate this module</h4>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition-transform hover:scale-110 ${
                  star <= rating ? 'opacity-100' : 'opacity-30'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional: share what could be improved..."
            className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
            rows={2}
          />
          <button
            onClick={submitFeedback}
            disabled={saving || rating === 0}
            className="px-4 py-2 bg-brand-green/20 text-brand-green rounded-xl text-xs font-semibold hover:bg-brand-green/30 transition-colors disabled:opacity-50"
          >
            {saving ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      )}
    </div>
  );
}
