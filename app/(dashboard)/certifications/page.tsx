import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { CERTIFICATIONS } from '@/lib/utils/certifications';
import { TRACKS } from '@/lib/utils/roles';
import CertActions from '@/components/learning/CertActions';

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
    // Check track completions
    const tracksComplete = cert.requirements.tracks.every((trackId) => {
      const track = TRACKS.find((t) => t.id === trackId);
      if (!track) return false;
      return track.modules.every((m) => completedKeys.has(`${trackId}:${m.id}`));
    });

    // Check quizzes passed with min score
    const quizzesPassed = cert.requirements.quizzes.every((quizId) => {
      const attempts = quizAttempts?.filter((a) => a.quiz_id === quizId) || [];
      return attempts.some((a) => a.passed && a.percentage >= cert.requirements.minQuizScore);
    });

    const isEligible = tracksComplete && quizzesPassed;
    const isEarned = earnedCertIds.has(cert.id);

    // Progress calculation
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

    return {
      ...cert,
      isEligible,
      isEarned,
      earnedAt: earnedMap[cert.id],
      completedTracks,
      totalTracks,
      completedQuizzes,
      totalQuizzes,
    };
  });

  const levelColors = { associate: '#3b82f6', professional: '#a855f7', expert: '#f59e0b' };

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
          <Card key={cert.id} className={cert.isEarned ? '' : 'opacity-80'}>
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: `${cert.color}15` }}
              >
                {cert.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">{cert.title}</h3>
                  <Badge color={levelColors[cert.level]}>{cert.level}</Badge>
                  {cert.isEarned && <Badge color="#10b981">Earned</Badge>}
                </div>
                <p className="text-sm text-text-secondary">{cert.description}</p>

                {/* Requirements */}
                <div className="mt-3 space-y-1.5">
                  <div className="text-xs text-text-muted">
                    Tracks: {cert.completedTracks}/{cert.totalTracks} complete
                  </div>
                  <div className="text-xs text-text-muted">
                    Quizzes: {cert.completedQuizzes}/{cert.totalQuizzes} passed (min {cert.requirements.minQuizScore}%)
                  </div>
                </div>

                {cert.isEarned && cert.earnedAt && (
                  <p className="text-xs text-text-muted mt-2">
                    Issued {new Date(cert.earnedAt).toLocaleDateString()}
                  </p>
                )}

                {cert.isEligible && !cert.isEarned && (
                  <div className="mt-3">
                    <CertActions certId={cert.id} level={cert.level} />
                  </div>
                )}

                {!cert.isEligible && !cert.isEarned && (
                  <p className="text-xs text-brand-amber mt-3">
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
