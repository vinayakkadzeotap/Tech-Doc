'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PageTransition({ children }: Props) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-opacity duration-200 ease-in-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}
