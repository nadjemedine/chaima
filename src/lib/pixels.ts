// Meta Pixel & TikTok Pixel Event Helpers
// Replace YOUR_META_PIXEL_ID and YOUR_TIKTOK_PIXEL_ID with your actual pixel IDs

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    ttq: {
      track: (...args: any[]) => void;
      page: () => void;
      identify: (data: Record<string, any>) => void;
      load: (id: string) => void;
      instances: any[];
    };
  }
}

// ─── Meta Pixel Events ───

export function metaPageView() {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
}

export function metaViewContent(data: { content_name: string; content_ids: string[]; content_type: string; value?: number; currency?: string }) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_name: data.content_name,
      content_ids: data.content_ids,
      content_type: data.content_type,
      value: data.value,
      currency: data.currency || 'DZD',
    });
  }
}

export function metaAddToCart(data: { content_name: string; content_ids: string[]; value: number; currency?: string }) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'AddToCart', {
      content_name: data.content_name,
      content_ids: data.content_ids,
      content_type: 'product',
      value: data.value,
      currency: data.currency || 'DZD',
    });
  }
}

export function metaInitiateCheckout(data: { content_ids: string[]; value: number; num_items: number; currency?: string }) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: data.content_ids,
      value: data.value,
      num_items: data.num_items,
      currency: data.currency || 'DZD',
    });
  }
}

export function metaPurchase(data: { content_ids: string[]; value: number; num_items: number; currency?: string }) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Purchase', {
      content_ids: data.content_ids,
      value: data.value,
      num_items: data.num_items,
      currency: data.currency || 'DZD',
    });
  }
}

export function metaLead() {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead');
  }
}

export function metaContact() {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Contact');
  }
}

// ─── TikTok Pixel Events ───

export function tiktokPageView() {
  if (typeof window.ttq !== 'undefined') {
    window.ttq.page();
  }
}

export function tiktokViewContent(data: { content_id: string; content_name: string; value?: number; currency?: string }) {
  if (typeof window.ttq !== 'undefined') {
    window.ttq.track('ViewContent', {
      content_id: data.content_id,
      content_name: data.content_name,
      value: data.value,
      currency: data.currency || 'DZD',
    });
  }
}

export function tiktokAddToCart(data: { content_id: string; content_name: string; value: number; currency?: string }) {
  if (typeof window.ttq !== 'undefined') {
    window.ttq.track('AddToCart', {
      content_id: data.content_id,
      content_name: data.content_name,
      value: data.value,
      currency: data.currency || 'DZD',
    });
  }
}

export function tiktokInitiateCheckout(data: { content_id: string; value: number; currency?: string }) {
  if (typeof window.ttq !== 'undefined') {
    window.ttq.track('InitiateCheckout', {
      content_id: data.content_id,
      value: data.value,
      currency: data.currency || 'DZD',
    });
  }
}

export function tiktokCompletePayment(data: { content_id: string; value: number; currency?: string }) {
  if (typeof window.ttq !== 'undefined') {
    window.ttq.track('CompletePayment', {
      content_id: data.content_id,
      value: data.value,
      currency: data.currency || 'DZD',
    });
  }
}

export function tiktokSubmitForm() {
  if (typeof window.ttq !== 'undefined') {
    window.ttq.track('SubmitForm');
  }
}

export function tiktokContact() {
  if (typeof window.ttq !== 'undefined') {
    window.ttq.track('Contact');
  }
}
