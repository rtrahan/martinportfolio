'use client';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export function SvgPlanView({ src, onClose }: { src: string; onClose: () => void }) {
  const fullUrl = src.startsWith('/') ? `${typeof window !== 'undefined' ? window.location.origin : ''}${src}` : src;

  return (
    <div className="w-full h-full flex flex-col bg-neutral-900 rounded-lg overflow-hidden">
      <div className="flex-1 min-h-0 relative">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={8}
          centerOnInit
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <object
              data={fullUrl}
              type="image/svg+xml"
              className="max-w-full max-h-full w-auto h-auto"
              aria-label="SVG plan"
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}
