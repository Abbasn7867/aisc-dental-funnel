import { motion } from "framer-motion";
import proofBand from "@/assets/landing/band-proof.webp";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Hash, Mail, PhoneIncoming, Play, UserCog } from "lucide-react";
import { AGENTS, CATEGORIES, type AgentKey } from "@/data/painPoints";
import { CtaButton } from "@/components/site";
import { AGENT_ORDER, AGENT_PHOTOS, SectionHead, TypedCall, Waveform, type CallLine } from "./shared";

function agentStats(key: AgentKey) {
  const items = CATEGORIES.flatMap((c) => c.items.filter((i) => i.agent === key).map((i) => ({ ...i, cat: c.title })));
  return { items, cats: Array.from(new Set(items.map((i) => i.cat))) };
}

export function TeamSection() {
  return (
    <section id="team" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
      <SectionHead eyebrow="Meet your AI team" title={<>Eight AI employees. <span className="text-gradient">Led by Amy.</span></>} sub="Each one owns a part of your front office, so your staff can focus on the patients in front of them." />
      <div className="-mx-6 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {AGENT_ORDER.map((key, i) => {
          const a = AGENTS[key];
          const { items, cats } = agentStats(key);
          const lead = i === 0;
          return (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.08 }}
              className={`group relative flex w-[78vw] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border bg-card shadow-soft transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_0_2px_var(--agent-glow),0_20px_50px_-12px_var(--agent-glow)] sm:w-auto ${lead ? "sm:col-span-2 lg:row-span-2" : ""}`}
              style={{ borderTop: `5px solid ${a.color}`, ["--agent-glow" as string]: `${a.color}66` }}
            >
              <div className={`relative overflow-hidden ${lead ? "aspect-[4/5] lg:aspect-auto lg:h-[28rem]" : "aspect-[4/5]"}`}>
                <img src={AGENT_PHOTOS[key]} alt={`${a.name}, ${a.role}`} loading="lazy" className="h-full w-full object-cover object-[50%_20%] transition duration-700 group-hover:scale-105" />
                {lead && <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground">Team lead</span>}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className={`font-extrabold ${lead ? "text-3xl" : "text-xl"}`}>{a.name}</h3>
                <p className="text-sm font-bold" style={{ color: a.color }}>{a.role}</p>
                <p className="mt-3 text-sm text-muted-foreground">{cats.join(" · ")}</p>
                <p className="mt-2 text-xs font-extrabold">Solves {items.length} problems</p>
                {lead && (
                  <ul className="mt-4 space-y-1.5 text-sm">
                    {items.slice(2, 5).map((it) => <li key={it.id} className="rounded-xl bg-background p-2.5">✓ {it.fix}</li>)}
                  </ul>
                )}
                <ul className="mt-3 max-h-0 space-y-1.5 overflow-hidden text-sm opacity-0 transition-all duration-500 group-hover:max-h-60 group-hover:opacity-100 group-focus-within:max-h-60 group-focus-within:opacity-100">
                  {items.slice(0, 2).map((it) => (
                    <li key={it.id} className="rounded-xl bg-background p-2.5">✓ {it.fix}</li>
                  ))}
                </ul>
              </div>
            </motion.article>
          );
        })}
        <div className="flex flex-col justify-center rounded-3xl bg-signature p-6 text-primary-foreground shadow-glow">
          <p className="text-2xl font-extrabold">All 8, working together.</p>
          <p className="mt-2 text-sm opacity-90">Every one is included in your 14-day free trial.</p>
          <CtaButton className="mt-5 bg-ink hover:bg-ink" />
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: UserCog, title: "Set up your profile", text: "From your dashboard, or let us do it for you." },
  { icon: Hash, title: "Get your own number", text: "Your practice gets its own phone number." },
  { icon: PhoneIncoming, title: "Our test caller rings Amy", text: "She answers questions from your FAQs, live." },
  { icon: Mail, title: "Recording delivered", text: "On your dashboard and in your inbox." },
];

