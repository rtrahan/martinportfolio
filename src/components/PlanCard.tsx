'use client';

import { useState, useRef, useEffect } from 'react';
import type { Plan } from '@/types/project';
import { PlanModal } from './PlanModal';

export function PlanCard({ plan }: { plan: Plan }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [initialRect, setInitialRect] = useState<DOMRect | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const handleOpen = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setInitialRect(rect);
      setModalOpen(true);
    }
  };

  useEffect(() => {
    if (plan.type !== 'pdf') return;
    let cancelled = false;

    const renderThumb = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        
        const fullUrl = plan.src.startsWith('/') ? `${window.location.origin}${plan.src}` : plan.src;
        const loadingTask = pdfjsLib.getDocument(fullUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(plan.page || 1);
        
        if (cancelled) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Scale to reasonable thumbnail size
        const viewportRaw = page.getViewport({ scale: 1 });
        const scale = 400 / viewportRaw.width;
        const viewport = page.getViewport({ scale });

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context, viewport }).promise;
        
        if (!cancelled) {
          setThumbnailUrl(canvas.toDataURL());
        }
      } catch (e) {
        console.error('Thumbnail error', e);
      }
    };
    
    renderThumb();
    return () => { cancelled = true; };
  }, [plan.src, plan.page]);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
        aria-label={plan.label ? `View ${plan.label}` : 'View plan'}
      >
        <div
          ref={cardRef}
          className="w-64 h-48 bg-[#f5f5f0] shadow-2xl transition-all duration-500 ease-out origin-center overflow-hidden relative"
          style={{
            transform: isHovered 
              ? 'perspective(1200px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.1) translateY(-30px)'
              : 'perspective(1200px) rotateX(60deg) rotateY(0deg) rotateZ(0deg)',
            transformStyle: 'preserve-3d',
            boxShadow: isHovered
              ? '0 20px 40px rgba(0,0,0,0.3)'
              : '0 40px 80px -20px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.05)'
          }}
        >
          {/* PDF Thumbnail Canvas */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply" 
          />

          {/* Card Content - Blueprint Style Overlay */}
          <div className="absolute inset-2 border-2 border-stone-900/10 flex flex-col justify-between p-4 z-10">
            <div className="flex justify-between items-start opacity-60">
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-stone-900 bg-white/50 px-1">
                PROJ-2026
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-stone-900 bg-white/50 px-1">
                SH-01
              </span>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <span className="font-serif text-lg text-stone-900 italic bg-white/80 px-2 py-1 backdrop-blur-sm rounded">
                {plan.label ?? 'View Plan'}
              </span>
            </div>

            <div className="border-t border-stone-900/20 pt-2 flex justify-between items-end opacity-80">
               <span className="font-mono text-[0.5rem] uppercase text-stone-600 bg-white/50 px-1">
                Scale: N.T.S.
              </span>
               <span className="font-mono text-[0.5rem] uppercase text-stone-600 bg-white/50 px-1">
                MBR Design
              </span>
            </div>
          </div>
          
          {/* Paper sheen/gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none z-20" />
        </div>
      </button>

      {modalOpen && (
        <PlanModal
          plan={plan}
          initialRect={initialRect}
          thumbnailUrl={thumbnailUrl}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
