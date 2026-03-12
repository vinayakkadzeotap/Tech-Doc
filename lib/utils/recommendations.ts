import { TRACKS, getTracksForRole, type UserRole } from '@/lib/utils/roles';

export interface Recommendation {
  trackId: string;
  moduleId: string;
  trackTitle: string;
  trackIcon: string;
  trackColor: string;
  moduleTitle: string;
  moduleIcon: string;
  reason: string;
}

interface ProgressEntry {
  track_id: string;
  module_id: string;
  status: string;
}

// Track priority order (most foundational first)
const TRACK_PRIORITY: Record<string, number> = {
  'business-essentials': 1,
  'product-mastery': 2,
  'sales-enablement': 3,
  'cs-playbook': 4,
  'engineering': 5,
  'tam-playbook': 6,
};

export function getRecommendations(
  role: UserRole,
  progress: ProgressEntry[],
  maxResults = 3
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const completedSet = new Set(
    progress.filter((p) => p.status === 'completed').map((p) => `${p.track_id}:${p.module_id}`)
  );
  const inProgressSet = new Set(
    progress.filter((p) => p.status === 'in_progress').map((p) => `${p.track_id}:${p.module_id}`)
  );

  const roleTracks = getTracksForRole(role);
  const roleTrackIds = new Set(roleTracks.map((t) => t.id));

  // Sort tracks by priority
  const sortedTracks = [...TRACKS].sort((a, b) => {
    const aPriority = TRACK_PRIORITY[a.id] || 99;
    const bPriority = TRACK_PRIORITY[b.id] || 99;
    // Prioritize role-relevant tracks
    const aRelevant = roleTrackIds.has(a.id) ? 0 : 10;
    const bRelevant = roleTrackIds.has(b.id) ? 0 : 10;
    return (aPriority + aRelevant) - (bPriority + bRelevant);
  });

  for (const track of sortedTracks) {
    if (recommendations.length >= maxResults) break;

    const trackCompleted = progress.filter(
      (p) => p.track_id === track.id && p.status === 'completed'
    ).length;
    const trackTotal = track.modules.length;
    const trackPct = trackTotal > 0 ? Math.round((trackCompleted / trackTotal) * 100) : 0;

    // Skip completed tracks
    if (trackPct === 100) continue;

    // Find next incomplete module in track
    const nextModule = track.modules.find(
      (m) => !completedSet.has(`${track.id}:${m.id}`) && !inProgressSet.has(`${track.id}:${m.id}`)
    );
    if (!nextModule) continue;

    // Determine reason
    let reason: string;
    if (trackPct > 0 && trackPct < 100) {
      reason = `Continue your ${track.title} progress (${trackPct}% complete)`;
    } else if (track.mandatory && roleTrackIds.has(track.id)) {
      reason = `Required for your role — start ${track.title}`;
    } else if (roleTrackIds.has(track.id)) {
      reason = `Recommended for ${role} — ${track.title}`;
    } else {
      reason = `Broaden your knowledge with ${track.title}`;
    }

    recommendations.push({
      trackId: track.id,
      moduleId: nextModule.id,
      trackTitle: track.title,
      trackIcon: track.icon,
      trackColor: track.color,
      moduleTitle: nextModule.title,
      moduleIcon: nextModule.icon,
      reason,
    });
  }

  return recommendations;
}
