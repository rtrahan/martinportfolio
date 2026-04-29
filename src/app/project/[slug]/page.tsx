import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getProjectBySlug,
  getProjectSlugs,
  getProjectSiblings,
} from '@/lib/projects';
import { Viewer3D } from '@/components/Viewer3D';
import { PlanCards } from '@/components/PlanCards';
import { ProjectNarrativePanel } from '@/components/ProjectNarrativePanel';
import { DetailPageMobileScroll } from '@/components/DetailPageMobileScroll';

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next, index, total } = getProjectSiblings(slug);

  return (
    <div className="relative h-screen w-full overflow-x-hidden overflow-y-hidden bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
      {/* Right blend into panel — extends beyond viewer to panel edge (desktop only) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none hidden md:block dark:opacity-0"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, transparent 40%, rgba(245,245,244,0.5) 50%, #f5f5f4 60%, #f5f5f4 100%)',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 z-10 pointer-events-none hidden md:block opacity-0 dark:opacity-100"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, transparent 40%, rgba(28,25,23,0.5) 50%, #1c1917 60%, #1c1917 100%)',
        }}
        aria-hidden
      />

      {/* Header: Index button (fixed on top) */}
      <header className="absolute top-0 left-0 z-20 p-5 md:p-7 pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto group inline-flex items-center gap-3 text-[10px] sm:text-xs font-medium tracking-[0.25em] uppercase text-stone-700 dark:text-white/70 hover:text-stone-900 dark:hover:text-white transition-colors bg-stone-200/70 dark:bg-stone-950/40 backdrop-blur-md px-4 py-2.5 rounded-full border border-stone-300/80 dark:border-white/10 hover:border-stone-400 dark:hover:border-white/20"
        >
          <svg
            className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform"
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

      {/* Mobile: scrollable page with tall image (65vh) + sheet that scrolls up; desktop: fixed layout */}
      <DetailPageMobileScroll>
        {/* 3D viewer — tall on mobile (65vh), full on desktop */}
        <div className="absolute top-0 left-0 min-h-[65vh] h-full md:min-h-0 md:h-full right-0 md:right-[420px] lg:right-[480px] z-0">
          <Viewer3D
            splatUrl={project.splatUrl}
            fallbackMediaUrl={project.fallbackMediaUrl}
            parallax={true}
            baseZoom={0}
            desktopZoom={-5}
          />
          {/* Radial vignette — clear center, solid edges (desktop only) */}
          <div
            className="absolute inset-0 pointer-events-none hidden md:block dark:opacity-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, transparent 50%, rgba(245,245,244,0.4) 65%, rgba(245,245,244,0.8) 80%, #f5f5f4 95%, #f5f5f4 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none hidden md:block opacity-0 dark:opacity-100"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, transparent 50%, rgba(28,25,23,0.4) 65%, rgba(28,25,23,0.8) 80%, #1c1917 95%, #1c1917 100%)',
            }}
          />
          {/* Edge fades — all sides (desktop only) */}
          <div
            className="absolute inset-0 pointer-events-none hidden md:block bg-gradient-to-r from-stone-100 dark:from-stone-900 via-transparent to-transparent"
            style={{
              backgroundSize: '30% 100%',
              backgroundPosition: 'left',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none hidden md:block bg-gradient-to-l from-stone-100 dark:from-stone-900 via-transparent to-transparent"
            style={{
              backgroundSize: '30% 100%',
              backgroundPosition: 'right',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none hidden md:block bg-gradient-to-b from-stone-100 dark:from-stone-900 via-transparent to-transparent"
            style={{
              backgroundSize: '100% 30%',
              backgroundPosition: 'top',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none hidden md:block bg-gradient-to-t from-stone-100 dark:from-stone-900 via-transparent to-transparent"
            style={{
              backgroundSize: '100% 30%',
              backgroundPosition: 'bottom',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Project number watermark — desktop only, ghosted top-left */}
          {index > 0 && (
            <div
              aria-hidden
              className="hidden md:block absolute top-6 right-6 z-[15] pointer-events-none select-none font-serif tabular text-[6rem] lg:text-[8rem] leading-none text-stone-900/[0.06] dark:text-white/[0.08]"
            >
              {String(index).padStart(2, '0')}
            </div>
          )}
        </div>

        <ProjectNarrativePanel
          title={project.title}
          location={project.location}
          description={project.description}
          plans={project.plans}
          index={index || undefined}
          total={total || undefined}
          prev={prev}
          next={next}
        />
      </DetailPageMobileScroll>

      {/* Plan Cards (Bottom) — left of narrative panel at lg+ only */}
      <main className="absolute bottom-0 left-0 right-0 md:right-[420px] lg:right-[480px] z-20 p-8 hidden lg:flex flex-col items-center justify-end pointer-events-none pb-6">
        <div className="pointer-events-auto w-full flex justify-center perspective-container">
          <PlanCards plans={project.plans} />
        </div>
      </main>
    </div>
  );
}
