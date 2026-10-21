// Browser-only attribution + analytics helpers. Call from effects/handlers only.
const REF_COOKIE = "aisc_ref";
const REF_DAYS = 45;
const UTM_KEY = "aisc_utm";

export type Utm = { utm_source?: string | undefined; utm_medium?: string | undefined; utm_campaign?: string | undefined };

const clean = (v: string | null, max = 100) => (v ? v.trim().slice(0, max).replace(/[^\w.\-~ ]/g, "") || undefined : undefined);

/** Stores ?ref= in a first-party cookie (latest wins) and UTM params for the session. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const q = new URLSearchParams(window.location.search);
  const ref = clean(q.get("ref"), 64);
  if (ref) {
    const exp = new Date(Date.now() + REF_DAYS * 864e5).toUTCString();
    document.cookie = `${REF_COOKIE}=${encodeURIComponent(ref)}; expires=${exp}; path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  }
  const utm: Utm = { utm_source: clean(q.get("utm_source")), utm_medium: clean(q.get("utm_medium")), utm_campaign: clean(q.get("utm_campaign")) };
  if (utm.utm_source || utm.utm_medium || utm.utm_campaign) sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
}

export function getRef(): string | undefined {
  const m = document.cookie.match(/(?:^|; )aisc_ref=([^;]*)/);
  return m ? decodeURIComponent(m[1]!) : undefined;
}

export function getUtm(): Utm {
  try { return JSON.parse(sessionStorage.getItem(UTM_KEY) ?? "{}") as Utm; } catch { return {}; }
}

type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; _fbq?: unknown };

// [ADD GA4 MEASUREMENT ID] e.g. "G-ABC123DEF4" — analytics stay off until this is set.
export const GA4_ID = "";
// [ADD META PIXEL ID] e.g. "1234567890123456" — the pixel stays off until this is set.
export const META_PIXEL_ID = "";

let analyticsLoaded = false;

/** Loads GA4 and the Meta pixel. Call only after the visitor chose "Accept all". */
export function loadAnalytics() {
  if (typeof window === "undefined" || analyticsLoaded) return;
  if (localStorage.getItem("aisc-cookie-choice") !== "all") return;
  analyticsLoaded = true;
  const w = window as W;

  if (GA4_ID) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(s);
    w.dataLayer ??= [];
    w.gtag = (...a: unknown[]) => w.dataLayer!.push(a);
    w.gtag("js", new Date());
    w.gtag("config", GA4_ID);
  }

  if (META_PIXEL_ID) {
    type Fbq = ((...a: unknown[]) => void) & { q?: unknown[] };
    const w2 = w as W & { fbq?: Fbq; _fbq?: unknown };
    if (!w2.fbq) {
      const fb: Fbq = (...a: unknown[]) => { (fb.q ??= []).push(a); };
      w2.fbq = fb;
    }
    w2._fbq = w2.fbq;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
    w2.fbq("init", META_PIXEL_ID);
    w2.fbq("track", "PageView");
  }
}

/** Fires an analytics event only after the visitor accepted analytics cookies. Never pass form field values. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || localStorage.getItem("aisc-cookie-choice") !== "all") return;
  const w = window as W;
  if (w.gtag) w.gtag("event", event, params);
  else (w.dataLayer ??= []).push({ event, ...params });
  if (w.fbq) w.fbq("trackCustom", event, params);
}

/** Standard "Lead" conversion event for a successful free-trial submission. No form values attached. */
export function trackLead() {
  if (typeof window === "undefined" || localStorage.getItem("aisc-cookie-choice") !== "all") return;
  const w = window as W;
  if (w.gtag) w.gtag("event", "Lead");
  else (w.dataLayer ??= []).push({ event: "Lead" });
  if (w.fbq) w.fbq("track", "Lead");
}
