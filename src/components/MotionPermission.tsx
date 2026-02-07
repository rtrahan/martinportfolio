'use client';

import { useEffect } from 'react';

/**
 * Requests DeviceOrientationEvent permission on the very first user tap (iOS 13+).
 * On non-iOS, orientation events work without permission so this is a no-op.
 * Mount once in the root layout so the prompt appears as early as possible.
 */
export function MotionPermission() {
  useEffect(() => {
    if (
      typeof DeviceOrientationEvent === 'undefined' ||
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission !== 'function'
    ) {
      return; // Not iOS 13+ — no permission needed
    }

    const request = async () => {
      try {
        const perm = await (
          DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }
        ).requestPermission();
        if (perm === 'granted') {
          // Store so other components know permission was granted
          window.__motionPermissionGranted = true;
        }
      } catch {
        // User denied or error — nothing to do
      }
    };

    // iOS requires the call inside a user-gesture handler
    window.addEventListener('touchstart', request, { once: true, passive: true });
    return () => window.removeEventListener('touchstart', request);
  }, []);

  return null;
}

// Extend Window so other components can check
declare global {
  interface Window {
    __motionPermissionGranted?: boolean;
  }
}
