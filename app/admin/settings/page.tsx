'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { MessageSquare, Send, CheckCircle, XCircle } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [events, setEvents] = useState({
    assignments: true,
    badges: true,
    completions: false,
    certifications: true,
  });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.ok ? r.json() : {})
      .then((data: Record<string, unknown>) => {
        if (data.slack) {
          const slack = data.slack as { webhook_url?: string; events?: typeof events };
          setWebhookUrl(slack.webhook_url || '');
          if (slack.events) setEvents(slack.events);
        }
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'slack',
        value: { webhook_url: webhookUrl, events },
      }),
    });
    setSaving(false);
  };

  const testWebhook = async () => {
    if (!webhookUrl) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'slack',
          value: { webhook_url: webhookUrl },
          testSlack: true,
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch {
      setTestResult({ success: false, message: 'Request failed' });
    }
    setTesting(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[
        { label: 'Admin', href: '/admin/dashboard' },
        { label: 'Settings' },
      ]} />
      <div>
        <h1 className="text-2xl font-extrabold">Platform Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Configure integrations and platform behavior</p>
      </div>

      {/* Slack Integration */}
      <Card className="!p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4A154B]/10 flex items-center justify-center">
            <MessageSquare size={20} className="text-[#4A154B]" />
          </div>
          <div>
            <h2 className="text-base font-bold">Slack Integration</h2>
            <p className="text-xs text-text-muted">Send notifications to a Slack channel</p>
          </div>
        </div>

        {/* Webhook URL */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Webhook URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
            />
            <button
              onClick={testWebhook}
              disabled={!webhookUrl || testing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-bg-surface border border-border hover:bg-bg-hover transition-colors disabled:opacity-50"
            >
              <Send size={12} />
              {testing ? 'Testing...' : 'Test'}
            </button>
          </div>
          {testResult && (
            <div className={`flex items-center gap-2 mt-2 text-xs ${testResult.success ? 'text-green-500' : 'text-red-400'}`}>
              {testResult.success ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {testResult.message}
            </div>
          )}
        </div>

        {/* Event toggles */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-3">Events to Forward</label>
          <div className="space-y-2">
            {(Object.entries(events) as [string, boolean][]).map(([key, enabled]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => setEvents((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className="w-4 h-4 rounded border-border bg-bg-primary text-brand-blue focus:ring-brand-blue/50"
                />
                <span className="text-sm text-text-primary capitalize">{key}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2 rounded-lg text-sm font-medium bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </Card>
    </div>
  );
}
