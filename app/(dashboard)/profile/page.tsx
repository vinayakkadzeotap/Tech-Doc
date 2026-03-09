'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ROLES, type UserRole } from '@/lib/utils/roles';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import {
  Camera,
  MapPin,
  Phone,
  Linkedin,
  Briefcase,
  Mail,
  User,
  Save,
  Trash2,
} from 'lucide-react';

interface Profile {
  full_name: string;
  email: string;
  role: UserRole;
  team: string;
  department: string;
  avatar_url: string;
  designation: string;
  bio: string;
  phone: string;
  linkedin: string;
  location: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { show } = useToast();

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (data) {
          setProfile({
            full_name: data.full_name || '',
            email: data.email || '',
            role: data.role || 'engineering',
            team: data.team || '',
            department: data.department || '',
            avatar_url: data.avatar_url || '',
            designation: data.designation || '',
            bio: data.bio || '',
            phone: data.phone || '',
            linkedin: data.linkedin || '',
            location: data.location || '',
          });
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (!file.type.startsWith('image/')) {
      show({ message: 'Please select an image file', icon: 'alert-circle', color: '#ef4444' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      show({ message: 'Image must be under 5MB', icon: 'alert-circle', color: '#ef4444' });
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      show({ message: 'Upload failed. Try again.', icon: 'alert-circle', color: '#ef4444' });
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(path);

    const avatarUrl = `${publicUrl}?t=${Date.now()}`;

    await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId);

    setProfile((prev) => (prev ? { ...prev, avatar_url: avatarUrl } : prev));
    show({ message: 'Profile picture updated!', icon: 'check-circle-2', color: '#10b981' });
    setUploading(false);
  };

  const handleRemoveAvatar = async () => {
    if (!userId) return;
    const supabase = createClient();
    await supabase
      .from('profiles')
      .update({ avatar_url: '' })
      .eq('id', userId);
    setProfile((prev) => (prev ? { ...prev, avatar_url: '' } : prev));
    show({ message: 'Profile picture removed', icon: 'check-circle-2', color: '#10b981' });
  };

  const handleSave = async () => {
    if (!profile || !userId) return;
    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        role: profile.role,
        team: profile.team,
        department: profile.department,
        designation: profile.designation,
        bio: profile.bio,
        phone: profile.phone,
        linkedin: profile.linkedin,
        location: profile.location,
      })
      .eq('id', userId);

    if (error) {
      show({ message: 'Failed to save. Try again.', icon: 'alert-circle', color: '#ef4444' });
    } else {
      show({ message: 'Profile updated!', icon: 'check-circle-2', color: '#10b981' });
    }
    setSaving(false);
  };

