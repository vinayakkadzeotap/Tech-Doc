'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ROLES, type UserRole } from '@/lib/utils/roles';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

export default function ProfilePage() {
  const [profile, setProfile] = useState<{
    full_name: string;
    email: string;
    role: UserRole;
    team: string;
    department: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) setProfile(data);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({
        full_name: profile.full_name,
        role: profile.role,
        team: profile.team,
        department: profile.department,
      }).eq('id', user.id);
      show({ message: 'Profile updated!', icon: '✅', color: '#10b981' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-bg-surface rounded-xl w-48" />
          <div className="h-64 bg-bg-surface rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-2xl font-extrabold">Profile</h1>

      <Card className="space-y-6">
        <Input
          label="Full Name"
          value={profile.full_name}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
        />
        <Input
          label="Email"
          value={profile.email}
          disabled
        />

        {/* Role selector */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Role</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.entries(ROLES) as [UserRole, typeof ROLES[UserRole]][]).map(([key, role]) => (
              <button
                key={key}
                onClick={() => setProfile({ ...profile, role: key })}
                className={`
                  flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all
                  ${profile.role === key
                    ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                    : 'border-border hover:border-border-strong text-text-secondary'
                  }
                `}
              >
                <span>{role.icon}</span>
                <span className="font-medium">{role.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Team"
          placeholder="e.g. Platform, Growth"
          value={profile.team}
          onChange={(e) => setProfile({ ...profile, team: e.target.value })}
        />
        <Input
          label="Department"
          placeholder="e.g. Engineering, Sales"
          value={profile.department}
          onChange={(e) => setProfile({ ...profile, department: e.target.value })}
        />

        <Button onClick={handleSave} loading={saving} size="lg" className="w-full">
          Save Changes
        </Button>
      </Card>
    </div>
  );
}
