'use client';

import Link from 'next/link';
import type { Project } from '@/types/project';
import { Viewer3D } from '@/components/Viewer3D';

/**
 * A project card for the home grid: editorial-numbered card with image,
 * hairline frame, refined hover. Splats only load on project detail pages.
 */
export function SplatCard({
  project,
  index,
  total,
}: {
  project: Project;
  index?: number;
  total?: number;
}) {
  const href = `/project/${project.slug}`;
  const indexStr = typeof index === 'number' ? String(index).padStart(2, '0') : null;
  const totalStr = typeof total === 'number' ? String(total).padStart(2, '0') : null;

  return (
    <Link
      href={href}
      className="group relative block rise focus:outline-none"
      aria-label={`View project: ${project.title}`}
    >
      {/* Top index strip — sheet number + location */}
      <div className="flex items-center justify-between gap-3 mb-3 pl-0.5 pr-0.5">
        <span className="font-mono tabular text-[10px] sm:text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500">
          {indexStr && totalStr ? `${indexStr} / ${totalStr}` : ''}
        </span>
        {project.location && (
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500 truncate">
            {project.location}
          </span>
        )}
      </div>

      {/* Image card */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md bg-stone-200 dark:bg-stone-800 ring-1 ring-stone-200 dark:ring-white/5 shadow-sm group-hover:shadow-xl group-hover:ring-stone-300 dark:group-hover:ring-white/10 transition-all duration-500 ease-out group-focus-visible:ring-2 group-focus-visible:ring-stone-400 dark:group-focus-visible:ring-white/40">
        {/* Image with parallax */}
        <div className="absolute inset-0 z-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]">
          <Viewer3D fallbackMediaUrl={project.fallbackMediaUrl} compact />
        </div>

        {/* Soft tint on hover */}
        <div className="absolute inset-0 z-[1] bg-stone-900/0 group-hover:bg-stone-900/15 transition-colors duration-500 pointer-events-none" />

        {/* Bottom gradient — gentler than before so the image breathes */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 z-[1] bg-gradient-to-t from-black/45 via-black/15 to-transparent pointer-events-none" />

        {/* Inner hairline frame (drafting border) */}
        <div className="absolute inset-2 sm:inset-3 z-[1] border border-white/10 pointer-events-none" />

        {/* Number watermark — large and ghosted, top-right */}
        {indexStr && (
          <span className="absolute top-2 right-3 sm:top-3 sm:right-4 z-[2] font-serif tabular text-3xl sm:text-4xl text-white/35 leading-none select-none">
            {indexStr}
          </span>
        )}

        {/* View indicator on hover (desktop) */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:flex items-center gap-2 text-white/95 text-[10px] font-medium uppercase tracking-[0.25em]">
          <span aria-hidden className="block w-5 h-px bg-white/70" />
          <span>View</span>
        </div>
      </div>

      {/* Title row below the card */}
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-3xl lg:text-4xl text-stone-900 dark:text-white tracking-[-0.01em] leading-[1.05]">
          {project.title}
        </h2>
        <span
          aria-hidden
          className="hidden sm:inline-block flex-shrink-0 w-6 h-px bg-stone-400 dark:bg-stone-600 translate-y-[-0.4em] group-hover:w-12 group-hover:bg-stone-700 dark:group-hover:bg-white transition-all duration-500"
        />
      </div>
    </Link>
  );
}
