'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

/** 
 * 3D Gaussian splat viewer with parallax effect.
 * Uses antimatter15/splat iframe viewer for reliability.
 * Progressive loading: shows fallback immediately, fades to splat when ready.
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
  
  // Progressive loading state
  const [splatLoaded, setSplatLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const useSplat = splatUrl && splatUrl.length > 0;
  const hasFallback = fallbackMediaUrl && fallbackMediaUrl.length > 0;
  
  // Show fallback while splat loads (progressive loading)
  const showFallback = hasFallback && (!splatLoaded || !useSplat);
  const showSplat = useSplat && mounted && iframeUrl;

  // Listen for splat load completion from iframe
  const handleMessage = useCallback((e: MessageEvent) => {
    if (e.data?.type === 'splat_loaded') {
      setSplatLoaded(true);
    } else if (e.data?.type === 'splat_progress') {
      setLoadProgress(e.data.progress || 0);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  // Only run on client after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    if (useSplat && splatUrl) {
      // Use local viewer with absolute URL to prevent defaulting to HuggingFace
      const fullUrl = splatUrl.startsWith('/') 
        ? `${window.location.origin}${splatUrl}` 
        : splatUrl;
      const search = new URLSearchParams({ url: fullUrl });
      if (typeof baseZoom === 'number' && !Number.isNaN(baseZoom)) {
        search.set('zoom', String(baseZoom));
      }
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

  // --- No splat, just fallback ---
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

  // --- Progressive loading: show fallback immediately, fade in splat when ready ---
  const isVideo = fallbackMediaUrl ? /\.(mp4|webm|mov)$/i.test(fallbackMediaUrl) : false;
  
  return (
    <div className={`absolute inset-0 ${compact ? 'bg-transparent' : 'bg-stone-100 dark:bg-stone-900'}`}>
      {/* Fallback layer — visible immediately, fades out when splat is ready */}
      {showFallback && (
        <div 
          className={`absolute inset-0 z-10 transition-opacity duration-700 ease-out ${splatLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          {parallax ? (
            <ParallaxImage src={fallbackMediaUrl!} isVideo={isVideo} />
          ) : (
            isVideo ? (
              <video src={fallbackMediaUrl!} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            ) : (
              <img src={fallbackMediaUrl!} alt="" className="w-full h-full object-cover" />
            )
          )}
        </div>
      )}
      
      {/* Loading indicator — only show if no fallback and not yet loaded */}
      {!hasFallback && !splatLoaded && mounted && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
          <div className="text-stone-500 dark:text-stone-500 font-mono text-sm tracking-widest animate-pulse">
            LOADING 3D SCENE...
          </div>
          {loadProgress > 0 && loadProgress < 100 && (
            <div className="mt-3 w-32 h-1 bg-stone-300 dark:bg-stone-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-stone-500 dark:bg-stone-400 transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Splat iframe — loads in background, becomes visible when ready */}
      {showSplat && (
        <iframe
          ref={iframeRef}
          title="3D Gaussian Splat Viewer"
          src={iframeUrl}
          className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-700 ease-out ${splatLoaded ? 'opacity-100' : 'opacity-0'}`}
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

// Helper for Parallax on the Fallback Image
function ParallaxImage({ src, isVideo }: { src: string; isVideo: boolean }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateOffset = (clientX: number, clientY: number) => {
      const x = (clientX / window.innerWidth - 0.5) * 5;  // Very subtle
      const y = (clientY / window.innerHeight - 0.5) * 5;
      setOffset({ x: -x, y: -y });
    };
    const handleMove = (e: MouseEvent) => updateOffset(e.clientX, e.clientY);
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) updateOffset(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  const style = {
    transform: `scale(1.1) translate(${offset.x}px, ${offset.y}px)`,
    transition: 'transform 0.1s ease-out',
  };

  if (isVideo) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={style}
      />
    );
  }
  return (
    <img
      src={src}
      alt=""
      className="w-full h-full object-cover"
      style={style}
    />
  );
}
