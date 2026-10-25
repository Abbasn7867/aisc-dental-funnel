import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Captions, Play, X } from "lucide-react";
import { INTRO_VIDEO_URL } from "@/lib/funnel";
import heroPoster from "@/assets/landing/hero-amy-wide.webp";
import { SectionHead } from "./shared";

export const INTRO_VIDEO_ENABLED = INTRO_VIDEO_URL.length > 0;

const TRANSCRIPT: { t: string; line: string }[] = [
  { t: "0:00", line: "Meet your AI front office: eight AI employees, led by Amy, built for dental practices." },
  { t: "0:07", line: "Amy answers every call, day or night, and books patients straight into your schedule." },
  { t: "0:15", line: "Leena fills open slots from your waitlist. Morgan handles intake forms, eligibility and benefits." },
  { t: "0:24", line: "Stephanie brings lapsed patients back. Elise turns happy visits into reviews. Joseph routes every fax and referral." },
  { t: "0:33", line: "Kim follows up on unscheduled treatment plans, and Trisha reports on all of it, every morning." },
  { t: "0:41", line: "Setup takes minutes with the Setup Wizard, and your recorded test call arrives right after." },
  { t: "0:49", line: "Your team focuses on the patients in the chair. Your AI front office handles the rest." },
  { t: "0:55", line: "Book a free trial today — no credit card required — and hear Amy answer for your practice." },
];

function IntroLightbox({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label="Intro video" className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4" onClick={onClose}>
      <button aria-label="Close video" onClick={onClose} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-card text-foreground shadow-soft"><X className="h-5 w-5" /></button>
      <video
        ref={ref}
        src={INTRO_VIDEO_URL}
        poster={heroPoster}
        autoPlay
        muted
        loop
        playsInline
        controls
        className="max-h-[85vh] w-full max-w-5xl rounded-2xl shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <track kind="captions" label="English" srcLang="en" src="/captions/intro.vtt" default />
      </video>
    </div>
  );
}

export function WatchIntroButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  if (!INTRO_VIDEO_ENABLED) return null;
  return (
    <>
      <button onClick={() => setOpen(true)} className={`inline-flex items-center gap-2 rounded-full border bg-card px-6 py-3.5 font-bold text-primary shadow-sm transition hover:-translate-y-0.5 ${className}`}>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="h-3 w-3 fill-current" /></span>
        Watch the Intro
      </button>
      {open && <IntroLightbox onClose={() => setOpen(false)} />}
    </>
  );
}

export function IntroVideoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const [playing, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <SectionHead center eyebrow="Watch the intro" title={<>Meet Your AI Front Office in <span className="text-gradient">60 Seconds</span></>} sub="A quick tour of Amy and the team, and how they work for your practice." />
      <div ref={ref} className="relative mx-auto mt-12 aspect-video max-w-5xl overflow-hidden rounded-[2rem] shadow-soft">
        {INTRO_VIDEO_ENABLED && inView && playing ? (
          <video src={INTRO_VIDEO_URL} poster={heroPoster} autoPlay controls playsInline className="h-full w-full object-cover">
            <track kind="captions" label="English" srcLang="en" src="/captions/intro.vtt" default />
          </video>
        ) : INTRO_VIDEO_ENABLED ? (
          <button onClick={() => setPlaying(true)} aria-label="Play the intro video" className="group relative block h-full w-full">
            <img src={heroPoster} alt="Amy, your AI receptionist, at the dental reception desk" loading="lazy" className="h-full w-full object-cover object-[75%_30%]" />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow transition group-hover:scale-110">
              <Play className="h-8 w-8 fill-current" />
            </span>
            <span className="absolute bottom-5 left-6 flex items-center gap-2 rounded-full bg-card/90 px-4 py-1.5 text-sm font-extrabold text-foreground">
              <Captions className="h-4 w-4 text-primary" /> Captions available
            </span>
          </button>
        ) : (
          <div className="relative h-full w-full">
            <img src={heroPoster} alt="Amy, your AI receptionist, at the dental reception desk" loading="lazy" className="h-full w-full object-cover object-[75%_30%]" />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/10" />
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="rounded-full bg-card/95 px-6 py-3 text-base font-extrabold text-primary shadow-soft">Video coming shortly</span>
              <span className="max-w-md text-sm font-semibold text-primary-foreground/90">We're adding the intro video now. Once it's in, it plays right here with captions.</span>
            </span>
          </div>
        )}

      </div>
      <div className="mx-auto mt-6 max-w-5xl text-center">
        <button onClick={() => setShowTranscript((s) => !s)} aria-expanded={showTranscript} className="rounded-full border bg-card px-5 py-2 text-sm font-bold text-primary shadow-sm hover:bg-secondary">
          {showTranscript ? "Hide the Transcript" : "Read the Transcript"}
        </button>
        {showTranscript && (
          <ol className="mt-5 space-y-2 rounded-3xl border bg-card p-6 text-left shadow-soft">
            {TRANSCRIPT.map((l) => (
              <li key={l.t} className="flex gap-4 text-sm">
                <span className="w-10 shrink-0 font-extrabold tabular-nums text-primary">{l.t}</span>
                <span>{l.line}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
