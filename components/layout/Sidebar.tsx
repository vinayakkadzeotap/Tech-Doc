'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  ClipboardCheck,
  Trophy,
  BookMarked,
  Microscope,
  Globe,
  User,
  GraduationCap,
  Swords,
  FileText,
  Handshake,
  Briefcase,
  Library,
  type LucideIcon,
} from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';

interface SidebarProps {
  overallProgress: number;
  role: string;
}

interface NavSection {
  title: string;
  items: { href: string; label: string; icon: LucideIcon }[];
}

export default function Sidebar({ overallProgress, role }: SidebarProps) {
  const pathname = usePathname();

  const isSalesOrCS = role === 'sales' || role === 'cs' || role === 'leadership';

  const sections: NavSection[] = [
    {
      title: 'Learn',
      items: [
        { href: '/learn', label: 'Learning Tracks', icon: BookOpen },
        { href: '/assess', label: 'Assessments', icon: ClipboardCheck },
        { href: '/certifications', label: 'Certifications', icon: GraduationCap },
        { href: '/glossary', label: 'Glossary', icon: BookMarked },
      ],
    },
    {
      title: 'Practice',
      items: [
        { href: '/explore', label: 'Simulators & Labs', icon: Microscope },
        { href: '/universe', label: 'Knowledge Universe', icon: Globe },
      ],
    },
    ...(isSalesOrCS ? [{
      title: 'Sales & CS',
      items: [
        { href: '/battle-cards', label: 'Battle Cards', icon: Swords },
        { href: '/deal-prep', label: 'Deal Prep', icon: Briefcase },
        { href: '/case-studies', label: 'Case Studies', icon: FileText },
        { href: '/partners', label: 'Partners', icon: Handshake },
      ],
    }] : []),
    {
      title: 'You',
      items: [
        { href: '/achievements', label: 'Achievements', icon: Trophy },
        { href: '/library', label: 'Library', icon: Library },
        { href: '/profile', label: 'Profile', icon: User },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-bg-secondary/50 p-4 gap-6" role="navigation" aria-label="Sidebar navigation">
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
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-brand-blue/10 text-brand-blue'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                    }
                  `}
                >
                  <IconComponent size={16} strokeWidth={isActive ? 2.5 : 2} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
