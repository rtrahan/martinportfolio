'use client';

import Link from 'next/link';
import type { Plan, Project } from '@/types/project';
import { PlanCards } from './PlanCards';

/**
 * Project narrative panel.
 * On mobile, panel sits below the splat (sheet style).
 * On desktop, panel is fixed to the right side.
 */
export function ProjectNarrativePanel({
  title,
  location,
  description,
  plans,
  index,
  total,
  prev,
  next,
}: {
  title: string;
  location: string;
  description: string;
  plans?: Plan[];
  /** 1-based project number (e.g. 2) */
  index?: number;
  /** Total number of projects */
  total?: number;
  prev?: Project | null;
  next?: Project | null;
}) {
  const paragraphs = description.split('\n\n').filter((p) => p.trim().length > 0);
  const indexStr = typeof index === 'number' ? String(index).padStart(2, '0') : null;
  const totalStr = typeof total === 'number' ? String(total).padStart(2, '0') : null;

  return (
    <aside
      className="relative md:fixed md:bottom-0 left-0 right-0 z-20 flex flex-col rounded-t-2xl md:rounded-none bg-stone-100 dark:bg-stone-900 md:bg-transparent md:top-0 md:left-auto md:w-[420px] lg:w-[480px] md:h-full md:overflow-hidden pb-8 md:pb-0"
      aria-label="Project narrative"
    >
      {/* Mobile drag indicator */}
      <div className="md:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
        <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
      </div>

      <div
        className="flex-1 flex flex-col min-h-0 p-6 pt-2 md:p-10 md:pt-12 lg:p-12 lg:pt-14"
        style={{
          background:
            'linear-gradient(to right, var(--panel-bg) 0%, var(--panel-bg) 35%, color-mix(in srgb, var(--panel-bg) 98%, transparent) 100%)',
        }}
      >
        {/* Header: index strip + title */}
        <div className="flex-shrink-0 mb-6 md:mb-8">
          <div className="flex items-center justify-between gap-3 mb-3 md:mb-4">
            <span className="font-mono tabular text-[10px] md:text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500">
              {indexStr && totalStr ? `Project ${indexStr} / ${totalStr}` : 'Project'}
            </span>
            {location && (
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500 truncate">
                {location}
              </span>
            )}
          </div>
          <h1 className="font-serif font-normal text-stone-900 dark:text-white tracking-[-0.01em] leading-[1.0] text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <div className="hairline-flat mt-6 md:mt-8" />
        </div>

        {/* Narrative — drop cap on first paragraph */}
        <div className="flex-1 min-h-0 overflow-visible md:overflow-y-auto pr-1 scrollbar-none">
          <div className="has-dropcap space-y-7 md:space-y-8">
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="font-serif text-base md:text-lg leading-[1.75] text-stone-700 dark:text-stone-300 font-normal tracking-wide whitespace-pre-line"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Plans — appears in panel on mobile + md; moves to left on lg+ */}
          {plans && plans.length > 0 && (
            <div className="lg:hidden mt-12 pt-8 border-t border-stone-200 dark:border-white/10">
              <h2 className="text-[10px] font-sans font-medium tracking-[0.25em] text-stone-500 dark:text-stone-400 uppercase mb-4">
                Plans · {String(plans.length).padStart(2, '0')}
              </h2>
              <PlanCards plans={plans} compact />
            </div>
          )}

          {/* Prev / Next */}
          {(prev || next) && (
            <div className="mt-12 md:mt-16 pt-6 border-t border-stone-200 dark:border-white/10 flex items-stretch justify-between gap-4">
              {prev ? (
                <Link
                  href={`/project/${prev.slug}`}
                  className="group flex-1 min-w-0 text-left"
                  aria-label={`Previous project: ${prev.title}`}
                >
                  <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500 mb-1.5">
                    ← Previous
                  </span>
                  <span className="font-serif text-base md:text-lg text-stone-700 dark:text-stone-200 group-hover:text-stone-900 dark:group-hover:text-white transition-colors truncate block">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span className="flex-1" />
              )}
              {next ? (
                <Link
                  href={`/project/${next.slug}`}
                  className="group flex-1 min-w-0 text-right"
                  aria-label={`Next project: ${next.title}`}
                >
                  <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500 mb-1.5">
                    Next →
                  </span>
                  <span className="font-serif text-base md:text-lg text-stone-700 dark:text-stone-200 group-hover:text-stone-900 dark:group-hover:text-white transition-colors truncate block">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <span className="flex-1" />
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
