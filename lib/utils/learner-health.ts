export type HealthStatus = 'active' | 'at-risk' | 'disengaged';

export interface LearnerHealth {
  userId: string;
  name: string;
  email: string;
  role: string;
  team: string;
  status: HealthStatus;
  score: number; // 0-100, lower = more at risk
  daysSinceLastActivity: number;
  completionPct: number;
  overdueAssignments: number;
  lastActivityDate: string | null;
}

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  role: string;
  team: string;
}

interface ProgressData {
  user_id: string;
  status: string;
  completed_at: string | null;
  created_at: string;
}

interface AssignmentData {
  user_id: string;
  track_id: string;
  due_date: string | null;
  status: string;
}

export function computeLearnerHealth(
  profiles: ProfileData[],
  progress: ProgressData[],
  assignments: AssignmentData[],
  totalModulesPerUser: number
): LearnerHealth[] {
  const now = Date.now();

  return profiles.map((profile) => {
    const userProgress = progress.filter((p) => p.user_id === profile.id);
    const userAssignments = assignments.filter((a) => a.user_id === profile.id);

    // Last activity: most recent progress entry (completed or started)
    const activityDates = userProgress
      .map((p) => p.completed_at || p.created_at)
      .filter(Boolean)
      .map((d) => new Date(d).getTime())
      .sort((a, b) => b - a);

    const lastActivityMs = activityDates[0] || 0;
    const daysSinceLastActivity = lastActivityMs
      ? Math.floor((now - lastActivityMs) / 86400000)
      : 999;

    // Completion percentage
    const completedCount = userProgress.filter((p) => p.status === 'completed').length;
    const completionPct = totalModulesPerUser > 0
      ? Math.round((completedCount / totalModulesPerUser) * 100)
      : 0;

    // Overdue assignments
    const overdueAssignments = userAssignments.filter((a) => {
      if (!a.due_date || a.status === 'completed') return false;
      return new Date(a.due_date).getTime() < now;
    }).length;

    // Health score calculation (0-100, higher = healthier)
    let score = 100;

    // Recency penalty: -2 points per day inactive (max -60)
    score -= Math.min(daysSinceLastActivity * 2, 60);

    // Overdue assignments penalty: -15 per overdue
    score -= overdueAssignments * 15;

    // Low completion bonus/penalty
    if (completionPct < 10 && daysSinceLastActivity > 7) {
      score -= 20; // Barely started and inactive
    } else if (completionPct > 50) {
      score += 10; // Good progress
    }

    score = Math.max(0, Math.min(100, score));

    // Classify
    let status: HealthStatus;
    if (score >= 60) {
      status = 'active';
    } else if (score >= 30) {
      status = 'at-risk';
    } else {
      status = 'disengaged';
    }

    return {
      userId: profile.id,
      name: profile.full_name || profile.email,
      email: profile.email,
      role: profile.role,
      team: profile.team || 'Unassigned',
      status,
      score,
      daysSinceLastActivity: daysSinceLastActivity === 999 ? -1 : daysSinceLastActivity,
      completionPct,
      overdueAssignments,
      lastActivityDate: lastActivityMs ? new Date(lastActivityMs).toISOString() : null,
    };
  }).sort((a, b) => a.score - b.score); // Most at-risk first
}
