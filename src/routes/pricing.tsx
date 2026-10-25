import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { CtaButton, Footer, Nav } from "@/components/site";
import { LandingPricing } from "@/components/landing/convert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AGENTS, type AgentKey } from "@/data/painPoints";
import { PLANS } from "@/lib/funnel";
import { PLAN_AGENTS, type PlanId } from "@/lib/configurator";
import { AGENT_ORDER } from "@/components/landing/shared";
import { seoMeta } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () =>
    seoMeta(
      "/pricing",
      "Pricing | AI Front Office for Dental Practices | AI Solution Company",
      "Receptionist, Pro and Full Team plans. The full platform free for 14 days, $0 setup during launch and $250 bonus credits.",
    ),
  component: PricingPage,
});

const PLAN_IDS: PlanId[] = ["receptionist", "pro", "full"];
const has = (p: PlanId, a: AgentKey) => PLAN_AGENTS[p].includes(a);

const CAPS: { label: string; agent: AgentKey | null; plans: PlanId[] }[] = [
  { label: "24/7 answering", agent: "amy", plans: PLAN_IDS },
  { label: "Booking", agent: "amy", plans: PLAN_IDS },
  { label: "Instant test call", agent: "amy", plans: PLAN_IDS },
  { label: "Intake", agent: "morgan", plans: PLAN_IDS.filter((p) => has(p, "morgan")) },
  { label: "Follow-up", agent: "stephanie", plans: PLAN_IDS.filter((p) => has(p, "stephanie")) },
  { label: "Reviews", agent: "elise", plans: PLAN_IDS.filter((p) => has(p, "elise")) },
  { label: "Documents", agent: "joseph", plans: PLAN_IDS.filter((p) => has(p, "joseph")) },
  { label: "Performance reporting", agent: "trisha", plans: PLAN_IDS.filter((p) => has(p, "trisha")) },
];

const BILLING_TERMS =
  "Your free trial is the full version and needs no credit card. When it ends, choose a monthly plan (month-to-month, cancel anytime) or a yearly plan to save 12%. Bonus credits expire 90 days after sign-up.";

const FAQ: [string, string][] = [
  ["What happens after the 14-day trial?", "You choose the plan that fits, monthly or yearly (yearly saves 12%). Nothing is locked during the trial, so you'll know exactly what you're getting."],
  ["What are the billing terms?", BILLING_TERMS],
  ["What do the $250 bonus credits cover?", "Your $250 bonus credits are applied to call minutes, roughly 250 minutes of live calls handled by your AI team."],
  ["Is there a setup fee?", "Setup is normally $1,000. It's waived during launch, so you pay $0."],
  ["Can I switch plans later?", "Yes. Upgrade or downgrade anytime; the change applies from your next billing date."],
];

function Cell({ on, color }: { on: boolean; color: string }) {
  return on ? <Check className="mx-auto h-5 w-5" style={{ color }} aria-label="Included" /> : <Minus className="mx-auto h-4 w-4 text-muted-foreground" aria-label="Not included" />;
}

function PricingPage() {
  return (
    <div>
      <Nav />
      <main>
        <section className="mx-auto max-w-4xl px-6 pb-4 pt-20 text-center">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Simple pricing. <span className="text-gradient">The full platform, free for 14 days.</span>
          </motion.h1>
          <div className="mt-8"><CtaButton size="lg" /></div>
        </section>

        <LandingPricing />

        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-3xl font-extrabold tracking-tight">Compare plans</h2>
          <div className="mt-6 overflow-x-auto rounded-3xl border bg-card shadow-soft">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-5 py-4 text-left font-extrabold">What's included</th>
                  {PLANS.map((p) => <th key={p.id} className="px-4 py-4 text-center font-extrabold">{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={4} className="bg-muted/30 px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">AI employees</td></tr>
                {AGENT_ORDER.map((a) => (
                  <tr key={a} className="border-b last:border-0">
                    <td className="px-5 py-3"><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: AGENTS[a].color }} /><b>{AGENTS[a].name}</b> <span className="text-muted-foreground">· {AGENTS[a].role}</span></td>
                    {PLAN_IDS.map((p) => <td key={p} className="px-4 py-3"><Cell on={has(p, a)} color={AGENTS[a].color} /></td>)}
                  </tr>
                ))}
                <tr><td colSpan={4} className="bg-muted/30 px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Capabilities</td></tr>
                {CAPS.map((c) => (
                  <tr key={c.label} className="border-b">
                    <td className="px-5 py-3 font-semibold">{c.label}</td>
                    {PLAN_IDS.map((p) => <td key={p} className="px-4 py-3"><Cell on={c.plans.includes(p)} color={c.agent ? AGENTS[c.agent].color : "var(--primary)"} /></td>)}
                  </tr>
                ))}
                <tr>
                  <td className="px-5 py-3 font-semibold">Value-added services</td>
                  {PLAN_IDS.map((p) => <td key={p} className="px-4 py-3 text-center text-xs font-bold text-muted-foreground">Add-on, quoted separately</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-8">
          <div className="grid gap-6 rounded-3xl bg-ink p-8 text-ink-foreground shadow-glow sm:grid-cols-2 sm:p-12">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wider opacity-70">Launch offer</p>
              <p className="mt-3 text-2xl font-extrabold">Setup</p>
              <p className="mt-1 text-5xl font-extrabold tabular-nums">
                <span className="relative inline-block opacity-75">$1,000
                  <motion.span aria-hidden initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="absolute left-0 top-1/2 h-1 w-full origin-left rounded-full bg-accent" />
                </span>{" "}
                <motion.span initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", delay: 0.9 }} className="inline-block text-accent">$0</motion.span>
              </p>
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wider opacity-70">Plus</p>
              <p className="mt-3 text-2xl font-extrabold">$250 bonus credits</p>
              <p className="mt-1 opacity-80">Applied to call minutes, roughly 250 minutes of live calls.</p>
              <div className="mt-6"><CtaButton /></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-3xl font-extrabold tracking-tight">Pricing FAQ</h2>
          <Accordion type="single" collapsible className="mt-6">
            {FAQ.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-left font-bold">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
      <Footer />
    </div>
  );
}
