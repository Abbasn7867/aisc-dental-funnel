import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/aisc-logo.png.asset.json";
import { LEGAL } from "@/lib/funnel";

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
          <Link to="/front-office" className="font-bold text-primary hover:text-foreground">Full tour</Link>
          <a href="/#team" className="hover:text-foreground">AI team</a>
          <a href="/#how" className="hover:text-foreground">How it works</a>
          <a href="/#pricing" className="hover:text-foreground">See pricing</a>
          <a href="/#faq" className="hover:text-foreground">FAQ</a>
        </div>
        <CtaButton />
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
          <img src={logo.url} alt="AI Solution Company" className="h-12 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The Complete AI Front Office for dental practices. Eight AI employees, led by Amy, that free your team for the patients in the chair.
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
          <p className="mt-6">© AI Solution Company</p>
        </div>
      </div>
    </footer>
  );
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(!localStorage.getItem("aisc-cookie-choice"));
  }, []);
  if (!show) return null;
  const choose = (v: string) => {
    localStorage.setItem("aisc-cookie-choice", v);
    setShow(false);
  };
  return (
    <div role="dialog" aria-label="Cookie notice" className="glass fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl p-5 shadow-soft">
      <p className="text-sm">
        We use essential cookies to run this site. With your OK, we'd also use analytics cookies to improve it. Nothing optional loads until you choose.{" "}
        <a href={LEGAL.cookies} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">Cookie Policy</a>
      </p>
      <div className="mt-4 flex gap-3">
        <button onClick={() => choose("all")} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">Accept all</button>
        <button onClick={() => choose("essential")} className="rounded-full border bg-card px-5 py-2 text-sm font-bold">Essential only</button>
      </div>
    </div>
  );
}
