// Browser-only attribution + analytics helpers. Call from effects/handlers only.
const REF_COOKIE = "aisc_ref";
const REF_DAYS = 45;
const UTM_KEY = "aisc_utm";

export type Utm = { utm_source?: string; utm_medium?: string; utm_campaign?: string };

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

type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };

/** Fires an analytics event only after the visitor accepted analytics cookies. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || localStorage.getItem("aisc-cookie-choice") !== "all") return;
  const w = window as W;
  if (w.gtag) w.gtag("event", event, params);
  else (w.dataLayer ??= []).push({ event, ...params });
}
