import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { AGENT_PHOTOS, Waveform } from "@/components/landing/shared";

/** "Joseph Called Amy": the FAQ test call every practice gets after setup.
 *  Styled with the site's own tokens (bg-card, shadow-soft, primary, secondary, mint-soft) so it
 *  sits inside the dark #test-call band like the original dashboard card. */
const AUDIO_SRC = "/audio/Dental-call-web.mp3";

type Line = { t: number; who: "amy" | "joseph"; text: string };
const LINES: Line[] = [
  { t: 0.0, who: "amy", text: "Thank you for calling Brightwater Family Dentistry. This is Amy. How can I help you today?" },
  { t: 6.47, who: "joseph", text: "Hey, hi there! So, uh, I've got a few quick questions about your practice. Mind if I ask? First... what are your office hours?" },
  { t: 15.76, who: "amy", text: "Of course. We are open Monday through Friday from 7 AM to 4 PM, with evening appointments on Tuesdays and Thursdays until 6 PM. We are closed on weekends." },
  { t: 27.26, who: "joseph", text: "Alright, got it. That works for me. And where's your office located?" },
  { t: 33.03, who: "amy", text: "We are located at 3940 Fourth Ave, Suite 202, San Diego, CA 92103, in Hillcrest. Free parking is available in the lot behind the building." },
  { t: 45.33, who: "joseph", text: "Hmm, okay... yeah, I think I know that area. Now, uh, the big question... what insurance or payment options do you take?" },
  { t: 55.95, who: "amy", text: "We accept most PPO plans, including Delta Dental, Cigna, MetLife, Aetna and Guardian. If you don't have insurance, our new patient special is $129, and it includes an exam, X-rays and a cleaning. We also offer CareCredit financing." },
  { t: 73.61, who: "joseph", text: "I see, okay. That helps a lot. And if something urgent comes up... do you handle same-day requests?" },
  { t: 82.77, who: "amy", text: "Yes. We keep time open every weekday for same-day dental emergencies, like a toothache or a broken tooth. After hours, you can call (619) 555-0141, and our on-call dentist will call you back." },
  { t: 97.69, who: "joseph", text: "Okay, good to know. Who would I be working with there?" },
  { t: 102.37, who: "amy", text: "You would see Dr. Elena Park or Dr. James Whitfield. Both are general dentists, and they work with our team of hygienists." },
  { t: 110.46, who: "joseph", text: "Nice, great to know that. And what services do you offer?" },
  { t: 115.09, who: "amy", text: "We offer cleanings, exams, X-rays, fillings, crowns, root canals, implants, Invisalign and teeth whitening. We also offer nitrous oxide for patients who feel nervous." },
  { t: 127.45, who: "joseph", text: "Oh, okay, nice. Good to know. Are you taking new clients right now?" },
  { t: 133.41, who: "amy", text: "Yes, we are welcoming new patients." },
  { t: 136.23, who: "joseph", text: "Perfect, good to hear. And, uh, one last thing... do you have a website I can check out?" },
  { t: 141.95, who: "amy", text: "Yes. Our website is brightwaterfamilydentistry.com. You can also fill out your new patient forms there. Is there anything else I can help you with?" },
  { t: 151.68, who: "joseph", text: "Awesome, I'll take a look. That answers all my questions. Nice team, really appreciate your help. Have a great day!" },
  { t: 159.15, who: "amy", text: "You're welcome. Thank you for calling Brightwater Family Dentistry. Goodbye." },
];

/** Question chips and the index of Amy's answer line that completes each one. */
const QUESTIONS: { label: string; answer: number }[] = [
  { label: "Office hours", answer: 2 },
  { label: "Location", answer: 4 },
  { label: "Insurance & payment", answer: 6 },
  { label: "Same-day requests", answer: 8 },
  { label: "Who you'll see", answer: 10 },
  { label: "Services", answer: 12 },
  { label: "New patients", answer: 14 },
  { label: "Website", answer: 16 },
];

const fmt = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "--:--");

