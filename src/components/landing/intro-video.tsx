import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Captions, Play, X } from "lucide-react";
import { INTRO_VIDEO_URL } from "@/lib/funnel";
import heroPoster from "@/assets/landing/hero-amy-wide.webp";
import { SectionHead } from "./shared";

export const INTRO_VIDEO_ENABLED = INTRO_VIDEO_URL.length > 0;

// Muted autoplay with captions on.
const embedUrl = `${INTRO_VIDEO_URL}?autoplay=1&mute=1&cc_load_policy=1&rel=0`;

function IntroLightbox({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label="Intro video" className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4" onClick={onClose}>
      <button aria-label="Close video" onClick={onClose} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-card text-foreground shadow-soft"><X className="h-5 w-5" /></button>
      <iframe
        src={embedUrl}
        title="Meet Your AI Front Office in 60 Seconds"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="aspect-video max-h-[85vh] w-full max-w-5xl rounded-2xl shadow-glow"
        onClick={(e) => e.stopPropagation()}
      />
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
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <SectionHead center eyebrow="Watch the intro" title={<>Meet Your AI Front Office in <span className="text-gradient">60 Seconds</span></>} sub="A quick tour of Amy and the team, and how they work for your practice." />
      <div ref={ref} className="relative mx-auto mt-12 aspect-video max-w-5xl overflow-hidden rounded-[2rem] shadow-soft">
        {INTRO_VIDEO_ENABLED && inView && playing ? (
          <iframe
            src={embedUrl}
            title="Meet Your AI Front Office in 60 Seconds"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="h-full w-full"
          />
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
    </section>
  );
}
