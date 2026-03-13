export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { actionSchema, executeAction } from '@/lib/utils/assistant-actions';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const parsed = actionSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      const path = firstIssue?.path?.length ? `${firstIssue.path.join('.')}: ` : '';
      return NextResponse.json(
        { error: `${path}${firstIssue?.message || 'Validation failed'}` },
        { status: 400 }
      );
    }

    const result = await executeAction(parsed.data, user.id, supabase);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      action: parsed.data.action_type,
    });
  } catch (error) {
    console.error('POST /api/assistant-actions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
