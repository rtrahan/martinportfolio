'use client';

import { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Plan } from '@/types/project';
import { PdfPlanView } from './PdfPlanView';
import { SvgPlanView } from './SvgPlanView';

export function PlanModal({
  plan,
  onClose,
  initialRect,
  thumbnailUrl,
  sheetNumber,
  indexStr,
  totalStr,
}: {
  plan: Plan;
  onClose: () => void;
  initialRect: DOMRect | null;
  thumbnailUrl?: string | null;
  sheetNumber?: string;
  indexStr?: string | null;
  totalStr?: string | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsOpen(true));
    });
    return () => setMounted(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(onClose, 500);
  }, [onClose]);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    },
    [handleClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [handleEscape]);

  if (!mounted) return null;

  const style: React.CSSProperties = isOpen
    ? {
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        borderRadius: 0,
        transform: 'perspective(1400px) rotateX(0deg)',
      }
    : initialRect
      ? {
          top: initialRect.top,
          left: initialRect.left,
          width: initialRect.width,
          height: initialRect.height,
          borderRadius: '0.25rem',
          transform: 'perspective(1400px) rotateX(18deg)',
          backgroundColor: '#f5f5f0',
        }
      : { top: '50%', left: '50%', width: 0, height: 0, opacity: 0 };

  return createPortal(
    <div
      className="fixed z-[100] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) overflow-hidden shadow-2xl origin-bottom bg-stone-100 dark:bg-stone-950"
      style={style}
      role="dialog"
      aria-modal="true"
      aria-label={plan.label ?? 'Plan viewer'}
    >
      {/* Subtle drafting paper grid behind the plan */}
      <div className="absolute inset-0 drafting-grid opacity-60 dark:opacity-40 pointer-events-none" />

      {/* Thumbnail for smooth transition */}
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isOpen ? 'opacity-0 delay-200' : 'opacity-100'
          }`}
          alt=""
        />
      )}

      <div
        className={`relative w-full h-full transition-opacity duration-300 delay-200 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top header strip — sheet info */}
        <div className="absolute top-0 inset-x-0 z-40 px-5 md:px-8 py-4 md:py-5 flex items-center justify-between gap-4 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 rounded-full bg-stone-100/80 dark:bg-stone-950/60 backdrop-blur-md border border-stone-300/70 dark:border-white/10">
            {sheetNumber && (
              <span className="font-mono tabular text-[10px] uppercase tracking-[0.25em] text-stone-700 dark:text-stone-200">
                {sheetNumber}
              </span>
            )}
            {plan.label && (
              <>
                <span aria-hidden className="block w-px h-3 bg-stone-400/50 dark:bg-white/20" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 truncate max-w-[40vw] sm:max-w-none">
                  {plan.label}
                </span>
              </>
            )}
            {indexStr && totalStr && (
              <>
                <span aria-hidden className="hidden sm:block w-px h-3 bg-stone-400/50 dark:bg-white/20" />
                <span className="hidden sm:inline font-mono tabular text-[10px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
                  {indexStr} / {totalStr}
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="pointer-events-auto w-11 h-11 rounded-full bg-stone-100/80 dark:bg-stone-950/60 hover:bg-stone-200 dark:hover:bg-stone-900/80 backdrop-blur-md text-stone-700 dark:text-white flex items-center justify-center transition-all duration-200 hover:rotate-90 group border border-stone-300/70 dark:border-white/10"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="w-full h-full flex items-center justify-center">
          {plan.type === 'pdf' ? (
            <PdfPlanView src={plan.src} page={plan.page} onClose={handleClose} />
          ) : (
            <SvgPlanView src={plan.src} onClose={handleClose} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
