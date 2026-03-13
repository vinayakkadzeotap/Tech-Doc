export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createNotification } from '@/lib/utils/notify';
import { trackServerEvent, EVENTS } from '@/lib/utils/analytics';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check if admin or manager
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, is_manager')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile?.is_admin && !profile?.is_manager) {
      // Regular users only see their own assignments
      const { data, error } = await supabase
        .from('assignments')
        .select('*, profiles!assignments_assigned_by_fkey(full_name)')
        .eq('assigned_to', user.id)
        .order('created_at', { ascending: false });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }

    // Admins/managers see all assignments
    const { data, error } = await supabase
      .from('assignments')
      .select('*, assigned_to_profile:profiles!assignments_assigned_to_fkey(full_name, email), assigned_by_profile:profiles!assignments_assigned_by_fkey(full_name)')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/assignments error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, is_manager')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile?.is_admin && !profile?.is_manager) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { assigned_to, track_id, due_date, notes } = await request.json();
    if (!assigned_to || !track_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase.from('assignments').insert({
      assigned_by: user.id,
      assigned_to,
      track_id,
      due_date: due_date || null,
      notes: notes || '',
      status: 'assigned',
    }).select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Notify the assigned user
    createNotification(
      supabase,
      assigned_to,
      'assignment',
      'New Learning Assignment',
      `You've been assigned the "${track_id}" track${due_date ? ` (due ${due_date})` : ''}.`,
      `/learn/${track_id}`
    );

    // Track analytics event
    trackServerEvent(supabase, user.id, EVENTS.ASSIGNMENT_CREATED, {
      assigned_to,
      track_id,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('POST /api/assignments error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
