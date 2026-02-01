'use client';

import { useState } from 'react';

export function DevTools({ slug, hasSplat }: { slug: string, hasSplat: boolean }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  if (process.env.NODE_ENV !== 'development') return null;

  const handleGenerate = async () => {
    if (!confirm("Generate 3D Splat? This runs SHARP locally and might take a minute.")) return;
    
    setLoading(true);
    setMsg("Generating...");
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ slug }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      
      setMsg("Done! Reloading...");
      setTimeout(() => window.location.reload(), 1000);
    } catch (e: any) {
      setMsg("Error: " + e.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-3 rounded text-xs font-mono border border-white/20">
      <div className="font-bold mb-2 text-stone-400">DEV TOOLS</div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={hasSplat ? "text-green-400" : "text-red-400"}>●</span>
          {hasSplat ? "Splat Active" : "No Splat"}
        </div>
        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="px-2 py-1 bg-stone-700 hover:bg-stone-600 rounded disabled:opacity-50"
        >
          {loading ? "Running SHARP..." : "Generate 3D Splat"}
        </button>
        {msg && <div className="mt-1 text-orange-300">{msg}</div>}
      </div>
    </div>
  );
}
