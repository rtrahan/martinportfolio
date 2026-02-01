'use client';

import { useState } from 'react';
import type { Plan } from '@/types/project';
import { PlanCards } from './PlanCards';

/**
 * On mobile only: floating "Info" button that opens a sheet with project narrative + plans.
 * Narrative panel and plan cards are hidden on mobile so the building is full-screen; this gives access to the info.
 */
export function MobileProjectInfo({
  title,
  location,
  description,
  plans,
}: {
  title: string;
  location: string;
  description: string;
  plans: Plan[];
}) {
  const [open, setOpen] = useState(false);
  const paragraphs = description.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <>
      {/* Floating Info button — mobile only */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-full text-sm font-medium uppercase tracking-widest text-stone-800 dark:text-white/90 bg-stone-100/95 dark:bg-stone-900/90 backdrop-blur-md border border-stone-300 dark:border-white/10 hover:bg-stone-200 dark:hover:bg-stone-800/90 hover:text-stone-900 dark:hover:text-white transition-colors shadow-lg"
        aria-label="Open project info"
      >
        Project info
      </button>

      {/* Full-screen sheet — mobile only */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 flex flex-col bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100"
          aria-modal
          aria-label="Project info"
        >
          <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-stone-200 dark:border-white/10">
            <div>
              <h1 className="text-xl font-serif font-normal text-stone-900 dark:text-white">{title}</h1>
              {location ? (
                <p className="font-mono text-xs text-stone-600 dark:text-white/60 mt-1 uppercase tracking-widest">
                  {location}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>
          <div className="flex-1 overflow-y-auto p-6 pb-24">
            <div className="space-y-6">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={`
                    font-serif text-base leading-[1.75] text-stone-600 dark:text-stone-300 font-normal tracking-wide whitespace-pre-line
                    ${i === 0 ? 'first-letter:float-left first-letter:text-4xl first-letter:pr-2 first-letter:font-normal first-letter:text-stone-700 dark:first-letter:text-stone-200 first-letter:leading-[0.85] first-letter:mt-0.5' : ''}
                  `}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            {plans.length > 0 && (
              <div className="mt-10 pt-8 border-t border-white/10">
                <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 dark:text-stone-500 mb-4">
                  Plans
                </h2>
                <PlanCards plans={plans} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
