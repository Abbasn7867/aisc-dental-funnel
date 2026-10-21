import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CookieBanner, Footer, Nav } from "@/components/site";
import { CATEGORIES } from "@/data/painPoints";
import { CONSENT_MARKETING, CONSENT_SMS, LEGAL, PLANS, formatUsd } from "@/lib/funnel";
import { trialFormSchema, type TrialForm } from "@/lib/leads.schema";
import { submitLead } from "@/lib/leads.functions";
import { getRef, getUtm } from "@/lib/tracking";

type TrialSearch = { plan?: "receptionist" | "pro" | "full" | undefined; billing?: "monthly" | "yearly" | undefined; pains?: string | undefined };

export const Route = createFileRoute("/free-trial")({
  head: () => ({
    meta: [
      { title: "Book a Free Trial | AI Solution Company for Dental Practices" },
      { name: "description", content: "Start your 14-day free trial of the full platform. $0 setup (was $1,000), $250 bonus credits and an instant test call in 3–4 minutes." },
      { property: "og:title", content: "Start your 14-day free trial of the full platform" },
      { property: "og:description", content: "All 8 AI employees, led by Amy. $0 setup during launch and $250 bonus credits." },
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

const STEPS: { title: string; fields: (keyof TrialForm)[] }[] = [
  { title: "About you", fields: ["name", "business_name", "email", "phone", "website"] },
  { title: "Your practice", fields: ["locations", "software", "problems"] },
  { title: "Patient questions", fields: ["q1", "q2", "q3"] },
  { title: "Plan & consent", fields: ["plan", "billing", "consent_sms_account", "consent_marketing"] },
];

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  if (d.length < 4) return d.length ? `(${d}` : "";
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

const input = "mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-primary aria-[invalid=true]:border-destructive";

function Field({ id, label, error, children, hint }: { id: string; label: string; error?: string | undefined; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold">{label}{hint && <span className="font-normal text-muted-foreground"> {hint}</span>}</label>
      {children}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}

function FreeTrial() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const send = useServerFn(submitLead);
  const painIds = (search.pains ?? "").split(",").filter((p) => /^p\d{1,2}$/.test(p));
  const preProblems = CATEGORIES.filter((c) => c.items.some((i) => painIds.includes(i.id))).map((c) => c.title);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, control, handleSubmit, trigger, watch, setValue, formState: { errors, isSubmitting } } = useForm<TrialForm>({
    resolver: zodResolver(trialFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: "", business_name: "", email: "", phone: "", website: "",
      locations: 1, software: "", problems: preProblems, q1: "", q2: "", q3: "",
      consent_sms_account: false, consent_marketing: false,
      plan: search.plan ?? "full", billing: search.billing ?? "monthly",
    },
  });

  const plan = watch("plan");
  const billing = watch("billing");
  const chosen = PLANS.find((p) => p.id === plan)!;

  async function next() {
    if (await trigger(STEPS[step]!.fields)) { setDir(1); setStep((s) => s + 1); }
  }
  function back() { setDir(-1); setStep((s) => s - 1); }

  const onSubmit = handleSubmit(async (v) => {
    setServerError(null);
    const utm = getUtm();
    const res = await send({ data: { ...v, pain_ids: painIds, ...utm, ref_code: getRef() } });
    if (!res.ok) { setServerError(res.error); return; }
    navigate({ to: "/thank-you" });
  });

  const err = (k: keyof TrialForm) => errors[k]?.message as string | undefined;
  const a11y = (k: keyof TrialForm) => ({ id: k, "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <div>
      <Nav />
      <main className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">14-day free trial</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">Start your 14-day free trial of <span className="text-gradient">the full platform</span></h1>
          <div className="mt-8 rounded-3xl bg-ink p-6 text-ink-foreground shadow-glow">
            <ul className="space-y-3 text-lg font-semibold">
              <li>✓ $0 setup <span className="opacity-70">(was <s>$1,000</s>)</span></li>
              <li>✓ $250 bonus credits</li>
              <li>✓ Instant test call in 3–4 minutes</li>
            </ul>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-soft sm:p-8">
          <div className="mb-6">
            <div className="flex justify-between text-xs font-bold text-muted-foreground"><span>Step {step + 1} of {STEPS.length}</span><span>{STEPS[step]!.title}</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
              <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }} />
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} noValidate data-trial-form className="overflow-hidden">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div key={step} custom={dir} initial={{ x: dir * 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: dir * -60, opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
                {step === 0 && (<>
                  <Field id="name" label="Your name" error={err("name")}><input {...register("name")} {...a11y("name")} autoComplete="name" className={input} /></Field>
                  <Field id="business_name" label="Practice name" error={err("business_name")}><input {...register("business_name")} {...a11y("business_name")} autoComplete="organization" className={input} /></Field>
                  <Field id="email" label="Work email" error={err("email")}><input type="email" {...register("email")} {...a11y("email")} autoComplete="email" className={input} /></Field>
                  <Field id="phone" label="Mobile phone" error={err("phone")}>
                    <Controller control={control} name="phone" render={({ field }) => (
                      <input {...field} {...a11y("phone")} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(555) 123-4567" onChange={(e) => field.onChange(maskPhone(e.target.value))} className={input} />
                    )} />
                  </Field>
                  <Field id="website" label="Website" hint="(optional)" error={err("website")}><input type="url" {...register("website")} {...a11y("website")} autoComplete="url" className={input} /></Field>
                </>)}

                {step === 1 && (<>
                  <Field id="locations" label="Number of locations" error={err("locations")}><input type="number" min={1} {...register("locations")} {...a11y("locations")} className={input} /></Field>
                  <Field id="software" label="Current scheduling or practice-management software" hint="(optional)" error={err("software")}><input {...register("software")} {...a11y("software")} className={input} /></Field>
                  <fieldset>
                    <legend className="text-sm font-bold">Biggest front-office problems</legend>
                    <Controller control={control} name="problems" render={({ field }) => (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {CATEGORIES.map((c) => {
                          const on = field.value.includes(c.title);
                          return (
                            <button key={c.id} type="button" aria-pressed={on} onClick={() => field.onChange(on ? field.value.filter((t) => t !== c.title) : [...field.value, c.title])}
                              className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${on ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`}>
                              {c.title}
                            </button>
                          );
                        })}
                      </div>
                    )} />
                  </fieldset>
                </>)}

                {step === 2 && (<>
                  <p className="text-sm font-bold">Top questions your patients ask <span className="font-normal text-muted-foreground">(optional)</span></p>
                  <p className="rounded-xl bg-mint-soft px-4 py-2 text-xs font-semibold">General questions only. Please don't include any patient names or personal details.</p>
                  {(["q1", "q2", "q3"] as const).map((k, i) => (
                    <Field key={k} id={k} label={`Question ${i + 1}`} error={err(k)}><input {...register(k)} {...a11y(k)} placeholder={["Do you take my insurance?", "Are you open Saturdays?", "How much is a cleaning?"][i]} className={input} /></Field>
                  ))}
                </>)}

                {step === 3 && (<>
                  <div className="rounded-2xl border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div role="radiogroup" aria-label="Plan" className="inline-flex flex-wrap rounded-full bg-muted p-0.5 text-xs font-bold">
                        {PLANS.map((p) => (
                          <button key={p.id} type="button" role="radio" aria-checked={plan === p.id} onClick={() => setValue("plan", p.id)} className={`rounded-full px-3 py-1.5 ${plan === p.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{p.name}</button>
                        ))}
                      </div>
                      <div role="radiogroup" aria-label="Billing period" className="inline-flex rounded-full bg-muted p-0.5 text-xs font-bold">
                        {(["monthly", "yearly"] as const).map((b) => (
                          <button key={b} type="button" role="radio" aria-checked={billing === b} onClick={() => setValue("billing", b)} className={`rounded-full px-3 py-1.5 ${billing === b ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{b === "monthly" ? "Monthly" : "Yearly"}</button>
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm"><b className="text-2xl tabular-nums">{formatUsd(billing === "yearly" ? chosen.yearly : chosen.monthly)}</b>/month · billed {billing} · after your 14-day free trial</p>
                  </div>
                  <label className="flex gap-3 text-xs text-muted-foreground">
                    <input type="checkbox" {...register("consent_sms_account")} className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
                    <span>{CONSENT_SMS}</span>
                  </label>
                  <label className="flex gap-3 text-xs text-muted-foreground">
                    <input type="checkbox" {...register("consent_marketing")} className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
                    <span>{CONSENT_MARKETING}</span>
                  </label>
                  <p className="text-sm">After setup, your instant test call is recorded and the recording is emailed to you.</p>
                  <p className="text-xs text-muted-foreground">
                    <a href={LEGAL.privacy} target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a> ·{" "}
                    <a href={LEGAL.terms} target="_blank" rel="noopener noreferrer" className="underline">Terms of Service</a>
                  </p>
                  {serverError && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive">{serverError}</p>}
                </>)}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex gap-3">
              {step > 0 && <button type="button" onClick={back} className="rounded-full border bg-card px-6 py-3 font-bold">Back</button>}
              {step < STEPS.length - 1 ? (
                <button key="next" type="button" onClick={next} className="flex-1 rounded-full bg-primary py-3 font-bold text-primary-foreground shadow-glow hover:bg-primary-deep">Continue →</button>
              ) : (
                <button key="submit" type="button" onClick={onSubmit} disabled={isSubmitting} className="flex-1 rounded-full bg-primary py-3 font-bold text-primary-foreground shadow-glow hover:bg-primary-deep disabled:opacity-60">
                  {isSubmitting ? "Booking…" : "Book a Free Trial"}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
