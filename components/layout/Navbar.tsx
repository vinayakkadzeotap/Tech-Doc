'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Search, Menu, X, User, LogOut } from 'lucide-react';
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

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { href: '/home', label: 'Dashboard', icon: '🏠' },
    { href: '/learn', label: 'Learn', icon: '📚' },
    { href: '/explore', label: 'Simulators', icon: '🔬' },
    { href: '/assess', label: 'Assess', icon: '📝' },
    { href: '/achievements', label: 'Achievements', icon: '🏆' },
    { href: '/certifications', label: 'Certs', icon: '🎓' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-gradient">Zeotap</span>
            <span className="text-text-muted text-sm">/</span>
            <span className="text-text-secondary text-sm font-medium">Learning</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${pathname.startsWith(item.href)
                    ? 'bg-brand-blue/10 text-brand-blue'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }
                `}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
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
                <span>⚡</span> Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors focus-ring"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {user && (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                >
                  <User size={16} />
                  <span className="max-w-[120px] truncate">{user.full_name || user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors focus-ring"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${pathname.startsWith(item.href)
                    ? 'bg-brand-blue/10 text-brand-blue'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
      {/* Search modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
