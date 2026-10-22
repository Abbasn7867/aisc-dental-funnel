import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import {
  CalendarCheck, ClipboardList, FileSignature, ShieldCheck, RefreshCcw, MessageSquareText,
  HeartPulse, Star, Repeat, Share2, BarChart3, type LucideIcon,
} from "lucide-react";
import { AGENTS, type AgentKey } from "@/data/painPoints";
import amy from "@/assets/amy.png.asset.json";
import leena from "@/assets/leena.jpg.asset.json";
import morgan from "@/assets/morgan.jpg.asset.json";
import kim from "@/assets/kim.jpg.asset.json";
import stephanie from "@/assets/stephanie.jpg.asset.json";
import elise from "@/assets/elise.jpg.asset.json";
import joseph from "@/assets/joseph.jpg.asset.json";
import trisha from "@/assets/trisha.jpg.asset.json";
import c1 from "@/assets/landing/cat-booking.jpg";
import c2 from "@/assets/landing/cat-intake.jpg";
import c3 from "@/assets/landing/cat-consent.jpg";
import c4 from "@/assets/landing/cat-eligibility.jpg";
import c5 from "@/assets/landing/cat-noshows.jpg";
import c6 from "@/assets/landing/cat-clinical.jpg";
import c7 from "@/assets/landing/cat-coverage.jpg";
import c8 from "@/assets/landing/cat-reviews-fixed.jpg";
import c9 from "@/assets/landing/cat-recall.jpg";
import c10 from "@/assets/landing/cat-referral-distinct.jpg";
import c11 from "@/assets/landing/cat-reporting.jpg";

export const AGENT_PHOTOS: Record<AgentKey, string> = {
  amy: amy.url, leena: leena.url, morgan: morgan.url, kim: kim.url,
  stephanie: stephanie.url, elise: elise.url, joseph: joseph.url, trisha: trisha.url,
};
export const AGENT_ORDER: AgentKey[] = ["amy", "leena", "morgan", "kim", "stephanie", "elise", "joseph", "trisha"];

/** focus = CSS object-position of the subject's face, so cover crops never cut it. */
type CatMeta = { icon: LucideIcon; photo: string; alt: string; focus: string };
export const CATEGORY_META = {
  c1: { icon: CalendarCheck, photo: c1, alt: "Receptionist with a headset booking a visit at a dental front desk in the evening", focus: "35% 35%" },
  c2: { icon: ClipboardList, photo: c2, alt: "Patient at home completing intake forms on a tablet before a dental visit", focus: "70% 40%" },
  c3: { icon: FileSignature, photo: c3, alt: "Hygienist walking a patient through a consent form on a tablet", focus: "40% 35%" },
  c4: { icon: ShieldCheck, photo: c4, alt: "Smiling patient at the dental checkout counter holding an insurance card", focus: "50% 35%" },
  c5: { icon: RefreshCcw, photo: c5, alt: "Hygienist welcoming a patient into a dental chair", focus: "50% 35%" },
  c6: { icon: MessageSquareText, photo: c6, alt: "Patient at home reading care instructions on a phone", focus: "55% 30%" },
  c7: { icon: HeartPulse, photo: c7, alt: "Dental office manager reviewing coverage paperwork at a desk", focus: "40% 30%" },
  c8: { icon: Star, photo: c8, alt: "Happy patient waving goodbye to the receptionist as she leaves", focus: "50% 30%" },
  c9: { icon: Repeat, photo: c9, alt: "Family arriving together at a dental clinic for a checkup", focus: "50% 35%" },
  c10: { icon: Share2, photo: c10, alt: "Dentist and assistant reviewing a referral on a tablet", focus: "40% 30%" },
  c11: { icon: BarChart3, photo: c11, alt: "Practice owner reviewing charts on a laptop", focus: "40% 30%" },
} satisfies Record<string, CatMeta>;
export const metaFor = (id: string): CatMeta => (CATEGORY_META as Record<string, CatMeta>)[id]!;

export function AgentChip({ agent, size = "sm" }: { agent: AgentKey; size?: "sm" | "md" }) {
  const a = AGENTS[agent];
  const dim = size === "md" ? "h-9 w-9" : "h-6 w-6";
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-card py-0.5 pl-0.5 pr-2.5 text-xs font-bold shadow-sm" style={{ boxShadow: `inset 0 0 0 1.5px ${a.color}` }}>
      <img src={AGENT_PHOTOS[agent]} alt="" className={`${dim} rounded-full object-cover object-[50%_20%]`} />
      <span style={{ color: a.color }}>{a.name}</span>
    </span>
  );
}

