'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

const MOBILE_BREAKPOINT = 768;
const MOBILE_VIEWER_MIN_HEIGHT = '75vh';
const ZOOM_MAX = 0.12; // scale up to 1.12 as user scrolls

/**
 * On mobile: scrollable page with tall image at top (65vh), sheet content below that scrolls up,
 * and the top image zooms in as the user scrolls.
 * On desktop: renders children unchanged (no scroll container).
 */
export function DetailPageMobileScroll({
  children,
}: {
  children: [React.ReactNode, React.ReactNode]; // [viewer section, panel]
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) setScrollY(scrollRef.current.scrollTop);
  }, []);

  const [viewerSection, panel] = Array.isArray(children) ? children : [children, null];

  // Desktop: pass through (viewer and panel keep their absolute/fixed positioning)
  if (!isMobile) {
    return <>{children}</>;
  }

  // Mobile: scrollable container; viewer zooms as user scrolls
  const scrollRange = typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400;
  const progress = Math.min(scrollY / scrollRange, 1);
  const scale = 1 + progress * ZOOM_MAX;

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-screen overflow-y-auto overscroll-none md:overflow-hidden md:h-auto md:overflow-visible"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Top: viewer area — tall on mobile (65vh) so image has room; zoom on scroll */}
      <div
        className="relative flex-shrink-0 w-full md:contents"
        style={{ minHeight: isMobile ? MOBILE_VIEWER_MIN_HEIGHT : undefined }}
      >
        <div
          className="absolute inset-0 w-full md:relative md:inset-auto md:w-auto"
          style={{
            transform: isMobile ? `scale(${scale})` : undefined,
            transformOrigin: 'center top',
          }}
        >
          {viewerSection}
        </div>
      </div>
      {/* Bottom: sheet content — in flow on mobile, scrolls up when user scrolls */}
      {panel}
    </div>
  );
}
