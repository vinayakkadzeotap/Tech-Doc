import { type SupabaseClient } from '@supabase/supabase-js';
import { TRACKS, type Track, type TrackModule } from './roles';

interface DBTrack {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  estimated_hours: number;
  target_roles: string[];
  mandatory: boolean;
  sort_order: number;
}

interface DBModule {
  track_id: string;
  id: string;
  title: string;
  description: string;
  icon: string;
  estimated_minutes: number;
  content_type: string;
  sort_order: number;
}

/**
 * Fetch tracks from Supabase with fallback to hardcoded TRACKS.
 * Returns the same Track[] shape the app already uses.
 */
export async function getTracksFromDB(supabase: SupabaseClient): Promise<Track[]> {
  try {
    const { data: dbTracks, error: tErr } = await supabase
      .from('tracks')
      .select('*')
      .order('sort_order');

    if (tErr || !dbTracks || dbTracks.length === 0) return TRACKS;

    const { data: dbModules, error: mErr } = await supabase
      .from('modules')
      .select('*')
      .order('sort_order');

    if (mErr || !dbModules) return TRACKS;

    const modulesByTrack = new Map<string, DBModule[]>();
    for (const m of dbModules) {
      if (!modulesByTrack.has(m.track_id)) modulesByTrack.set(m.track_id, []);
      modulesByTrack.get(m.track_id)!.push(m);
    }

    return (dbTracks as DBTrack[]).map((t) => {
      const mods = (modulesByTrack.get(t.id) || []) as DBModule[];
      return {
        id: t.id as Track['id'],
        title: t.title,
        subtitle: t.subtitle,
        icon: t.icon,
        color: t.color,
        totalModules: mods.length,
        estimatedHours: t.estimated_hours,
        targetRoles: t.target_roles as Track['targetRoles'],
        mandatory: t.mandatory,
        modules: mods.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          icon: m.icon,
          estimatedMinutes: m.estimated_minutes,
          contentType: m.content_type as TrackModule['contentType'],
        })),
      };
    });
  } catch {
    return TRACKS;
  }
}

export async function getTrackById(supabase: SupabaseClient, trackId: string): Promise<Track | null> {
  const tracks = await getTracksFromDB(supabase);
  return tracks.find((t) => t.id === trackId) || null;
}
