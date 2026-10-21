import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/** Word-by-word reveal. Each segment can carry its own className (e.g. gradient text). */
export function WordReveal({ segments, delay = 0.1, step = 0.07 }: { segments: { text: string; className?: string }[]; delay?: number; step?: number }) {
  const reduce = useReducedMotion();
  let n = 0;
  return (
    <>
      <span className="sr-only">{segments.map((s) => s.text).join(" ")}</span>
      <span aria-hidden>
        {segments.map((seg, si) =>
          seg.text.split(" ").map((w, wi) => {
            const i = n++;
            return (
              <span key={`${si}-${wi}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className={`inline-block ${seg.className ?? ""}`}
                  initial={reduce ? false : { y: "105%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: delay + i * step, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>
                {"\u00a0"}
              </span>
            );
          }),
        )}
      </span>
    </>
  );
}

/** Counts from 0 to `value` once it scrolls into view. */
export function CountUp({ value, duration = 1400, prefix = "", suffix = "" }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  // Show the real number until the animation actually runs, so it never gets stuck at 0.
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); setN(null); };
  }, [inView, reduce, value, duration]);
  const shown = n ?? value;
  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{prefix}{value.toLocaleString("en-US")}{suffix}</span>
      <span aria-hidden>{prefix}{shown.toLocaleString("en-US")}{suffix}</span>
    </span>
  );
}
