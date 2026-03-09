import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

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

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const navUser = profile
    ? {
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        is_admin: profile.is_admin,
      }
    : {
        email: user.email || '',
        full_name: '',
        role: 'engineering',
        is_admin: false,
      };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={navUser} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