export function Strike({ children }: { children: React.ReactNode }) {
  return <s className="opacity-75 decoration-2">{children}</s>;
}

export function OfferLine({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      14-day free trial · Setup <Strike>$1,000</Strike> $0 · +$250 bonus credits
    </span>
  );
}

export function SectionHead({ eyebrow, title, sub, center }: { eyebrow: string; title: React.ReactNode; sub?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-extrabold leading-[1.05] md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-lg text-muted-foreground">{sub}</p>}
    </div>
  );
}

export type CallLine = { who: "amy" | "caller"; text: string };

export function Waveform({ active, bars = 28 }: { active: boolean; bars?: number }) {
  return (
    <div className="flex h-8 items-center gap-[3px]" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="wave-bar w-[3px] rounded-full bg-signature"
          style={{ animationDelay: `${(i * 73) % 900}ms`, animationPlayState: active ? "running" : "paused", height: `${30 + ((i * 37) % 60)}%` }}
        />
      ))}
    </div>
  );
}

/** Animated call: types transcript line by line, then shows outcome. */
export function TypedCall({ lines, outcome, playKey, loop = false, compact = false }: { lines: CallLine[]; outcome: string; playKey: string | number; loop?: boolean; compact?: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const [shown, setShown] = useState<{ idx: number; chars: number }>({ idx: 0, chars: 0 });
  const [secs, setSecs] = useState(0);
  const [cycle, setCycle] = useState(0);
  const done = shown.idx >= lines.length;

  useEffect(() => {
    setShown(reduce ? { idx: lines.length, chars: 0 } : { idx: 0, chars: 0 });
    setSecs(0);
  }, [playKey, cycle, reduce, lines.length]);

  useEffect(() => {
    if (!inView || reduce) return;
    if (done) {
      if (!loop) return;
      const t = setTimeout(() => setCycle((c) => c + 1), 3200);
      return () => clearTimeout(t);
    }
    const line = lines[shown.idx]!.text;
    const t = setTimeout(
      () => setShown((s) => (s.chars >= line.length ? { idx: s.idx + 1, chars: 0 } : { idx: s.idx, chars: s.chars + 2 })),
      shown.chars >= line.length ? 650 : 22,
    );
    return () => clearTimeout(t);
  }, [shown, inView, done, loop, lines, reduce]);

  useEffect(() => {
    if (!inView || done || reduce) return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [inView, done, reduce]);

  const mm = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <div ref={ref} className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={AGENT_PHOTOS.amy} alt="Amy, AI receptionist" className="h-12 w-12 rounded-full object-cover object-[50%_20%] ring-2 ring-agent-amy ring-offset-2" />
          {!done && <span className="pulse-ring absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-accent" />}
        </div>
        <div className="flex-1">
          <p className="font-extrabold leading-tight">Amy · AI Receptionist</p>
          <p className="text-xs font-semibold text-muted-foreground">{done ? "Call ended" : "On a call"} · <span className="tabular-nums">{mm}</span></p>
        </div>
        <Waveform active={!done && inView} bars={compact ? 14 : 22} />
      </div>
      <div className={`mt-4 flex flex-1 flex-col gap-2 overflow-hidden ${compact ? "min-h-[15rem]" : "min-h-[19rem]"}`} aria-live="off">
        {lines.slice(0, Math.min(shown.idx + 1, lines.length)).map((l, i) => {
          const text = i < shown.idx ? l.text : l.text.slice(0, shown.chars);
          if (!text) return null;
          const isAmy = l.who === "amy";
          return (
            <p key={i} className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${isAmy ? "self-end rounded-br-md bg-primary text-primary-foreground" : "self-start rounded-bl-md bg-secondary"}`}>
              {text}
            </p>
          );
        })}
        {done && (
          <span className="mt-1 inline-flex items-center gap-1.5 self-center rounded-full bg-mint-soft px-4 py-1.5 text-sm font-extrabold text-foreground shadow-sm animate-in zoom-in-50">
            ✓ {outcome}
          </span>
        )}
      </div>
      <p className="sr-only">{lines.map((l) => `${l.who === "amy" ? "Amy" : "Caller"}: ${l.text}`).join(" ")} Outcome: {outcome}</p>
    </div>
  );
}
