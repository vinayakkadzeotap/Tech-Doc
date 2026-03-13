'use client';

import { useState, useEffect } from 'react';
import { Settings, Bell, Mail } from 'lucide-react';
import {
  NOTIFICATION_TYPES,
  CHANNELS,
  DEFAULT_PREFERENCES,
  type NotificationPreference,
  type NotificationChannel,
} from '@/lib/utils/notification-preferences';

interface NotificationPreferencesProps {
  onClose?: () => void;
}

export default function NotificationPreferences({ onClose }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreference[]>(DEFAULT_PREFERENCES);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/notifications/preferences')
      .then((r) => r.json())
      .then((data) => {
        if (data.preferences) setPreferences(data.preferences);
      })
      .catch(() => {});
  }, []);

  const toggleChannel = (notificationType: string, channel: NotificationChannel) => {
    setPreferences((prev) =>
      prev.map((p) => {
        if (p.notification_type !== notificationType) return p;
        const hasChannel = p.channels.includes(channel);
        return {
          ...p,
          channels: hasChannel
            ? p.channels.filter((c) => c !== channel)
            : [...p.channels, channel],
        };
      })
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Silent fail
    } finally {
      setSaving(false);
    }
  };

  const ChannelIcon = ({ channel }: { channel: NotificationChannel }) =>
    channel === 'in_app' ? <Bell size={12} /> : <Mail size={12} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-text-muted" />
          <h3 className="text-sm font-bold text-text-primary">Notification Preferences</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close notification preferences"
          >
            Done
          </button>
        )}
      </div>

      <div className="space-y-1">
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-3 py-2 text-[10px] text-text-muted font-medium uppercase tracking-wider">
          <span>Type</span>
          {CHANNELS.map((ch) => (
            <span key={ch.channel} className="w-14 text-center">{ch.label}</span>
          ))}
        </div>

        {/* Rows */}
        {NOTIFICATION_TYPES.map((nt) => {
          const pref = preferences.find((p) => p.notification_type === nt.type);
          return (
            <div
              key={nt.type}
              className="grid grid-cols-[1fr_auto_auto] gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-surface/50 transition-colors"
            >
              <div>
                <div className="text-xs font-medium text-text-primary">{nt.label}</div>
                <div className="text-[10px] text-text-muted">{nt.description}</div>
              </div>
              {CHANNELS.map((ch) => {
                const isActive = pref?.channels.includes(ch.channel) ?? false;
                return (
                  <button
                    key={ch.channel}
                    onClick={() => toggleChannel(nt.type, ch.channel)}
                    className={`w-14 h-7 flex items-center justify-center rounded-md text-xs transition-colors ${
                      isActive
                        ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                        : 'bg-bg-surface/50 text-text-muted border border-border hover:border-border-strong'
                    }`}
                    aria-label={`${ch.label} notifications for ${nt.label}: ${isActive ? 'enabled' : 'disabled'}`}
                    aria-pressed={isActive}
                  >
                    <ChannelIcon channel={ch.channel} />
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2 rounded-lg bg-brand-blue text-white text-xs font-medium hover:bg-brand-blue/90 disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
      </button>
    </div>
  );
}
