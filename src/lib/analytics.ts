// src/lib/analytics.ts - GA4 Platform-wide Tracking

export const GA4_ID = (import.meta as any).env.VITE_GA4_ID || 
                      (import.meta as any).env.NEXT_PUBLIC_GA4_ID || 
                      '';

// Send any event to GA4
export function trackEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window === 'undefined') return;
  if (!GA4_ID) {
    console.log(`[GA4 Track Event (Mock - No GA4 ID)]: ${eventName}`, params);
    return;
  }
  if (typeof window.gtag !== 'function') {
    console.warn(`[GA4 Track Event]: window.gtag is not defined. Tried to track ${eventName}`, params);
    return;
  }
  window.gtag('event', eventName, params);
}

// Declare gtag and fbq for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
    _fbq?: any;
  }
}
