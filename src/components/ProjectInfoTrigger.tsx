'use client';

import { useProjectDrawer } from '@/context/ProjectContext';

export function ProjectInfoTrigger() {
  const { setIsOpen } = useProjectDrawer();

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="group relative flex items-center gap-3 px-6 py-2.5 overflow-hidden rounded-full bg-stone-900/40 border border-white/10 hover:border-white/30 transition-all duration-500 backdrop-blur-md hover:bg-stone-900/60"
    >
      <span className="relative text-xs font-sans font-bold tracking-[0.2em] text-stone-300 group-hover:text-white uppercase transition-colors">
        About Project
      </span>
      <div className="w-px h-3 bg-white/20 group-hover:bg-white/40 transition-colors" />
      <svg 
        className="relative w-3 h-3 text-stone-400 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-0.5" 
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}
