import { getAllProjects } from '@/lib/projects';
import { SplatCard } from '@/components/SplatCard';
import { ProfileHero } from '@/components/ProfileHero';
import profileData from '@/data/profile.json';
import type { ProfileData } from '@/components/ProfileHero';

export default function GalleryPage() {
  const projects = getAllProjects();
  const profile = profileData as ProfileData;

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
      {/* Above the fold: Martin's profile + accolades */}
      <ProfileHero profile={profile} />

      {/* Grid of 3D splat scenes — dreamy portals with space between */}
      <main id="projects" className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 pb-20 sm:pb-24">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 md:gap-16 lg:gap-20">
          {projects.map((project) => (
            <SplatCard key={project.slug} project={project} />
          ))}
        </div>
      </main>

      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-stone-200 dark:border-stone-800 text-center text-stone-600 dark:text-stone-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Martin Braia Rodriguez</p>
      </footer>
    </div>
  );
}
