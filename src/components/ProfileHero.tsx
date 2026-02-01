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
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-stone-900 dark:text-white tracking-tight leading-tight">
          {profile.name}
        </h1>
        {profile.tagline && (
          <p className="text-base sm:text-lg md:text-xl text-stone-500 dark:text-stone-400 font-mono uppercase tracking-widest">
            {profile.tagline}
          </p>
        )}
        <nav className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 sm:pt-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors py-2 touch-manipulation"
          >
            About
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </nav>
      </div>
    </section>
  );
}
