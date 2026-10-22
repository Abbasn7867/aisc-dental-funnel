import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, CalendarClock, CheckCircle2, CreditCard, DoorOpen, ListChecks, Mic, PhoneCall, Plug, Stethoscope, Users } from "lucide-react";
import { SETUP_URL } from "@/lib/funnel";
import trialBg from "@/assets/landing/band-trial.webp";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Your Free Trial Is Booked! | AI Solution Company" },
      { name: "description", content: "Your 14-day free trial is booked. Taking you to the Setup Wizard to get your AI front office live." },
      { property: "og:title", content: "Your Free Trial Is Booked!" },
      { property: "og:description", content: "Set up your AI front office in minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

const SECONDS = 4;
const STEPS = [
  { icon: Building2, text: "Your Practice Details" },
  { icon: Stethoscope, text: "Who Sees Patients?" },
  { icon: CalendarClock, text: "When Are You Open?" },
  { icon: ListChecks, text: "Which Services Do You Offer?" },
  { icon: DoorOpen, text: "Your Treatment Rooms", note: "Medical: Your Exam Rooms" },
  { icon: CreditCard, text: "Insurance and Payments" },
  { icon: Mic, text: "How Should Amy Answer?" },
  { icon: Users, text: "Invite Your Team", note: "Optional" },
  { icon: Plug, text: "Connect Your Scheduling Software", note: "Optional" },
  { icon: CheckCircle2, text: "You're All Set" },
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
    if (left <= 0) { window.location.href = SETUP_URL; return; }
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
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Your Free Trial Is Booked!</h1>
      <p className="mt-4 text-lg text-muted-foreground">Taking you to the Setup Wizard to get your AI front office live…</p>
      <div className="mt-8 flex flex-col items-center gap-5">
        <svg width="64" height="64" viewBox="0 0 64 64" aria-label={paused ? "Redirect paused" : `Redirecting in ${left} seconds`} role="img">
          <circle cx="32" cy="32" r={r} fill="none" stroke="var(--muted)" strokeWidth="6" />
          <circle cx="32" cy="32" r={r} fill="none" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c}
            strokeDashoffset={c * (1 - left / SECONDS)} transform="rotate(-90 32 32)" style={{ transition: "stroke-dashoffset 1s linear" }} />
          <text x="32" y="38" textAnchor="middle" className="fill-foreground text-lg font-extrabold">{paused ? "II" : left}</text>
        </svg>
        <a href={SETUP_URL} className="rounded-full bg-primary px-7 py-3.5 font-bold text-primary-foreground shadow-glow hover:bg-primary-deep">Start Setup Now</a>
      </div>

      <section className="mt-14 rounded-3xl border bg-card p-6 text-left shadow-soft sm:p-8">
        <h2 className="text-2xl font-extrabold">What Happens Next — Get Set Up in Minutes</h2>
        <ol className="mt-5 space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.text} className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint-soft"><s.icon className="h-4 w-4 text-primary" /></span>
              <span className="flex-1 font-semibold">{i + 1}. {s.text}</span>
              {s.note && <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold">{s.note}</span>}
            </li>
          ))}
        </ol>
        <p className="mt-6 flex gap-3 rounded-2xl bg-muted p-4 text-sm">
          <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          Then your practice gets its own booking line, and our test caller rings Amy. The call is recorded, and the recording appears on your dashboard and is emailed to you within 3–4 minutes.
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
