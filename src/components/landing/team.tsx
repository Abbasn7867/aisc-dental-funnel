import { TestCallSection } from "@/components/TestCallSection";
import { motion, useInView } from "framer-motion";
import proofBand from "@/assets/landing/band-proof.webp";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Hash, Mail, Pause, PhoneIncoming, Play, UserCog } from "lucide-react";
import { AGENTS, CATEGORIES, type AgentKey } from "@/data/painPoints";
import { CtaButton } from "@/components/site";
import { AGENT_ORDER, AGENT_PHOTOS, NoCardNote, SectionHead, Waveform, type CallLine } from "./shared";

function agentStats(key: AgentKey) {
  const items = CATEGORIES.flatMap((c) => c.items.filter((i) => i.agent === key).map((i) => ({ ...i, cat: c.title })));
  return { items, cats: Array.from(new Set(items.map((i) => i.cat))) };
}

export function TeamSection() {
  return (
    <section id="team" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
      <SectionHead eyebrow="Meet your AI team" title={<>Eight AI Employees. <span className="text-gradient">Led by Annie.</span></>} sub="Each one owns a part of your front office, so your staff can focus on the patients in front of them." />
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
          <NoCardNote dark className="mt-2" />
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: UserCog, title: "Set Up Your Profile", text: "With the Setup Wizard, or let us do it for you." },
  { icon: Hash, title: "Get Your Booking Line", text: "Your practice gets its own booking line." },
  { icon: PhoneIncoming, title: "A Test Caller Rings Annie", text: "Right after setup, a caller asks your FAQs and Annie answers live." },
  { icon: Mail, title: "Recording Delivered", text: "On your dashboard and in your inbox." },
];

