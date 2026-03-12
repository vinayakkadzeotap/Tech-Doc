export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'zeoai-theme';

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  // Check system preference
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

export function setTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(theme);
}

export function toggleTheme(): Theme {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
