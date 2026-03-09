import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    redirect('/home');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={{
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        is_admin: true,
      }} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