export function ProofCall() {
  return (
    <section id="proof" className="relative min-h-[420px] scroll-mt-24 overflow-hidden bg-ink py-28 text-ink-foreground md:min-h-[360px]">
      <img src={proofBand} alt="" aria-hidden loading="lazy" width={1920} height={832} className="absolute inset-0 h-full w-full object-cover object-[80%_30%] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />
      <div className="blob -left-32 top-0 h-96 w-96 bg-primary" />
      <div className="blob -right-20 bottom-0 h-80 w-80 bg-accent" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Your instant test call</p>
          <h2 className="mt-3 text-4xl font-extrabold leading-[1.05] md:text-5xl">Hear Amy answer YOUR practice's questions in 3–4 minutes.</h2>
          <ol className="relative mt-10 space-y-6 border-l-2 border-dashed border-accent/50 pl-8">
            {STEPS.map((s, i) => (
              <motion.li key={s.title} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative">
                <span className="absolute -left-[3.05rem] grid h-9 w-9 place-items-center rounded-full bg-signature text-primary-foreground"><s.icon className="h-4 w-4" /></span>
                <p className="font-extrabold">{i + 1}. {s.title}</p>
                <p className="text-sm opacity-80">{s.text}</p>
              </motion.li>
            ))}
          </ol>
          <CtaButton size="lg" className="mt-10" />
          <p className="mt-3 text-sm opacity-80">Your test call recording arrives within 3–4 minutes of setup. The test call is recorded and sent to the email you provide.</p>
        </div>

        <div className="relative">
          <div className="rounded-[1.75rem] bg-card p-5 text-card-foreground shadow-soft">
            <div className="flex items-center justify-between border-b pb-3">
              <p className="font-extrabold">Calls</p>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-muted-foreground">Illustrative dashboard</span>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-background p-4">
              <button aria-label="Play recording (illustration)" className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="h-4 w-4" /></button>
              <div className="flex-1">
                <p className="text-sm font-extrabold">Test call · 3:12 · Recording ready</p>
                <Waveform active bars={34} />
              </div>
            </div>
            {["Opening hours question", "New patient booking", "Insurance question"].map((t) => (
              <div key={t} className="mt-2 flex items-center justify-between rounded-xl px-4 py-2.5 text-sm">
                <span>{t}</span><span className="font-bold text-primary">Answered ✓</span>
              </div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
            className="glass absolute -bottom-16 -left-4 flex items-center gap-3 rounded-2xl p-4 text-foreground shadow-soft md:-left-10"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-mint-soft"><Mail className="h-5 w-5 text-primary" /></span>
            <div>
              <p className="text-sm font-extrabold">Your test call recording is ready</p>
              <p className="text-xs text-muted-foreground">Sent to your inbox · just now</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const OPEN = "Thanks for calling. All calls are recorded for quality and training purposes.";
const SCENARIOS: { id: string; label: string; outcome: string; lines: CallLine[] }[] = [
  {
    id: "new", label: "New patient cleaning", outcome: "Booked · Thu 9:00 AM",
    lines: [
      { who: "amy", text: `${OPEN} This is Amy. How can I help?` },
      { who: "caller", text: "Hi! Are you taking new patients?" },
      { who: "amy", text: "We are, and we'd love to see you. Are you looking for a cleaning and exam?" },
      { who: "caller", text: "Yes, ideally a morning this week." },
      { who: "amy", text: "I have Thursday at 9:00 or 10:30 AM. Which suits you?" },
      { who: "caller", text: "9:00 is perfect." },
      { who: "amy", text: "You're booked for Thursday at 9:00. I'll text your new patient forms so you can finish them at home." },
    ],
  },
  {
    id: "urgent", label: "Toothache after hours", outcome: "First slot tomorrow · on-call team alerted",
    lines: [
      { who: "amy", text: `${OPEN} This is Amy. How can I help?` },
      { who: "caller", text: "It's late, I know, but I have a really bad toothache." },
      { who: "amy", text: "I'm sorry you're in pain. Is there any swelling, injury or bleeding that won't stop?" },
      { who: "caller", text: "A little swelling on one side." },
      { who: "amy", text: "Thank you. I'm following the practice's urgent protocol and alerting the on-call team now." },
      { who: "amy", text: "I've also held our first emergency slot tomorrow at 8:00 AM for you. Shall I confirm it?" },
      { who: "caller", text: "Yes, please. Thank you." },
    ],
  },
  {
    id: "insurance", label: "Insurance question", outcome: "In network · visit booked",
    lines: [
      { who: "amy", text: `${OPEN} This is Amy. How can I help?` },
      { who: "caller", text: "Do you take my dental plan? It's through my employer." },
      { who: "amy", text: "Happy to check. What's the name of the plan on your card?" },
      { who: "caller", text: "It's the PPO plan from my work insurance." },
      { who: "amy", text: "That plan is on the practice's approved in-network list. Would you like to book a visit?" },
      { who: "caller", text: "Great, next Monday afternoon if possible." },
      { who: "amy", text: "Done: Monday at 2:30 PM. Please bring your insurance card with you." },
    ],
  },
  {
    id: "resched", label: "Reschedule", outcome: "Moved to Friday · slot offered to waitlist",
    lines: [
      { who: "amy", text: `${OPEN} This is Amy. How can I help?` },
      { who: "caller", text: "I can't make my Tuesday appointment anymore." },
      { who: "amy", text: "No problem. Would later this week work for you?" },
      { who: "caller", text: "Friday would be great." },
      { who: "amy", text: "I can move you to Friday at 11:00 AM. Does that work?" },
      { who: "caller", text: "Perfect, thank you." },
      { who: "amy", text: "All set for Friday. I've offered your Tuesday time to a patient on the waitlist." },
    ],
  },
];

export function CallPlayer() {
  const [active, setActive] = useState(SCENARIOS[0]!.id);
  const [run, setRun] = useState(0);
  const sc = SCENARIOS.find((s) => s.id === active) ?? SCENARIOS[0]!;
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <SectionHead center eyebrow="Hear Amy in action" title={<>Real calls, <span className="text-gradient">handled warmly.</span></>} sub="Pick a call and watch how Amy handles it." />
      <div role="tablist" aria-label="Call scenarios" className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={active === s.id}
            onClick={() => { setActive(s.id); setRun((r) => r + 1); }}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${active === s.id ? "bg-primary text-primary-foreground shadow-glow" : "border bg-card hover:bg-secondary"}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mx-auto mt-8 max-w-2xl rounded-[2rem] border bg-card p-6 shadow-soft">
        <TypedCall lines={sc.lines} outcome={sc.outcome} playKey={`${active}-${run}`} />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Prefer to hear it for real?{" "}
        <Link to="/free-trial" className="font-bold text-primary underline">Book a Free Trial</Link> and get your own recorded test call in 3–4 minutes.
      </p>
    </section>
  );
}
