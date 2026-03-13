import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/utils/rate-limit';
import { MODULE_DOCS_MAP, getLinkedModuleIds, getTotalDocsLinkCount } from '@/lib/utils/docs-links';
import { getFullDocsUrl } from '@/lib/utils/mintlify';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Rate limit: 1 request per minute
    const rl = rateLimit(`docs-status:${user.id}`, 1, 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Rate limited. Try again in a minute.' },
        { status: 429 }
      );
    }

    const docsBaseUrl = process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL;
    if (!docsBaseUrl) {
      return NextResponse.json({
        configured: false,
        message: 'NEXT_PUBLIC_MINTLIFY_DOCS_URL is not set',
      });
    }

    // Check all mapped doc links
    const linkedModules = getLinkedModuleIds();
    const totalLinks = getTotalDocsLinkCount();
    const results: Array<{
      moduleId: string;
      path: string;
      url: string;
      status: number | 'error';
      ok: boolean;
    }> = [];

    // Check unique paths only
    const checkedPaths = new Set<string>();

    for (const moduleId of linkedModules) {
      const links = MODULE_DOCS_MAP[moduleId] || [];
      for (const link of links) {
        if (checkedPaths.has(link.path)) continue;
        checkedPaths.add(link.path);

        const fullUrl = getFullDocsUrl(link.path);
        try {
          const res = await fetch(fullUrl, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000),
          });
          results.push({
            moduleId,
            path: link.path,
            url: fullUrl,
            status: res.status,
            ok: res.ok,
          });
        } catch {
          results.push({
            moduleId,
            path: link.path,
            url: fullUrl,
            status: 'error',
            ok: false,
          });
        }
      }
    }

    const broken = results.filter((r) => !r.ok);

    return NextResponse.json({
      configured: true,
      summary: {
        linked_modules: linkedModules.length,
        total_links: totalLinks,
        checked: results.length,
        ok: results.filter((r) => r.ok).length,
        broken: broken.length,
      },
      broken_links: broken,
    });
  } catch (error) {
    console.error('GET /api/content/docs-status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
