import Link from 'next/link';
import { getAllProjects } from '@/lib/projects';
import { SplatCard } from '@/components/SplatCard';
import { ProfileHero } from '@/components/ProfileHero';
import { ThemeToggle } from '@/components/ThemeProvider';
import profileData from '@/data/profile.json';
import type { ProfileData } from '@/components/ProfileHero';

export default function GalleryPage() {
  const projects = getAllProjects();
  const profile = profileData as ProfileData;

  // Only show projects that have fallback images (exclude "Details" which has no visual)
  const visualProjects = projects.filter((p) => p.fallbackMediaUrl);
  const detailsProject = projects.find((p) => p.slug === 'details');

  return (
    <div className="relative min-h-screen flex flex-col bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
      <ProfileHero profile={profile} />

      {/* Project index */}
      <main
        id="projects"
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-14 md:gap-y-16 lg:gap-y-20">
          {visualProjects.map((project, i) => (
            <SplatCard
              key={project.slug}
              project={project}
              index={i + 1}
              total={visualProjects.length}
            />
          ))}
        </div>

        {/* Details — typographic feature instead of a card */}
        {detailsProject && (
          <section className="mt-24 sm:mt-32 md:mt-40 pt-12 sm:pt-16 border-t border-stone-200 dark:border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12">
              <div className="md:col-span-3">
                <span className="font-mono tabular text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500">
                  {String(visualProjects.length + 1).padStart(2, '0')} / Addendum
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 dark:text-white tracking-tight leading-[0.95]">
                  Details
                </h2>
              </div>
              <div className="md:col-span-9 max-w-2xl">
                <p className="font-serif text-lg sm:text-xl leading-[1.75] text-stone-600 dark:text-stone-300 tracking-wide">
                  {detailsProject.description}
                </p>
                <Link
                  href={`/project/${detailsProject.slug}`}
                  className="group mt-6 inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  View details
                  <span
                    aria-hidden
                    className="block w-6 h-px bg-stone-400 dark:bg-stone-600 group-hover:w-10 group-hover:bg-stone-700 dark:group-hover:bg-white transition-all duration-300"
                  />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-white/10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-8 gap-x-6 items-start">
            {/* Wordmark */}
            <div className="sm:col-span-4">
              <p className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-white">
                {profile.name}
              </p>
              <p className="mt-1 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500">
                Drafting & Design — Est. 2019
              </p>
            </div>
            {/* Contact */}
            <div className="sm:col-span-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500 mb-3">
                Contact
              </h3>
              <a
                href={`mailto:${profile.contact.email}`}
                className="font-mono text-sm text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white transition-colors block"
              >
                {profile.contact.email}
              </a>
              {profile.contact.phone && (
                <p className="font-mono text-sm text-stone-500 dark:text-stone-500 mt-1 tabular">
                  {profile.contact.phone}
                </p>
              )}
            </div>
            {/* Locations + colophon */}
            <div className="sm:col-span-4 sm:text-right">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500 mb-3">
                Studios
              </h3>
              <p className="font-mono text-sm text-stone-700 dark:text-stone-200">
                {profile.locations.join(' · ')}
              </p>
            </div>
          </div>

          <div className="mt-10 sm:mt-14 pt-6 border-t border-stone-200 dark:border-white/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-500 tabular">
              © {new Date().getFullYear()} {profile.name} — All rights reserved
            </p>
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  );
}
