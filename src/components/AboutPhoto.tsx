'use client';

import { useState } from 'react';

export function AboutPhoto({ photoUrl, name }: { photoUrl?: string | null; name: string }) {
  const [error, setError] = useState(false);

  if (!photoUrl || error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-stone-500 dark:text-stone-600 font-mono uppercase tracking-widest">
        Photo
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt={name}
      className="absolute inset-0 w-full h-full object-cover object-top"
      onError={() => setError(true)}
    />
  );
}
