import { motion, useInView } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { CalendarPlus, PhoneCall, Rocket, Settings2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PLANS, formatUsd, planPrice, type Billing } from "@/lib/funnel";
import { CtaButton } from "@/components/site";
import { CATEGORY_META, OfferLine, SectionHead, Strike } from "./shared";

const HOW = [
  { icon: CalendarPlus, title: "Book a Free Trial", text: "Takes about 2 minutes.", photo: CATEGORY_META.c1.photo },
  { icon: Settings2, title: "Set up your profile", text: <>Profile, FAQs and greeting from your dashboard in about 10 minutes, or let our team do it for you (setup <Strike>$1,000</Strike> $0).</>, photo: CATEGORY_META.c2.photo },
  { icon: PhoneCall, title: "Your number + instant test call", text: "Your own number, and a recorded test call in 3–4 minutes.", photo: CATEGORY_META.c3.photo },
  { icon: Rocket, title: "Go live, 24/7", text: "Your AI front office starts answering, booking and following up.", photo: CATEGORY_META.c9.photo },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-150px" });
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
      <SectionHead center eyebrow="How it works" title={<>Four steps to <span className="text-gradient">always answering.</span></>} />
      <div ref={ref} className="relative mt-16">
        <svg className="absolute left-0 right-0 top-[5.5rem] hidden h-2 w-full lg:block" preserveAspectRatio="none" viewBox="0 0 100 2" aria-hidden>
          <motion.line x1="10" y1="1" x2="90" y2="1" stroke="var(--primary)" strokeWidth="0.4" strokeDasharray="1.5 1.2" initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.8, ease: "easeInOut" }} />
        </svg>
        <svg className="absolute bottom-10 left-8 top-10 w-2 lg:hidden" preserveAspectRatio="none" viewBox="0 0 2 100" aria-hidden>
          <motion.line x1="1" y1="0" x2="1" y2="100" stroke="var(--primary)" strokeWidth="0.6" strokeDasharray="2 2" initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.8 }} />
        </svg>
        <ol className="relative grid gap-6 pl-14 lg:grid-cols-4 lg:pl-0">
          {HOW.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0.35, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.4 }}
              className="overflow-hidden rounded-3xl border bg-card shadow-soft"
            >
              <div className="relative h-28">
                <img src={s.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute -bottom-6 left-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary text-lg font-extrabold text-primary-foreground shadow-glow ring-4 ring-card">{i + 1}</span>
              </div>
              <div className="p-5 pt-9">
                <s.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-2 font-extrabold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const VAS = [
  ["Instant proof call", "Your own number and a live test call where Amy answers your FAQs, with the recording in 3–4 minutes."],
  ["Self-serve or done-for-you setup", "Set up in minutes from your dashboard, or share your information and we configure it (normally $1,000, waived during launch)."],
  ["Trisha's real-time performance view", "Calls answered, bookings, follow-ups and every agent's results in one dashboard."],
  ["Add-on services", "Billing, Credentialing, Payor Negotiation, Utilization Management, Eligibility Verification, Claims Follow-up, A/R Recovery, Payor Contract Audit and Fee Benchmarking, quoted separately."],
];

export function ValueServices() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHead eyebrow="Value-added services" title="More than an answering service." />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {VAS.map(([t, d]) => (
          <div key={t} className="rounded-3xl border bg-card p-6 shadow-soft transition hover:-translate-y-1">
            <h3 className="text-lg font-extrabold">{t}</h3>
            <p className="mt-2 text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LandingPricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
      <SectionHead center eyebrow="Pricing" title={<>Simple plans. <span className="text-gradient">Full platform in every trial.</span></>} />
      <div className="mt-8 flex justify-center">
        <span className="rounded-full bg-signature px-5 py-2 text-sm font-extrabold text-primary-foreground shadow-glow"><OfferLine /></span>
      </div>
      <div className="mt-8 flex justify-center">
        <div role="radiogroup" aria-label="Billing period" className="glass relative inline-flex rounded-full p-1 shadow-soft">
          {(["monthly", "yearly"] as const).map((b) => (
            <button key={b} role="radio" aria-checked={billing === b} onClick={() => setBilling(b)} className="relative z-10 rounded-full px-7 py-2 text-sm font-bold">
              {billing === b && <motion.span layoutId="bill-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: "spring", stiffness: 300, damping: 26 }} />}
              <span className={billing === b ? "text-primary-foreground" : "text-muted-foreground"}>{b === "monthly" ? "Monthly" : "Yearly"}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {PLANS.map((p) => (
          <article key={p.id} className={`relative flex flex-col rounded-3xl p-8 ${p.popular ? "bg-ink text-ink-foreground shadow-glow ring-2 ring-accent lg:-translate-y-4" : "border bg-card shadow-soft"}`}>
            {p.popular && <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-accent-foreground">Most Popular</span>}
            <h3 className="text-2xl font-extrabold">{p.name}</h3>
            <p className={`mt-2 text-sm ${p.popular ? "opacity-80" : "text-muted-foreground"}`}>{p.blurb}</p>
            <div className="mt-6 flex items-end gap-2">
              <motion.span key={`${p.id}-${billing}`} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-extrabold tracking-tight tabular-nums">
                {formatUsd(planPrice(p, billing))}
              </motion.span>
              <span className="pb-2 text-sm opacity-80">/month</span>
              {billing === "yearly" && <span className="mb-2 rounded-full bg-mint-soft px-2 py-0.5 text-xs font-extrabold text-foreground">Save 12%</span>}
            </div>
            <p className="mt-1 text-sm opacity-80">billed {billing}</p>
            <ul className="mt-6 flex-1 space-y-2 text-sm">
              {p.features.map((f) => <li key={f}>✓ {f}</li>)}
              <li>✓ 14-day free trial · Setup <Strike>$1,000</Strike> $0 · $250 bonus credits</li>
            </ul>
            <Link
              to="/free-trial"
              search={{ plan: p.id, billing }}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:bg-primary-deep"
            >
              Book a Free Trial →
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-8 text-center text-muted-foreground">
        Need Billing, Credentialing, Payor Negotiation and more? <Link to="/free-trial" className="font-bold text-primary underline">Talk to our team</Link>
      </p>
      <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-muted-foreground">
        Choose monthly or yearly billing. Monthly plans are month-to-month with no long-term contract — cancel anytime before your next billing date. Prefer yearly? Pay annually and save 12% on any plan.
      </p>
    </section>
  );
}

const FAQ = [
  ["How fast can we go live?", "Most practices finish the Quick Start checklist in about 10 minutes, and your instant test call arrives 3–4 minutes after setup. Prefer not to do it yourself? Our team will set everything up at no cost during launch."],
  ["What is the instant test call?", "Right after setup we give your practice its own phone number. Our test caller rings it and asks real questions from your FAQs, Amy answers live, and the recording lands on your dashboard and in your inbox."],
  ["Which calendars and software does it work with?", "Amy works with the calendar and practice-management software you already use; we connect it during setup. Ask us about yours."],
  ["What happens after the 14-day trial?", "You choose the plan that fits, monthly or yearly. Nothing is locked during the trial, so you'll know exactly what you're getting."],
  ["Can calls transfer to my staff?", "Yes. When a caller asks for a person, Amy routes them to the right staff member and logs the reason so nothing gets lost."],
  ["Does Amy give dental advice?", "No. Amy handles front-office tasks and routes clinical questions to your staff. Dental emergencies follow your practice's urgent protocol."],
  ["Is our data secure?", "Yes. We're HIPAA compliant and SOC 2 compliant, and a BAA is available on request. Everything runs on secure, enterprise-grade cloud infrastructure."],
  ["Is there a contract?", "Choose monthly or yearly billing. Monthly plans are month-to-month with no long-term contract — cancel anytime before your next billing date. Prefer yearly? Pay annually and save 12% on any plan."],
  ["What do the $250 bonus credits cover?", "Your $250 bonus credits are applied to call minutes, roughly 250 minutes of live calls handled by your AI team."],
  ["Will this replace my front desk team?", "No. Your AI team takes the phones, paperwork and follow-up so your staff can focus on the patients in front of them."],
];

export function LandingFaq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-28">
      <SectionHead center eyebrow="FAQ" title="Questions practice owners ask" />
      <Accordion type="single" collapsible className="mt-10 space-y-3">
        {FAQ.map(([q, a], i) => (
          <AccordionItem key={q} value={`q${i}`} className="rounded-2xl border bg-card px-5 shadow-soft">
            <AccordionTrigger className="text-left text-base font-extrabold hover:no-underline">{q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function FinalBand() {
  return (
    <section className="px-4 pt-10">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-signature p-12 text-center text-primary-foreground shadow-glow md:p-20">
        <div className="blob left-1/4 top-0 h-64 w-64 bg-card opacity-20" />
        <h2 className="relative text-4xl font-extrabold md:text-6xl">Your patients are calling. Let Amy answer.</h2>
        <CtaButton size="lg" className="relative mt-8 bg-ink hover:bg-ink" />
        <p className="relative mt-5 font-semibold opacity-95"><OfferLine /></p>
      </div>
    </section>
  );
}
