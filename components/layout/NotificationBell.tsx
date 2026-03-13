'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFocusTrap } from '@/lib/utils/focus-trap';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useFocusTrap(dropdownRef, isOpen);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (n: Notification) => {
    if (n.link) {
      router.push(n.link);
      setIsOpen(false);
    }
    // Mark as read
    if (!n.read) {
      fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [n.id] }),
      });
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
  };

  const typeColors: Record<string, string> = {
    assignment: '#3b82f6',
    badge: '#f59e0b',
    milestone: '#10b981',
    info: '#6b7280',
  };

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-bg-hover transition-colors"
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell size={16} className="text-text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          role="listbox"
          className="absolute top-full right-0 mt-2 w-80 bg-bg-surface border border-border rounded-xl shadow-xl animate-fade-in z-50 overflow-hidden"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
              return;
            }
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              const items = dropdownRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
              if (!items || items.length === 0) return;
              const currentIndex = Array.from(items).findIndex((item) => item === document.activeElement);
              let nextIndex: number;
              if (e.key === 'ArrowDown') {
                nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
              } else {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
              }
              items[nextIndex].focus();
            }
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-brand-blue hover:text-brand-blue/80 transition-colors"
              >
                <Check size={12} />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-[350px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell size={20} className="text-text-muted mx-auto mb-2 opacity-40" />
                <p className="text-xs text-text-muted">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  role="option"
                  aria-selected={!n.read}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-bg-hover transition-colors border-b border-border-subtle last:border-0 ${
                    !n.read ? 'bg-brand-blue/5' : ''
                  }`}
                >
                  {/* Dot indicator */}
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: !n.read ? typeColors[n.type] || '#6b7280' : 'transparent' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-text-primary truncate">{n.title}</span>
                      {n.link && <ExternalLink size={10} className="text-text-muted flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-text-muted/60 mt-1">{formatTime(n.created_at)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
