'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { getTheme, toggleTheme, type Theme } from '@/lib/utils/theme';

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setThemeState(next);
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-bg-hover transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={15} className="text-text-muted hover:text-text-primary transition-colors" />
      ) : (
        <Moon size={15} className="text-text-muted hover:text-text-primary transition-colors" />
      )}
    </button>
  );
}
