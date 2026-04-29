'use client';

import { useRef, useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export function PdfPlanView({
  src,
  page = 1,
  onClose,
}: {
  src: string;
  page?: number;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPdfUrl(src);
    setCurrentPage(page);
  }, [src, page]);

  useEffect(() => {
    if (!pdfUrl) return;
    setLoading(true);
    setError(null);
    const loadPdf = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        const fullUrl = pdfUrl.startsWith('/') ? `${window.location.origin}${pdfUrl}` : pdfUrl;
        const pdf = await pdfjsLib.getDocument(fullUrl).promise;
        setNumPages(pdf.numPages);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load PDF');
      } finally {
        setLoading(false);
      }
    };
    loadPdf();
  }, [pdfUrl]);

  if (error) {
    return (
      <div className="bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-white p-8 rounded-md max-w-md border border-stone-200 dark:border-white/10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 mb-3">Error</p>
        <p className="font-serif text-base text-stone-800 dark:text-stone-200">{error}</p>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-3">
          Ensure the plan PDF exists at the expected path.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-700 dark:text-white border border-stone-300 dark:border-white/20 rounded-full hover:bg-stone-200 dark:hover:bg-white/5 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  if (loading || !pdfUrl) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-1 h-1 rounded-full bg-stone-500 dark:bg-stone-400 animate-pulse" />
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
          Loading plan
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col bg-transparent overflow-hidden">
      {numPages > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 py-1.5 px-2 bg-stone-100/85 dark:bg-stone-950/70 backdrop-blur-md rounded-full border border-stone-300/70 dark:border-white/10 shadow-sm">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="p-2.5 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white disabled:opacity-30 transition-colors rounded-full"
            aria-label="Previous page"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="px-2 text-[11px] font-mono tabular uppercase tracking-[0.2em] text-stone-700 dark:text-stone-300">
            {String(currentPage).padStart(2, '0')} / {String(numPages).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
            className="p-2.5 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white disabled:opacity-30 transition-colors rounded-full"
            aria-label="Next page"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
      <div className="flex-1 min-h-0 relative">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={8}
          centerOnInit
          wheel={{ step: 0.1 }}
          pinch={{ step: 50 }}
          panning={{ velocityDisabled: false }}
          doubleClick={{ disabled: true }}
          smooth={true}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <PdfPageCanvas src={pdfUrl} pageNum={currentPage} />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}

function PdfPageCanvas({ src, pageNum }: { src: string; pageNum: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scale = 3; // Higher resolution for crisp full-screen

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      const pdfjsLib = await import('pdfjs-dist');
      const fullUrl = src.startsWith('/') ? `${window.location.origin}${src}` : src;
      const pdf = await pdfjsLib.getDocument(fullUrl).promise;
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    };
    render();
    return () => { cancelled = true; };
  }, [src, pageNum]);

  return <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />;
}
