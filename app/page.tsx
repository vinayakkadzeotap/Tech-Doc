export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Icon from '@/components/ui/Icon';

export default async function LandingPage() {
  let isAuthenticated = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isAuthenticated = !!user;
  } catch {
    // Auth check failed - show landing page
  }

  if (isAuthenticated) {
    redirect('/home');
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/zeotap-logo.svg" alt="Zeotap" className="w-7 h-7" />
            <span className="text-lg font-extrabold" style={{ color: '#2563EB' }}>Zeotap Learning</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-blue to-brand-indigo text-white hover:shadow-glow transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="relative text-center max-w-3xl mx-auto">
          {/* Glow backdrop */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-blue/[0.07] rounded-full blur-[100px]" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-brand-blue/25 bg-brand-blue/10 text-brand-blue text-xs font-semibold uppercase tracking-widest">
            Interactive Learning Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6">
            Master{' '}
            <span className="text-gradient">Zeotap CDP</span>
            <br />
            From Any Role
          </h1>

          <p className="text-lg text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
            Structured learning paths for engineers, salespeople, customer success, product managers, and
            everyone in between. Interactive quizzes, certifications, and progress tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3.5 text-base font-semibold rounded-xl bg-gradient-to-r from-brand-blue to-brand-indigo text-white hover:shadow-glow-lg hover:-translate-y-0.5 transition-all"
            >
              Start Learning
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 text-base font-semibold rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-20 max-w-4xl mx-auto w-full">
          {[
            { icon: '⚙️', label: 'Engineering', desc: 'Architecture deep dives', color: '#3b82f6' },
            { icon: '💼', label: 'Sales', desc: 'Pitch & demo playbooks', color: '#f59e0b' },
            { icon: '🤝', label: 'Customer Success', desc: 'Onboarding & support', color: '#10b981' },
            { icon: '📐', label: 'Product', desc: 'Feature mastery', color: '#a855f7' },
            { icon: '📣', label: 'Marketing', desc: 'Positioning & use cases', color: '#ec4899' },
          ].map((role) => (
            <div
              key={role.label}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-bg-surface/50 border border-border hover:border-border-strong hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              <Icon name={role.icon} contained color={role.color} containerSize="lg" />
              <span className="text-sm font-semibold">{role.label}</span>
              <span className="text-xs text-text-muted text-center">{role.desc}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto w-full">
          {[
            { n: '6', label: 'Learning Tracks' },
            { n: '56', label: 'Modules' },
            { n: '10+', label: 'Quizzes' },
            { n: '10', label: 'Badges to Earn' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-gradient">{stat.n}</div>
              <div className="text-xs text-text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-text-muted">
        Zeotap CDP Learning Platform — Built for every role in the organization
      </footer>
    </div>
  );
}
