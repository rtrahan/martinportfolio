'use client';

import { useEffect } from 'react';
import { useProjectDrawer } from '@/context/ProjectContext';

export function ProjectInfo({ description }: { description: string }) {
  const { isOpen, setIsOpen } = useProjectDrawer();

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setIsOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Split description into paragraphs for better typography control
  const paragraphs = description.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <>
      {/* Drawer Overlay (Backdrop) */}
      <div 
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-700 ease-in-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
      />

      {/* Sliding Drawer */}
      <div 
        className={`
          fixed top-0 right-0 z-50 h-full w-full md:w-[550px] 
          bg-[#0c0a09] border-l border-white/5 shadow-2xl
          transform transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Content Container */}
        <div className="h-full flex flex-col p-8 md:p-16 relative overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-8 right-8 p-2 text-stone-500 hover:text-white transition-colors z-10 group"
            aria-label="Close"
          >
            <svg className="w-6 h-6 transform transition-transform duration-500 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-none">
            <div className="mt-8 mb-12">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-stone-600 uppercase block mb-12">
                Project Narrative
              </span>
              
              <div className="space-y-6">
                {paragraphs.map((paragraph, i) => (
                  <p 
                    key={i} 
                    className={`
                      font-serif text-lg md:text-xl leading-[1.8] text-[#a8a29e] font-normal tracking-wide
                      ${i === 0 ? 'first-letter:float-left first-letter:text-5xl first-letter:pr-3 first-letter:font-normal first-letter:text-stone-200 first-letter:leading-[0.8] first-letter:mt-1' : ''}
                    `}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Decorative Divider */}
            <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent mb-10" />
            
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-y-10 gap-x-8">
               <div className="group">
                 <h4 className="text-[9px] font-sans font-bold tracking-[0.25em] text-stone-600 uppercase mb-2 group-hover:text-stone-400 transition-colors">Year</h4>
                 <p className="font-serif text-lg text-stone-300 italic font-normal">2026</p>
               </div>
               <div className="group">
                 <h4 className="text-[9px] font-sans font-bold tracking-[0.25em] text-stone-600 uppercase mb-2 group-hover:text-stone-400 transition-colors">Location</h4>
                 <p className="font-serif text-lg text-stone-300 italic font-normal">Martha's Vineyard</p>
               </div>
               <div className="group">
                 <h4 className="text-[9px] font-sans font-bold tracking-[0.25em] text-stone-600 uppercase mb-2 group-hover:text-stone-400 transition-colors">Typology</h4>
                 <p className="font-serif text-lg text-stone-300 italic font-normal">Residential / Workshop</p>
               </div>
               <div className="group">
                 <h4 className="text-[9px] font-sans font-bold tracking-[0.25em] text-stone-600 uppercase mb-2 group-hover:text-stone-400 transition-colors">Status</h4>
                 <p className="font-serif text-lg text-stone-300 italic font-normal">Completed</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
