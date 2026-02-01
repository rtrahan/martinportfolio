'use client';

export interface ProfileAccolade {
  title: string;
  items: string[];
}

/**
 * About page right panel: name, locations, bio, then Experience and Skills (no Certifications — those go at bottom).
 */
export function AboutPanel({
  name,
  locations,
  bio,
  contact,
  accoladesExcludingCertifications,
}: {
  name: string;
  locations: string[];
  bio: string;
  contact: { email: string; phone?: string };
  accoladesExcludingCertifications: ProfileAccolade[];
}) {
  return (
    <aside
      className="fixed top-0 right-0 z-20 h-full w-full md:w-[420px] lg:w-[480px] flex flex-col overflow-hidden"
      aria-label="About Martin"
      style={{
        background: 'linear-gradient(to right, var(--panel-bg) 0%, var(--panel-bg) 35%, color-mix(in srgb, var(--panel-bg) 98%, transparent) 100%)',
      }}
    >
      <div className="flex-1 flex flex-col min-h-0 p-8 md:p-10">
        <div className="flex-shrink-0 mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-normal text-stone-900 dark:text-white tracking-tight">
            {name}
          </h1>
          {locations.length > 0 ? (
            <p className="font-mono text-xs text-stone-600 dark:text-white/60 mt-2 uppercase tracking-widest">
              {locations.join(' & ')}
            </p>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 scrollbar-none space-y-8">
          <p className="font-serif text-base md:text-lg leading-[1.8] text-stone-600 dark:text-stone-300 font-normal tracking-wide">
            {bio}
          </p>

          {accoladesExcludingCertifications.map((block) => (
            <div key={block.title}>
              <h2 className="text-[10px] font-sans font-medium tracking-[0.2em] text-stone-500 uppercase mb-3">
                {block.title}
              </h2>
              <ul className="space-y-2">
                {block.items.map((item, i) => (
                  <li key={i} className="text-stone-600 dark:text-stone-300 text-sm md:text-base leading-relaxed flex gap-2">
                    <span className="text-stone-500 mt-1.5 flex-shrink-0">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="pt-8 border-t border-stone-200 dark:border-white/10">
            <h2 className="text-[10px] font-sans font-medium tracking-[0.2em] text-stone-500 uppercase mb-3">
              Contact
            </h2>
            <a
              href={`mailto:${contact.email}`}
              className="font-mono text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors block"
            >
              {contact.email}
            </a>
            {contact.phone && (
              <p className="font-mono text-sm text-stone-600 dark:text-stone-400 mt-1">{contact.phone}</p>
            )}
            {locations.length > 0 && (
              <p className="font-mono text-xs text-stone-500 dark:text-stone-500 uppercase tracking-widest mt-2">
                {locations.join(' · ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
