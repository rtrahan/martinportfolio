import Link from 'next/link';
import profileData from '@/data/profile.json';
import type { ProfileData } from '@/components/ProfileHero';
import { AboutPanel } from '@/components/AboutPanel';
import { Viewer3D } from '@/components/Viewer3D';

export default function AboutPage() {
  const profile = profileData as ProfileData;
  const certifications = profile.accolades.find((a) => a.title === 'Certifications');
  const accoladesExcludingCertifications = profile.accolades.filter(
    (a) => a.title !== 'Certifications'
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
      {/* Portrait splat — left of panel, same layout as project viewer */}
      <div className="absolute top-0 left-0 bottom-0 right-0 md:right-[420px] lg:right-[480px] z-0">
        <Viewer3D
          splatUrl={profile.splatUrl ?? undefined}
          fallbackMediaUrl={profile.photo ?? undefined}
          parallax={true}
          baseZoom={-1}
        />
        {/* Radial vignette — clear center, solid edges */}
        <div
          className="absolute inset-0 pointer-events-none dark:opacity-0"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, transparent 50%, rgba(245,245,244,0.4) 65%, rgba(245,245,244,0.8) 80%, #f5f5f4 95%, #f5f5f4 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-100"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, transparent 50%, rgba(28,25,23,0.4) 65%, rgba(28,25,23,0.8) 80%, #1c1917 95%, #1c1917 100%)',
          }}
        />
        {/* Edge fades — all sides */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-stone-100 dark:from-stone-900 via-transparent to-transparent" style={{ backgroundSize: '30% 100%', backgroundPosition: 'left', backgroundRepeat: 'no-repeat' }} />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-stone-100 dark:from-stone-900 via-transparent to-transparent" style={{ backgroundSize: '30% 100%', backgroundPosition: 'right', backgroundRepeat: 'no-repeat' }} />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-stone-100 dark:from-stone-900 via-transparent to-transparent" style={{ backgroundSize: '100% 30%', backgroundPosition: 'top', backgroundRepeat: 'no-repeat' }} />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-stone-100 dark:from-stone-900 via-transparent to-transparent" style={{ backgroundSize: '100% 30%', backgroundPosition: 'bottom', backgroundRepeat: 'no-repeat' }} />
      </div>

      {/* Right blend into panel */}
      <div
        className="absolute inset-0 z-10 pointer-events-none hidden md:block dark:opacity-0"
        style={{
          background: 'linear-gradient(to right, transparent 0%, transparent 40%, rgba(245,245,244,0.5) 50%, #f5f5f4 60%, #f5f5f4 100%)',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 z-10 pointer-events-none hidden md:block opacity-0 dark:opacity-100"
        style={{
          background: 'linear-gradient(to right, transparent 0%, transparent 40%, rgba(28,25,23,0.5) 50%, #1c1917 60%, #1c1917 100%)',
        }}
        aria-hidden
      />

      <header className="absolute top-0 left-0 z-20 p-6 md:p-8 pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto group flex items-center text-sm font-medium tracking-widest uppercase text-stone-600 dark:text-white/60 hover:text-stone-900 dark:hover:text-white transition-colors bg-stone-200/80 dark:bg-stone-950/30 backdrop-blur-sm px-4 py-2 rounded-full border border-stone-300 dark:border-white/5 hover:border-stone-400 dark:hover:border-white/20"
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
        certifications={certifications?.items ?? []}
      />
    </div>
  );
}
