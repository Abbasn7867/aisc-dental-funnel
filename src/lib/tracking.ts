// Browser-only attribution and measurement. Invoke only from effects/handlers.
const REF_COOKIE = "aisc_ref";
const REF_DAYS = 45;
const UTM_KEY = "aisc_utm";
export type Utm = { utm_source?: string | undefined; utm_medium?: string | undefined; utm_campaign?: string | undefined };
const clean = (v: string | null, max = 100) => (v ? v.trim().slice(0, max).replace(/[^\w.\-~ ]/g, "") || undefined : undefined);
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const q = new URLSearchParams(window.location.search);
  const ref = clean(q.get("ref"), 64);
  if (ref) document.cookie = `${REF_COOKIE}=${encodeURIComponent(ref)}; expires=${new Date(Date.now() + REF_DAYS * 864e5).toUTCString()}; path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  const utm: Utm = { utm_source: clean(q.get("utm_source")), utm_medium: clean(q.get("utm_medium")), utm_campaign: clean(q.get("utm_campaign")) };
  if (utm.utm_source || utm.utm_medium || utm.utm_campaign) sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
}
export function getRef(): string | undefined {
  const value = document.cookie.match(/(?:^|; )aisc_ref=([^;]*)/)?.[1];
  return value ? decodeURIComponent(value) : undefined;
}
export function getUtm(): Utm {
  try { return JSON.parse(sessionStorage.getItem(UTM_KEY) ?? "{}") as Utm; } catch { return {}; }
}
export const GA4_ID = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY"] ?? "";
export const META_PIXEL_ID = "2206705753230004";
export const NOTICE_VERSION = "business-measurement-v1";
export const NOTICE_TEXT = "With Accept all, Google Analytics and Meta receive page visits, offer clicks and successful business trial sign-ups for measurement and ad optimization, including browser/device information, IP address and cookie identifiers. No form answers or patient information are shared. Tracking is disabled in consent-required and unresolved regions and when a browser privacy opt-out is detected. Essential only refuses optional measurement. Withdraw anytime through Cookie settings.";
const CHOICE_KEY = "aisc-cookie-choice";
const RECORD_KEY = "aisc-measurement-consent";
type Consent = { visitor: string; version: string; region: string; choice: "all" | "essential"; at: string; acceptedAt?: string; notice: string };
type Fbq = ((...args: unknown[]) => void) & { callMethod?: ((...args: unknown[]) => void) | undefined; queue: unknown[][]; push?: Fbq | undefined; loaded: boolean; version: string };
type W = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; fbq?: Fbq; _fbq?: Fbq };
let region: string | undefined;
let regionPromise: Promise<string> | undefined;
let loaded = false;
let lastPage = "";
// Conservative permission allowlist: other countries remain blocked until assessed.
export function regionPermitsTracking(country: string) { return ["US", "CA", "AU", "NZ", "JP", "SG"].includes(country); }
export async function resolveTrackingRegion(): Promise<string> {
  if (typeof window === "undefined") return "XX";
  regionPromise ??= (async () => {
    try {
      const res = await fetch("/cdn-cgi/trace", { signal: AbortSignal.timeout(2000) });
      const loc = res.ok ? (await res.text()).match(/^loc=([A-Z]{2})$/m)?.[1] : undefined;
      region = loc ?? "XX";
    } catch { region = "XX"; }
    return region;
  })();
  return regionPromise;
}
export function readConsent(): Consent | undefined {
  if (typeof window === "undefined") return;
  try { const record = JSON.parse(localStorage.getItem(RECORD_KEY) ?? "null") as Consent | null; return record?.version === NOTICE_VERSION ? record : undefined; } catch { return; }
}
export async function saveConsent(choice: "all" | "essential") {
  const country = await resolveTrackingRegion();
  const previous = readConsent();
  const now = new Date().toISOString();
  const record: Consent = { visitor: previous?.visitor ?? crypto.randomUUID(), version: NOTICE_VERSION, region: country, choice, at: now, notice: NOTICE_TEXT, ...(choice === "all" ? { acceptedAt: now } : previous?.acceptedAt ? { acceptedAt: previous.acceptedAt } : {}) };
  localStorage.setItem(RECORD_KEY, JSON.stringify(record));
  localStorage.setItem(CHOICE_KEY, choice);
  syncAnalyticsConsent();
}
export function measurementPermitted() {
  if (typeof window === "undefined") return false;
  const privacy = navigator as Navigator & { globalPrivacyControl?: boolean };
  return regionPermitsTracking(region ?? "XX") && !privacy.globalPrivacyControl && navigator.doNotTrack !== "1" && readConsent()?.choice === "all" && localStorage.getItem(CHOICE_KEY) === "all";
}
export function syncAnalyticsConsent() {
  if (typeof window === "undefined") return;
  const w = window as W;
  const allowed = measurementPermitted();
  w.fbq?.("consent", allowed ? "grant" : "revoke");
  w.gtag?.("consent", "update", { analytics_storage: allowed ? "granted" : "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  if (allowed) void loadAnalytics();
}
export async function loadAnalytics() {
  if (typeof window === "undefined") return;
  await resolveTrackingRegion();
  if (!measurementPermitted()) return;
  const w = window as W;
  if (!loaded) {
    loaded = true;
    if (GA4_ID) {
      w.dataLayer ??= [];
      w.gtag = function (..._args: unknown[]) { w.dataLayer?.push(arguments); };
      w.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      w.gtag("set", "developer_id.dZjgwMW", true);
      w.gtag("js", new Date());
      w.gtag("config", GA4_ID, { send_page_view: false, allow_google_signals: false });
      const script = document.createElement("script");
      script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`; document.head.appendChild(script);
    }
    if (!w.fbq) {
      const fb = Object.assign(function (...args: unknown[]) { if (fb.callMethod) fb.callMethod.apply(fb, args); else fb.queue.push(args); }, { queue: [] as unknown[][], loaded: true, version: "2.0", callMethod: undefined as ((...args: unknown[]) => void) | undefined, push: undefined as Fbq | undefined });
      fb.push = fb; w.fbq = fb; w._fbq = fb;
      fb("consent", "grant");
      fb("set", "autoConfig", false, META_PIXEL_ID);
      fb("init", META_PIXEL_ID, {}, { agent: "lovable" });
      const script = document.createElement("script");
      script.async = true; script.src = "https://connect.facebook.net/en_US/fbevents.js"; document.head.appendChild(script);
    }
  }
  trackPageView();
}
export function trackPageView() {
  if (!measurementPermitted()) return;
  const page = window.location.pathname;
  if (lastPage === page) return;
  lastPage = page;
  const w = window as W;
  w.gtag?.("event", "page_view", { page_path: page, page_location: `${window.location.origin}${page}` });
  w.fbq?.("track", "PageView");
}
export function track(event: string, _params: Record<string, unknown> = {}) {
  if (!measurementPermitted() || !["cta_bar_click", "exit_popup_shown", "exit_popup_click", "offer_click"].includes(event)) return;
  const w = window as W;
  w.gtag?.("event", event);
  w.fbq?.("trackCustom", event);
}
export function trackLead() {
  if (!measurementPermitted()) return;
  const id = crypto.randomUUID();
  const w = window as W;
  w.gtag?.("event", "generate_lead", { event_id: id });
  w.fbq?.("track", "Lead", {}, { eventID: id });
}
