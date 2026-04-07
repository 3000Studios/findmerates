// components/AdSenseSlot.tsx
// Reusable Google AdSense ad placement component
// Copy this template for standardized ad integration

import { useEffect } from 'react';
import { cn } from '../lib/utils';

interface AdSenseSlotProps {
  adClient: string;  // ca-pub-xxxxxxxxxxxxxxxx from AdSense account
  adSlot: string;    // Individual slot ID
  format?: string;   // '300x250', '728x90', '300x600', 'auto', etc.
  responsive?: boolean;
  sticky?: boolean;
  visible?: boolean; // Control visibility
  className?: string;
  minHeight?: number;
}

export default function AdSenseSlot({
  adClient,
  adSlot,
  format = 'auto',
  responsive = true,
  sticky = false,
  visible = true,
  className = '',
  minHeight = 250,
}: AdSenseSlotProps) {
  useEffect(() => {
    if (!visible) return;

    try {
      // Push ad config to AdSense
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn('AdSense slot error:', { adSlot, error });
    }
  }, [visible, adSlot]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        sticky && 'sticky top-0 z-40',
        'flex justify-center items-center bg-slate-50 rounded-lg border border-slate-200',
        className
      )}
      style={{ minHeight: `${minHeight}px` }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: `${minHeight}px`,
          width: '100%',
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      ></ins>
    </div>
  );
}
