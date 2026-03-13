export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

async function isAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  return profile?.is_admin === true;
}

// GET: fetch all tracks + modules
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: tracks } = await supabase
      .from('tracks')
      .select('*')
      .order('sort_order');

    const { data: modules } = await supabase
      .from('modules')
      .select('*')
      .order('sort_order');

    return NextResponse.json({ tracks: tracks || [], modules: modules || [] });
  } catch (error) {
    console.error('GET /api/admin/content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: create or update a track or module
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { type, data } = body;

    if (type === 'track') {
      const { error } = await supabase.from('tracks').upsert(data, { onConflict: 'id' });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (type === 'module') {
      const { error } = await supabase.from('modules').upsert(data, { onConflict: 'track_id,id' });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('POST /api/admin/content error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH: update a track or module
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { type, id, trackId, updates } = body;

    if (type === 'track') {
      const { error } = await supabase.from('tracks').update(updates).eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (type === 'module') {
      const { error } = await supabase
        .from('modules')
        .update(updates)
        .eq('track_id', trackId)
        .eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('PATCH /api/admin/content error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: remove a track or module
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const trackId = searchParams.get('trackId');

    if (type === 'track' && id) {
      const { error } = await supabase.from('tracks').delete().eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (type === 'module' && id && trackId) {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('track_id', trackId)
        .eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
  } catch (error) {
    console.error('DELETE /api/admin/content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
