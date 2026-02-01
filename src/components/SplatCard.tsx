'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/types/project';
import { Viewer3D } from '@/components/Viewer3D';

/** Zoom out more on mobile so the full building is visible in the splat. */
const MOBILE_BREAKPOINT = 640;
const BASE_ZOOM_DESKTOP = -3;
const BASE_ZOOM_MOBILE = -40;

/**
 * A single project card in the grid: 3D splat (or fallback) that reacts to mouse/touch,
 * with title overlay. Links to project detail. Link is a full-size overlay so iframe/image
 * cannot capture clicks.
 */
export function SplatCard({ project }: { project: Project }) {
  const href = `/project/${project.slug}`;
  const cardRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  // Default to mobile zoom so small screens get correct zoom on first paint (no flash)
  const [baseZoom, setBaseZoom] = useState(BASE_ZOOM_MOBILE);

  useEffect(() => {
    const updateZoom = () => {
      setBaseZoom(window.innerWidth < MOBILE_BREAKPOINT ? BASE_ZOOM_MOBILE : BASE_ZOOM_DESKTOP);
    };
    updateZoom();
    window.addEventListener('resize', updateZoom);
    return () => window.removeEventListener('resize', updateZoom);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      // Disable scroll-zoom on small screens for performance and simpler UX
      if (window.innerWidth < 640) {
        setScale(1);
        return;
      }
      const rect = cardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const cardCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distanceFromCenter = cardCenter - viewportCenter;
      const normalizedDistance = distanceFromCenter / (windowHeight / 2);
      const newScale = 1 + (1 - Math.abs(normalizedDistance)) * 0.15;
      setScale(Math.max(1, Math.min(1.15, newScale)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={cardRef}
      className="group relative w-full aspect-[16/9] overflow-hidden bg-transparent focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-400 dark:focus-within:ring-white/30 focus-within:ring-inset"
    >
      {/* Splat only — radial vignette to blend edges into page (no hard rect) */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
        style={{ transform: `scale(${scale})` }}
      >
        <Viewer3D
          splatUrl={project.splatUrl}
          fallbackMediaUrl={project.fallbackMediaUrl}
          compact
          baseZoom={baseZoom}
        />
      </div>
      {/* Radial vignette — circular, clear center, solid edges */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none dark:opacity-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 65%, rgba(245,245,244,0.4) 75%, rgba(245,245,244,0.8) 82%, #f5f5f4 92%, #f5f5f4 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-0 dark:opacity-100"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 65%, rgba(28,25,23,0.4) 75%, rgba(28,25,23,0.8) 82%, #1c1917 92%, #1c1917 100%)',
        }}
      />
      {/* Edge fades to ensure corners are covered */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-stone-100 dark:from-stone-900 via-transparent to-stone-100 dark:to-stone-900" />
      {/* Top gradient to hide top edge */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-stone-100 dark:from-stone-900 via-transparent to-transparent" style={{ backgroundSize: '100% 40%', backgroundPosition: 'top', backgroundRepeat: 'no-repeat' }} />
      {/* Bottom gradient to hide bottom edge */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-stone-100 dark:from-stone-900 via-transparent to-transparent" style={{ backgroundSize: '100% 40%', backgroundPosition: 'bottom', backgroundRepeat: 'no-repeat' }} />
      {/* Title overlay — bottom, lower for legibility over gradient */}
      <div className="absolute inset-x-0 bottom-0 z-[1] flex flex-col items-center px-4 pb-4 sm:pb-6 md:pb-10 lg:pb-14 pointer-events-none">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-stone-800 dark:text-white tracking-tight text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
          {project.title}
        </h2>
        {project.location ? (
          <p className="font-mono text-[10px] sm:text-xs text-stone-700 dark:text-white/80 mt-2 sm:mt-3 uppercase tracking-[0.2em] sm:tracking-[0.25em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {project.location}
          </p>
        ) : null}
      </div>
      {/* Clickable link overlay — on top so it always receives clicks */}
      <Link
        href={href}
        aria-label={`View project: ${project.title}`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">View project: {project.title}</span>
      </Link>
    </div>
  );
}
