import { AnimatePresence, motion, useInView } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AGENTS, CATEGORIES, type AgentKey } from "@/data/painPoints";
import { PLANS, SHOW_PRICES, formatUsd } from "@/lib/funnel";
import { ALL_PAIN_IDS, PLAN_AGENTS, idsForAgents, recommendPlan } from "@/lib/configurator";
import { AGENT_ORDER, AgentChip, SectionHead } from "./shared";

const spring = { type: "spring" as const, stiffness: 380, damping: 28 };

function Switch({ on, onChange, label, color }: { on: boolean; onChange: () => void; label: string; color: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className="relative h-6 w-11 shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{ backgroundColor: on ? color : "var(--muted)" }}
    >
      <motion.span layout transition={spring} className="absolute top-0.5 h-4.5 w-4.5 rounded-full bg-card shadow" style={{ left: on ? "calc(100% - 1.25rem)" : "0.125rem", width: 18, height: 18 }} />
    </button>
  );
}

function Summary({ enabled }: { enabled: Set<string> }) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const stats = AGENT_ORDER.map((k) => {
    const all = idsForAgents([k]);
    return { k, total: all.length, on: all.filter((id) => enabled.has(id)).length };
  });
  const activeAgents = stats.filter((s) => s.on > 0).length;
  const pct = Math.round((enabled.size / ALL_PAIN_IDS.length) * 100);
  const planId = recommendPlan(enabled);
  const plan = PLANS.find((p) => p.id === planId)!;
  const price = billing === "yearly" ? plan.yearly : plan.monthly;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Agent utilization</h3>
        <ul className="mt-3 space-y-2">
          {stats.map(({ k, total, on }) => (
            <li key={k} className={`transition-opacity ${on === 0 ? "opacity-40 grayscale" : ""}`}>
              <div className="flex justify-between text-xs font-bold"><span>{AGENTS[k].name}</span><span className="tabular-nums">{on} of {total}</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: on === 0 ? "var(--muted-foreground)" : AGENTS[k].color }} animate={{ width: `${(on / total) * 100}%` }} transition={spring} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-muted p-3"><p className="text-2xl font-extrabold tabular-nums">{activeAgents} of 8</p><p className="text-xs text-muted-foreground">agents in scope</p></div>
        <div className="rounded-2xl bg-muted p-3"><p className="text-2xl font-extrabold tabular-nums">{pct}%</p><p className="text-xs text-muted-foreground">{enabled.size} of {ALL_PAIN_IDS.length} mapped pain points</p></div>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Recommended plan</h3>
          {SHOW_PRICES && (
            <div role="radiogroup" aria-label="Billing period" className="inline-flex rounded-full bg-muted p-0.5 text-xs font-bold">
              {(["monthly", "yearly"] as const).map((b) => (
                <button key={b} role="radio" aria-checked={billing === b} onClick={() => setBilling(b)} className={`rounded-full px-3 py-1 ${billing === b ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{b === "monthly" ? "Monthly" : "Yearly"}</button>
              ))}
            </div>
          )}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={planId} initial={{ opacity: 0, scale: 0.92, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} transition={spring} className="rounded-2xl bg-ink p-5 text-ink-foreground ring-2 ring-accent">
            <p className="text-lg font-extrabold">{plan.name}</p>
            {SHOW_PRICES ? (
              <p className="mt-1"><span className="text-3xl font-extrabold tabular-nums">{formatUsd(price)}</span><span className="text-sm opacity-80">/mo{billing === "yearly" ? ", billed yearly" : ""}</span></p>
            ) : (
              <p className="mt-1"><span className="text-3xl font-extrabold tabular-nums">$0</span><span className="text-sm opacity-80"> for 14 days · No credit card required</span></p>
            )}
            <p className="mt-2 text-xs opacity-80">{plan.blurb}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <Link
        to="/free-trial"
        search={{ plan: planId, billing, pains: [...enabled].join(",") }}
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:bg-primary-deep"
      >
        Book a Free Trial with this setup →
      </Link>
    </div>
  );
}

export function Configurator({ standalone = false }: { standalone?: boolean }) {
  const [enabled, setEnabled] = useState<Set<string>>(() => new Set(ALL_PAIN_IDS));
  const [open, setOpen] = useState<Record<string, boolean>>({ c1: true });
  const [sheet, setSheet] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-30% 0px -30% 0px" });
  const toggle = (id: string) => setEnabled((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const preset = (agents: AgentKey[]) => setEnabled(new Set(idsForAgents(agents)));
  const planName = useMemo(() => PLANS.find((p) => p.id === recommendPlan(enabled))!.name, [enabled]);

  return (
    <section ref={ref} id="configure" className={`mx-auto max-w-6xl scroll-mt-24 px-6 ${standalone ? "py-12" : "py-28"}`}>
      {standalone && <h1 className="sr-only">Build your AI front office</h1>}
      <SectionHead eyebrow="Configurator" title={<>Build your <span className="text-gradient">AI front office</span></>} sub="Turn off anything you don't need. Watch your team and plan update." />
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="self-center text-sm font-bold text-muted-foreground">Quick presets:</span>
        <button onClick={() => preset(PLAN_AGENTS.receptionist)} className="rounded-full border bg-card px-4 py-1.5 text-sm font-bold hover:border-primary">Receptionist</button>
        <button onClick={() => preset(PLAN_AGENTS.pro)} className="rounded-full border bg-card px-4 py-1.5 text-sm font-bold hover:border-primary">Pro</button>
        <button onClick={() => preset(PLAN_AGENTS.full)} className="rounded-full border bg-card px-4 py-1.5 text-sm font-bold hover:border-primary">Everything</button>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-3 pb-24 lg:pb-0">
          {CATEGORIES.map((c) => {
            const onCount = c.items.filter((i) => enabled.has(i.id)).length;
            const isOpen = !!open[c.id];
            return (
              <div key={c.id} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
                <button onClick={() => setOpen((o) => ({ ...o, [c.id]: !isOpen }))} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
                  <span className="font-extrabold">{c.title}</span>
                  <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground"><span className="tabular-nums">{onCount}/{c.items.length}</span><ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} /></span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.25 }} className="divide-y border-t">
                      {c.items.map((i) => {
                        const on = enabled.has(i.id);
                        return (
                          <li key={i.id} className={`flex gap-4 px-5 py-4 transition-opacity ${on ? "" : "opacity-50"}`}>
                            <Switch on={on} onChange={() => toggle(i.id)} label={`${on ? "Disable" : "Enable"}: ${i.pain}`} color={AGENTS[i.agent].color} />
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <p className="text-sm font-semibold">{i.pain}</p>
                              <AgentChip agent={i.agent} />
                              <p className="text-sm text-muted-foreground">→ {i.fix}</p>
                            </div>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border bg-card p-6 shadow-soft"><Summary enabled={enabled} /></div>
        </aside>
      </div>
      {/* Mobile bottom sheet */}
      <div className={`fixed inset-x-0 bottom-16 z-30 px-3 transition lg:hidden ${inView ? "" : "pointer-events-none translate-y-8 opacity-0"}`}>
        <div className="mx-auto max-w-lg rounded-3xl border bg-card shadow-glow">
          <button onClick={() => setSheet((s) => !s)} aria-expanded={sheet} className="flex w-full items-center justify-between px-5 py-3 text-sm font-extrabold">
            <span>{enabled.size} of {ALL_PAIN_IDS.length} on · {planName}</span>
            <ChevronDown className={`h-4 w-4 transition ${sheet ? "" : "rotate-180"}`} />
          </button>
          <AnimatePresence initial={false}>
            {sheet && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="max-h-[65vh] overflow-y-auto">
                <div className="px-5 pb-5"><Summary enabled={enabled} /></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
