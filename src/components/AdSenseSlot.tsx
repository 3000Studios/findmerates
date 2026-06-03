// components/AdSenseSlot.tsx
// Optimized Google AdSense ad placement component for maximum revenue
// Enhanced with auto-optimization, lazy loading, and performance monitoring

import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

// Extend Window interface for AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseSlotProps {
  adClient: string;  // ca-pub-xxxxxxxxxxxxxxxx from AdSense account
  adSlot: string;    // Individual slot ID
  format?: string;   // 'auto' for maximum optimization, or specific formats
  responsive?: boolean;
  sticky?: boolean;
  visible?: boolean; // Control visibility
  lazy?: boolean;    // Enable lazy loading for better performance
  className?: string;
  minHeight?: number;
  style?: React.CSSProperties;
  onAdLoad?: () => void; // Callback when ad loads
  onAdError?: (error: any) => void; // Callback when ad fails
}

export default function AdSenseSlot({
  adClient,
  adSlot,
  format = 'auto', // Default to auto for maximum revenue optimization
  responsive = true,
  sticky = false,
  visible = true,
  lazy = true, // Enable lazy loading by default
  className = '',
  minHeight = 250,
  style = {},
  onAdLoad,
  onAdError,
}: AdSenseSlotProps) {
  const adsEnabled = String(import.meta.env.VITE_ENABLE_ADS ?? 'true').toLowerCase() !== 'false';
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy); // If not lazy, always in view
  const adRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const normalizedSlot = String(adSlot || '').trim();
  const isPlaceholderSlot = /^(1234567890|0987654321|2222222222|4444444444|5555555555|6666666666|7777777777|8888888888)$/.test(normalizedSlot);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !adRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect(); // Stop observing once loaded
          }
        });
      },
      {
        threshold: 0.1, // Load when 10% visible
        rootMargin: '50px', // Load 50px before entering viewport
      }
    );

    observer.observe(adRef.current);

    return () => observer.disconnect();
  }, [lazy]);

  // Load ad when in view or not lazy
  useEffect(() => {
    if (!visible || !isInView || isLoaded || hasError || isPlaceholderSlot) return;

    const loadAd = () => {
      try {
        // Enhanced AdSense push with error handling
        (window.adsbygoogle = window.adsbygoogle || []).push({
          // Optional: Add targeting or other advanced options here
        });
        setIsLoaded(true);
        onAdLoad?.();
      } catch (error) {
        console.warn('AdSense slot error:', { adSlot, error });
        setHasError(true);
        onAdError?.(error);
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(loadAd, 100);

    return () => clearTimeout(timeoutId);
  }, [visible, isInView, isLoaded, hasError, adSlot, onAdLoad, onAdError, isPlaceholderSlot]);

  if (!visible || !adsEnabled || !normalizedSlot || isPlaceholderSlot || hasError) return null;

  return (
    <div
      ref={adRef}
      className={cn(
        sticky && 'sticky top-0 z-40',
        'flex justify-center items-center',
        className
      )}
      style={{
        minHeight: `${minHeight}px`,
        ...style,
      }}
    >
      {isInView && (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            minHeight: `${minHeight}px`,
            width: '100%',
          }}
          data-ad-client={adClient}
          data-ad-slot={normalizedSlot}
          data-ad-format={format}
          data-full-width-responsive={responsive.toString()}
        />
      )}
    </div>
  );
}

// Utility function to refresh all ads on a page
export const refreshAllAds = () => {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (error) {
    console.warn('AdSense global refresh error:', error);
  }
};

// Utility function to get ad performance data (if available)
export const getAdPerformance = (adSlot: string) => {
  // This would integrate with AdSense reporting API
  // For now, returns placeholder
  return {
    slotId: adSlot,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    rpm: 0,
  };
};
