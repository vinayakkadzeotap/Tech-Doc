import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { track_id, module_id, status } = body;

  if (!track_id || !module_id || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Check if row exists, then insert or update to avoid upsert 409 with RLS
  const { data: existing } = await supabase
    .from('progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('track_id', track_id)
    .eq('module_id', module_id)
    .single();

  let data, error;
  if (existing) {
    ({ data, error } = await supabase
      .from('progress')
      .update({
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
      })
      .eq('id', existing.id)
      .select());
  } else {
    ({ data, error } = await supabase.from('progress').insert({
      user_id: user.id,
      track_id,
      module_id,
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    }).select());
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
