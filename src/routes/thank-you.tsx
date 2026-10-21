import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, CalendarClock, HelpCircle, Mic, Plug, Users, PhoneCall } from "lucide-react";
import { DASHBOARD_URL } from "@/lib/funnel";
import trialBg from "@/assets/landing/band-trial.webp";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Your free trial is booked! | AI Solution Company" },
      { name: "description", content: "Your 14-day free trial is booked. Taking you to your dashboard to set up your AI front office." },
      { property: "og:title", content: "Your free trial is booked!" },
      { property: "og:description", content: "Set up your AI front office in about 10 minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

const SECONDS = 4;
const STEPS = [
  { icon: Building2, text: "Confirm your business details", time: "2 min" },
  { icon: CalendarClock, text: "Set your opening hours", time: "2 min" },
  { icon: HelpCircle, text: "Add your services and FAQs", time: "3 min" },
  { icon: Mic, text: "Personalize your receptionist's greeting", time: "1 min" },
  { icon: Plug, text: "Connect your scheduling software", time: "3 min" },
  { icon: Users, text: "Invite your team", time: "1 min" },
];
const MAILTO = "mailto:info@aisolutioncompany.com?subject=Please%20set%20up%20my%20AI%20front%20office";

function ThankYou() {
  const [left, setLeft] = useState(SECONDS);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let stop = false;
    import("canvas-confetti").then(({ default: confetti }) => {
      const colors = ["#0B5CC4", "#2DD4A3", "#F2F8FF", "#FF5DA2", "#FFC531", "#FF7A3D", "#8B5CF6"];
      const end = Date.now() + 3000;
      (function frame() {
        if (stop) return;
        confetti({ particleCount: 7, startVelocity: 0, ticks: 300, gravity: 0.8, spread: 360, origin: { x: Math.random(), y: -0.05 }, colors, scalar: 1.1 });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    });
    return () => { stop = true; };
  }, []);

  useEffect(() => {
    if (paused) return;
    if (left <= 0) { window.location.href = DASHBOARD_URL; return; }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, paused]);

  const r = 26, c = 2 * Math.PI * r;
  return (
    <div className="relative isolate">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
        <img src={trialBg} alt="" width={1920} height={640} className="h-full w-full object-cover object-[70%_50%] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </div>
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Your free trial is booked!</h1>
      <p className="mt-4 text-lg text-muted-foreground">Taking you to your dashboard to set up your AI front office…</p>
      <div className="mt-8 flex flex-col items-center gap-5">
        <svg width="64" height="64" viewBox="0 0 64 64" aria-label={paused ? "Redirect paused" : `Redirecting in ${left} seconds`} role="img">
          <circle cx="32" cy="32" r={r} fill="none" stroke="var(--muted)" strokeWidth="6" />
          <circle cx="32" cy="32" r={r} fill="none" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c}
            strokeDashoffset={c * (1 - left / SECONDS)} transform="rotate(-90 32 32)" style={{ transition: "stroke-dashoffset 1s linear" }} />
          <text x="32" y="38" textAnchor="middle" className="fill-foreground text-lg font-extrabold">{paused ? "II" : left}</text>
        </svg>
        <a href={DASHBOARD_URL} className="rounded-full bg-primary px-7 py-3.5 font-bold text-primary-foreground shadow-glow hover:bg-primary-deep">Go to my dashboard now</a>
      </div>

      <section className="mt-14 rounded-3xl border bg-card p-6 text-left shadow-soft sm:p-8">
        <h2 className="text-2xl font-extrabold">What happens next — get set up in about 10 minutes</h2>
        <ol className="mt-5 space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.text} className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint-soft"><s.icon className="h-4 w-4 text-primary" /></span>
              <span className="flex-1 font-semibold">{i + 1}. {s.text}</span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold">{s.time}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 flex gap-3 rounded-2xl bg-muted p-4 text-sm">
          <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          Then your practice gets its own booking phone number, and our test caller rings Amy. The call is recorded, and the recording appears on your dashboard and is emailed to you within 3–4 minutes.
        </p>
      </section>

      <p className="mt-8 text-sm text-muted-foreground">
        <a href={MAILTO} onClick={() => setPaused(true)} className="font-semibold text-primary underline">
          Prefer we set it up for you? Share your information and our team will configure everything (setup <s>$1,000</s> $0)
        </a>
      </p>
    </main>
    </div>
  );
}
