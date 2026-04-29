import type { Project } from '@/types/project';
import projectsData from '@/data/projects.json';

const projects = projectsData as Project[];

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

/**
 * Find the index of a project by slug. Returns -1 when not found.
 * Indexed against the full ordered list (matches data file order).
 */
export function getProjectIndexBySlug(slug: string): number {
  return projects.findIndex((p) => p.slug === slug);
}

/** Returns the previous and next visual project (skipping projects without media) for nav. */
export function getProjectSiblings(slug: string): {
  prev: Project | null;
  next: Project | null;
  index: number; // 1-based position in the visual sequence (0 if not found)
  total: number;
} {
  const visual = projects.filter((p) => p.fallbackMediaUrl);
  const i = visual.findIndex((p) => p.slug === slug);
  if (i === -1) {
    return { prev: null, next: null, index: 0, total: visual.length };
  }
  return {
    prev: i > 0 ? visual[i - 1] : null,
    next: i < visual.length - 1 ? visual[i + 1] : null,
    index: i + 1,
    total: visual.length,
  };
}
