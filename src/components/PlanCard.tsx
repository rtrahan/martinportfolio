'use client';

import { useState, useRef, useEffect } from 'react';
import type { Plan } from '@/types/project';
import { PlanModal } from './PlanModal';

export function PlanCard({
  plan,
  compact = false,
  index,
  total,
}: {
  plan: Plan;
  compact?: boolean;
  index?: number;
  total?: number;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [initialRect, setInitialRect] = useState<DOMRect | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const sheetNumber = typeof index === 'number' ? `PL-${String(index).padStart(2, '0')}` : 'PL-01';
  const indexStr = typeof index === 'number' ? String(index).padStart(2, '0') : null;
  const totalStr = typeof total === 'number' ? String(total).padStart(2, '0') : null;

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

        const viewportRaw = page.getViewport({ scale: 1 });
        const scale = 500 / viewportRaw.width;
        const viewport = page.getViewport({ scale });

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport, canvas }).promise;

        if (!cancelled) {
          setThumbnailUrl(canvas.toDataURL());
        }
      } catch (e) {
        console.error('Thumbnail error', e);
      }
    };

    renderThumb();
    return () => {
      cancelled = true;
    };
  }, [plan.src, plan.page]);

  // Compact mode: simple flat card for mobile panels
  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={handleOpen}
          className="group relative block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-md overflow-hidden"
          aria-label={plan.label ? `View ${plan.label}` : 'View plan'}
        >
          <div
            ref={cardRef}
            className="aspect-[4/3] bg-[#f5f5f0] dark:bg-stone-800 shadow-sm group-hover:shadow-lg ring-1 ring-stone-300/50 dark:ring-white/10 rounded-md overflow-hidden relative transition-shadow duration-300"
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-1.5 border border-stone-900/10 dark:border-white/5 pointer-events-none" />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent p-3 pt-10">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-white uppercase tracking-[0.2em] truncate">
                  {plan.label ?? 'View plan'}
                </span>
                <span className="font-mono tabular text-[10px] text-white/70 flex-shrink-0">
                  {sheetNumber}
                </span>
              </div>
            </div>
          </div>
        </button>

        {modalOpen && (
          <PlanModal
            plan={plan}
            initialRect={initialRect}
            thumbnailUrl={thumbnailUrl}
            sheetNumber={sheetNumber}
            indexStr={indexStr}
            totalStr={totalStr}
            onClose={() => setModalOpen(false)}
          />
        )}
      </>
    );
  }

  // Desktop mode: gently tilted cards that lift on hover
  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className="group relative block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 dark:focus-visible:ring-white/40 rounded-sm"
        aria-label={plan.label ? `View ${plan.label}` : 'View plan'}
      >
        {/* Sheet label above card */}
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <span className="font-mono tabular text-[10px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
            {sheetNumber}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 truncate max-w-[140px]">
            {plan.label ?? 'Plan'}
          </span>
        </div>

        <div
          ref={cardRef}
          className="w-56 h-44 lg:w-64 lg:h-48 bg-[#f5f5f0] dark:bg-stone-800 transition-all duration-500 ease-out origin-bottom overflow-hidden relative ring-1 ring-stone-900/10 dark:ring-white/10 rounded-sm"
          style={{
            transform: isHovered
              ? 'perspective(1400px) rotateX(0deg) translateY(-12px) scale(1.04)'
              : 'perspective(1400px) rotateX(18deg) translateY(0px) scale(1)',
            transformStyle: 'preserve-3d',
            boxShadow: isHovered
              ? '0 30px 50px -20px rgba(0,0,0,0.45)'
              : '0 18px 30px -12px rgba(0,0,0,0.35)',
          }}
        >
          {/* PDF thumbnail */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Drafting border */}
          <div className="absolute inset-1.5 border border-stone-900/15 pointer-events-none" />

          {/* Top-right tab number */}
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-white/80 dark:bg-stone-900/70 backdrop-blur-sm">
            <span className="font-mono tabular text-[9px] uppercase tracking-[0.2em] text-stone-700 dark:text-stone-200">
              {indexStr}/{totalStr}
            </span>
          </div>

          {/* Hover label overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-between gap-2">
              <span className="font-serif text-base text-white italic truncate">
                {plan.label ?? 'View plan'}
              </span>
              <span aria-hidden className="block w-5 h-px bg-white/70 flex-shrink-0" />
            </div>
          </div>

          {/* Paper sheen */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none"
            style={{ mixBlendMode: 'overlay' }}
          />
        </div>
      </button>

      {modalOpen && (
        <PlanModal
          plan={plan}
          initialRect={initialRect}
          thumbnailUrl={thumbnailUrl}
          sheetNumber={sheetNumber}
          indexStr={indexStr}
          totalStr={totalStr}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
