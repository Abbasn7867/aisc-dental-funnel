import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/aisc-logo.png.asset.json";
import { LEGAL, TRIAL_OFFER_SHORT } from "@/lib/funnel";
import { loadAnalytics, readConsent, saveConsent, syncAnalyticsConsent, NOTICE_TEXT } from "@/lib/tracking";
import { Button } from "@/components/ui/button";

export function CtaButton({ size = "md", className = "" }: { size?: "md" | "lg"; className?: string }) {
  const pad = size === "lg" ? "px-8 py-4 text-base" : "px-5 py-2.5 text-sm";
  return (
    <Link
      to="/free-trial"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-primary font-bold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:bg-primary-deep ${pad} ${className}`}
    >
      Book a Free Trial <span aria-hidden>→</span>
    </Link>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2 shadow-soft" aria-label="Main">
        <Link to="/" className="flex items-center rounded-full bg-card px-3 py-1">
          <img src={logo.url} alt="AI Solution Company" className="h-9 w-auto" />
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground md:flex">
          <Link to="/" className="font-bold text-primary hover:text-foreground">Full Tour</Link>
          <a href="/#team" className="hover:text-foreground">AI Team</a>
          <a href="/#how" className="hover:text-foreground">How It Works</a>
          <Link to="/configure" className="hover:text-foreground">Build Yours</Link>
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          <a href="/#faq" className="hover:text-foreground">FAQ</a>
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

export function LegalLinks({ className = "" }: { className?: string }) {
  const items: [string, string][] = [
    ["Privacy Policy", LEGAL.privacy],
    ["Terms of Service", LEGAL.terms],
    ["Cookie Policy", LEGAL.cookies],
    ["Accessibility Statement", LEGAL.accessibility],
  ];
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
      {items.map(([label, href]) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr]">
        <div>
          <img src={logo.url} alt="AI Solution Company" loading="lazy" decoding="async" className="h-12 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The Complete AI Front Office for dental practices. Eight AI employees, led by Annie, that free your team for the patients in the chair.
          </p>
          <p className="mt-4 text-sm font-semibold">Powered by AI Solution Company</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="flex flex-wrap gap-2">
            {["HIPAA compliant", "SOC 2 compliant", "BAA available"].map((b) => (
              <span key={b} className="rounded-full bg-mint-soft px-3 py-1 text-xs font-bold text-foreground">{b}</span>
            ))}
          </div>
          <LegalLinks className="mt-6" />
          <Link to="/tracking-privacy" className="mt-3 inline-block underline">Website measurement privacy</Link>
          <p className="mt-6 text-sm font-semibold text-foreground">14-day free trial · +$250 in free credits · No credit card required</p>
          <p className="mt-2">© AI Solution Company</p>
        </div>
      </div>
    </footer>
  );
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setShow(!readConsent());
    void loadAnalytics();
    const settings = () => setShow(true);
    const storage = () => syncAnalyticsConsent();
    window.addEventListener("aisc-cookie-settings", settings);
    window.addEventListener("storage", storage);
    return () => { window.removeEventListener("aisc-cookie-settings", settings); window.removeEventListener("storage", storage); };
  }, []);
  if (!show) return <Button variant="outline" size="sm" className="fixed bottom-1 left-1 z-50" onClick={() => setShow(true)}>Cookie settings</Button>;
  const choose = async (v: "all" | "essential") => {
    setSaving(true);
    try { await saveConsent(v); setShow(false); } finally { setSaving(false); }
  };
  return (
    <div role="dialog" aria-label="Cookie notice" className="glass fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl p-5 shadow-soft">
      <p className="text-sm">
        {NOTICE_TEXT}{" "}
        <Link to="/tracking-privacy" className="font-semibold text-primary underline">Website measurement privacy</Link>{" · "}
        <a href={LEGAL.cookies} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">Cookie Policy</a>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button disabled={saving} onClick={() => void choose("all")} className="rounded-full px-5 font-bold">Accept all</Button>
        <Button variant="outline" disabled={saving} onClick={() => void choose("essential")} className="rounded-full px-5 font-bold">Essential only</Button>
        {readConsent() && <Button variant="ghost" onClick={() => setShow(false)}>Close</Button>}
      </div>
    </div>
  );
}
