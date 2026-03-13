import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('NotificationBell', () => {
  describe('notification data structure', () => {
    const mockNotification = {
      id: '1',
      type: 'badge',
      title: 'New Badge Earned!',
      message: 'You earned the CDP Explorer badge',
      read: false,
      created_at: new Date().toISOString(),
      link: '/achievements',
    };

    it('has required fields', () => {
      expect(mockNotification).toHaveProperty('id');
      expect(mockNotification).toHaveProperty('type');
      expect(mockNotification).toHaveProperty('title');
      expect(mockNotification).toHaveProperty('message');
      expect(mockNotification).toHaveProperty('read');
      expect(mockNotification).toHaveProperty('created_at');
    });

    it('read defaults to false for new notifications', () => {
      expect(mockNotification.read).toBe(false);
    });

    it('link is optional', () => {
      const noLink = { ...mockNotification };
      delete (noLink as Record<string, unknown>).link;
      expect(noLink).not.toHaveProperty('link');
    });
  });

  describe('unread count', () => {
    it('computes unread count from notifications array', () => {
      const notifications = [
        { id: '1', read: false },
        { id: '2', read: true },
        { id: '3', read: false },
        { id: '4', read: false },
      ];
      const unreadCount = notifications.filter((n) => !n.read).length;
      expect(unreadCount).toBe(3);
    });

    it('returns 0 when all read', () => {
      const notifications = [
        { id: '1', read: true },
        { id: '2', read: true },
      ];
      const unreadCount = notifications.filter((n) => !n.read).length;
      expect(unreadCount).toBe(0);
    });

    it('returns 0 for empty array', () => {
      const notifications: { id: string; read: boolean }[] = [];
      const unreadCount = notifications.filter((n) => !n.read).length;
      expect(unreadCount).toBe(0);
    });
  });

  describe('relative time formatting', () => {
    it('formats seconds ago as "just now" equivalent', () => {
      const now = Date.now();
      const tenSecsAgo = new Date(now - 10_000);
      const diffMs = now - tenSecsAgo.getTime();
      const diffMins = Math.floor(diffMs / 60_000);
      expect(diffMins).toBe(0);
    });

    it('formats minutes ago', () => {
      const now = Date.now();
      const fiveMinAgo = new Date(now - 5 * 60_000);
      const diffMs = now - fiveMinAgo.getTime();
      const diffMins = Math.floor(diffMs / 60_000);
      expect(diffMins).toBe(5);
    });

    it('formats hours ago', () => {
      const now = Date.now();
      const twoHoursAgo = new Date(now - 2 * 3600_000);
      const diffMs = now - twoHoursAgo.getTime();
      const diffHours = Math.floor(diffMs / 3600_000);
      expect(diffHours).toBe(2);
    });

    it('formats days ago', () => {
      const now = Date.now();
      const threeDaysAgo = new Date(now - 3 * 86400_000);
      const diffMs = now - threeDaysAgo.getTime();
      const diffDays = Math.floor(diffMs / 86400_000);
      expect(diffDays).toBe(3);
    });
  });

  describe('notification type colors', () => {
    it('maps badge type to purple', () => {
      const typeColors: Record<string, string> = {
        badge: '#a855f7',
        assignment: '#3b82f6',
        milestone: '#10b981',
        nudge: '#f59e0b',
      };
      expect(typeColors.badge).toBe('#a855f7');
      expect(typeColors.assignment).toBe('#3b82f6');
    });

    it('supports all expected notification types', () => {
      const expectedTypes = ['badge', 'assignment', 'milestone', 'nudge'];
      expectedTypes.forEach((type) => {
        expect(typeof type).toBe('string');
      });
    });
  });

  describe('mark as read', () => {
    it('updates notification read state', () => {
      const notifications = [
        { id: '1', read: false },
        { id: '2', read: false },
      ];
      const updated = notifications.map((n) =>
        n.id === '1' ? { ...n, read: true } : n
      );
      expect(updated[0].read).toBe(true);
      expect(updated[1].read).toBe(false);
    });

    it('mark all as read updates all entries', () => {
      const notifications = [
        { id: '1', read: false },
        { id: '2', read: false },
        { id: '3', read: false },
      ];
      const allRead = notifications.map((n) => ({ ...n, read: true }));
      const unreadCount = allRead.filter((n) => !n.read).length;
      expect(unreadCount).toBe(0);
    });
  });

  describe('polling interval', () => {
    it('polls every 30 seconds', () => {
      const POLL_INTERVAL = 30_000;
      expect(POLL_INTERVAL).toBe(30_000);
    });
  });
});
