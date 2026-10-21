import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Check, FileLock2, Lock, Settings, ShieldCheck } from "lucide-react";
import { AGENTS, type AgentKey } from "@/data/painPoints";
import withImg from "@/assets/landing/with.jpg";
import withoutImg from "@/assets/landing/without.jpg";
import { AGENT_ORDER, AGENT_PHOTOS, AgentChip, CATEGORY_META, SectionHead } from "./shared";

const DAY: { time: string; moment: string; agent: AgentKey; photo: string; alt: string; focus: string }[] = [
  { time: "7:00 AM", moment: "Your morning report is waiting: calls answered, visits booked and show rates from yesterday.", agent: "trisha", photo: CATEGORY_META.c11.photo, alt: CATEGORY_META.c11.alt, focus: CATEGORY_META.c11.focus },
  { time: "7:45 AM", moment: "Phones light up before the doors open. Every call is answered and booked into your schedule.", agent: "amy", photo: CATEGORY_META.c1.photo, alt: CATEGORY_META.c1.alt, focus: CATEGORY_META.c1.focus },
  { time: "8:30 AM", moment: "Today's patients are re-verified for eligibility, close to the appointment, not weeks before.", agent: "morgan", photo: CATEGORY_META.c4.photo, alt: CATEGORY_META.c4.alt, focus: CATEGORY_META.c4.focus },
  { time: "10:15 AM", moment: "A cancellation opens a chair. The slot is offered to the waitlist and filled.", agent: "leena", photo: CATEGORY_META.c5.photo, alt: CATEGORY_META.c5.alt, focus: CATEGORY_META.c5.focus },
  { time: "12:30 PM", moment: "Lunch break, phones still covered. No voicemail, no lost new patients.", agent: "amy", photo: CATEGORY_META.c9.photo, alt: CATEGORY_META.c9.alt, focus: CATEGORY_META.c9.focus },
  { time: "2:00 PM", moment: "Faxes, emails and portal messages land in one routed queue; urgent ones are flagged first.", agent: "joseph", photo: CATEGORY_META.c10.photo, alt: CATEGORY_META.c10.alt, focus: CATEGORY_META.c10.focus },
  { time: "3:30 PM", moment: "A treatment plan unscheduled for 7 days gets a friendly follow-up.", agent: "kim", photo: CATEGORY_META.c6.photo, alt: CATEGORY_META.c6.alt, focus: CATEGORY_META.c6.focus },
  { time: "5:30 PM", moment: "Today's patients get a review request; any unhappy feedback goes privately to your team.", agent: "elise", photo: CATEGORY_META.c8.photo, alt: CATEGORY_META.c8.alt, focus: CATEGORY_META.c8.focus },
  { time: "7:00 PM", moment: "Patients lapsed 6–12 months get a warm note inviting them back.", agent: "stephanie", photo: CATEGORY_META.c7.photo, alt: CATEGORY_META.c7.alt, focus: CATEGORY_META.c7.focus },
  { time: "10:00 PM", moment: "A parent books a checkup after the kids are asleep. Confirmed in minutes.", agent: "amy", photo: CATEGORY_META.c2.photo, alt: CATEGORY_META.c2.alt, focus: CATEGORY_META.c2.focus },
  { time: "Sunday", moment: "Office closed, front office open: weekend calls booked, Monday's reminders already sent.", agent: "amy", photo: CATEGORY_META.c3.photo, alt: CATEGORY_META.c3.alt, focus: CATEGORY_META.c3.focus },
];

function DayStop({ d, i, onActive }: { d: (typeof DAY)[number]; i: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => { if (inView) onActive(i); }, [inView, i, onActive]);
  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="grid overflow-hidden rounded-3xl border bg-card shadow-soft sm:grid-cols-[200px_1fr]"
    >
      <img src={d.photo} alt={d.alt} loading="lazy" className="aspect-[4/3] w-full object-cover sm:h-full" style={{ objectPosition: d.focus }} />
      <div className="p-5">
        <p className="text-sm font-extrabold text-primary">{d.time}</p>
        <p className="mt-1 font-bold">{d.moment}</p>
        <div className="mt-3"><AgentChip agent={d.agent} /></div>
      </div>
    </motion.li>
  );
}

