import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CookieBanner, Footer, LegalLinks, Nav } from "@/components/site";
import { CONSENT_MARKETING, CONSENT_SMS, DASHBOARD_URL, LEGAL, PLANS, formatUsd } from "@/lib/funnel";

type TrialSearch = { plan?: "receptionist" | "pro" | "full" | undefined; billing?: "monthly" | "yearly" | undefined; pains?: string | undefined };

export const Route = createFileRoute("/free-trial")({
  head: () => ({
    meta: [
      { title: "Book a Free Trial | AI Solution Company for Dental Practices" },
      { name: "description", content: "Start 14 days of the full Complete AI Front Office. $0 setup during launch and $250 bonus credits." },
      { property: "og:title", content: "Book a Free Trial of the Complete AI Front Office" },
      { property: "og:description", content: "14-day free trial of all 8 AI employees, led by Amy. No setup fee during launch." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): TrialSearch => {
    const plan = s["plan"];
    const billing = s["billing"];
    return {
      plan: plan === "receptionist" || plan === "pro" || plan === "full" ? plan : undefined,
      billing: billing === "yearly" || billing === "monthly" ? billing : undefined,
      pains: typeof s["pains"] === "string" ? (s["pains"] as string).slice(0, 400) : undefined,
    };
  },
  component: FreeTrial,
});

const fields = [
  { name: "name", label: "Your name", type: "text", auto: "name" },
  { name: "practice", label: "Practice name", type: "text", auto: "organization" },
  { name: "email", label: "Work email", type: "email", auto: "email" },
  { name: "phone", label: "Phone", type: "tel", auto: "tel" },
  { name: "website", label: "Website", type: "url", auto: "url" },
];

function FreeTrial() {
  const [done, setDone] = useState(false);
  const { plan, billing, pains } = Route.useSearch();
  const chosen = PLANS.find((p) => p.id === plan);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const now = new Date().toISOString();
    const record = {
      ...Object.fromEntries(fields.map((f) => [f.name, fd.get(f.name)])),
      plan: plan ?? null,
      billing: billing ?? null,
      pains: pains ? pains.split(",") : null,
      consent_sms_account: fd.get("consent_sms_account") ? { text: CONSENT_SMS, at: now } : null,
      consent_marketing: fd.get("consent_marketing") ? { text: CONSENT_MARKETING, at: now } : null,
    };
    console.info("trial signup", record);
    setDone(true);
  }

  return (
    <div>
      <Nav />
      <main className="relative mx-auto grid max-w-6xl gap-12 px-6 pt-16 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">14-day free trial</p>
          <h1 className="mt-3 text-5xl font-extrabold leading-tight">Your full AI front office, <span className="text-gradient">ready today.</span></h1>
          <ul className="mt-8 space-y-3 text-lg">
            <li>✓ All of the platform, nothing locked</li>
            <li>✓ Setup <s>$1,000</s> $0 during launch</li>
            <li>✓ $250 in bonus credits for call minutes</li>
            <li>✓ Your instant test call in 3–4 minutes</li>
          </ul>
          <p className="mt-8 text-muted-foreground">
            After you book, you go straight to your dashboard. A Quick Start checklist gets you set up in about 10 minutes. Your instant test call is recorded, and the recording is sent to the email you provide.
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-8 shadow-soft">
          {done ? (
            <div className="py-10 text-center">
              <h2 className="text-3xl font-extrabold">You're in.</h2>
              <p className="mt-3 text-muted-foreground">Head to your dashboard to start the Quick Start checklist.</p>
              <a href={DASHBOARD_URL} className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-glow">Go to my dashboard →</a>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4" data-trial-form>
              {chosen && (
                <p className="rounded-2xl bg-mint-soft px-4 py-3 text-sm font-semibold">
                  Selected plan: <b>{chosen.name}</b> · {formatUsd(billing === "yearly" ? chosen.yearly : chosen.monthly)}/month, billed {billing ?? "monthly"} · starts with your 14-day free trial
                </p>
              )}
              {fields.map((f) => (
                <label key={f.name} className="block">
                  <span className="text-sm font-bold">{f.label}</span>
                  <input
                    name={f.name}
                    type={f.type}
                    autoComplete={f.auto}
                    required={f.name !== "website"}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-primary"
                  />
                </label>
              ))}
              <label className="flex gap-3 text-xs text-muted-foreground">
                <input type="checkbox" name="consent_sms_account" className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
                <span>
                  {CONSENT_SMS}{" "}
                  <a href={LEGAL.privacy} target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a> ·{" "}
                  <a href={LEGAL.terms} target="_blank" rel="noopener noreferrer" className="underline">Terms of Service</a>
                </span>
              </label>
              <label className="flex gap-3 text-xs text-muted-foreground">
                <input type="checkbox" name="consent_marketing" className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
                <span>{CONSENT_MARKETING}</span>
              </label>
              <button type="submit" className="w-full rounded-full bg-primary py-4 font-bold text-primary-foreground shadow-glow hover:bg-primary-deep">
                Book a Free Trial →
              </button>
              <LegalLinks className="text-xs text-muted-foreground" />
            </form>
          )}
        </div>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
