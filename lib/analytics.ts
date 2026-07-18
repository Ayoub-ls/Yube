export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
  }
}

/**
 * Sends an event to YOUR platform-wide GA4 property. Safe to call
 * anywhere client-side — silently no-ops if GA4 isn't configured or
 * hasn't loaded yet, so call sites never need to guard this themselves.
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  if (!GA4_ID) return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}

/**
 * Fires a Meta Pixel event for a CLIENT's own pixel (not yours).
 * Safe to call anywhere client-side — no-ops if the client hasn't
 * configured a pixel_id, or if the pixel script hasn't loaded.
 */
export function trackPixelEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  if (typeof window.fbq !== 'function') return;
  window.fbq('track', eventName, params);
}