export function DayTimeline() {
  const [active, setActive] = useState(0);
  return (
    <section className="bg-stripes py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead eyebrow="A day at your practice" title={<>From first call to last, <span className="text-gradient">covered.</span></>} />
        <div className="mt-14 grid gap-10 lg:grid-cols-[280px_1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="glass rounded-[2rem] p-8 text-center shadow-soft">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Right now</p>
              <motion.p key={DAY[active]!.time} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-5xl font-extrabold tabular-nums text-gradient">
                {DAY[active]!.time}
              </motion.p>
              <div className="mt-5 flex justify-center"><AgentChip agent={DAY[active]!.agent} size="md" /></div>
              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-secondary">
                <motion.div className="h-full bg-signature" animate={{ width: `${((active + 1) / DAY.length) * 100}%` }} />
              </div>
            </div>
          </div>
          <ol className="space-y-5">
            {DAY.map((d, i) => <DayStop key={d.time} d={d} i={i} onActive={setActive} />)}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function CompareSlider() {
  const [pos, setPos] = useState(50);
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <SectionHead center eyebrow="Without vs with AISC" title={<>Same desk. <span className="text-gradient">Different day.</span></>} sub="Drag the handle to compare." />
      <div className="relative mx-auto mt-12 aspect-video max-w-5xl overflow-hidden rounded-[2rem] shadow-soft select-none">
        <img src={withImg} alt="Calm front desk, receptionist focused on one patient" className="absolute inset-0 h-full w-full object-cover object-[50%_35%]" width={1280} height={720} loading="lazy" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={withoutImg} alt="Stressed front desk with phones ringing and a line at the counter" className="absolute inset-0 h-full w-full object-cover object-[50%_35%]" width={1280} height={720} loading="lazy" />
        </div>
        <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-extrabold">Without</span>
        <span className="glass absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-extrabold">With AISC</span>
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="h-full w-1 -translate-x-1/2 bg-card shadow-soft" />
          <div className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary font-extrabold text-primary-foreground shadow-glow">⇆</div>
        </div>
        <input
          type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare without and with AISC"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6">
          <h3 className="font-extrabold">Without</h3>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            {["Calls going to voicemail", "Endless call-backs", "Empty chairs and open slots", "Forms filled out in the lobby"].map((t) => <li key={t}>✕ {t}</li>)}
          </ul>
        </div>
        <div className="rounded-3xl border bg-mint-soft p-6">
          <h3 className="font-extrabold">With</h3>
          <ul className="mt-3 space-y-2">
            {["Every call answered", "Visits booked, day or night", "Forms done before arrival", "Reviews rolling in"].map((t) => <li key={t}>✓ {t}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

const CHECKLIST = [
  ["Confirm your practice details", "2 min"], ["Set your opening hours", "2 min"], ["Add services and FAQs", "3 min"],
  ["Personalize your receptionist's greeting", "1 min"], ["Connect your scheduling software", "3 min"], ["Invite your team", "1 min"],
];

export function DashboardMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [ticked, setTicked] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setTicked((n) => (n >= CHECKLIST.length ? n : n + 1)), 650);
    return () => clearInterval(t);
  }, [inView]);
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <SectionHead center eyebrow="Your dashboard" title={<>Ready in <span className="text-gradient">about 10 minutes.</span></>} />
      <div ref={ref} className="perspective mx-auto mt-14 max-w-5xl">
        <motion.div initial={{ rotateX: 14, opacity: 0, y: 40 }} whileInView={{ rotateX: 5, opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="rounded-[1.75rem] border-[10px] border-ink bg-background p-5 shadow-soft md:p-7">
          <div className="flex items-center justify-between">
            <p className="font-extrabold">Good morning 👋</p>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">Sample dashboard</span>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl bg-card p-4">
              <p className="text-sm font-extrabold">8 of 8 Agents Working for You</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {AGENT_ORDER.map((k) => (
                  <div key={k} className="rounded-xl border p-2.5 text-center">
                    <img src={AGENT_PHOTOS[k]} alt="" className="mx-auto h-10 w-10 rounded-full object-cover object-[50%_20%]" style={{ boxShadow: `0 0 0 2px ${AGENTS[k].color}` }} />
                    <p className="mt-1.5 text-xs font-extrabold">{AGENTS[k].name}</p>
                    <p className="text-[10px] text-muted-foreground">{AGENTS[k].role}</p>
                    <div className="mt-1.5 flex items-center justify-center gap-1">
                      <span className="rounded-full bg-mint-soft px-1.5 text-[10px] font-bold">Active</span>
                      <Settings className="h-3 w-3 text-muted-foreground" aria-label="Settings" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <div className="rounded-2xl bg-card p-4">
                <p className="text-sm font-extrabold">Quick Start — Get Set Up in About 10 Minutes</p>
                <ul className="mt-3 space-y-2">
                  {CHECKLIST.map(([t, m], i) => (
                    <li key={t} className="flex items-center gap-2.5 text-sm">
                      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition ${i < ticked ? "border-accent bg-accent" : "border-input"}`}>
                        {i < ticked && <Check className="h-3.5 w-3.5 text-accent-foreground" />}
                      </span>
                      <span className={i < ticked ? "text-muted-foreground line-through" : ""}>{t}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-signature p-4 text-primary-foreground">
                <p className="text-xs font-bold uppercase tracking-wider opacity-90">Booking number</p>
                <p className="mt-1 text-2xl font-extrabold tabular-nums">+1 (555) 010-0000</p>
                <p className="text-sm opacity-90">Callers reach Amy on this number.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const FLIPS = [
  { icon: ShieldCheck, title: "HIPAA compliant", back: "Patient information your AI team handles is protected under HIPAA safeguards, the same standard your practice follows." },
  { icon: Lock, title: "SOC 2 compliant", back: "Your data runs on secure, enterprise-grade cloud infrastructure with SOC 2 controls for security and availability." },
  { icon: FileLock2, title: "BAA available", back: "Need a Business Associate Agreement? We'll sign one with your practice on request." },
];

export function FlipCards() {
  const [flipped, setFlipped] = useState<number | null>(null);
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <SectionHead center eyebrow="Compliance & security" title={<>Built for the way <span className="text-gradient">healthcare works.</span></>} sub="Tap a card to see what it means for your practice." />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {FLIPS.map((f, i) => (
          <button
            key={f.title}
            onClick={() => setFlipped(flipped === i ? null : i)}
            onMouseEnter={() => setFlipped(i)}
            onMouseLeave={() => setFlipped(null)}
            aria-pressed={flipped === i}
            aria-label={`${f.title}: ${f.back}`}
            className="perspective h-64 text-left"
          >
            <div className="preserve-3d relative h-full w-full transition-transform duration-700" style={{ transform: flipped === i ? "rotateY(180deg)" : "none" }}>
              <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[2rem] border bg-card shadow-soft">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-signature text-primary-foreground"><f.icon className="h-8 w-8" /></span>
                <p className="text-2xl font-extrabold">{f.title}</p>
              </div>
              <div className="backface-hidden absolute inset-0 flex items-center rounded-[2rem] bg-ink p-8 text-ink-foreground shadow-soft" style={{ transform: "rotateY(180deg)" }}>
                <p className="text-lg font-semibold">{f.back}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
