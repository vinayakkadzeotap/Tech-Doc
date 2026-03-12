import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAllowedDomain } from '@/lib/utils/sso-config';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/home';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Validate domain for OAuth logins
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email && !isAllowedDomain(user.email)) {
        // Sign out unauthorized domain
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/login?error=domain_restricted`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_error`);
}