  const update = (field: keyof Profile, value: string) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 bg-bg-surface rounded-2xl" />
            <div className="space-y-2">
              <div className="h-6 bg-bg-surface rounded-xl w-48" />
              <div className="h-4 bg-bg-surface rounded-xl w-32" />
            </div>
          </div>
          <div className="h-80 bg-bg-surface rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const initials = (profile.full_name || profile.email)
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Profile Header with Avatar ─────────────────────────────── */}
      <Card className="!p-6 sm:!p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative group flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center ring-4 ring-bg-primary">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-3xl font-bold">{initials}</span>
              )}
            </div>
            {/* Upload overlay */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              aria-label="Change profile picture"
            >
              {uploading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Camera size={22} className="text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            {/* Remove avatar */}
            {profile.avatar_url && (
              <button
                onClick={handleRemoveAvatar}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-text-muted hover:text-red-400 hover:border-red-400/50 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Remove profile picture"
              >
                <Trash2 size={11} />
              </button>
            )}
          </div>

          {/* Name & meta */}
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h1 className="text-2xl font-extrabold">
              {profile.full_name || 'Your Profile'}
            </h1>
            {profile.designation && (
              <p className="text-sm text-brand-blue font-medium">
                {profile.designation}
              </p>
            )}
            <p className="text-text-muted text-sm">{profile.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
              {profile.department && (
                <span className="text-xs text-text-secondary bg-bg-surface/80 px-2.5 py-1 rounded-lg">
                  {profile.department}
                </span>
              )}
              {profile.team && (
                <span className="text-xs text-text-secondary bg-bg-surface/80 px-2.5 py-1 rounded-lg">
                  {profile.team}
                </span>
              )}
              {profile.location && (
                <span className="text-xs text-text-secondary bg-bg-surface/80 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <MapPin size={10} /> {profile.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio preview */}
        {profile.bio && (
          <p className="mt-5 text-sm text-text-secondary leading-relaxed border-t border-border pt-5">
            {profile.bio}
          </p>
        )}
      </Card>

      {/* ── Personal Information ───────────────────────────────────── */}
      <Card>
        <h2 className="text-base font-bold mb-5 flex items-center gap-2">
          <User size={16} className="text-brand-blue" />
          Personal Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={profile.full_name}
            onChange={(e) => update('full_name', e.target.value)}
            icon={<User size={14} />}
          />
          <Input
            label="Email"
            value={profile.email}
            disabled
            icon={<Mail size={14} />}
          />
          <Input
            label="Designation / Job Title"
            placeholder="e.g. Senior Software Engineer"
            value={profile.designation}
            onChange={(e) => update('designation', e.target.value)}
            icon={<Briefcase size={14} />}
          />
          <Input
            label="Location"
            placeholder="e.g. Berlin, Germany"
            value={profile.location}
            onChange={(e) => update('location', e.target.value)}
            icon={<MapPin size={14} />}
          />
          <Input
            label="Phone"
            placeholder="+49 123 456 7890"
            value={profile.phone}
            onChange={(e) => update('phone', e.target.value)}
            icon={<Phone size={14} />}
          />
          <Input
            label="LinkedIn"
            placeholder="linkedin.com/in/johndoe"
            value={profile.linkedin}
            onChange={(e) => update('linkedin', e.target.value)}
            icon={<Linkedin size={14} />}
          />
        </div>

        {/* Bio textarea */}
        <div className="mt-5 space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">
            Bio
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => update('bio', e.target.value)}
            placeholder="Tell us about yourself, your experience, or what you're learning..."
            rows={3}
            maxLength={500}
            className="w-full bg-bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-muted transition-all duration-200 hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
          />
          <p className="text-[10px] text-text-muted text-right">
            {profile.bio.length}/500
          </p>
        </div>
      </Card>

      {/* ── Organization ──────────────────────────────────────────── */}
      <Card>
        <h2 className="text-base font-bold mb-5 flex items-center gap-2">
          <Briefcase size={16} className="text-brand-purple" />
          Organization
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <Input
            label="Team"
            placeholder="e.g. Platform, Growth"
            value={profile.team}
            onChange={(e) => update('team', e.target.value)}
          />
          <Input
            label="Department"
            placeholder="e.g. Engineering, Sales"
            value={profile.department}
            onChange={(e) => update('department', e.target.value)}
          />
        </div>

        {/* Role selector */}
        <div className="mt-5 space-y-2">
          <label className="block text-sm font-medium text-text-secondary">
            Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(
              Object.entries(ROLES) as [UserRole, (typeof ROLES)[UserRole]][]
            ).map(([key, role]) => (
              <button
                key={key}
                onClick={() => update('role', key)}
                className={`
                  flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-all
                  ${
                    profile.role === key
                      ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                      : 'border-border hover:border-border-strong text-text-secondary'
                  }
                `}
              >
                <Icon
                  name={role.icon}
                  size={16}
                  color={profile.role === key ? '#3b82f6' : undefined}
                />
                <span className="font-medium">{role.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Save ──────────────────────────────────────────────────── */}
      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} loading={saving} size="lg" className="px-8">
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
