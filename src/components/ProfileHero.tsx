'use client';

import Link from 'next/link';

export interface ProfileAccolade {
  title: string;
  items: string[];
}

export interface ProfileData {
  name: string;
  tagline: string;
  contact: { email: string; phone?: string };
  locations: string[];
  photo?: string | null;
  splatUrl?: string | null;
  bio: string;
  accolades: ProfileAccolade[];
}

export function ProfileHero({ profile }: { profile: ProfileData }) {
  const currentYear = new Date().getFullYear();
  const [first, ...rest] = profile.name.split(' ');
  const surname = rest.join(' ');

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 md:pt-24 lg:pt-28 pb-12 sm:pb-16 md:pb-20">
      {/* Top eyebrow row: practice mark · year span */}
      <div className="rise flex items-baseline justify-between gap-4 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 sm:gap-4">
          <span aria-hidden className="block w-6 sm:w-8 h-px bg-stone-400 dark:bg-stone-600" />
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
            Moment Drafting & Design
          </span>
        </div>
        <span className="font-mono tabular text-[10px] sm:text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500">
          Est. 2019 — {currentYear}
        </span>
      </div>

      {/* Display name */}
      <h1 className="rise rise-delay-1 font-serif font-normal text-stone-900 dark:text-white tracking-[-0.02em] leading-[0.95] text-[clamp(2.75rem,9vw,7.5rem)]">
        <span className="block">{first}</span>
        {surname && (
          <span className="block italic text-stone-700 dark:text-stone-300">
            {surname}
          </span>
        )}
      </h1>

      {/* Sub-block: tagline · locations */}
      <div className="rise rise-delay-2 mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-12 gap-y-6 gap-x-8 items-end">
        <div className="sm:col-span-7 lg:col-span-6 max-w-2xl">
          <p className="font-serif text-lg sm:text-xl md:text-2xl leading-snug text-stone-700 dark:text-stone-200">
            Field-tested drafting and design for residential construction —
            grounded in <span className="italic">eighteen years</span> on the
            tools.
          </p>
        </div>
        <div className="sm:col-span-5 lg:col-span-6 sm:text-right">
          {profile.locations.length > 0 && (
            <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
              Practicing from
              <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0 text-stone-700 dark:text-stone-200">
                {profile.locations.join(' · ')}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Hairline divider */}
      <div className="rise rise-delay-3 mt-12 sm:mt-16 md:mt-20 hairline-flat" />

      {/* Bottom row: Index label, About link */}
      <div className="rise rise-delay-4 mt-6 flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500">
          Selected Works
        </span>
        <nav className="flex items-center">
          <Link
            href="/about"
            className="group inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors py-2 touch-manipulation"
          >
            About the practice
            <span aria-hidden className="block w-6 h-px bg-stone-400 dark:bg-stone-600 group-hover:w-10 group-hover:bg-stone-700 dark:group-hover:bg-white transition-all duration-300" />
          </Link>
        </nav>
      </div>
    </section>
  );
}
