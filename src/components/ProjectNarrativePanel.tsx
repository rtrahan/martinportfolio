'use client';

/**
 * Project narrative as part of the main view: title at top, then narrative text.
 * Always visible on the right — no drawer, no trigger.
 */
export function ProjectNarrativePanel({
  title,
  location,
  description,
}: {
  title: string;
  location: string;
  description: string;
}) {
  const paragraphs = description.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <aside
      className="fixed top-0 right-0 z-20 h-full w-full md:w-[420px] lg:w-[480px] hidden md:flex flex-col overflow-hidden"
      aria-label="Project narrative"
      style={{
        background: 'linear-gradient(to right, var(--panel-bg) 0%, var(--panel-bg) 35%, color-mix(in srgb, var(--panel-bg) 98%, transparent) 100%)',
      }}
    >
      <div className="flex-1 flex flex-col min-h-0 p-8 md:p-10">
        {/* Title at top */}
        <div className="flex-shrink-0 mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-normal text-stone-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {location ? (
            <p className="font-mono text-xs text-stone-600 dark:text-white/60 mt-2 uppercase tracking-widest">
              {location}
            </p>
          ) : null}
        </div>

        {/* Narrative — scrollable */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-none space-y-8">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="font-serif text-base md:text-lg leading-[1.8] text-stone-600 dark:text-stone-300 font-normal tracking-wide whitespace-pre-line"
            >
              {paragraph}
            </p>
          ))}

          {/* Metadata */}
          <div className="pt-8 border-t border-stone-200 dark:border-white/10">
            <h2 className="text-[10px] font-sans font-medium tracking-[0.2em] text-stone-500 uppercase mb-3">
              Project Details
            </h2>
            <ul className="space-y-2">
              <li className="text-stone-600 dark:text-stone-300 text-sm md:text-base leading-relaxed flex gap-2">
                <span className="text-stone-500 mt-0.5 flex-shrink-0">·</span>
                <span><span className="text-stone-500">Year:</span> 2026</span>
              </li>
              <li className="text-stone-600 dark:text-stone-300 text-sm md:text-base leading-relaxed flex gap-2">
                <span className="text-stone-500 mt-0.5 flex-shrink-0">·</span>
                <span><span className="text-stone-500">Location:</span> {location || '—'}</span>
              </li>
              <li className="text-stone-600 dark:text-stone-300 text-sm md:text-base leading-relaxed flex gap-2">
                <span className="text-stone-500 mt-0.5 flex-shrink-0">·</span>
                <span><span className="text-stone-500">Typology:</span> Residential / Workshop</span>
              </li>
              <li className="text-stone-600 dark:text-stone-300 text-sm md:text-base leading-relaxed flex gap-2">
                <span className="text-stone-500 mt-0.5 flex-shrink-0">·</span>
                <span><span className="text-stone-500">Status:</span> Completed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
