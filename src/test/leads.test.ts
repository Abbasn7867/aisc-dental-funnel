import { describe, expect, it } from "vitest";
import { buildLeadRow, webhookPayload } from "@/lib/leads.server";
import type { LeadSubmission } from "@/lib/leads.schema";

const base: LeadSubmission = {
  name: "Jo", business_name: "Smile Co", email: "Jo@X.com", phone: "(555) 123-4567", website: "",
  locations: 1, software: "", problems: [], q1: "", q2: "", q3: "",
  consent_sms_account: false, consent_marketing: false, plan: "pro", billing: "yearly", pain_ids: [],
};

describe("leads", () => {
  it("niche is dental-practices and status new", () => {
    const r = buildLeadRow(base);
    expect(r.niche).toBe("dental-practices");
    expect(r.status).toBe("new");
  });
  it("no consent → no consent text or timestamp", () => {
    const r = buildLeadRow(base);
    expect(r.consent_text).toBeNull();
    expect(r.consent_at).toBeNull();
  });
  it("consent given → timestamp recorded", () => {
    expect(buildLeadRow({ ...base, consent_sms_account: true }, "2026-01-01T00:00:00Z").consent_at).toBe("2026-01-01T00:00:00Z");
  });
  it("webhook tags, plus affiliate only with a ref code", () => {
    expect(webhookPayload(buildLeadRow(base), "t").tags).toEqual(["lovable-funnel", "dental-practices", "free-trial"]);
    expect(webhookPayload(buildLeadRow({ ...base, ref_code: "abc" }), "t").tags).toContain("affiliate");
  });
});
