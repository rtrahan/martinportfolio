'use client';

import Link from 'next/link';
import type { Project } from '@/types/project';
import { Viewer3D } from '@/components/Viewer3D';

/**
 * A project card for the home grid: clean image with parallax effect,
 * title overlay on hover/always on mobile. Splats only load on project detail pages.
 */
export function SplatCard({ project }: { project: Project }) {
  const href = `/project/${project.slug}`;

  return (
    <Link
      href={href}
      className="group relative block w-full aspect-[4/3] overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800 shadow-sm hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-stone-100 dark:focus:ring-offset-stone-900"
      aria-label={`View project: ${project.title}`}
    >
      {/* Image with parallax */}
      <div className="absolute inset-0 z-0">
        <Viewer3D
          fallbackMediaUrl={project.fallbackMediaUrl}
          compact
        />
      </div>

      {/* Hover overlay — subtle darkening */}
      <div className="absolute inset-0 z-[1] bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />

      {/* Bottom gradient for text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 z-[1] bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none" />

      {/* Title + location — always visible */}
      <div className="absolute inset-x-0 bottom-0 z-[2] p-4 sm:p-5 md:p-6 pointer-events-none">
        <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-serif font-normal text-white tracking-tight leading-tight">
          {project.title}
        </h2>
        {project.location && (
          <p className="font-mono text-[10px] sm:text-xs text-white/70 mt-1.5 uppercase tracking-widest">
            {project.location}
          </p>
        )}
      </div>

      {/* View indicator on hover (desktop) */}
      <div className="absolute top-4 right-4 z-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:flex items-center gap-1.5 text-white/90 text-xs font-medium uppercase tracking-widest">
        <span>View</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </Link>
  );
}
