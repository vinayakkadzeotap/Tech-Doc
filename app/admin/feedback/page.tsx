'use client';

import { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { MessageSquare, CheckCircle, Clock, Star, AlertTriangle } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface FeedbackItem {
  id: string;
  user_id: string;
  content_type: string;
  content_id: string;
  rating: number;
  comment: string;
  issue_type: string;
  status: string;
  admin_response: string;
  addressed_at: string | null;
  created_at: string;
  profiles?: { full_name: string; email: string; role: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  open: '#f59e0b',
  addressed: '#10b981',
};

export default function FeedbackAdminPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'addressed'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedback = useCallback(async () => {
    try {
      const res = await fetch('/api/feedback?admin=true');
      if (res.ok) {
        const data = await res.json();
        setFeedback(data);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const handleAddress = async () => {
    if (!selectedItem) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback_id: selectedItem.id,
          status: 'addressed',
          admin_response: responseText,
        }),
      });

      if (res.ok) {
        setFeedback((prev) =>
          prev.map((f) => f.id === selectedItem.id
            ? { ...f, status: 'addressed', admin_response: responseText, addressed_at: new Date().toISOString() }
            : f
          )
        );
        setSelectedItem(null);
        setResponseText('');
      }
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  const filtered = feedback.filter((f) => filter === 'all' || f.status === filter);

  const openCount = feedback.filter((f) => f.status === 'open' || !f.status).length;
  const addressedCount = feedback.filter((f) => f.status === 'addressed').length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-text-muted/30'} />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb items={[
        { label: 'Admin', href: '/admin/dashboard' },
        { label: 'Feedback' },
      ]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Feedback Management</h1>
          <p className="text-sm text-text-muted mt-1">Review and respond to user feedback on learning content</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock size={14} /> {openCount} open
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
            <CheckCircle size={14} /> {addressedCount} addressed
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'open', 'addressed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tab
                ? 'bg-brand-blue/10 border border-brand-blue/20 text-brand-blue'
                : 'bg-bg-surface/50 border border-border text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab !== 'all' && (
              <span className="ml-1.5 text-xs opacity-60">
                ({tab === 'open' ? openCount : addressedCount})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Feedback list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-bg-surface/50 border border-border animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-text-muted/30 mb-4" />
            <p className="text-text-muted">No {filter !== 'all' ? filter : ''} feedback yet</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const userName = item.profiles?.full_name || item.profiles?.email || 'Anonymous';
            const statusColor = STATUS_COLORS[item.status] || STATUS_COLORS.open;

            return (
              <Card key={item.id} className="!p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold">{userName}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full border" style={{
                        color: statusColor,
                        borderColor: `${statusColor}30`,
                        background: `${statusColor}10`,
                      }}>
                        {item.status || 'open'}
                      </span>
                      <span className="text-xs text-text-muted">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-bg-primary border border-border text-text-muted">
                        {item.content_type}/{item.content_id}
                      </span>
                      <div className="flex">{renderStars(item.rating)}</div>
                      {item.issue_type && (
                        <span className="flex items-center gap-1 text-xs text-amber-400">
                          <AlertTriangle size={12} /> {item.issue_type}
                        </span>
                      )}
                    </div>

                    {item.comment && (
                      <p className="text-sm text-text-secondary line-clamp-2">{item.comment}</p>
                    )}

                    {item.admin_response && (
                      <div className="mt-2 pl-3 border-l-2 border-brand-green/30">
                        <p className="text-xs text-brand-green">Admin response:</p>
                        <p className="text-sm text-text-secondary">{item.admin_response}</p>
                      </div>
                    )}
                  </div>

                  {(item.status === 'open' || !item.status) && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => { setSelectedItem(item); setResponseText(''); }}
                    >
                      Address
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Address feedback modal */}
      {selectedItem && (
        <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Address Feedback">
          <div className="space-y-4">
            <div className="bg-bg-primary rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-text-muted">{selectedItem.content_type}/{selectedItem.content_id}</span>
                <div className="flex">{renderStars(selectedItem.rating)}</div>
              </div>
              {selectedItem.comment && (
                <p className="text-sm text-text-secondary">{selectedItem.comment}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Response (optional — will be sent to the user)
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="e.g., Thank you for the feedback! We've updated the module content..."
                rows={3}
                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/50 resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setSelectedItem(null)}>Cancel</Button>
              <Button onClick={handleAddress} loading={submitting}>
                <CheckCircle size={16} />
                Mark as Addressed
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
