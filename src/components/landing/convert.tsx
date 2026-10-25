import { motion, useInView } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { CalendarPlus, PhoneCall, Rocket, Settings2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PLANS, SHOW_PRICES, formatUsd, planPrice, type Billing } from "@/lib/funnel";
import { CtaButton } from "@/components/site";
import { CATEGORY_META, OfferLine, SectionHead, Strike } from "./shared";
import pricingBand from "@/assets/landing/band-pricing.webp";
import pricingBandMobile from "@/assets/landing/band-pricing-mobile.webp";
import finalBand from "@/assets/landing/band-final.webp";

const HOW = [
  { icon: CalendarPlus, title: "Book a Free Trial", text: "Pick your plan and tell us about your practice.", photo: CATEGORY_META.c1.photo, focus: CATEGORY_META.c1.focus },
  { icon: Settings2, title: "Set Up Your Profile", text: <>Get set up in minutes with the Setup Wizard, or let our team do it for you (setup <Strike>$1,000</Strike> $0).</>, photo: CATEGORY_META.c2.photo, focus: CATEGORY_META.c2.focus },
  { icon: PhoneCall, title: "Your Booking Line + Instant Test Call", text: "Your own booking line, and a recorded test call in 3–4 minutes.", photo: CATEGORY_META.c3.photo, focus: CATEGORY_META.c3.focus },
  { icon: Rocket, title: "Go Live, 24/7", text: "Your AI front office starts answering, booking and following up.", photo: CATEGORY_META.c9.photo, focus: CATEGORY_META.c9.focus },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-150px" });
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
      <SectionHead center eyebrow="How it works" title={<>Four Steps to <span className="text-gradient">Always Answering.</span></>} />
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
              <div className="relative aspect-[4/3]">
                <img src={s.photo} alt="" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: s.focus }} />
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
  ["Instant Test Call", "Your own booking line and a live test call where Amy answers your FAQs, with the recording in 3–4 minutes."],
  ["Self-serve or done-for-you setup", "Set up in minutes from your dashboard, or share your information and we configure it (normally $1,000, waived during launch)."],
  ["Trisha's real-time performance view", "Calls answered, bookings, follow-ups and every agent's results in one dashboard."],
  ["Add-on services", "Billing, Credentialing, Payor Negotiation, Utilization Management, Eligibility Verification, Claims Follow-up, A/R Recovery, Payor Contract Audit and Fee Benchmarking, quoted separately."],
];

