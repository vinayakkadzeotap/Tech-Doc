import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BADGES } from '@/lib/utils/badges';
import Card from '@/components/ui/Card';

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: earned } = await supabase
    .from('badges')
    .select('badge_id, earned_at')
    .eq('user_id', user.id);

  const earnedIds = new Set(earned?.map((b) => b.badge_id) || []);
  const earnedMap = Object.fromEntries(earned?.map((b) => [b.badge_id, b.earned_at]) || []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Achievements</h1>
        <p className="text-text-secondary text-sm mt-1">
          {earnedIds.size} of {Object.keys(BADGES).length} badges earned. Complete tracks and quizzes to unlock more.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.values(BADGES).map((badge) => {
          const isEarned = earnedIds.has(badge.id);
          return (
            <Card
              key={badge.id}
              className={`text-center !p-5 transition-all ${
                isEarned ? '' : 'opacity-30 grayscale'
              }`}
            >
              <span className="text-4xl block mb-3">{badge.icon}</span>
              <h3 className="text-sm font-bold mb-1">{badge.title}</h3>
              <p className="text-[11px] text-text-muted leading-relaxed">{badge.description}</p>
              {isEarned && earnedMap[badge.id] && (
                <p className="text-[10px] text-text-muted mt-2">
                  Earned {new Date(earnedMap[badge.id]).toLocaleDateString()}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
