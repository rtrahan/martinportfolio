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
  bio: string;
  accolades: ProfileAccolade[];
}

export function ProfileHero({ profile }: { profile: ProfileData }) {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16 md:py-20">
      <div className="flex flex-col gap-8 md:gap-10">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-stone-900 dark:text-white tracking-tighter leading-[0.9]">
          {profile.name}
        </h1>
        {profile.tagline ? (
          <p className="text-xl md:text-2xl text-stone-500 dark:text-stone-400 font-serif italic font-light tracking-wide max-w-xl">
            {profile.tagline}
          </p>
        ) : null}
        <nav className="flex flex-wrap items-center gap-8 pt-4">
          <Link
            href="/about"
            className="text-sm font-medium uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
            aria-label="About Martin"
          >
            About Martin
          </Link>
          <a
            href="#projects"
            className="text-sm font-medium uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors inline-flex items-center gap-2"
          >
            View projects
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </nav>
      </div>
    </section>
  );
}
