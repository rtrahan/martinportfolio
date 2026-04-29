'use client';

export interface ProfileAccolade {
  title: string;
  items: string[];
}

/**
 * About page right panel: name, locations, bio, Experience, Skills, Contact, then Certifications at bottom.
 */
export function AboutPanel({
  name,
  locations,
  bio,
  contact,
  accoladesExcludingCertifications,
  certifications,
}: {
  name: string;
  locations: string[];
  bio: string;
  contact: { email: string; phone?: string };
  accoladesExcludingCertifications: ProfileAccolade[];
  certifications: string[];
}) {
  const [first, ...rest] = name.split(' ');
  const surname = rest.join(' ');

  return (
    <aside
      className="relative md:fixed md:bottom-0 left-0 right-0 z-20 flex flex-col rounded-t-2xl md:rounded-none bg-stone-100 dark:bg-stone-900 md:bg-transparent md:top-0 md:left-auto md:w-[420px] lg:w-[480px] md:h-full md:overflow-hidden pb-8 md:pb-0"
      aria-label="About Martin"
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
        {/* Header */}
        <div className="flex-shrink-0 mb-6 md:mb-8">
          <span className="block font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500 mb-3">
            About
          </span>
          <h1 className="font-serif font-normal text-stone-900 dark:text-white tracking-[-0.01em] leading-[1.0] text-3xl md:text-4xl lg:text-5xl">
            <span className="block">{first}</span>
            {surname && (
              <span className="block italic text-stone-700 dark:text-stone-300">
                {surname}
              </span>
            )}
          </h1>
          {locations.length > 0 && (
            <p className="font-mono text-[10px] md:text-xs text-stone-500 dark:text-white/55 mt-4 uppercase tracking-[0.25em]">
              {locations.join(' · ')}
            </p>
          )}
          <div className="hairline-flat mt-6 md:mt-8" />
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-visible md:overflow-y-auto pr-1 scrollbar-none space-y-10 md:space-y-12">
          {/* Bio with drop cap */}
          <div className="has-dropcap">
            <p className="font-serif text-base md:text-lg leading-[1.75] text-stone-700 dark:text-stone-300 font-normal tracking-wide">
              {bio}
            </p>
          </div>

          {accoladesExcludingCertifications.map((block) => (
            <section key={block.title}>
              <div className="flex items-baseline justify-between gap-3 mb-4">
                <h2 className="text-[10px] font-sans font-medium tracking-[0.25em] text-stone-500 dark:text-stone-400 uppercase">
                  {block.title}
                </h2>
                <span className="font-mono tabular text-[10px] text-stone-500 dark:text-stone-500">
                  {String(block.items.length).padStart(2, '0')}
                </span>
              </div>
              <ul className="border-t border-stone-200 dark:border-white/10 divide-y divide-stone-200 dark:divide-white/10">
                {block.items.map((item, i) => (
                  <li
                    key={i}
                    className="py-3 flex gap-4 text-stone-700 dark:text-stone-300 text-sm md:text-[0.95rem] leading-relaxed"
                  >
                    <span className="font-mono tabular text-[10px] uppercase tracking-[0.25em] text-stone-400 dark:text-stone-500 mt-[3px] flex-shrink-0 w-6">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* Contact */}
          <section>
            <h2 className="text-[10px] font-sans font-medium tracking-[0.25em] text-stone-500 dark:text-stone-400 uppercase mb-4">
              Contact
            </h2>
            <div className="border-t border-stone-200 dark:border-white/10 pt-4 space-y-2">
              <a
                href={`mailto:${contact.email}`}
                className="font-mono text-sm text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white transition-colors block"
              >
                {contact.email}
              </a>
              {contact.phone && (
                <p className="font-mono text-sm tabular text-stone-500 dark:text-stone-400">
                  {contact.phone}
                </p>
              )}
              {locations.length > 0 && (
                <p className="font-mono text-[10px] text-stone-500 dark:text-stone-500 uppercase tracking-[0.25em] pt-1">
                  {locations.join(' · ')}
                </p>
              )}
            </div>
          </section>

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="pb-2">
              <div className="flex items-baseline justify-between gap-3 mb-4">
                <h2 className="text-[10px] font-sans font-medium tracking-[0.25em] text-stone-500 dark:text-stone-400 uppercase">
                  Certifications
                </h2>
                <span className="font-mono tabular text-[10px] text-stone-500 dark:text-stone-500">
                  {String(certifications.length).padStart(2, '0')}
                </span>
              </div>
              <ul className="border-t border-stone-200 dark:border-white/10 divide-y divide-stone-200 dark:divide-white/10">
                {certifications.map((item, i) => (
                  <li
                    key={i}
                    className="py-3 flex gap-4 text-stone-700 dark:text-stone-300 text-sm md:text-[0.95rem] leading-relaxed"
                  >
                    <span className="font-mono tabular text-[10px] uppercase tracking-[0.25em] text-stone-400 dark:text-stone-500 mt-[3px] flex-shrink-0 w-6">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </aside>
  );
}