export function ValueServices() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHead eyebrow="Value-added services" title="More Than an Answering Service." />
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
      <div className="relative flex min-h-[420px] items-center overflow-hidden rounded-[2.5rem] bg-ink p-8 text-ink-foreground shadow-soft md:min-h-[360px] md:p-14">
        <picture>
          <source media="(max-width: 767px)" srcSet={pricingBandMobile} />
          <img src={pricingBand} alt="Clean dental instruments on a tray beside a dental chair in a sunlit operatory" loading="lazy" width={1584} height={672} className="absolute inset-0 h-full w-full object-cover object-right" />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--ink)_0%,var(--ink)_35%,color-mix(in_oklab,var(--ink)_70%,transparent)_55%,transparent_75%)] md:bg-[linear-gradient(to_right,var(--ink)_0%,var(--ink)_50%,color-mix(in_oklab,var(--ink)_70%,transparent)_65%,transparent_85%)]" />
        <div className="relative max-w-xl md:max-w-[52%]">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Pricing</p>
          <h2 className="mt-3 text-4xl font-extrabold leading-[1.05] md:text-5xl">
            <span className="text-ink-foreground">Simple plans.</span>{" "}
            <span className="text-[#8FD0FF]">Full platform</span>{" "}
            <span className="text-accent">in every trial.</span>
          </h2>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <span className="rounded-full bg-[linear-gradient(120deg,var(--primary),oklch(0.4_0.09_200))] px-5 py-2 text-sm font-extrabold text-primary-foreground shadow-glow"><OfferLine /></span>
      </div>
      <div className="mt-8 flex justify-center">
        {SHOW_PRICES ? (
          <div role="radiogroup" aria-label="Billing period" className="glass relative inline-flex rounded-full p-1 shadow-soft">
            {(["monthly", "yearly"] as const).map((b) => (
              <button key={b} role="radio" aria-checked={billing === b} onClick={() => setBilling(b)} className="relative z-10 rounded-full px-7 py-2 text-sm font-bold">
                {billing === b && <motion.span layoutId="bill-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: "spring", stiffness: 300, damping: 26 }} />}
                <span className={billing === b ? "text-primary-foreground" : "text-muted-foreground"}>{b === "monthly" ? "Monthly" : "Yearly"}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Choose your plan after the trial — monthly or yearly (yearly saves 12%).</p>
        )}
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {PLANS.map((p) => (
          <article key={p.id} className={`relative flex flex-col rounded-3xl p-8 ${p.popular ? "bg-ink text-ink-foreground shadow-glow ring-2 ring-accent lg:-translate-y-4" : "border bg-card shadow-soft"}`}>
            {p.popular && <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-accent-foreground">Most Popular</span>}
            <h3 className="text-2xl font-extrabold">{p.name}</h3>
            <p className={`mt-2 text-sm ${p.popular ? "opacity-80" : "text-muted-foreground"}`}>{p.blurb}</p>
            {SHOW_PRICES ? (
              <>
                <div className="mt-6 flex items-end gap-2">
                  <motion.span key={`${p.id}-${billing}`} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-extrabold tracking-tight tabular-nums">
                    {formatUsd(planPrice(p, billing))}
                  </motion.span>
                  <span className="pb-2 text-sm opacity-80">/month</span>
                  {billing === "yearly" && <span className="mb-2 rounded-full bg-mint-soft px-2 py-0.5 text-xs font-extrabold text-foreground">Save 12%</span>}
                </div>
                <p className="mt-1 text-sm opacity-80">billed {billing}</p>
              </>
            ) : (
              <>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-5xl font-extrabold tracking-tight tabular-nums">$0</span>
                  <span className="pb-2 text-sm opacity-80">for 14 days</span>
                </div>
                <p className="mt-1 text-sm font-bold">No credit card required</p>
                <p className="mt-0.5 text-xs opacity-80">Full version · Setup <Strike>$1,000</Strike> $0</p>
              </>
            )}
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
            {!SHOW_PRICES && <p className="mt-2 text-center text-xs opacity-80">Full version. No credit card. Ready in minutes.</p>}
          </article>
        ))}
      </div>
      <p className="mt-8 text-center text-muted-foreground">
        Need Billing, Credentialing, Payor Negotiation and more? <Link to="/free-trial" className="font-bold text-primary underline">Talk to our team</Link>
      </p>
      <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-muted-foreground">
        {SHOW_PRICES
          ? "Choose monthly or yearly billing. Monthly plans are month-to-month with no long-term contract — cancel anytime before your next billing date. Prefer yearly? Pay annually and save 12% on any plan."
          : "Your free trial is the full version and needs no credit card. When it ends, choose a monthly plan (month-to-month, cancel anytime) or a yearly plan to save 12%. Bonus credits expire 90 days after sign-up."}
      </p>
    </section>
  );
}

const FAQ = [
  ["How fast can we go live?", "Most practices finish the Setup Wizard in minutes, and your instant test call arrives 3–4 minutes after setup. Prefer not to do it yourself? Our team will set everything up at no cost during launch."],
  ["What is the instant test call?", "Right after setup we give your practice its own phone number. Our test caller rings it and asks real questions from your FAQs, Amy answers live, and the recording lands on your dashboard and in your inbox."],
  ["Which calendars and software does it work with?", "Amy works with the calendar and practice-management software you already use; we connect it during setup. Ask us about yours."],
  ["What happens after the 14-day trial?", "You choose the plan that fits, monthly or yearly. Nothing is locked during the trial, so you'll know exactly what you're getting."],
  ["Can calls transfer to my staff?", "Yes. When a caller asks for a person, Amy routes them to the right staff member and logs the reason so nothing gets lost."],
  ["Does Amy give dental advice?", "No. Amy handles front-office tasks and routes clinical questions to your staff. Dental emergencies follow your practice's urgent protocol."],
  ["Is our data secure?", "Yes. We're HIPAA compliant and SOC 2 compliant, and a BAA is available on request. Everything runs on secure, enterprise-grade cloud infrastructure."],
  ["Is there a contract?", "Your free trial is the full version and needs no credit card. When it ends, choose a monthly plan (month-to-month, cancel anytime) or a yearly plan to save 12%. Bonus credits expire 90 days after sign-up."],
  ["What do the $250 bonus credits cover?", "Your $250 bonus credits are applied to call minutes, roughly 250 minutes of live calls handled by your AI team."],
  ["Will this replace my front desk team?", "No. Your AI team takes the phones, paperwork and follow-up so your staff can focus on the patients in front of them."],
];

export function LandingFaq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-28">
      <SectionHead center eyebrow="FAQ" title="Questions Practice Owners Ask" />
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
      <div className="relative mx-auto flex min-h-[420px] max-w-6xl flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-ink p-10 text-center text-ink-foreground shadow-glow md:min-h-[360px] md:items-end md:p-20 md:text-right">
        {/* People sit in the left third, so the text and the dark side of the overlay go right */}
        <img src={finalBand} alt="A family checking in at a bright, calm dental reception desk" loading="lazy" width={1920} height={832} className="absolute inset-0 h-full w-full object-cover object-[20%_35%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20 md:bg-gradient-to-l md:from-ink md:via-ink/85 md:to-ink/0" />
        <h2 className="relative max-w-xl text-4xl font-extrabold md:text-6xl">Your Patients Are Calling. Let Amy Answer.</h2>
        <CtaButton size="lg" className="relative mt-8 bg-ink hover:bg-ink" />
        <p className="relative mt-5 max-w-xl font-semibold opacity-95"><OfferLine /></p>
      </div>
    </section>
  );
}
