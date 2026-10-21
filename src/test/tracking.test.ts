import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Business-only measurement", () => {
  beforeEach(() => { vi.resetModules(); localStorage.clear(); document.head.querySelectorAll('script[src*="facebook"],script[src*="googletagmanager"]').forEach(s => s.remove()); delete (window as unknown as { fbq?: unknown }).fbq; vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, text: async () => "loc=US\n" })); });
  it("uses the supplied pixel and standard signup event with no form data", async () => {
    const tracking = await import("@/lib/tracking");
    await tracking.saveConsent("all"); await tracking.loadAnalytics();
    tracking.trackLead();
    const fbq = (window as unknown as { fbq: { queue: unknown[][] } }).fbq;
    expect(fbq.queue).toContainEqual(["init", "2206705753230004", {}, { agent: "lovable" }]);
    expect(fbq.queue.find(call => call[1] === "Lead")).toEqual(["track", "Lead", {}, { eventID: expect.any(String) }]);
  });
  it("blocks consent-required and unknown regions even after Accept all", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, text: async () => "loc=DE\n" }));
    const tracking = await import("@/lib/tracking");
    await tracking.saveConsent("all"); await tracking.loadAnalytics(); tracking.trackLead();
    expect(document.querySelector('script[src*="fbevents.js"]')).toBeNull();
    expect(tracking.regionPermitsTracking("XX")).toBe(false);
    expect(tracking.regionPermitsTracking("GB")).toBe(false);
  });
  it("stops events on withdrawal and retains acceptance evidence", async () => {
    const tracking = await import("@/lib/tracking");
    await tracking.saveConsent("all"); await tracking.loadAnalytics();
    await tracking.saveConsent("essential");
    const fbq = (window as unknown as { fbq: { queue: unknown[][] } }).fbq;
    const count = fbq.queue.length; tracking.trackLead(); tracking.track("offer_click");
    expect(fbq.queue.length).toBe(count);
    expect(fbq.queue).toContainEqual(["consent", "revoke"]);
    expect(tracking.readConsent()?.acceptedAt).toBeTruthy();
  });
});