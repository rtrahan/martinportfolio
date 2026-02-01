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
      <div className="bg-neutral-900 text-white p-8 rounded-lg max-w-md">
        <p className="text-red-400">{error}</p>
        <p className="text-sm text-neutral-400 mt-2">
          Ensure portfolio.pdf is in public/plans/ or use a valid PDF URL.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-white/10 rounded hover:bg-white/20"
        >
          Close
        </button>
      </div>
    );
  }

  if (loading || !pdfUrl) {
    return (
      <div className="bg-neutral-900 text-white p-8 rounded-lg">
        <p className="text-neutral-400">Loading PDF…</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col bg-stone-100 dark:bg-black overflow-hidden">
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 py-2 px-4 bg-stone-200/90 dark:bg-stone-900/80 backdrop-blur-md rounded-full border border-stone-300 dark:border-white/10">
        {numPages > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-3 md:p-2 text-stone-700 dark:text-white hover:text-stone-900 dark:hover:text-stone-300 disabled:opacity-30 transition-colors"
            >
              <svg className="w-5 h-5 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-mono text-stone-300">
              {currentPage} / {numPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
              disabled={currentPage >= numPages}
              className="p-3 md:p-2 text-stone-700 dark:text-white hover:text-stone-900 dark:hover:text-stone-300 disabled:opacity-30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
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