export function ProofCall() {
  return (
    <section id="test-call" className="relative min-h-[420px] scroll-mt-24 overflow-hidden bg-ink py-28 text-ink-foreground md:min-h-[360px]">
      <img src={proofBand} alt="" aria-hidden loading="lazy" width={1920} height={832} className="absolute inset-0 h-full w-full object-cover object-[80%_30%] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />
      <div className="blob -left-32 top-0 h-96 w-96 bg-primary" />
      <div className="blob -right-20 bottom-0 h-80 w-80 bg-accent" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Your instant test call</p>
          <h2 className="mt-3 text-4xl font-extrabold leading-[1.05] md:text-5xl">Hear Annie Answer Your Practice's Questions in 3–4 Minutes.</h2>
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
          <NoCardNote dark className="mt-2" />
          <p className="mt-3 text-sm opacity-80">Your test call recording arrives within 3–4 minutes of setup. The test call is recorded and sent to the email you provide.</p>
        </div>

        <div className="relative min-w-0">
          <TestCallSection />
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

const CALL_AUDIO = "/audio/dental-new-patient-call.mp3";

const TRANSCRIPT: CallLine[] = [
  { who: "amy", text: "Thank you for calling Brightwater Family Dentistry. This is Amy. How can I help you today?" },
  { who: "caller", text: "Hey there. So, it's been a few years since my last cleaning. I'm a little overdue. First off, do you take Cigna?" },
  { who: "amy", text: "Yes. We accept most PPO plans, including Delta Dental, Cigna, MetLife, Aetna and Guardian. We will check your benefits before your visit." },
  { who: "caller", text: "Oh nice, that's good to hear. Also, how much is a cleaning and exam for a new patient?" },
  { who: "amy", text: "Our new patient special is $129. It includes an exam, X-rays and a cleaning." },
  { who: "caller", text: "Okay, that's reasonable. Quick one, it's been about five years. Is that a problem?" },
  { who: "amy", text: "Not at all. The dentist and hygienist will check everything and recommend the right type of cleaning for you." },
  { who: "caller", text: "Fair enough. Now, I get pretty nervous at the dentist. Do you have anything for that?" },
  { who: "amy", text: "Yes. We offer nitrous oxide, noise-canceling headphones and warm blankets. Just let us know when you arrive." },
  { who: "caller", text: "Okay, good. That's a relief. And do you have early morning or evening times?" },
  { who: "amy", text: "Yes. We open at 7 AM on weekdays, and we have evening appointments on Tuesdays and Thursdays until 6 PM." },
  { who: "caller", text: "Great, good to know. And where are you located, and is there parking?" },
  { who: "amy", text: "We are located at 3940 Fourth Ave, Suite 202, San Diego, CA 92103. Free parking is available in the lot behind the building." },
  { who: "caller", text: "Alright, good to know. Last one, what's the next new patient opening?" },
  { who: "amy", text: "The next new patient opening is Monday at 7:00 AM. Would you like me to book it?" },
  { who: "caller", text: "Yeah, let's do it. My name is Sam Whitaker, and my number is (619) 555-0191." },
  { who: "amy", text: "Thank you, Sam. You're booked for a new patient exam and cleaning on Monday at 7:00 AM. You'll get a text confirmation at (619) 555-0191. Is there anything else I can help you with?" },
  { who: "caller", text: "Awesome, thanks for your help. Have a great day!" },
  { who: "amy", text: "You're welcome. Thank you for calling Brightwater Family Dentistry. Goodbye." },
];

const fmtTime = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "--:--");

export function CallPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(NaN);
  const [failed, setFailed] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const inView = useInView(cardRef, { margin: "-60px" });
  const wasInView = useRef(false);

  // Pause only when the card leaves the screen after having been visible,
  // so a tap while it scrolls into place isn't instantly paused.
  useEffect(() => {
    if (inView) {
      wasInView.current = true;
      return;
    }
    if (wasInView.current && playing) {
      audioRef.current?.pause();
      wasInView.current = false;
    }
  }, [inView, playing]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) void a.play().catch(() => setFailed(true));
    else a.pause();
  };

  const seekFromPointer = (clientX: number) => {
    const bar = barRef.current;
    const a = audioRef.current;
    if (!bar || !a || !Number.isFinite(a.duration)) return;
    const r = bar.getBoundingClientRect();
    a.currentTime = Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * a.duration;
  };

  const onBarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    seekFromPointer(e.clientX);
  };
  const onBarPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 1) seekFromPointer(e.clientX);
  };

  const progress = Number.isFinite(duration) && duration > 0 ? (time / duration) * 100 : 0;

  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <SectionHead center eyebrow="Hear Annie in action" title={<>Real Calls, <span className="text-gradient">Handled Warmly.</span></>} sub="Listen to Annie book a new patient, start to finish." />
      <div ref={cardRef} className="mx-auto mt-10 max-w-2xl rounded-[2rem] border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <img src={AGENT_PHOTOS.amy} alt="Annie, AI receptionist" className="h-12 w-12 rounded-full object-cover object-[50%_20%] ring-2 ring-agent-amy ring-offset-2" />
          <div className="flex-1">
            <p className="font-extrabold leading-tight">Annie · AI Receptionist</p>
            <p className="text-xs font-semibold text-muted-foreground">New patient books a cleaning · 2:23</p>
          </div>
          <Waveform active={playing} bars={22} />
        </div>

        {!failed && (
          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause the call recording" : "Play the call recording"}
              className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow transition hover:scale-105 active:scale-95"
            >
              {playing ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
            </button>
            <div className="flex-1">
              <div
                ref={barRef}
                role="slider"
                aria-label="Call progress"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration) || 0}
                aria-valuenow={Math.round(time)}
                tabIndex={0}
                onPointerDown={onBarPointerDown}
                onPointerMove={onBarPointerMove}
                onKeyDown={(e) => {
                  const a = audioRef.current;
                  if (!a || !Number.isFinite(a.duration)) return;
                  if (e.key === "ArrowRight") a.currentTime = Math.min(a.duration, a.currentTime + 5);
                  if (e.key === "ArrowLeft") a.currentTime = Math.max(0, a.currentTime - 5);
                }}
                className="group relative h-6 cursor-pointer touch-none"
              >
                <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-secondary" />
                <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
                <div className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow transition group-hover:scale-110" style={{ left: `${progress}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-xs font-bold tabular-nums text-muted-foreground">
                <span>{fmtTime(time)}</span>
                <span>{fmtTime(duration)}</span>
              </div>
            </div>
          </div>
        )}

        <audio
          ref={audioRef}
          src={CALL_AUDIO}
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onError={() => { setFailed(true); setShowTranscript(true); }}
        />

        <button
          type="button"
          onClick={() => setShowTranscript((s) => !s)}
          aria-expanded={showTranscript}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary underline-offset-2 hover:underline"
        >
          {showTranscript ? "Hide the transcript" : "Read the transcript"}
          <ChevronDown className={`h-4 w-4 transition ${showTranscript ? "rotate-180" : ""}`} />
        </button>

        {showTranscript && (
          <div className="mt-4 flex flex-col gap-2">
            {TRANSCRIPT.map((l, i) => {
              const isAmy = l.who === "amy";
              return (
                <p key={i} className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${isAmy ? "self-end rounded-br-md bg-primary text-primary-foreground" : "self-start rounded-bl-md bg-secondary"}`}>
                  <span className="mb-0.5 block text-[11px] font-extrabold uppercase tracking-wide opacity-70">{isAmy ? "Annie" : "Caller"}</span>
                  {l.text}
                </p>
              );
            })}
          </div>
        )}
      </div>
      <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-muted-foreground">
        Sample call with a fictional practice (Brightwater Family Dentistry). All calls are recorded for quality and training purposes.
      </p>
      <div className="mt-8 text-center">
        <CtaButton size="lg" />
        <p className="mt-3 text-sm font-semibold text-muted-foreground">14-day free trial · No credit card required · Get your own recorded test call</p>
      </div>
    </section>
  );
}
