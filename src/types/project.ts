export type PlanType = 'pdf' | 'svg';

export interface Plan {
  type: PlanType;
  src: string;
  label?: string;
  /** For PDFs: 1-based page number (used when src is multi-page PDF) */
  page?: number;
}

export interface Project {
  slug: string;
  title: string;
  location: string;
  description: string;
  /** Path for SHARP input (building photo); optional until provided */
  buildingPhotoPath?: string;
  /** URL to .splat file for 3D viewer (e.g. /splat/monitor-barn.splat) */
  splatUrl?: string | null;
  /** Poster image or video URL when WebGL unavailable */
  fallbackMediaUrl?: string | null;
  plans: Plan[];
}
