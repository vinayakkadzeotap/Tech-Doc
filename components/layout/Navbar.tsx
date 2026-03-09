'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Menu,
  X,
  User,
  LogOut,
  Home,
  BookOpen,
  Microscope,
  ClipboardCheck,
  Trophy,
  GraduationCap,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import SearchModal from '@/components/layout/SearchModal';

interface NavbarProps {
  user: {
    email: string;
    full_name: string;
    role: string;
    is_admin: boolean;
  } | null;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global ⌘K / Ctrl+K shortcut
  const handleGlobalKey = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKey);
    return () => document.removeEventListener('keydown', handleGlobalKey);
  }, [handleGlobalKey]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems: NavItem[] = [
    { href: '/home', label: 'Dashboard', icon: Home },
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/explore', label: 'Simulators', icon: Microscope },
    { href: '/assess', label: 'Assess', icon: ClipboardCheck },
    { href: '/achievements', label: 'Achievements', icon: Trophy },
    { href: '/certifications', label: 'Certs', icon: GraduationCap },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center">
              <span className="text-white text-xs font-black">Z</span>
            </div>
            <span className="text-lg font-extrabold text-gradient">Zeotap</span>
            <span className="text-text-muted text-sm">/</span>
            <span className="text-text-secondary text-sm font-medium">Learning</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'text-brand-blue'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl bg-brand-blue/10 border border-brand-blue/20" />
                  )}
                  <IconComponent size={16} className="relative z-10" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
            {user?.is_admin && (
              <Link
                href="/admin/dashboard"
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${pathname.startsWith('/admin')
                    ? 'bg-brand-purple/10 text-brand-purple'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }
                `}
              >
                <Zap size={16} /> Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-text-muted bg-bg-surface/50 border border-border hover:border-border-strong transition-all focus-ring"
              aria-label="Search"
            >
              <Search size={14} />
              <span className="hidden sm:inline text-xs">Search...</span>
              <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-bg-elevated border border-border text-text-muted">⌘K</kbd>
            </button>

            {user && (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">
                      {(user.full_name || user.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="max-w-[100px] truncate text-xs font-medium">{user.full_name || user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors focus-ring"
                  aria-label="Sign out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors focus-ring"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-bg-secondary/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-brand-blue/10 text-brand-blue'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                    }
                  `}
                >
                  <IconComponent size={18} />
                  {item.label}
                </Link>
              );
            })}
            {user && (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all"
                >
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {/* Search modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
