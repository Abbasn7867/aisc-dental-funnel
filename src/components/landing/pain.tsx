import { CountUp } from "./motion-text";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { AGENTS, CATEGORIES, type AgentKey, type Category } from "@/data/painPoints";
import { AGENT_ORDER, AGENT_PHOTOS, AgentChip, metaFor, SectionHead } from "./shared";

const TOTAL = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

function MiniCard({ item, i }: { item: Category["items"][number]; i: number }) {
  const color = AGENTS[item.agent].color;
  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (i % 6) * 0.06, duration: 0.45 }}
      className="group/mini rounded-2xl border bg-background p-4 transition hover:-translate-y-1 hover:shadow-soft"
    >
      <motion.p
        initial={{ color: "oklch(0.5 0.17 25)" }}
        whileInView={{ color: "oklch(0.235 0.06 257)" }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 + (i % 6) * 0.06, duration: 0.8 }}
        className="text-sm font-bold leading-snug"
      >
        {item.pain}
      </motion.p>
      <div className="mt-3 flex items-center gap-2">
        <AgentChip agent={item.agent} />
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <motion.span className="ml-auto" initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.9 + (i % 6) * 0.06, type: "spring" }}>
          <CheckCircle2 className="h-4 w-4" style={{ color }} aria-label="Solved" />
        </motion.span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{item.fix}</p>
    </motion.li>
  );
}

function CategoryCard({ cat, wide, flip, index }: { cat: Category; wide: boolean; flip: boolean; index: number }) {
  const meta = metaFor(cat.id);
  const Icon = meta.icon;
  const [open, setOpen] = useState(index === 0);
  const sideLayout = wide;
  return (
    <article className={`group overflow-hidden rounded-[2rem] border bg-card shadow-soft ${wide ? "lg:col-span-2" : ""}`}>
      <div>
        <div className={`relative overflow-hidden ${sideLayout ? "aspect-[4/3] sm:aspect-video" : "aspect-[4/3]"}`}>
          <img src={meta.photo} alt={meta.alt} loading="lazy" width={1280} height={720} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" style={{ objectPosition: meta.focus }} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        </div>
        <div className="relative flex-1 p-6 md:p-7">
          <span className="absolute -top-7 left-6 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow ring-4 ring-card">
            <Icon className="h-6 w-6" />
          </span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="mt-6 flex w-full items-start justify-between gap-3 text-left lg:pointer-events-none"
          >
            <div>
              <h3 className="text-lg font-extrabold uppercase tracking-wide">{cat.title}</h3>
              <p className="mt-1 text-sm font-semibold text-primary">{cat.outcome}</p>
              <p className="mt-1 text-xs font-bold text-muted-foreground">{cat.items.length} {cat.items.length === 1 ? "problem" : "problems"} solved</p>
            </div>
            <ChevronDown className={`mt-1 h-5 w-5 shrink-0 transition lg:hidden ${open ? "rotate-180" : ""}`} />
          </button>
          <ul className={`mt-5 grid gap-3 ${wide ? "md:grid-cols-2" : ""} ${open ? "grid" : "hidden"} lg:grid`}>
            {cat.items.map((it, i) => <MiniCard key={it.id} item={it} i={i} />)}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function PainSection() {
  // Rows alternate: wide+narrow, narrow+wide…
  return (
    <section id="problems" className="bg-stripes relative scroll-mt-24 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead
          eyebrow="Sound familiar?"
          title={<>Every front-office headache, <span className="text-gradient">handled by name.</span></>}
          sub="Here is every problem we built the AI Front Office to solve, grouped the way your day actually runs."
        />
        <div className="mt-10 flex flex-wrap gap-3">
          {([[TOTAL, "problems"], [8, "AI employees"], [1, "front office"]] as const).map(([v, t]) => (
            <span key={t} className="glass rounded-full px-5 py-2 text-lg font-extrabold shadow-soft"><CountUp value={v} /> {t}</span>
          ))}
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => {
            const row = Math.floor(i / 2);
            const firstInRow = i % 2 === 0;
            const wide = row % 2 === 0 ? firstInRow : !firstInRow;
            const isLastSolo = i === CATEGORIES.length - 1 && CATEGORIES.length % 2 === 1;
            return <CategoryCard key={c.id} cat={c} wide={isLastSolo ? true : wide} flip={row % 2 === 1} index={i} />;
          })}
        </div>
      </div>
      <Infographic />
    </section>
  );
}

function Infographic() {
  const agentsFor = (cat: Category) => Array.from(new Set(cat.items.map((i) => i.agent)));
  return (
    <div className="mx-auto mt-24 max-w-6xl px-6">
      <SectionHead center eyebrow="How it fits together" title={<>Problem → <span className="text-gradient">AI employee</span> → outcome</>} />
      <div className="mt-12 rounded-[2rem] border bg-card p-6 shadow-soft md:p-10">
        <div className="hidden grid-cols-[1fr_auto_1fr] gap-x-6 text-xs font-bold uppercase tracking-widest text-muted-foreground lg:grid">
          <span>Problem area</span><span className="text-center">Handled by</span><span className="text-right">Outcome</span>
        </div>
        <ol className="mt-4 space-y-3">
          {CATEGORIES.map((c, i) => {
            const Icon = metaFor(c.id).icon;
            const agents = agentsFor(c);
            const color = AGENTS[agents[0]!].color;
            return (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="grid items-center gap-3 rounded-2xl bg-background p-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-6"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Icon className="h-5 w-5" /></span>
                  <span className="font-bold">{c.title}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg width="48" height="8" className="hidden lg:block" aria-hidden><line x1="0" y1="4" x2="48" y2="4" stroke={color} strokeWidth="2.5" strokeDasharray="6 4" className="flow-dash" /></svg>
                  <div className="flex -space-x-2">
                    {agents.map((a) => (
                      <img key={a} src={AGENT_PHOTOS[a]} alt={AGENTS[a].name} title={`${AGENTS[a].name}, ${AGENTS[a].role}`} loading="lazy" decoding="async" className="h-10 w-10 rounded-full border-2 border-card object-cover object-[50%_20%]" style={{ boxShadow: `0 0 0 2px ${AGENTS[a].color}` }} />
                    ))}
                  </div>
                  <svg width="48" height="8" className="hidden lg:block" aria-hidden><line x1="0" y1="4" x2="48" y2="4" stroke={color} strokeWidth="2.5" strokeDasharray="6 4" className="flow-dash" /></svg>
                </div>
                <p className="text-sm font-semibold text-primary lg:text-right">{c.outcome}</p>
              </motion.li>
            );
          })}
        </ol>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {AGENT_ORDER.map((a: AgentKey) => <AgentChip key={a} agent={a} />)}
        </div>
      </div>
    </div>
  );
}
