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
  thumbnailUrl
}: { 
  plan: Plan; 
  onClose: () => void;
  initialRect: DOMRect | null;
  thumbnailUrl?: string | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Start animation in next frame to ensure initial style renders first
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
        transform: 'perspective(1200px) rotateX(0deg)'
      }
    : initialRect
      ? {
          top: initialRect.top,
          left: initialRect.left,
          width: initialRect.width,
          height: initialRect.height,
          borderRadius: '0.125rem',
          transform: 'perspective(1200px) rotateX(60deg)',
          backgroundColor: '#f5f5f0'
        }
      : { top: '50%', left: '50%', width: 0, height: 0, opacity: 0 };

  return createPortal(
    <div
      className="fixed z-[100] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) overflow-hidden shadow-2xl origin-bottom bg-stone-100 dark:bg-black"
      style={style}
      role="dialog"
      aria-modal="true"
      aria-label={plan.label ?? 'Plan viewer'}
    >
      {/* Thumbnail for smooth transition */}
      {thumbnailUrl && (
        <img 
          src={thumbnailUrl} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isOpen ? 'opacity-0 delay-200' : 'opacity-100'}`}
          alt=""
        />
      )}

      <div className={`w-full h-full transition-opacity duration-300 delay-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-stone-800/60 dark:bg-black/50 hover:bg-stone-700/80 dark:hover:bg-black/70 backdrop-blur-md text-stone-100 dark:text-white flex items-center justify-center transition-all duration-200 hover:rotate-90 group border border-stone-600/50 dark:border-white/10"
          aria-label="Close"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

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