export function TestCallSection() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(164.1);
  const [failed, setFailed] = useState(false);
  const [started, setStarted] = useState(false);

  let current = -1;
  LINES.forEach((l, i) => { if (time >= l.t - 0.05) current = i; });
  if (!started) current = -1;
  const allDone = started && current >= 16;

  // Keep the line being spoken in view while the call plays.
  useEffect(() => {
    const box = boxRef.current, el = lineRefs.current[current];
    if (!playing || !box || !el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ top: el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2, behavior: reduce ? "auto" : "smooth" });
  }, [current, playing]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) void a.play().catch(() => setFailed(true));
    else a.pause();
  };
  const seek = (secs: number) => {
    const a = audioRef.current;
    if (!a) return;
    const d = Number.isFinite(a.duration) ? a.duration : duration;
    a.currentTime = Math.min(d, Math.max(0, secs));
    setTime(a.currentTime);
    setStarted(true);
  };
  const seekFromPointer = (clientX: number) => {
    const bar = barRef.current;
    if (!bar) return;
    const r = bar.getBoundingClientRect();
    seek(((clientX - r.left) / r.width) * duration);
  };
  const playFrom = (secs: number) => {
    seek(secs);
    if (audioRef.current?.paused) toggle();
  };
  const progress = duration > 0 ? Math.min(100, (time / duration) * 100) : 0;

  return (
    <div className="rounded-[1.75rem] bg-card p-5 text-card-foreground shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <img src={AGENT_PHOTOS.joseph} alt="" aria-hidden className="h-9 w-9 rounded-full object-cover object-[50%_20%] ring-2 ring-card" />
            <img src={AGENT_PHOTOS.amy} alt="" aria-hidden className="h-9 w-9 rounded-full object-cover object-[50%_20%] ring-2 ring-card" />
          </div>
          <div>
            <p className="font-extrabold leading-tight">Joseph Called Amy</p>
            <p className="text-xs font-semibold text-muted-foreground">Live FAQ check on your booking line</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-muted-foreground">Sample call</span>
      </div>

      {!failed && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-background p-4">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause the test call" : "Play the test call"}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow transition hover:scale-105 active:scale-95"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-extrabold">Test call · {fmt(duration)} · Recording ready</p>
              <span className="hidden sm:block"><Waveform active={playing} bars={14} /></span>
            </div>
            <div
              ref={barRef}
              role="slider"
              aria-label="Test call progress"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(time)}
              tabIndex={0}
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); seekFromPointer(e.clientX); }}
              onPointerMove={(e) => { if (e.buttons === 1) seekFromPointer(e.clientX); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") { e.preventDefault(); seek(time + 5); }
                if (e.key === "ArrowLeft") { e.preventDefault(); seek(time - 5); }
              }}
              className="group relative mt-1 h-5 cursor-pointer touch-none"
            >
              <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-secondary" />
              <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
              <div className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow transition group-hover:scale-110" style={{ left: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs font-bold tabular-nums text-muted-foreground">
              <span>{fmt(time)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="metadata"
        onPlay={() => { setPlaying(true); setStarted(true); }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => { if (Number.isFinite(e.currentTarget.duration)) setDuration(e.currentTarget.duration); }}
        onError={() => setFailed(true)}
      />

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Questions Joseph asks">
        {QUESTIONS.map((q) => {
          const done = started && current >= q.answer;
          return (
            <li key={q.label} className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${done ? "bg-mint-soft text-primary" : "bg-secondary text-muted-foreground"}`}>
              {done ? "✓ " : ""}{q.label}
            </li>
          );
        })}
      </ul>

      <div ref={boxRef} role="log" aria-label="Test call transcript" className="relative mt-3 flex max-h-56 flex-col gap-2 overflow-y-auto p-1">
        {LINES.map((l, i) => {
          const isAmy = l.who === "amy";
          const now = i === current;
          return (
            <div
              key={i}
              ref={(el) => { lineRefs.current[i] = el; }}
              role="button"
              tabIndex={0}
              onClick={() => playFrom(l.t)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); playFrom(l.t); } }}
              className={`max-w-[85%] cursor-pointer rounded-2xl px-3.5 py-2 text-sm transition ${isAmy ? "self-end rounded-br-md bg-primary text-primary-foreground" : "self-start rounded-bl-md bg-secondary"} ${started && !now ? "opacity-60" : ""} ${now ? "ring-2 ring-accent ring-offset-2 ring-offset-card" : ""}`}
            >
              <span className="mb-0.5 block text-[11px] font-extrabold uppercase tracking-wide opacity-70">{isAmy ? "Amy · AI receptionist" : "Joseph · AI test caller"}</span>
              {l.text}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        {allDone ? (
          <span className="rounded-full bg-mint-soft px-3 py-1 text-xs font-extrabold text-primary">All FAQs answered ✓</span>
        ) : (
          <span className="text-xs font-semibold text-muted-foreground">{failed ? "Audio couldn't load. The full call is shown above." : "Tap any line to jump to it."}</span>
        )}
        {!failed && (
          <button type="button" onClick={() => playFrom(0)} className="inline-flex items-center gap-1.5 text-sm font-bold text-primary underline-offset-2 hover:underline">
            <RotateCcw className="h-3.5 w-3.5" /> Replay call
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Sample practice (Brightwater Family Dentistry). This test call doesn't use your trial credits. Yours appears on your dashboard and in your inbox after setup.</p>
    </div>
  );
}
