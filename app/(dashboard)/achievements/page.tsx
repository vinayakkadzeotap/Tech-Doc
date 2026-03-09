import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BADGES } from '@/lib/utils/badges';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';

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
              className={`text-center !p-5 transition-all duration-300 ${
                isEarned
                  ? 'hover:-translate-y-1 hover:shadow-card'
                  : 'opacity-30 grayscale'
              }`}
            >
              <div className="flex justify-center mb-3">
                <Icon name={badge.icon} contained color={badge.color} containerSize="lg" />
              </div>
              <h3 className="text-sm font-bold mb-1">{badge.title}</h3>
              <p className="text-[11px] text-text-muted leading-relaxed">{badge.description}</p>
              {isEarned && earnedMap[badge.id] && (
                <p className="text-[10px] text-brand-green mt-2 font-medium">
                  Earned {new Date(earnedMap[badge.id]).toLocaleDateString()}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {earnedIds.size === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-border">
          <div className="flex justify-center">
            <Icon name="🏆" contained color="#f59e0b" containerSize="lg" />
          </div>
          <p className="mt-4 text-sm text-text-secondary font-medium">No badges earned yet</p>
          <p className="text-xs text-text-muted mt-1">Start completing modules and quizzes to earn your first badge!</p>
        </div>
      )}
    </div>
  );
}
