'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/types/project';
import { Viewer3D } from '@/components/Viewer3D';

/**
 * A single project card in the grid: 3D splat (or fallback) that reacts to mouse/touch,
 * with title overlay. Links to project detail. Link is a full-size overlay so iframe/image
 * cannot capture clicks.
 */
export function SplatCard({ project }: { project: Project }) {
  const href = `/project/${project.slug}`;
  const cardRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the card center is from viewport center
      const cardCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distanceFromCenter = cardCenter - viewportCenter;
      
      // Normalize: when card is at center, distance is 0
      // When card is at top/bottom of viewport, distance is +/- windowHeight/2
      const normalizedDistance = distanceFromCenter / (windowHeight / 2);
      
      // Scale: 1.0 at edges, up to 1.15 when centered
      // As card approaches center (normalizedDistance -> 0), scale increases
      const newScale = 1 + (1 - Math.abs(normalizedDistance)) * 0.15;
      
      setScale(Math.max(1, Math.min(1.15, newScale)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
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
          baseZoom={-3}
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
      {/* Title overlay — bottom */}
      <div className="absolute inset-x-0 bottom-0 z-[1] flex flex-col items-center pb-12 md:pb-16 pointer-events-none">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-stone-800 dark:text-white tracking-tight text-center leading-tight">
          {project.title}
        </h2>
        {project.location ? (
          <p className="font-mono text-[10px] md:text-xs text-stone-600 dark:text-white/60 mt-3 uppercase tracking-[0.25em]">
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
