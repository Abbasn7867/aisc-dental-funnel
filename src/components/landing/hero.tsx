import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { BadgeCheck, Clock, FileLock2, Lock, PhoneCall, ShieldCheck, X } from "lucide-react";
import logo from "@/assets/aisc-logo.png.asset.json";
import heroWide from "@/assets/landing/hero-amy-wide.webp";
import heroMobile from "@/assets/landing/hero-amy-mobile.webp";
import { CtaButton } from "@/components/site";
import { TRIAL_OFFER_SHORT } from "@/lib/funnel";
import { WatchIntroButton } from "./intro-video";
import { OfferLine, Strike, TypedCall, type CallLine } from "./shared";
import { CountUp, WordReveal } from "./motion-text";

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (sessionStorage.getItem("announceDismissed")) setOpen(false);
  }, []);
  if (!open) return null;
  return (
    <div className="relative z-50 bg-signature px-10 py-2 text-center text-sm font-semibold text-primary-foreground">
      <span>Launch offer: <OfferLine /></span>{" "}
      <Link to="/free-trial" className="ml-2 font-extrabold underline underline-offset-4">Book a Free Trial →</Link>
      <button
        aria-label="Dismiss announcement"
        onClick={() => { sessionStorage.setItem("announceDismissed", "1"); setOpen(false); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-primary-deep/40"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

const NAV = [
  ["Problems", "#problems"], ["AI Team", "#team"], ["Test Call", "#test-call"], ["Pricing", "#pricing"], ["FAQ", "#faq"],
] as const;

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <nav aria-label="Main" className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-3 py-2 transition-all duration-300 ${scrolled ? "glass shadow-soft" : "bg-transparent"}`}>
        <Link to="/" className="flex items-center rounded-full bg-card px-3 py-1">
          <img src={logo.url} alt="AI Solution Company" className="h-8 w-auto md:h-9" />
        </Link>
        <div className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground lg:flex">
          {NAV.map(([l, h]) => <a key={h} href={h} className="hover:text-foreground">{l}</a>)}
        </div>
        <span className="flex flex-col items-center">
          <CtaButton />
          <span className="mt-0.5 text-[10px] font-semibold leading-tight text-muted-foreground sm:hidden">{TRIAL_OFFER_SHORT}</span>
          <span className="mt-0.5 hidden text-[10px] font-semibold leading-tight text-muted-foreground sm:block">✓ No credit card required</span>
        </span>
      </nav>
    </header>
  );
}

const HERO_CALL: CallLine[] = [
  { who: "amy", text: "Thanks for calling. All calls are recorded for quality and training purposes. This is Annie, how can I help?" },
  { who: "caller", text: "Hi, my son needs a cleaning. Do you have anything after school?" },
  { who: "amy", text: "Happy to help. I have Wednesday at 3:45 or Thursday at 4:15. Which works better?" },
  { who: "caller", text: "Thursday at 4:15, please." },
  { who: "amy", text: "Done. I'll text a reminder two days before, plus a link for his intake forms." },
];

const FLOATERS = [
  { text: "New patient booked ✓", pos: "-left-6 -top-10 md:-left-16", depth: 18 },
  { text: "Insurance checked ✓", pos: "-right-4 top-28 md:-right-16", depth: -24 },
  { text: "Reminder sent ✓", pos: "-left-4 bottom-24 md:-left-20", depth: -14 },
  { text: "Review request sent ✓", pos: "-right-2 -bottom-4 md:-right-10", depth: 22 },
];

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 15 });
  const sy = useSpring(my, { stiffness: 60, damping: 15 });
  const { scrollY } = useScroll();
  const scrollShift = useTransform(scrollY, [0, 600], [0, -60]);
  const rotX = useTransform(sy, [-1, 1], [6, -6]);
  const rotY = useTransform(sx, [-1, 1], [-8, 8]);

  return (
    <section
      className="bg-mesh relative -mt-[4.5rem] overflow-hidden pt-[4.5rem]"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
    >
      {/* Desktop background: subject in the right third (face ~75% 28%), heading sits on the calm left side */}
      <img src={heroWide} alt="" aria-hidden width={1920} height={832} fetchPriority="high" className="absolute inset-x-0 -top-[11%] hidden h-[111%] w-full object-cover object-[75%_30%] lg:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-background via-background/85 to-background/0 lg:block" />
      <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-background to-transparent lg:block" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 pb-20 pt-14 lg:min-h-[720px] lg:grid-cols-[1.1fr_1fr] lg:pt-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold">
            <span className="pulse-ring h-2.5 w-2.5 rounded-full bg-accent" /> Live 24/7 · nights, weekends &amp; holidays
          </span>
          <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-[4.1rem]">
            <WordReveal segments={[{ text: "Your dental practice, always answering." }, { text: "Every call booked, every chair filled.", className: "text-gradient" }]} />
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Meet Annie and the AI Front Office team: <CountUp value={8} /> AI employees that answer, book, follow up and report for your practice, 24/7.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CtaButton size="lg" />
            <WatchIntroButton />
            <a href="#pricing" className="rounded-full border bg-card px-6 py-3.5 font-bold text-primary shadow-sm hover:-translate-y-0.5 transition">See Pricing</a>
          </div>
          <p className="mt-3 text-sm font-semibold text-muted-foreground">✓ No credit card required · Ready in minutes</p>
          <p className="mt-3 text-sm font-semibold text-muted-foreground">
            <CountUp value={14} /> days free · No credit card required · $0 setup (was <Strike>$1,000</Strike>) · <CountUp value={250} prefix="$" /> bonus credits
          </p>
          {/* Mobile/tablet: 4:5 art-directed crop shown as its own block so the face is never sliced */}
          <picture className="mt-10 block overflow-hidden rounded-[2rem] shadow-soft lg:hidden">
            <source media="(min-width: 640px) and (max-width: 1023px)" srcSet={heroWide} />
            <img src={heroMobile} alt="Annie, your AI receptionist, wearing a headset at the dental reception desk" width={928} height={1152} className="aspect-[4/5] w-full object-cover object-[50%_35%] sm:aspect-[21/9] sm:object-[75%_30%]" />
          </picture>
        </motion.div>

        <motion.div style={{ y: scrollShift }} className="perspective relative mx-auto w-full max-w-md lg:mr-0 lg:mt-72 lg:max-w-sm lg:self-end">
          <motion.div style={{ rotateX: rotX, rotateY: rotY }} className="preserve-3d glass rounded-[2rem] p-5 shadow-soft">
            <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5"><PhoneCall className="h-3.5 w-3.5 text-primary" /> Incoming · Your practice line</span>
              <span className="rounded-full bg-mint-soft px-2 py-0.5 text-foreground">Live</span>
            </div>
            <TypedCall lines={HERO_CALL} outcome="Booked · Thu 4:15 PM" playKey="hero" loop />
          </motion.div>
          {FLOATERS.map((f, i) => (
            <Floater key={f.text} {...f} i={i} sx={sx} sy={sy} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Floater({ text, pos, depth, i, sx, sy }: { text: string; pos: string; depth: number; i: number; sx: ReturnType<typeof useSpring>; sy: ReturnType<typeof useSpring> }) {
  const x = useTransform(sx, [-1, 1], [-depth, depth]);
  const y = useTransform(sy, [-1, 1], [-depth / 1.5, depth / 1.5]);
  return (
    <motion.div style={{ x, y }} className={`absolute ${pos} z-10 hidden sm:block`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: i % 2 ? 3 : -3 }}
        transition={{ delay: 0.8 + i * 0.45, type: "spring", stiffness: 200, damping: 14 }}
        className="float-y glass rounded-2xl px-4 py-2.5 text-sm font-extrabold shadow-soft"
        style={{ animationDelay: `${-i * 1.4}s` }}
      >
        <span className="text-primary">{text}</span>
      </motion.div>
    </motion.div>
  );
}

const TRUST = [
  { icon: ShieldCheck, label: "HIPAA compliant" },
  { icon: Lock, label: "SOC 2 compliant" },
  { icon: FileLock2, label: "BAA available" },
  { icon: Clock, label: "24/7" },
  { icon: BadgeCheck, label: "Your own number in minutes" },
];

export function TrustStrip() {
  const row = (aria: boolean) => (
    <ul aria-hidden={!aria} className="flex shrink-0 items-center gap-8 px-4 md:gap-12">
      {TRUST.map(({ icon: I, label }) => (
        <li key={label} className="flex items-center gap-2 whitespace-nowrap text-sm font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-mint-soft"><I className="h-4 w-4 text-primary" /></span>
          {label}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="border-y bg-card py-4">
      <div className="mx-auto hidden max-w-6xl justify-center md:flex">{row(true)}</div>
      <div className="flex overflow-hidden md:hidden">
        <div className="marquee flex">{row(true)}{row(false)}</div>
      </div>
    </div>
  );
}
