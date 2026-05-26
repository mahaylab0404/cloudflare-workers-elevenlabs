declare global {
  interface Window {
    _cio: any[];
  }
}

const SITE_ID = import.meta.env.VITE_CUSTOMERIO_SITE_ID as string | undefined;

export function initCustomerIO(): void {
  if (!SITE_ID) return;

  window._cio = window._cio || [];
  (function () {
    const a = function (f: string) {
      return function () {
        window._cio.push(
          [f].concat(Array.prototype.slice.call(arguments, 0))
        );
      };
    };
    const methods = ["load", "identify", "sidentify", "track", "page"];
    for (let i = 0; i < methods.length; i++) {
      (window._cio as any)[methods[i]] =
        (window._cio as any)[methods[i]] || a(methods[i]);
    }
    const t = document.createElement("script");
    const s = document.getElementsByTagName("script")[0];
    t.async = true;
    t.id = "cio-tracker";
    t.setAttribute("data-site-id", SITE_ID);
    t.setAttribute("data-use-array-params", "true");
    t.src = "https://assets.customer.io/assets/track.js";
    s.parentNode!.insertBefore(t, s);
  })();
}

export type CIOEvent =
  | "cta_call_clicked"
  | "cta_start_pilot_clicked"
  | "missed_revenue_calculated"
  | "missed_revenue_report_requested"
  | "pricing_viewed"
  | "demo_line_viewed"
  | "start_pilot_viewed"
  | "plan_selected"
  | "paypal_subscription_approved"
  | "baa_requested";

export function trackEvent(
  event: CIOEvent,
  data?: Record<string, unknown>
): void {
  if (!window._cio) return;
  window._cio.push(["track", event, data]);
}

export function trackPageView(url?: string): void {
  if (!window._cio) return;
  window._cio.push(["page", url || window.location.href]);
}

export interface LeadProfile {
  email: string;
  clinic_name?: string;
  practice_type?: string;
  plan_interest?: string;
  selected_plan?: string;
  lead_source?: string;
  phone?: string;
  city_region?: string;
  contact_name?: string;
  role?: string;
}

export function identifyLead(profile: LeadProfile): void {
  if (!window._cio) return;

  const attributes: Record<string, unknown> = { id: profile.email };
  for (const [key, value] of Object.entries(profile)) {
    if (value) attributes[key] = value;
  }

  window._cio.push(["identify", attributes]);
}
