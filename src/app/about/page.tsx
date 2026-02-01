import Link from 'next/link';
import profileData from '@/data/profile.json';
import type { ProfileData } from '@/components/ProfileHero';
import { AboutPanel } from '@/components/AboutPanel';
import { AboutPhoto } from '@/components/AboutPhoto';

export default function AboutPage() {
  const profile = profileData as ProfileData;
  const certifications = profile.accolades.find((a) => a.title === 'Certifications');
  const accoladesExcludingCertifications = profile.accolades.filter(
    (a) => a.title !== 'Certifications'
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
      {/* Photo — left of panel only, same layout as project viewer */}
      <div className="absolute top-0 left-0 bottom-0 right-0 md:right-[420px] lg:right-[480px] z-0">
        <div className="absolute inset-0 bg-stone-200 dark:bg-stone-900">
          <AboutPhoto photoUrl={profile.photo} name={profile.name} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-100/90 dark:from-stone-900/90 via-transparent to-stone-100/40 dark:to-stone-900/40 pointer-events-none" />
      </div>

      <div
        className="absolute inset-0 z-10 pointer-events-none hidden md:block dark:opacity-0"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, transparent 40%, rgba(245,245,244,0.3) 50%, rgba(245,245,244,0.7) 60%, #f5f5f4 70%, #f5f5f4 100%)',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 z-10 pointer-events-none hidden md:block opacity-0 dark:opacity-100"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, transparent 40%, rgba(28,25,23,0.3) 50%, rgba(28,25,23,0.7) 60%, #1c1917 70%, #1c1917 100%)',
        }}
        aria-hidden
      />

      <header className="absolute top-0 left-0 z-20 p-6 md:p-8 pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto group flex items-center text-sm font-medium tracking-widest uppercase text-stone-600 dark:text-white/60 hover:text-stone-900 dark:hover:text-white transition-colors bg-stone-200/80 dark:bg-stone-950/30 backdrop-blur-sm px-4 py-2 rounded-full border border-stone-300 dark:border-white/5 hover:border-white/20"
        >
          <svg
            className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Index
        </Link>
      </header>

      <AboutPanel
        name={profile.name}
        locations={profile.locations}
        bio={profile.bio}
        contact={profile.contact}
        accoladesExcludingCertifications={accoladesExcludingCertifications}
      />

      {/* Certifications strip — bottom, same position as plan cards */}
      <main className="absolute bottom-0 left-0 right-0 md:right-[420px] lg:right-[480px] z-20 p-8 flex flex-col items-center justify-end pointer-events-none pb-4">
        <div className="pointer-events-auto w-full flex flex-col items-center">
          {certifications && certifications.items.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center max-w-3xl">
              <span className="text-[10px] font-sans font-medium tracking-[0.2em] text-stone-500 dark:text-stone-500 uppercase w-full text-center mb-2">
                Certifications
              </span>
              {certifications.items.map((item, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full text-sm font-mono text-stone-600 dark:text-stone-300 bg-stone-200/80 dark:bg-white/5 border border-stone-300 dark:border-white/10"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
