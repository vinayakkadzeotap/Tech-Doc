import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';
import { CERTIFICATIONS } from '@/lib/utils/certifications';
import { TRACKS } from '@/lib/utils/roles';
import CertActions from '@/components/learning/CertActions';
import ProgressBar from '@/components/ui/ProgressBar';

export default async function CertificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch progress
  const { data: progress } = await supabase
    .from('progress')
    .select('track_id, module_id, status')
    .eq('user_id', user.id)
    .eq('status', 'completed');

  const completedKeys = new Set(
    progress?.map((p) => `${p.track_id}:${p.module_id}`) || []
  );

  // Fetch quiz attempts
  const { data: quizAttempts } = await supabase
    .from('quiz_attempts')
    .select('quiz_id, percentage, passed')
    .eq('user_id', user.id);

  // Fetch earned certifications
  const { data: earnedCerts } = await supabase
    .from('certifications')
    .select('cert_id, level, issued_at')
    .eq('user_id', user.id);

  const earnedCertIds = new Set(earnedCerts?.map((c) => c.cert_id) || []);
  const earnedMap = Object.fromEntries(
    earnedCerts?.map((c) => [c.cert_id, c.issued_at]) || []
  );

  // Check eligibility for each certification
  const certStatus = CERTIFICATIONS.map((cert) => {
    const tracksComplete = cert.requirements.tracks.every((trackId) => {
      const track = TRACKS.find((t) => t.id === trackId);
      if (!track) return false;
      return track.modules.every((m) => completedKeys.has(`${trackId}:${m.id}`));
    });

    const quizzesPassed = cert.requirements.quizzes.every((quizId) => {
      const attempts = quizAttempts?.filter((a) => a.quiz_id === quizId) || [];
      return attempts.some((a) => a.passed && a.percentage >= cert.requirements.minQuizScore);
    });

    const isEligible = tracksComplete && quizzesPassed;
    const isEarned = earnedCertIds.has(cert.id);

    const totalTracks = cert.requirements.tracks.length;
    const completedTracks = cert.requirements.tracks.filter((trackId) => {
      const track = TRACKS.find((t) => t.id === trackId);
      if (!track) return false;
      return track.modules.every((m) => completedKeys.has(`${trackId}:${m.id}`));
    }).length;

    const totalQuizzes = cert.requirements.quizzes.length;
    const completedQuizzes = cert.requirements.quizzes.filter((quizId) => {
      const attempts = quizAttempts?.filter((a) => a.quiz_id === quizId) || [];
      return attempts.some((a) => a.passed && a.percentage >= cert.requirements.minQuizScore);
    }).length;

    const totalReqs = totalTracks + totalQuizzes;
    const completedReqs = completedTracks + completedQuizzes;
    const progressPct = totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0;

    return {
      ...cert,
      isEligible,
      isEarned,
      earnedAt: earnedMap[cert.id],
      completedTracks,
      totalTracks,
      completedQuizzes,
      totalQuizzes,
      progressPct,
    };
  });

  const levelColors: Record<string, string> = { associate: '#3b82f6', professional: '#a855f7', expert: '#f59e0b' };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Certifications</h1>
        <p className="text-text-secondary text-sm mt-1">
          Complete tracks and pass quizzes to earn certifications.
          {earnedCertIds.size > 0 && ` ${earnedCertIds.size} earned.`}
        </p>
      </div>

      <div className="space-y-4">
        {certStatus.map((cert) => (
          <Card
            key={cert.id}
            className={`transition-all duration-300 ${cert.isEarned ? 'hover:-translate-y-0.5 hover:shadow-card' : 'opacity-80'}`}
          >
            <div className="flex items-start gap-4">
              <Icon name={cert.icon} contained color={cert.color} containerSize="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold">{cert.title}</h3>
                  <Badge color={levelColors[cert.level]}>{cert.level}</Badge>
                  {cert.isEarned && <Badge color="#10b981">Earned</Badge>}
                </div>
                <p className="text-sm text-text-secondary">{cert.description}</p>

                {/* Progress bar */}
                {!cert.isEarned && (
                  <div className="mt-3">
                    <ProgressBar value={cert.progressPct} color={cert.color} size="sm" showLabel />
                  </div>
                )}

                {/* Requirements */}
                <div className="mt-3 flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <div className={`w-1.5 h-1.5 rounded-full ${cert.completedTracks >= cert.totalTracks ? 'bg-brand-green' : 'bg-border-strong'}`} />
                    Tracks: {cert.completedTracks}/{cert.totalTracks}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <div className={`w-1.5 h-1.5 rounded-full ${cert.completedQuizzes >= cert.totalQuizzes ? 'bg-brand-green' : 'bg-border-strong'}`} />
                    Quizzes: {cert.completedQuizzes}/{cert.totalQuizzes} (min {cert.requirements.minQuizScore}%)
                  </div>
                </div>

                {cert.isEarned && cert.earnedAt && (
                  <p className="text-xs text-brand-green mt-2 font-medium">
                    Issued {new Date(cert.earnedAt).toLocaleDateString()}
                  </p>
                )}

                {cert.isEligible && !cert.isEarned && (
                  <div className="mt-3">
                    <CertActions certId={cert.id} level={cert.level} />
                  </div>
                )}

                {!cert.isEligible && !cert.isEarned && (
                  <p className="text-xs text-text-muted mt-3">
                    Complete the requirements above to unlock this certification.
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
