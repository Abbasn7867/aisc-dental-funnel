import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import amy from "@/assets/amy.png.asset.json";
import desk from "@/assets/front-desk.png.asset.json";
import { CookieBanner, CtaButton, Footer, Nav } from "@/components/site";
import { AGENTS, PLANS, formatUsd, planPrice, type Billing } from "@/lib/funnel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Complete AI Front Office for Dental Practices | AI Solution Company" },
      { name: "description", content: "Amy and 7 more AI employees answer calls 24/7, book appointments and follow up with patients. Start a 14-day free trial of the full platform." },
      { property: "og:title", content: "The Complete AI Front Office for Dental Practices" },
      { property: "og:description", content: "8 AI employees led by Amy, your AI receptionist. 14-day free trial, $0 setup during launch." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-28 px-6 pt-28">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-4xl font-extrabold md:text-5xl">{title}</h2>
      <div className="mt-12">{children}</div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="blob -left-20 top-10 h-96 w-96 bg-accent" />
      <div className="blob right-0 top-40 h-[28rem] w-[28rem] bg-primary" style={{ animationDelay: "-6s" }} />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-10 pt-16 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold">
            <span className="pulse-ring h-2.5 w-2.5 rounded-full bg-accent" /> Answering calls 24/7, nights, weekends &amp; holidays
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] md:text-7xl">
            Every call answered. <span className="text-gradient">Every chair filled.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            The Complete AI Front Office from AI Solution Company gives your dental practice 8 AI employees, led by Amy, your AI receptionist. They take the phones, scheduling and follow-up so your front desk can focus on the patients in front of them.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CtaButton size="lg" />
            <a href="#pricing" className="font-bold text-primary underline-offset-4 hover:underline">See pricing</a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-muted-foreground">
            <li>✓ 14-day free trial, full platform</li>
            <li>✓ Setup <s>$1,000</s> $0 during launch</li>
            <li>✓ $250 bonus credits</li>
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded-[2rem] shadow-soft ring-8 ring-card">
            <img src={amy.url} alt="Amy, the AI receptionist, wearing a headset at a dental front desk" className="h-[30rem] w-full object-cover" />
          </div>
          <div className="glass float-y absolute -left-10 top-10 rounded-2xl p-4 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Incoming call · 11:42 pm</p>
            <p className="mt-1 font-bold">Amy answered in 1 ring</p>
          </div>
          <div className="glass float-y absolute -right-8 bottom-12 rounded-2xl p-4 shadow-soft" style={{ animationDelay: "-3s" }}>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Booked</p>
            <p className="mt-1 font-bold">Cleaning · Tue 9:30 am</p>
            <div className="mt-2 h-1.5 w-40 rounded-full bg-signature" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <Section id="team" eyebrow="Meet your AI team" title={<>Eight AI employees. <span className="text-gradient">One calm front desk.</span></>}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {AGENTS.map((a, i) => (
          <article key={a.name} className="group rounded-3xl border bg-card p-6 shadow-soft transition hover:-translate-y-1.5">
            <div className="flex items-center gap-3">
              <div className={`grid h-12 w-12 place-items-center rounded-full ring-4 ring-offset-2 ${a.ring} ${i === 0 ? "" : a.color} overflow-hidden font-extrabold text-primary-foreground`}>
                {i === 0 ? <img src={amy.url} alt="" className="h-full w-full object-cover object-top" /> : a.name[0]}
              </div>
              <div>
                <h3 className="text-lg font-extrabold">{a.name}</h3>
                <p className="text-sm text-muted-foreground">{a.role}</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">{a.area}</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold">
              <span className={`h-2 w-2 rounded-full ${a.color}`} /> Owns {a.count} pain points
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function How() {
  const steps = [
    ["Book your free trial", "Share your business details. You go straight to your dashboard."],
    ["Quick Start in about 10 minutes", "Hours, services and FAQs, Amy's greeting, your scheduling software and team invites."],
    ["Your instant test call", "We assign your own phone number. A test caller asks real questions from your FAQs and Amy answers live."],
    ["Hear it in 3–4 minutes", "The recording lands on your dashboard and in your inbox."],
  ];
  return (
    <Section id="how" eyebrow="How it works" title={<>Live in minutes, <span className="text-gradient">not months.</span></>}>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <ol className="space-y-5">
          {steps.map(([t, d], i) => (
            <li key={t} className="flex gap-5 rounded-3xl border bg-card p-6 shadow-soft">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-signature text-lg font-extrabold text-primary-foreground">{i + 1}</span>
              <div>
                <h3 className="text-lg font-extrabold">{t}</h3>
                <p className="mt-1 text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
          <p className="px-2 text-sm text-muted-foreground">
            Prefer not to set it up yourself? Share your information and our team configures everything at no cost during launch (normally $1,000). Your instant test call is recorded, and the recording is sent to the email you provide.
          </p>
        </ol>
        <div className="relative">
          <img src={desk.url} alt="A calm, modern dental front desk with a receptionist wearing a headset" className="rounded-[2rem] shadow-soft" loading="lazy" />
          <figure className="glass absolute -bottom-8 left-6 right-6 rounded-2xl p-5 shadow-soft">
            <figcaption className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Test call transcript</figcaption>
            <p className="mt-2 text-sm"><b>Amy:</b> All calls are recorded for quality and training purposes. Thanks for calling, this is Amy. How can I help?</p>
            <p className="mt-1 text-sm"><b>Caller:</b> Are you open Saturday?</p>
          </figure>
        </div>
      </div>
    </Section>
  );
}

function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  return (
    <Section id="pricing" eyebrow="Pricing" title={<>Simple plans. <span className="text-gradient">Full platform in every trial.</span></>}>
      <div role="radiogroup" aria-label="Billing period" className="glass inline-flex rounded-full p-1 shadow-soft">
        {(["monthly", "yearly"] as const).map((b) => (
          <button
            key={b}
            role="radio"
            aria-checked={billing === b}
            onClick={() => setBilling(b)}
            className={`rounded-full px-6 py-2 text-sm font-bold capitalize transition ${billing === b ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            {b === "monthly" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {PLANS.map((p) => (
          <article
            key={p.id}
            className={`relative flex flex-col rounded-3xl p-8 shadow-soft ${p.popular ? "bg-ink text-ink-foreground lg:-translate-y-4" : "border bg-card"}`}
          >
            {p.popular && <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-accent-foreground">Most Popular</span>}
            <h3 className="text-2xl font-extrabold">{p.name}</h3>
            <p className={`mt-2 text-sm ${p.popular ? "opacity-80" : "text-muted-foreground"}`}>{p.blurb}</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl font-extrabold tracking-tight">{formatUsd(planPrice(p, billing))}</span>
              <span className="pb-2 text-sm opacity-80">/month</span>
              {billing === "yearly" && <span className="mb-2 rounded-full bg-mint-soft px-2 py-0.5 text-xs font-extrabold text-foreground">Save 12%</span>}
            </div>
            <p className="mt-1 text-sm opacity-80">billed {billing}</p>
            <ul className="mt-6 flex-1 space-y-2 text-sm">
              {p.features.map((f) => <li key={f}>✓ {f}</li>)}
              <li>✓ 14-day free trial · Setup <s>$1,000</s> $0 · $250 bonus credits</li>
            </ul>
            <CtaButton className="mt-8 w-full" />
          </article>
        ))}
      </div>
      <p className="mt-8 text-center text-muted-foreground">
        Need Billing, Credentialing, Payor Negotiation and more?{" "}
        <a href="mailto:hello@aisolutioncompany.com" className="font-bold text-primary underline">Talk to our team</a>
      </p>
      <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-muted-foreground">
        Choose monthly or yearly billing. Monthly plans are month-to-month with no long-term contract — cancel anytime before your next billing date. Prefer yearly? Pay annually and save 12% on any plan.
      </p>
      <p className="mx-auto mt-2 max-w-3xl text-center text-sm text-muted-foreground">
        $250 in free credits applies to call minutes, roughly 250 minutes of live call time handled by your AI team.
      </p>
    </Section>
  );
}

function Faq() {
  const faqs = [
    ["Is the free trial the full product?", "Yes. 14 days of the full platform, with nothing locked."],
    ["Does Amy give dental advice?", "No. Amy handles front-office tasks and routes clinical questions to your staff. Dental emergencies follow your practice's urgent protocol."],
    ["How does Amy answer insurance questions?", "Only from the knowledge base your practice approves."],
    ["Is it secure?", "We run on secure, enterprise-grade cloud infrastructure. We're HIPAA compliant and SOC 2 compliant, and a BAA is available."],
    ["Will this take over my front desk's job?", "No. Your AI team supports your staff so they can spend more time with patients in person."],
    ["Can I cancel?", "Monthly plans are month-to-month with no long-term contract. Cancel anytime before your next billing date."],
  ];
  return (
    <Section id="faq" eyebrow="FAQ" title="Questions practice owners ask">
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map(([q, a]) => (
          <details key={q} className="group rounded-2xl border bg-card p-6 shadow-soft">
            <summary className="cursor-pointer list-none font-extrabold">{q}</summary>
            <p className="mt-3 text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-28">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-signature p-12 text-center text-primary-foreground shadow-glow md:p-20">
        <h2 className="text-4xl font-extrabold md:text-6xl">Let Amy take tonight's calls.</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg opacity-95">14 days of the full platform. $0 setup during launch. $250 bonus credits.</p>
        <CtaButton size="lg" className="mt-8 bg-ink hover:bg-ink" />
      </div>
    </section>
  );
}

function Index() {
  return (
    <div>
      <Nav />
      <main>
        <Hero />
        <Team />
        <How />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
