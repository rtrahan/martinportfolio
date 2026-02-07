'use client';

import { useEffect } from 'react';

/**
 * Requests DeviceOrientationEvent permission on the very first user tap (iOS 13+).
 * On non-iOS, orientation events work without permission so this is a no-op.
 * Mount once in the root layout so the prompt appears as early as possible.
 */
export function MotionPermission() {
  useEffect(() => {
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof DeviceOrientationEvent === 'undefined' || typeof DOE.requestPermission !== 'function') {
      return; // Not iOS 13+ — no permission needed
    }

    let requested = false;
    const request = async () => {
      if (requested) return;
      requested = true;
      try {
        const perm = await DOE.requestPermission!();
        if (perm === 'granted') {
          window.__motionPermissionGranted = true;
        }
      } catch {
        // User denied or error
      }
      // Clean up all listeners after the first request
      cleanup();
    };

    // iOS requires the call inside a user-gesture handler.
    // Use both click and touchend for maximum reliability.
    const cleanup = () => {
      document.removeEventListener('click', request);
      document.removeEventListener('touchend', request);
    };
    document.addEventListener('click', request, { once: true, passive: true });
    document.addEventListener('touchend', request, { once: true, passive: true });
    return cleanup;
  }, []);

  return null;
}

// Extend Window so other components can check
declare global {
  interface Window {
    __motionPermissionGranted?: boolean;
  }
}
