'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Compass, User, Award } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/learn', icon: BookOpen, label: 'Learn' },
  { href: '/explore', icon: Compass, label: 'Explore' },
  { href: '/achievements', icon: Award, label: 'Badges' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-bg-surface/95 backdrop-blur-lg border-t border-border" role="navigation" aria-label="Mobile navigation">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? 'text-brand-blue'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 rounded-full bg-brand-blue" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
