'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, EVENTS } from '@/lib/utils/analytics';

export default function AnalyticsPageTracker() {
  const pathname = usePathname();
  const prevPath = useRef('');

  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      trackEvent(EVENTS.PAGE_VIEW, { path: pathname });
    }
  }, [pathname]);

  return null;
}
