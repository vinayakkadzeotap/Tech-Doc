'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  politeness?: 'polite' | 'assertive';
}

export default function LiveRegion({ children, politeness = 'polite' }: Props) {
  return (
    <div aria-live={politeness} aria-atomic="true" className="sr-only">
      {children}
    </div>
  );
}
