'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ROLES, type UserRole } from '@/lib/utils/roles';
import { Mail, Lock, User } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState<'credentials' | 'role'>('credentials');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [team, setTeam] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setStep('role');
  };

  const handleSignup = async () => {
    if (!selectedRole) {
      setError('Please select your role');
      return;
    }
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Update profile with role and team
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ role: selectedRole, team, full_name: fullName })
        .eq('id', user.id);
    }

    router.push('/home');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-purple/[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-gradient">
            Zeotap Learning
          </Link>
          <p className="mt-2 text-sm text-text-secondary">
            {step === 'credentials' ? 'Create your account' : 'Tell us about your role'}
          </p>
        </div>

        <div className="bg-bg-surface/50 border border-border rounded-3xl p-8 backdrop-blur-sm">
          {step === 'credentials' ? (
            <form onSubmit={handleCredentials} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User size={16} />}
                required
                autoFocus
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@zeotap.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
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

              <Button type="submit" className="w-full" size="lg">
                Continue
              </Button>
            </form>
          ) : (
            <div className="space-y-5">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setStep('credentials')}
                  className="text-xs text-text-muted hover:text-brand-blue transition-colors"
                >
                  ← Back
                </button>
              </div>

              <p className="text-sm text-text-secondary mb-4">
                We&apos;ll personalize your learning paths based on your role.
              </p>

              {/* Role grid */}
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(ROLES) as [UserRole, typeof ROLES[UserRole]][]).map(([key, role]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedRole(key)}
                    className={`
                      flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all duration-200
                      ${selectedRole === key
                        ? 'border-brand-blue bg-brand-blue/10 shadow-glow'
                        : 'border-border hover:border-border-strong hover:bg-bg-hover'
                      }
                    `}
                  >
                    <span className="text-2xl">{role.icon}</span>
                    <span className="text-sm font-semibold">{role.label}</span>
                    <span className="text-[10px] text-text-muted leading-tight">{role.description}</span>
                  </button>
                ))}
              </div>

              <Input
                label="Team (optional)"
                type="text"
                placeholder="e.g. Platform, Growth, EMEA Sales"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              />

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  {error}
                </div>
              )}

              <Button onClick={handleSignup} loading={loading} className="w-full" size="lg">
                Create Account
              </Button>
            </div>
          )}

          {step === 'credentials' && (
            <p className="mt-6 text-center text-sm text-text-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-blue hover:underline font-medium">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
