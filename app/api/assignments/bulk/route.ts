export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { LEARNING_PLAN_TEMPLATES } from '@/lib/utils/learning-plans';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { templateId, userIds } = body;

    if (!templateId || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'templateId and userIds required' }, { status: 400 });
    }

    const template = LEARNING_PLAN_TEMPLATES.find((t) => t.id === templateId);
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Create assignments for each user × track
    const assignments = [];
    for (const userId of userIds) {
      for (const trackId of template.tracks) {
        assignments.push({
          user_id: userId,
          track_id: trackId,
          assigned_by: user.id,
          template_id: templateId,
          due_date: new Date(Date.now() + template.estimatedDays * 86400000).toISOString(),
        });
      }
    }

    const { error } = await supabase.from('assignments').upsert(assignments, {
      onConflict: 'user_id,track_id',
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create notifications for assigned users
    const notifications = userIds.map((userId: string) => ({
      user_id: userId,
      type: 'assignment',
      title: `New learning plan: ${template.name}`,
      message: `You've been assigned the "${template.name}" learning plan with ${template.tracks.length} tracks.`,
    }));

    await supabase.from('notifications').insert(notifications);

    return NextResponse.json({
      success: true,
      created: assignments.length,
      users: userIds.length,
      tracks: template.tracks.length,
    });
  } catch (error) {
    console.error('POST /api/assignments/bulk error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
