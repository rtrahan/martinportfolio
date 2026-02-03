'use client';

import type { Plan } from '@/types/project';
import { PlanCards } from './PlanCards';

/**
 * Project narrative panel.
 * On mobile, panel sits at bottom 60% so splat is visible at top.
 * On desktop, panel is fixed to the right side.
 */
export function ProjectNarrativePanel({
  title,
  location,
  description,
  plans,
}: {
  title: string;
  location: string;
  description: string;
  plans?: Plan[];
}) {
  const paragraphs = description.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <aside
      className="relative md:fixed md:bottom-0 left-0 right-0 z-20 flex flex-col rounded-t-2xl md:rounded-none bg-stone-100 dark:bg-stone-900 md:bg-transparent md:top-0 md:left-auto md:w-[420px] lg:w-[480px] md:h-full md:overflow-hidden pb-8 md:pb-0"
      aria-label="Project narrative"
    >
      {/* Mobile: sheet drag indicator — sheet scrolls up with page scroll */}
      <div className="md:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
        <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
      </div>
      
      <div 
        className="flex-1 flex flex-col min-h-0 p-6 pt-2 md:p-10 md:pt-10"
        style={{
          background: 'linear-gradient(to right, var(--panel-bg) 0%, var(--panel-bg) 35%, color-mix(in srgb, var(--panel-bg) 98%, transparent) 100%)',
        }}
      >
        {/* Title at top */}
        <div className="flex-shrink-0 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-normal text-stone-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {location ? (
            <p className="font-mono text-xs text-stone-600 dark:text-white/60 mt-2 uppercase tracking-widest">
              {location}
            </p>
          ) : null}
        </div>

        {/* Narrative — on mobile content flows (page scrolls); on desktop scrollable */}
        <div className="flex-1 min-h-0 overflow-visible md:overflow-y-auto pr-2 scrollbar-none space-y-8">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="font-serif text-base md:text-lg leading-[1.8] text-stone-600 dark:text-stone-300 font-normal tracking-wide whitespace-pre-line"
            >
              {paragraph}
            </p>
          ))}

          {/* Plans — in panel on mobile and middle breakpoint (md); at lg+ they move to left column */}
          {plans && plans.length > 0 && (
            <div className="lg:hidden pt-12 pb-4 border-t border-stone-200 dark:border-white/10">
              <h2 className="text-[10px] font-sans font-medium tracking-[0.2em] text-stone-500 uppercase mb-4">
                Plans
              </h2>
              <PlanCards plans={plans} compact />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
