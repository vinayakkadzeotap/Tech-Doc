import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/utils/rate-limit';
import { TRACKS } from '@/lib/utils/roles';
import {
  MODULE_DOCS_MAP,
  getLinkedModuleIds,
  getTotalDocsLinkCount,
} from '@/lib/utils/docs-links';
import { getFullDocsUrl, isMintlifyConfigured } from '@/lib/utils/mintlify';

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

    // Rate limit: 5 requests per minute
    const rl = rateLimit(`docs-health:${user.id}`, 5, 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Rate limited' },
        { status: 429 }
      );
    }

    // Calculate coverage
    const allModuleIds = TRACKS.flatMap((t) => t.modules.map((m) => m.id));
    const linkedModuleIds = getLinkedModuleIds();
    const totalModules = allModuleIds.length;
    const linkedModules = linkedModuleIds.length;
    const coveragePercent = totalModules > 0 ? Math.round((linkedModules / totalModules) * 100) : 0;

    // Find unlinked modules
    const linkedSet = new Set(linkedModuleIds);
    const unlinkedModules = TRACKS.flatMap((t) =>
      t.modules
        .filter((m) => !linkedSet.has(m.id))
        .map((m) => ({
          trackId: t.id,
          trackTitle: t.title,
          moduleId: m.id,
          moduleTitle: m.title,
        }))
    );

    // Check for broken links (only check first 5 to keep response fast)
    const brokenLinks: Array<{ path: string; url: string; status: number | string }> = [];
    if (isMintlifyConfigured()) {
      const allPaths = new Set<string>();
      Object.values(MODULE_DOCS_MAP).forEach((links) => {
        links.forEach((l) => allPaths.add(l.path));
      });

      const pathsArray = Array.from(allPaths);
      let checked = 0;
      for (const path of pathsArray) {
        if (checked >= 5) break;
        const url = getFullDocsUrl(path);
        try {
          const res = await fetch(url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(3000),
          });
          if (!res.ok) {
            brokenLinks.push({ path, url, status: res.status });
          }
        } catch {
          brokenLinks.push({ path, url, status: 'timeout' });
        }
        checked++;
      }
    }

    return NextResponse.json({
      configured: isMintlifyConfigured(),
      docs_url: process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL || null,
      coverage: {
        total_modules: totalModules,
        linked_modules: linkedModules,
        percent: coveragePercent,
        total_docs_links: getTotalDocsLinkCount(),
      },
      unlinked_modules: unlinkedModules,
      broken_links: brokenLinks,
    });
  } catch (error) {
    console.error('GET /api/admin/docs-health error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
