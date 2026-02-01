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
  const visualProjects = projects.filter(p => p.fallbackMediaUrl);

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
      {/* Above the fold: Martin's profile */}
      <ProfileHero profile={profile} />

      {/* Project grid — 2 columns on desktop, 1 on mobile */}
      <main id="projects" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {visualProjects.map((project) => (
            <SplatCard key={project.slug} project={project} />
          ))}
        </div>
      </main>

      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-stone-200 dark:border-stone-800 text-center text-stone-600 dark:text-stone-500 text-sm flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        <p>&copy; {new Date().getFullYear()} Martin Braia Rodriguez</p>
        <span className="hidden sm:inline" aria-hidden="true">·</span>
        <ThemeToggle />
      </footer>
    </div>
  );
}
