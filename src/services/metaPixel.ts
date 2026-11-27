/**
 * Meta (Facebook) Pixel – pour les pubs Meta Ads.
 */
export const META_PIXEL_ID = '1087161004375149';

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let started = false;

export const initMetaPixel = () => {
  if (started || !META_PIXEL_ID || typeof window === 'undefined') return;
  started = true;

  if (!window.fbq) {
    const n: Fbq = function (...args: unknown[]) {
      if (n.callMethod) n.callMethod(...args);
      else n.queue!.push(args);
    } as Fbq;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    window.fbq = n;
    window._fbq = n;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
  }

  window.fbq!('init', META_PIXEL_ID);
  window.fbq!('track', 'PageView');
};

export const trackPixel = (event: string, data?: Record<string, unknown>) => {
  if (!META_PIXEL_ID || !window.fbq) return;
  window.fbq('track', event, data);
};
