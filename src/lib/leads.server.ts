import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { CONSENT_MARKETING, CONSENT_SMS } from "@/lib/funnel";
import { phoneDigits, type LeadSubmission } from "@/lib/leads.schema";

type LeadRow = Database["public"]["Tables"]["leads"]["Insert"];

export function buildLeadRow(d: LeadSubmission, now = new Date().toISOString()): LeadRow {
  const consents = [d.consent_sms_account && CONSENT_SMS, d.consent_marketing && CONSENT_MARKETING].filter(Boolean) as string[];
  const digits = phoneDigits(d.phone);
  return {
    name: d.name, business_name: d.business_name, email: d.email.toLowerCase(),
    phone: `+1${digits}`,
    website: d.website || null, locations: d.locations, software: d.software || null,
    problems: d.problems, pain_ids: d.pain_ids,
    sample_questions: [d.q1, d.q2, d.q3].filter((q): q is string => !!q),
    niche: "dental-practices",
    consent_sms_account: d.consent_sms_account, consent_marketing: d.consent_marketing,
    consent_text: consents.length ? consents.join("\n\n") : null,
    consent_at: consents.length ? now : null,
    utm_source: d.utm_source ?? null, utm_medium: d.utm_medium ?? null, utm_campaign: d.utm_campaign ?? null,
    ref_code: d.ref_code ?? null, plan: d.plan, billing: d.billing, status: "new",
  };
}

export function webhookPayload(row: LeadRow, createdAt: string) {
  const tags = ["lovable-funnel", "dental-practices", "free-trial"];
  if (row.ref_code) tags.push("affiliate");
  return { ...row, created_at: createdAt, tags, plan: row.plan, ...(row.ref_code ? { ref_code: row.ref_code } : {}) };
}

export async function insertLead(row: LeadRow) {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const sb = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const h = new Headers(init?.headers);
      if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
      h.set("apikey", key);
      return fetch(input, { ...init, headers: h });
    } },
  });
  const { error } = await sb.from("leads").insert(row);
  if (error) console.error("[leads] insert failed", error.message);
  return !error;
}

/** POSTs the lead to the CRM inbound webhook; retries once. Never throws. */
export async function forwardLead(payload: unknown) {
  const hook = process.env["GHL_WEBHOOK_URL"];
  if (!hook) { console.error("[forward-lead] GHL_WEBHOOK_URL is not set"); return false; }
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) return true;
      console.error(`[forward-lead] attempt ${attempt} failed: HTTP ${res.status}`);
    } catch (e) {
      console.error(`[forward-lead] attempt ${attempt} error`, e instanceof Error ? e.message : e);
    }
    if (attempt === 1) await new Promise((r) => setTimeout(r, 800));
  }
  return false;
}
