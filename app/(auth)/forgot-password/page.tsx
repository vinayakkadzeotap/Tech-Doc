'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-gradient">
            Zeotap Learning
          </Link>
        </div>

        <div className="bg-bg-surface/50 border border-border rounded-3xl p-8 backdrop-blur-sm">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">📧</div>
              <h2 className="text-xl font-bold">Check your email</h2>
              <p className="text-sm text-text-secondary">
                We sent a password reset link to <strong className="text-text-primary">{email}</strong>
              </p>
              <Link href="/login" className="inline-block text-sm text-brand-blue hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">Reset your password</h2>
              <p className="text-sm text-text-secondary mb-6">
                Enter your email and we&apos;ll send you a reset link.
              </p>
              <form onSubmit={handleReset} className="space-y-5">
                <Input
                  type="email"
                  placeholder="you@zeotap.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={16} />}
                  required
                  autoFocus
                />

                {error && (
                  <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <Button type="submit" loading={loading} className="w-full" size="lg">
                  Send Reset Link
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-text-muted">
                <Link href="/login" className="text-brand-blue hover:underline">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
