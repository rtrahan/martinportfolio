'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'martin-portfolio-theme';

export type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getEffectiveTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return getSystemTheme();
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = getEffectiveTheme();
    setThemeState(t);
    applyTheme(t);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
      const next = media.matches ? 'dark' : 'light';
      setThemeState(next);
      applyTheme(next);
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [mounted]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return { theme, setTheme, toggleTheme, mounted };
}

/** Compact theme override for footer; theme is automatic by device preference by default. */
export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  if (!mounted) {
    return <span className="inline-block w-[120px] h-8" aria-hidden />;
  }
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-stone-300 dark:border-white/10 bg-stone-100/80 dark:bg-stone-900/40 hover:border-stone-400 dark:hover:border-white/20 hover:bg-stone-200 dark:hover:bg-stone-900/70 transition-colors touch-manipulation active:scale-[0.98]"
      aria-label={theme === 'dark' ? 'Use light mode' : 'Use dark mode'}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
      <span aria-hidden className="block w-px h-3 bg-stone-300 dark:bg-white/15" />
      {theme === 'dark' ? (
        <svg className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
