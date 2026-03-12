'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Mail, Lock } from 'lucide-react';
import SSOButton from '@/components/onboarding/SSOButton';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/home';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ssoMode, setSsoMode] = useState(false);
  const [ssoDomain, setSsoDomain] = useState('');
  const [ssoMessage, setSsoMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-blue/[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/zeotap-logo.svg" alt="Zeotap" className="w-12 h-12 mb-4" />
          <div>
            <Link href="/" className="text-2xl font-extrabold text-gradient">
              Zeotap Learning
            </Link>
          </div>
          <p className="mt-2 text-sm text-text-secondary">Sign in to continue learning</p>
        </div>

        {/* Form card */}
        <div className="bg-bg-surface/50 border border-border rounded-3xl p-8 backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@zeotap.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              required
              autoFocus
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={16} />}
              required
            />

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          {/* SSO Section */}
          <div className="mt-6 pt-6 border-t border-border">
            {!ssoMode ? (
              <SSOButton onClick={() => setSsoMode(true)} />
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-text-muted text-center">Enter your company email domain</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="company.com"
                    value={ssoDomain}
                    onChange={(e) => { setSsoDomain(e.target.value); setSsoMessage(''); }}
                    className="flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                  />
                  <button
                    onClick={() => {
                      if (ssoDomain) {
                        setSsoMessage(`SSO is not yet configured for "${ssoDomain}". Contact your IT admin to set up SAML/OIDC integration.`);
                      }
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors"
                  >
                    Continue
                  </button>
                </div>
                {ssoMessage && (
                  <p className="text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg">{ssoMessage}</p>
                )}
                <button
                  onClick={() => { setSsoMode(false); setSsoMessage(''); }}
                  className="text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  Back to email login
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 text-center space-y-3">
            <Link
              href="/forgot-password"
              className="text-sm text-text-muted hover:text-brand-blue transition-colors"
            >
              Forgot your password?
            </Link>
            <p className="text-sm text-text-muted">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-brand-blue hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
