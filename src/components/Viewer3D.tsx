'use client';

import { useEffect, useState, useRef } from 'react';

/** Mobile breakpoint */
const MOBILE_BREAKPOINT = 768;
/** Zoom level for mobile view */
const MOBILE_ZOOM = -5;

/** 
 * 3D Gaussian splat viewer with parallax effect.
 * Uses antimatter15/splat iframe viewer for reliability.
 * Shows splat loading progressively - you can watch it build up as data arrives.
 */
export function Viewer3D({
  splatUrl,
  fallbackMediaUrl,
  compact = false,
  parallax = true,
  baseZoom,
}: {
  splatUrl?: string | null;
  fallbackMediaUrl?: string | null;
  /** Lighter vignette for grid cards so the scene stays visible */
  compact?: boolean;
  /** Disable parallax (e.g. on project detail view) */
  parallax?: boolean;
  /** Initial zoom for splat viewer (e.g. -10 for home page); passed as ?zoom= to iframe */
  baseZoom?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const useSplat = splatUrl && splatUrl.length > 0;

  // Only run on client after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    if (useSplat && splatUrl) {
      // Use local viewer with absolute URL to prevent defaulting to HuggingFace
      const fullUrl = splatUrl.startsWith('/') 
        ? `${window.location.origin}${splatUrl}` 
        : splatUrl;
      const search = new URLSearchParams({ url: fullUrl });
      
      // When baseZoom is passed (e.g. project/about), use it for both; otherwise mobile uses MOBILE_ZOOM
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const effectiveZoom = baseZoom !== undefined ? baseZoom : (isMobile ? MOBILE_ZOOM : -5);
      
      search.set('zoom', String(effectiveZoom));
      setIframeUrl(`/splat-viewer.html?${search.toString()}`);
    }
  }, [useSplat, splatUrl, baseZoom]);

  // Pass mouse/touch events to iframe for parallax (desktop and mobile) — only when parallax enabled
  useEffect(() => {
    if (!parallax) return;

    const updatePosition = (clientX: number, clientY: number) => {
      const xNorm = clientX / window.innerWidth;
      const yNorm = clientY / window.innerHeight;
      setMousePos({ x: xNorm, y: yNorm });

      if (iframeRef.current?.contentWindow) {
        const x = xNorm * 2 - 1;
        const y = yNorm * 2 - 1;
        iframeRef.current.contentWindow.postMessage({ type: 'mouse_move', x, y }, '*');
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleIframeMessage = (e: MessageEvent) => {
      if (e.data?.type === 'iframe_mouse_move') {
        setMousePos({ x: e.data.x, y: e.data.y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('message', handleIframeMessage);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('message', handleIframeMessage);
    };
  }, [parallax]);

  // Gradient center: fixed when parallax off, subtle movement when on
  const gradX = parallax ? 50 + (mousePos.x - 0.5) * 5 : 50;
  const gradY = parallax ? 60 + (mousePos.y - 0.5) * 5 : 60;

  // --- No splat, just fallback image ---
  if (!useSplat) {
    if (fallbackMediaUrl) {
      const isVideo = /\.(mp4|webm|mov)$/i.test(fallbackMediaUrl);
      return (
        <div className={`absolute inset-0 overflow-hidden ${compact ? 'bg-transparent' : 'bg-stone-100 dark:bg-stone-900'}`}>
           {parallax ? (
             <ParallaxImage src={fallbackMediaUrl} isVideo={isVideo} />
           ) : (
             isVideo ? (
               <video src={fallbackMediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
             ) : (
               <img src={fallbackMediaUrl} alt="" className="w-full h-full object-cover" />
             )
           )}
           {!compact && <div className="absolute inset-0 bg-stone-900/20" />}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
        </div>
      );
    }
    // Gradient Fallback
    return (
      <div className={`absolute inset-0 ${compact ? 'bg-transparent' : 'bg-stone-200 dark:bg-stone-900'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-stone-300 via-stone-200 to-stone-400 dark:from-stone-800 dark:via-stone-900 dark:to-black opacity-80" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>
    );
  }

  // --- Splat viewer: shows progressive loading as data arrives ---
  return (
    <div className={`absolute inset-0 ${compact ? 'bg-transparent' : 'bg-stone-100 dark:bg-stone-900'}`}>
      {/* Splat iframe — visible immediately, renders progressively as data loads */}
      {mounted && iframeUrl && (
        <iframe
          ref={iframeRef}
          title="3D Gaussian Splat Viewer"
          src={iframeUrl}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; gyroscope"
        />
      )}
      
      {/* Portal Vignette — skip when compact so home grid is just splat */}
      {!compact && (
        <>
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out dark:opacity-0 z-20"
            style={{
              background: `radial-gradient(circle at ${gradX}% ${gradY}%, transparent 78%, rgba(250,250,249,0.4) 92%, #fafaf9 100%)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out opacity-0 dark:opacity-100 z-20"
            style={{
              background: `radial-gradient(circle at ${gradX}% ${gradY}%, transparent 78%, rgba(0,0,0,0.4) 92%, black 100%)`,
            }}
          />
        </>
      )}
      {!compact && (
        <>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_80px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_0_150px_100px_black] z-20" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone-100/50 dark:from-stone-900/80 to-transparent pointer-events-none z-20" />
        </>
      )}
    </div>
  );
}

// Helper for Parallax on the Fallback Image (mouse, touch, and accelerometer)
function ParallaxImage({ src, isVideo }: { src: string; isVideo: boolean }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [permissionGranted, setPermissionGranted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationId: number;

    // Smooth animation loop
    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setOffset({ x: currentX, y: currentY });
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    const updateTarget = (x: number, y: number) => {
      targetX = x * 8;  // Parallax intensity
      targetY = y * 8;
    };

    // Mouse movement
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * -1;
      const y = (e.clientY / window.innerHeight - 0.5) * -1;
      updateTarget(x, y);
    };

    // Touch movement
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const x = (e.touches[0].clientX / window.innerWidth - 0.5) * -1;
        const y = (e.touches[0].clientY / window.innerHeight - 0.5) * -1;
        updateTarget(x, y);
      }
    };

    // Accelerometer / DeviceOrientation
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma: left/right tilt (-90 to 90), beta: front/back tilt (-180 to 180)
        const x = Math.max(-1, Math.min(1, e.gamma / 30));
        const y = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); // 45 is "neutral" holding angle
        updateTarget(-x, -y);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleTouch, { passive: true });

    // Check if DeviceOrientationEvent needs permission (iOS 13+)
    if (typeof DeviceOrientationEvent !== 'undefined') {
      if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
        // iOS 13+ requires permission - we'll request on first touch
        if (permissionGranted) {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } else {
        // Non-iOS or older iOS - just add listener
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [permissionGranted]);

  // Request permission on first touch (iOS)
  useEffect(() => {
    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
          if (permission === 'granted') {
            setPermissionGranted(true);
          }
        } catch {
          // Permission denied or error
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', requestPermission, { once: true, passive: true });
      return () => container.removeEventListener('touchstart', requestPermission);
    }
  }, []);

  const style = {
    transform: `scale(1.15) translate(${offset.x}px, ${offset.y}px)`,
  };

  if (isVideo) {
    return (
      <div ref={containerRef} className="w-full h-full">
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-transform duration-100 ease-out"
          style={style}
        />
      </div>
    );
  }
  return (
    <div ref={containerRef} className="w-full h-full">
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover transition-transform duration-100 ease-out"
        style={style}
      />
    </div>
  );
}
