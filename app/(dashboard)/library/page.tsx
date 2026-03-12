'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { BookMarked, FileText, BookOpen, ArrowRight, Search } from 'lucide-react';
import { TRACKS } from '@/lib/utils/roles';

interface Bookmark {
  id: string;
  track_id: string;
  module_id: string;
  created_at: string;
}

interface Note {
  id: string;
  track_id: string;
  module_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

function getModuleInfo(trackId: string, moduleId: string) {
  const track = TRACKS.find((t) => t.id === trackId);
  const module = track?.modules.find((m) => m.id === moduleId);
  return {
    trackTitle: track?.title || trackId,
    trackColor: track?.color || '#6366f1',
    trackIcon: track?.icon || '📚',
    moduleTitle: module?.title || moduleId,
    moduleIcon: module?.icon || '📄',
  };
}

export default function LibraryPage() {
  const [tab, setTab] = useState<'bookmarks' | 'notes'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/bookmarks').then((r) => r.ok ? r.json() : []),
      fetch('/api/notes').then((r) => r.ok ? r.json() : []),
    ]).then(([b, n]) => {
      setBookmarks(Array.isArray(b) ? b : []);
      setNotes(Array.isArray(n) ? n : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const tabs = [
    { key: 'bookmarks' as const, label: 'Bookmarks', icon: BookMarked, count: bookmarks.length },
    { key: 'notes' as const, label: 'Notes', icon: FileText, count: notes.length },
  ];

  const filteredNotes = notes.filter((n) =>
    !search.trim() || n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <BookOpen size={24} className="text-brand-blue" />
          My Library
        </h1>
        <p className="text-sm text-text-muted mt-1">Your saved bookmarks and notes</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
              tab === t.key
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <t.icon size={14} />
            {t.label}
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-bg-elevated ml-1">{t.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-bg-surface/50 rounded-xl" />
          ))}
        </div>
      ) : tab === 'bookmarks' ? (
        bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <BookMarked size={48} className="mx-auto text-text-muted/30 mb-4" />
            <h3 className="font-semibold text-text-secondary mb-2">No bookmarks yet</h3>
            <p className="text-sm text-text-muted mb-4">
              Bookmark modules while learning to quickly find them later
            </p>
            <Link href="/learn" className="text-sm text-brand-blue hover:underline font-medium">
              Start Learning
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bm) => {
              const info = getModuleInfo(bm.track_id, bm.module_id);
              return (
                <Link key={bm.id} href={`/learn/${bm.track_id}/${bm.module_id}`}>
                  <Card hover className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: `${info.trackColor}15` }}
                    >
                      {info.moduleIcon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm truncate">{info.moduleTitle}</h3>
                      <p className="text-xs text-text-muted">{info.trackTitle}</p>
                    </div>
                    <div className="text-xs text-text-muted flex-shrink-0">
                      {new Date(bm.created_at).toLocaleDateString()}
                    </div>
                    <ArrowRight size={16} className="text-text-muted flex-shrink-0" />
                  </Card>
                </Link>
              );
            })}
          </div>
        )
      ) : (
        <>
          {notes.length > 0 && (
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-bg-surface/50 border border-border rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
              />
            </div>
          )}
          {notes.length === 0 ? (
            <div className="text-center py-16">
              <FileText size={48} className="mx-auto text-text-muted/30 mb-4" />
              <h3 className="font-semibold text-text-secondary mb-2">No notes yet</h3>
              <p className="text-sm text-text-muted mb-4">
                Take notes on modules to capture key insights
              </p>
              <Link href="/learn" className="text-sm text-brand-blue hover:underline font-medium">
                Start Learning
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotes.map((note) => {
                const info = getModuleInfo(note.track_id, note.module_id);
                return (
                  <Link key={note.id} href={`/learn/${note.track_id}/${note.module_id}`}>
                    <Card hover>
                      <div className="flex items-start gap-3 mb-2">
                        <div className="text-lg flex-shrink-0">{info.moduleIcon}</div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm truncate">{info.moduleTitle}</h3>
                          <p className="text-xs text-text-muted">{info.trackTitle}</p>
                        </div>
                        <span className="text-xs text-text-muted flex-shrink-0">
                          {new Date(note.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2 ml-8">
                        {note.content}
                      </p>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
