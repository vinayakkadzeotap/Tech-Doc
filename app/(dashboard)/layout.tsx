import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import CelebrationWrapper from '@/components/interactive/CelebrationWrapper';
import WelcomeWizard from '@/components/onboarding/WelcomeWizard';
import type { UserRole } from '@/lib/utils/roles';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile — use maybeSingle() to avoid 406 when no row exists
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // Auto-create profile row if it doesn't exist (handles cases where
  // the on_auth_user_created trigger didn't fire or wasn't set up)
  if (!profile) {
    const fullName = user.user_metadata?.full_name || '';
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email || '',
      full_name: typeof fullName === 'string' ? fullName : '',
      role: 'engineering',
    });
    // Re-fetch to get the complete row with defaults
    const { data: created } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    profile = created;
  }

  const navUser = profile
    ? {
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        is_admin: profile.is_admin,
        avatar_url: profile.avatar_url || '',
      }
    : {
        email: user.email || '',
        full_name: '',
        role: 'engineering',
        is_admin: false,
        avatar_url: '',
      };

  const showOnboarding = profile && !profile.onboarding_completed;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={navUser} />
      <CelebrationWrapper>
        <main className="flex-1 animate-fade-in">{children}</main>
      </CelebrationWrapper>
      {showOnboarding && (
        <WelcomeWizard
          userId={user.id}
          userName={profile.full_name || ''}
          currentRole={(profile.role as UserRole) || 'engineering'}
        />
      )}
    </div>
  );
}
