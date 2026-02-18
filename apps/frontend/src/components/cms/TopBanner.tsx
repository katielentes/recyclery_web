import React from 'react';
import { useTopBanner } from '../../hooks/useCMS.js';

export default function TopBanner() {
  const { banner, loading } = useTopBanner();

  if (loading || !banner?.message) {
    return null;
  }

  const content = (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2 text-center text-sm font-medium text-white bg-maroon-600">
      <span>{banner.message}</span>
      {banner.link && (
        <a
          href={banner.link}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-maroon-600 rounded"
        >
          {banner.linkText || 'Learn more'}
        </a>
      )}
    </div>
  );

  return (
    <div className="sticky top-0 z-50 w-full shrink-0" role="banner" aria-live="polite">
      {content}
    </div>
  );
}
