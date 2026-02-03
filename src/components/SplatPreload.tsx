'use client';

import { useEffect } from 'react';

/**
 * Preloads the splat file as soon as the page loads so the viewer's fetch
 * can hit the cache and start rendering sooner.
 */
export function SplatPreload({ splatUrl }: { splatUrl?: string | null }) {
  useEffect(() => {
    if (!splatUrl?.startsWith('/')) return;
    const href = `${window.location.origin}${splatUrl}`;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [splatUrl]);
  return null;
}
