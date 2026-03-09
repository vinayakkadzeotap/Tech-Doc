'use client';

import { CelebrationProvider } from '@/components/interactive/CelebrationOverlay';
import CelebrationOverlay from '@/components/interactive/CelebrationOverlay';

export default function CelebrationWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CelebrationProvider>
      {children}
      <CelebrationOverlay />
    </CelebrationProvider>
  );
}
