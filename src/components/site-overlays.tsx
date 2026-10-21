import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import amy from "@/assets/amy.png.asset.json";

const HIDDEN_ROUTES = ["/free-trial", "/thank-you"];
const POPUP_EVENT = "aisc-popup";

function useHiddenRoute() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return HIDDEN_ROUTES.includes(path);
}

/** Frosted bottom CTA bar, portaled under <body> so backdrop-filter works. */
export function CtaBar() {
  const hiddenRoute = useHiddenRoute();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [formFocus, setFormFocus] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDismissed(!!sessionStorage.getItem("ctaBarDismissed"));
    const onScroll = () => setScrolled(window.scrollY > 300);
    const onFocus = () => setFormFocus(!!(document.activeElement as HTMLElement | null)?.closest("[data-trial-form]"));
    const onPopup = (e: Event) => setPopupOpen((e as CustomEvent<boolean>).detail);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", () => setTimeout(onFocus, 0));
    window.addEventListener(POPUP_EVENT, onPopup);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onFocus);
      window.removeEventListener(POPUP_EVENT, onPopup);
    };
  }, []);

  const visible = !hiddenRoute && !dismissed && scrolled && !formFocus && !popupOpen;
  const reserve = !hiddenRoute && !dismissed;

  useEffect(() => {
    document.body.style.paddingBottom = reserve ? "calc(7.5rem + 24px)" : "";
    return () => { document.body.style.paddingBottom = ""; };
  }, [reserve]);

  if (!mounted) return null;
  return createPortal(
    <div
      role="region"
      aria-label="Free trial offer"
      aria-hidden={!visible}
      className="cta-frost shimmer-top fixed inset-x-3 z-50 mx-auto max-w-[880px] rounded-2xl p-3 transition-transform duration-500 ease-out sm:inset-x-4 sm:p-4"
      style={{
        bottom: 16,
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        transform: visible ? "translateY(0)" : "translateY(calc(100% + 40px))",
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 pr-8 sm:flex-1 sm:pr-0">
          <span className="relative shrink-0">
            <img src={amy.url} alt="" className="h-11 w-11 rounded-full object-cover object-top" />
            <span className="pulse-ring absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-accent" />
          </span>
          <div className="text-sm leading-snug">
            <p className="font-extrabold">14-day free trial · Setup <s>$1,000</s> $0 · +$250 bonus credits</p>
            <p className="text-muted-foreground">Amy answers and books your practice's calls 24/7.</p>
          </div>
        </div>
        <Link to="/free-trial" tabIndex={visible ? 0 : -1} className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground sm:w-auto">
          Book a Free Trial
        </Link>
      </div>
      <button
        aria-label="Close offer bar"
        tabIndex={visible ? 0 : -1}
        onClick={() => { sessionStorage.setItem("ctaBarDismissed", "1"); setDismissed(true); }}
        className="absolute right-2 top-2 rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
      >
        <X className="h-4 w-4" />
      </button>
    </div>,
    document.body,
  );
}

/** "Before you go" exit-intent pop-up. */
export function ExitPopup() {
  const hiddenRoute = useHiddenRoute();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (hiddenRoute) return;
    if (sessionStorage.getItem("exitPopupShown")) return;
    const start = Date.now();
    const show = () => {
      if (Date.now() - start < 8000 || sessionStorage.getItem("exitPopupShown")) return;
      sessionStorage.setItem("exitPopupShown", "1");
      lastFocus.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (!isMobile) {
      const onLeave = (e: MouseEvent) => { if (e.clientY <= 0 && !e.relatedTarget) show(); };
      document.addEventListener("mouseout", onLeave);
      return () => document.removeEventListener("mouseout", onLeave);
    }
    const timer = setTimeout(show, 45000);
    const onScroll = () => {
      const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (depth >= 0.6) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, [hiddenRoute]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(POPUP_EVENT, { detail: open }));
    if (!open) { lastFocus.current?.focus?.(); return; }
    const el = dialogRef.current;
    el?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && el) {
        const f = Array.from(el.querySelectorAll<HTMLElement>("a,button"));
        const first = f[0], last = f[f.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && !hiddenRoute && (
        <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-ink/50 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-title"
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 260, damping: 20 }}
            className="glass relative w-full max-w-md rounded-[2rem] p-8 text-center shadow-soft"
          >
            <button aria-label="Close" onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-secondary"><X className="h-4 w-4" /></button>
            <div className="relative mx-auto h-20 w-20">
              <img src={amy.url} alt="Amy, AI receptionist" className="pulse-ring h-20 w-20 rounded-full object-cover object-top ring-4 ring-accent" />
            </div>
            <div className="mx-auto mt-3 flex h-6 w-24 items-center justify-center gap-[3px]" aria-hidden>
              {Array.from({ length: 12 }).map((_, i) => <span key={i} className="wave-bar w-[3px] rounded-full bg-signature" style={{ height: `${40 + ((i * 29) % 60)}%`, animationDelay: `${i * 80}ms` }} />)}
            </div>
            <h2 id="exit-title" className="mt-4 text-3xl font-extrabold">Before you go</h2>
            <p className="mt-3 text-muted-foreground">Try the full platform free for 14 days, and hear Amy answer your practice's questions within 3–4 minutes of setup.</p>
            <span className="mt-4 inline-block rounded-full bg-mint-soft px-4 py-1.5 text-sm font-extrabold">Setup <s>$1,000</s> $0 · +$250 bonus credits</span>
            <Link to="/free-trial" onClick={() => setOpen(false)} className="mt-6 flex w-full items-center justify-center rounded-full bg-primary py-3.5 font-bold text-primary-foreground shadow-glow">Book a Free Trial</Link>
            <button onClick={() => setOpen(false)} className="mt-3 text-sm font-semibold text-muted-foreground underline">No thanks, I'll keep browsing</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
