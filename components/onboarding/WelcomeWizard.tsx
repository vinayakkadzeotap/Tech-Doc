'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ROLES, getTracksForRole, type UserRole } from '@/lib/utils/roles';
import { Sparkles, ArrowRight, Check, BookOpen } from 'lucide-react';

interface Props {
  userId: string;
  userName: string;
  currentRole: UserRole;
}

export default function WelcomeWizard({ userId, userName, currentRole }: Props) {
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const tracks = getTracksForRole(selectedRole);
  const mandatoryTrack = tracks.find((t) => t.mandatory);
  const firstName = userName?.split(' ')[0] || 'there';

  // Track onboarding step changes for analytics
  const trackStep = useCallback((stepName: string) => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'onboarding_step', metadata: { step: stepName } }),
    }).catch(() => {});
  }, []);

  const completeOnboarding = useCallback(async () => {
    setSaving(true);
    trackStep('completed');
    const supabase = createClient();
    await supabase
      .from('profiles')
      .update({ role: selectedRole, onboarding_completed: true })
      .eq('id', userId);
    router.refresh();
  }, [userId, selectedRole, router, trackStep]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-bg-primary/95 backdrop-blur-xl">
      <div className="max-w-lg w-full bg-bg-elevated border border-border rounded-3xl p-8 shadow-modal animate-slide-up">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-brand-blue' : i < step ? 'w-4 bg-brand-blue/50' : 'w-4 bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-blue/10 mx-auto mb-6">
              <Sparkles size={28} className="text-brand-blue" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Welcome to ZeoAI, {firstName}!
            </h1>
            <p className="text-sm text-text-muted mb-8 max-w-sm mx-auto">
              Your personalized learning hub for mastering the Zeotap CDP platform. Let&apos;s set up your experience.
            </p>
            <button
              onClick={() => { trackStep('welcome_seen'); setStep(1); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white text-sm font-semibold rounded-xl hover:bg-brand-blue/90 transition-colors"
            >
              Get Started
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-text-primary mb-1">What&apos;s your role?</h2>
            <p className="text-xs text-text-muted mb-6">
              This personalizes your learning tracks and recommended content.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {(Object.entries(ROLES) as [UserRole, typeof ROLES[UserRole]][]).map(([id, role]) => (
                <button
                  key={id}
                  onClick={() => setSelectedRole(id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    selectedRole === id
                      ? 'border-brand-blue bg-brand-blue/10'
                      : 'border-border hover:border-border-strong'
                  }`}
                >
                  <span className="text-lg">{role.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">{role.label}</p>
                    <p className="text-[9px] text-text-muted line-clamp-1">{role.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(0)}
                className="text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => { trackStep('role_selected'); setStep(2); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-xl hover:bg-brand-blue/90 transition-colors"
              >
                Continue
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Your Learning Path */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-text-primary mb-1">Your Learning Path</h2>
            <p className="text-xs text-text-muted mb-5">
              {tracks.length} tracks selected for {ROLES[selectedRole].label}. Start with the mandatory track.
            </p>
            <div className="space-y-2 mb-6 max-h-52 overflow-y-auto">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    track.mandatory
                      ? 'border-brand-blue/30 bg-brand-blue/5'
                      : 'border-border'
                  }`}
                >
                  <span className="text-lg">{track.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-text-primary">{track.title}</p>
                      {track.mandatory && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue uppercase">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-text-muted">
                      {track.totalModules} modules &middot; {track.estimatedHours}h
                    </p>
                  </div>
                  <BookOpen size={14} className="text-text-muted shrink-0" />
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                Back
              </button>
              <button
                onClick={completeOnboarding}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-xl hover:bg-brand-blue/90 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Start Learning
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
