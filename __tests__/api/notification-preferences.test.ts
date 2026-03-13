import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PREFERENCES,
  NOTIFICATION_TYPES,
  CHANNELS,
  type NotificationPreference,
  type NotificationChannel,
} from '@/lib/utils/notification-preferences';

describe('Notification Preferences', () => {
  describe('DEFAULT_PREFERENCES', () => {
    it('has preferences for all notification types', () => {
      const types = DEFAULT_PREFERENCES.map((p) => p.notification_type);
      NOTIFICATION_TYPES.forEach((nt) => {
        expect(types).toContain(nt.type);
      });
    });

    it('all defaults include in_app channel', () => {
      DEFAULT_PREFERENCES.forEach((p) => {
        expect(p.channels).toContain('in_app');
      });
    });

    it('assignment and nudge defaults include email', () => {
      const assignment = DEFAULT_PREFERENCES.find((p) => p.notification_type === 'assignment');
      const nudge = DEFAULT_PREFERENCES.find((p) => p.notification_type === 'nudge');
      expect(assignment?.channels).toContain('email');
      expect(nudge?.channels).toContain('email');
    });

    it('badge defaults to in_app only', () => {
      const badge = DEFAULT_PREFERENCES.find((p) => p.notification_type === 'badge');
      expect(badge?.channels).toEqual(['in_app']);
    });
  });

  describe('NOTIFICATION_TYPES', () => {
    it('has 5 notification types', () => {
      expect(NOTIFICATION_TYPES).toHaveLength(5);
    });

    it('each type has label and description', () => {
      NOTIFICATION_TYPES.forEach((nt) => {
        expect(nt.label).toBeTruthy();
        expect(nt.description).toBeTruthy();
      });
    });
  });

  describe('CHANNELS', () => {
    it('has 2 channels', () => {
      expect(CHANNELS).toHaveLength(2);
    });

    it('includes in_app and email', () => {
      const channelIds = CHANNELS.map((c) => c.channel);
      expect(channelIds).toContain('in_app');
      expect(channelIds).toContain('email');
    });
  });

  describe('preference toggling logic', () => {
    it('toggles a channel on', () => {
      const pref: NotificationPreference = {
        notification_type: 'badge',
        channels: ['in_app'],
      };
      const channel: NotificationChannel = 'email';
      const hasChannel = pref.channels.includes(channel);
      const updated = hasChannel
        ? pref.channels.filter((c) => c !== channel)
        : [...pref.channels, channel];
      expect(updated).toEqual(['in_app', 'email']);
    });

    it('toggles a channel off', () => {
      const pref: NotificationPreference = {
        notification_type: 'assignment',
        channels: ['in_app', 'email'],
      };
      const channel: NotificationChannel = 'email';
      const hasChannel = pref.channels.includes(channel);
      const updated = hasChannel
        ? pref.channels.filter((c) => c !== channel)
        : [...pref.channels, channel];
      expect(updated).toEqual(['in_app']);
    });

    it('can disable all channels', () => {
      const pref: NotificationPreference = {
        notification_type: 'badge',
        channels: ['in_app'],
      };
      const updated = pref.channels.filter((c) => c !== 'in_app');
      expect(updated).toEqual([]);
    });
  });
});
