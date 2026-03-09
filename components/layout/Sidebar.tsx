'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProgressBar from '@/components/ui/ProgressBar';

interface SidebarProps {
  overallProgress: number;
  role: string;
}

export default function Sidebar({ overallProgress, role }: SidebarProps) {
  const pathname = usePathname();

  const sections = [
    {
      title: 'Learning',
      items: [
        { href: '/learn', label: 'All Tracks', icon: '📚' },
        { href: '/assess', label: 'Assessments', icon: '📝' },
        { href: '/achievements', label: 'Achievements', icon: '🏆' },
        { href: '/glossary', label: 'Glossary', icon: '📖' },
      ],
    },
    {
      title: 'Explore',
      items: [
        { href: '/explore', label: 'Architecture Map', icon: '🗺️' },
      ],
    },
    {
      title: 'Account',
      items: [
        { href: '/profile', label: 'Profile', icon: '👤' },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-bg-secondary/50 p-4 gap-6">
      {/* Progress summary */}
      <div className="p-4 rounded-2xl bg-bg-surface/50 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-brand-blue">{overallProgress}%</span>
        </div>
        <ProgressBar value={overallProgress} size="md" />
        <p className="text-xs text-text-muted">
          Keep going! Complete modules to earn badges.
        </p>
      </div>

      {/* Nav sections */}
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="px-3 mb-2 text-[11px] font-bold text-text-muted uppercase tracking-wider">
            {section.title}
          </h3>
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${pathname === item.href
                    ? 'bg-brand-blue/10 text-brand-blue'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }
                `}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
