import { useEffect, useRef } from "react";

const AUDIO_SRC = "/audio/Dental-call-web.mp3";

const CSS =
  '.aisc-tc{--tc-navy:#0B1F3A;--tc-ink:#14202B;--tc-muted:#5B6874;--tc-line:#E1E6EB;--tc-soft:#F4F6F8;--tc-card:#FFFFFF;--tc-acc:#6D4AFF;--tc-acc-soft:#EFEBFF;--tc-ok:#12805C;--tc-ok-soft:#E3F5EE;\n  font:15px/1.55 inherit;color:var(--tc-ink);max-width:880px;margin:0 auto;padding:0 16px;box-sizing:border-box}\n.aisc-tc *{box-sizing:border-box}\n.aisc-tc .tc-frame{background:var(--tc-card);border:1px solid var(--tc-line);border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(11,31,58,.10);position:relative}\n.aisc-tc .tc-badge{position:absolute;top:14px;right:14px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.3);padding:3px 9px;border-radius:999px}\n.aisc-tc .tc-dash{background:var(--tc-navy);color:#fff;padding:18px 20px;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center}\n.aisc-tc .tc-dash h3{margin:0;font-size:18px;font-weight:700}\n.aisc-tc .tc-dash p{margin:0;color:#B8C4D3;font-size:13px}\n.aisc-tc .tc-body{padding:18px 20px 20px;display:grid;gap:16px}\n.aisc-tc .tc-head{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:flex-start;justify-content:space-between}\n.aisc-tc .tc-eyebrow{font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--tc-acc)}\n.aisc-tc .tc-head h4{margin:2px 0 4px;font-size:20px}\n.aisc-tc .tc-head p{margin:0;color:var(--tc-muted);font-size:14px;max-width:60ch}\n.aisc-tc .tc-btn{border:0;border-radius:10px;background:var(--tc-acc);color:#fff;font:inherit;font-weight:600;padding:9px 16px;cursor:pointer}\n.aisc-tc .tc-btn:focus-visible,.aisc-tc .tc-line:focus-visible,.aisc-tc .tc-seek:focus-visible{outline:3px solid #9C86FF;outline-offset:2px}\n.aisc-tc .tc-qs{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}\n.aisc-tc .tc-qs li{font-size:13px;border:1px solid var(--tc-line);border-radius:999px;padding:4px 10px;color:var(--tc-muted);background:var(--tc-soft);transition:background .3s,color .3s,border-color .3s}\n.aisc-tc .tc-qs li.done{background:var(--tc-ok-soft);color:var(--tc-ok);border-color:#BFE6D5}\n.aisc-tc .tc-qs li.done::before{content:"✓ "}\n.aisc-tc .tc-player{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;background:var(--tc-soft);border:1px solid var(--tc-line);border-radius:12px;padding:10px 12px}\n.aisc-tc .tc-play{width:44px;height:44px;border-radius:50%;border:0;background:var(--tc-acc);color:#fff;font-size:16px;cursor:pointer;display:grid;place-items:center}\n.aisc-tc .tc-seek{width:100%;accent-color:var(--tc-acc);min-width:0}\n.aisc-tc .tc-time{font-variant-numeric:tabular-nums;font-size:13px;color:var(--tc-muted);white-space:nowrap}\n.aisc-tc .tc-note{font-size:12.5px;color:var(--tc-muted);margin:0}\n.aisc-tc .tc-script{max-height:340px;overflow-y:auto;border:1px solid var(--tc-line);border-radius:12px;padding:12px;display:grid;gap:8px;background:#FBFCFD}\n.aisc-tc .tc-line{display:grid;gap:2px;max-width:86%;padding:8px 12px;border-radius:12px;cursor:pointer;border:1px solid transparent;transition:background .25s,border-color .25s,opacity .25s}\n.aisc-tc .tc-line .who{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--tc-muted)}\n.aisc-tc .tc-line.j{justify-self:start;background:#fff;border-color:var(--tc-line)}\n.aisc-tc .tc-line.a{justify-self:end;background:var(--tc-acc-soft)}\n.aisc-tc .tc-script.playing .tc-line{opacity:.55}\n.aisc-tc .tc-script.playing .tc-line.now{opacity:1;border-color:var(--tc-acc);box-shadow:0 2px 10px rgba(109,74,255,.18)}\n.aisc-tc .tc-done{justify-self:start;font-size:13px;font-weight:700;color:var(--tc-ok);background:var(--tc-ok-soft);border-radius:999px;padding:5px 12px}\n.aisc-tc .tc-toast{position:absolute;right:16px;bottom:16px;background:var(--tc-navy);color:#fff;border-radius:12px;padding:10px 14px;font-size:13px;box-shadow:0 10px 30px rgba(0,0,0,.25);transform:translateY(20px);opacity:0;transition:.4s;pointer-events:none}\n.aisc-tc .tc-toast.show{transform:none;opacity:1}\n@media (max-width:560px){.aisc-tc .tc-line{max-width:100%}.aisc-tc .tc-player{grid-template-columns:auto 1fr}.aisc-tc .tc-time{grid-column:1/-1}}\n@media (prefers-reduced-motion:reduce){.aisc-tc *{transition:none!important}}\n';

const LINES: { s: "a" | "j"; t: number; who: string; text: string }[] = [
  {
    s: "a",
    t: 0.0,
    who: "Amy",
    text: "Thank you for calling Brightwater Family Dentistry. This is Amy. How can I help you today?",
  },
  {
    s: "j",
    t: 6.47,
    who: "Joseph",
    text: "Hey, hi there! So, uh, I've got a few quick questions about your practice. Mind if I ask? First... what are your office hours?",
  },
  {
    s: "a",
    t: 15.76,
    who: "Amy",
    text: "Of course. We are open Monday through Friday from 7 AM to 4 PM, with evening appointments on Tuesdays and Thursdays until 6 PM. We are closed on weekends.",
  },
  {
    s: "j",
    t: 27.26,
    who: "Joseph",
    text: "Alright, got it. That works for me. And where's your office located?",
  },
  {
    s: "a",
    t: 33.03,
    who: "Amy",
    text: "We are located at 3940 Fourth Ave, Suite 202, San Diego, CA 92103, in Hillcrest. Free parking is available in the lot behind the building.",
  },
  {
    s: "j",
    t: 45.33,
    who: "Joseph",
    text: "Hmm, okay... yeah, I think I know that area. Now, uh, the big question... what insurance or payment options do you take?",
  },
  {
    s: "a",
    t: 55.95,
    who: "Amy",
    text: "We accept most PPO plans, including Delta Dental, Cigna, MetLife, Aetna and Guardian. If you don't have insurance, our new patient special is $129, and it includes an exam, X-rays and a cleaning. We also offer CareCredit financing.",
  },
  {
    s: "j",
    t: 73.61,
    who: "Joseph",
    text: "I see, okay. That helps a lot. And if something urgent comes up... do you handle same-day requests?",
  },
  {
    s: "a",
    t: 82.77,
    who: "Amy",
    text: "Yes. We keep time open every weekday for same-day dental emergencies, like a toothache or a broken tooth. After hours, you can call (619) 555-0141, and our on-call dentist will call you back.",
  },
  {
    s: "j",
    t: 97.69,
    who: "Joseph",
    text: "Okay, good to know. Who would I be working with there?",
  },
  {
    s: "a",
    t: 102.37,
    who: "Amy",
    text: "You would see Dr. Elena Park or Dr. James Whitfield. Both are general dentists, and they work with our team of hygienists.",
  },
  {
    s: "j",
    t: 110.46,
    who: "Joseph",
    text: "Nice, great to know that. And what services do you offer?",
  },
  {
    s: "a",
    t: 115.09,
    who: "Amy",
    text: "We offer cleanings, exams, X-rays, fillings, crowns, root canals, implants, Invisalign and teeth whitening. We also offer nitrous oxide for patients who feel nervous.",
  },
  {
    s: "j",
    t: 127.45,
    who: "Joseph",
    text: "Oh, okay, nice. Good to know. Are you taking new clients right now?",
  },
  {
    s: "a",
    t: 133.41,
    who: "Amy",
    text: "Yes, we are welcoming new patients.",
  },
  {
    s: "j",
    t: 136.23,
    who: "Joseph",
    text: "Perfect, good to hear. And, uh, one last thing... do you have a website I can check out?",
  },
  {
    s: "a",
    t: 141.95,
    who: "Amy",
    text: "Yes. Our website is brightwaterfamilydentistry.com. You can also fill out your new patient forms there. Is there anything else I can help you with?",
  },
  {
    s: "j",
    t: 151.68,
    who: "Joseph",
    text: "Awesome, I'll take a look. That answers all my questions. Nice team, really appreciate your help. Have a great day!",
  },
  {
    s: "a",
    t: 159.15,
    who: "Amy",
    text: "You're welcome. Thank you for calling Brightwater Family Dentistry. Goodbye.",
  },
];

const QUESTIONS = [
  "Office hours",
  "Location",
  "Insurance & payment",
  "Urgent & same-day requests",
  "Who you'll see",
  "Services",
  "New patients",
  "Website",
];
/** index of Amy's answer line for each question chip */
const QA = [2, 4, 6, 8, 10, 12, 14, 16];
const AUDIO_ERROR = "Audio could not load. The full call transcript is shown below.";

/** "Joseph Called Amy" dental test-call preview, ported from public/sections/test-call-section-dental.html. */
export function TestCallSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const A = root.querySelector("audio") as HTMLAudioElement;
    const play = root.querySelector("[data-act=play]") as HTMLButtonElement;
    const seek = root.querySelector(".tc-seek") as HTMLInputElement;
    const cur = root.querySelector("[data-cur]") as HTMLElement;
    const durEl = root.querySelector("[data-dur]") as HTMLElement;
    const box = root.querySelector(".tc-script") as HTMLElement;
    const lines = Array.from(root.querySelectorAll<HTMLElement>(".tc-line"));
    const qs = Array.from(root.querySelectorAll<HTMLElement>(".tc-qs li"));
    const done = root.querySelector(".tc-done") as HTMLElement;
    const toast = root.querySelector(".tc-toast") as HTMLElement;
    const note = root.querySelector(".tc-note") as HTMLElement;
    const retest = root.querySelector("[data-act=retest]") as HTMLButtonElement;
    const T = LINES.map((l) => l.t);
    const reduce =
      typeof window.matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = -1;
    let dragging = false;
    let toastTimer: ReturnType<typeof setTimeout> | undefined;
    const fmt = (v: number) => {
      const s = Math.max(0, Math.floor(v));
      return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2);
    };
    const idx = (t: number) => {
      let i = -1;
      for (let k = 0; k < T.length; k++) if (t >= (T[k] ?? 0) - 0.05) i = k;
      return i;
    };
    const update = (t: number) => {
      const i = idx(t);
      if (i !== last) {
        lines.forEach((l, k) => l.classList.toggle("now", k === i));
        if (i >= 0 && !A.paused) {
          const l = lines[i];
          if (!l) return;
          const top = l.offsetTop - box.offsetTop - box.clientHeight / 2 + l.clientHeight / 2;
          box.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
        }
        last = i;
      }
      qs.forEach((q, k) => q.classList.toggle("done", i >= (QA[k] ?? 0)));
      done.hidden = !(i >= (QA[QA.length - 1] ?? 0));
      cur.textContent = fmt(t);
      if (!dragging) seek.value = String(t);
    };
    const fail = () => {
      play.disabled = true;
      play.textContent = "–";
      box.classList.remove("playing");
      note.textContent = AUDIO_ERROR;
    };
    const onPlayClick = () => {
      if (A.paused) {
        const p = A.play();
        if (p && p.catch) p.catch(fail);
      } else A.pause();
    };
    const onPlay = () => {
      play.textContent = "❚❚";
      play.setAttribute("aria-label", "Pause sample call");
      box.classList.add("playing");
      toast.classList.remove("show");
    };
    const onPause = () => {
      play.textContent = "▶";
      play.setAttribute("aria-label", "Play sample call");
    };
    const onTime = () => update(A.currentTime);
    const onMeta = () => {
      if (isFinite(A.duration)) {
        seek.max = String(A.duration);
        durEl.textContent = fmt(A.duration);
      }
    };
    const onEnded = () => {
      box.classList.remove("playing");
      update(A.duration || (T[T.length - 1] ?? 0) + 5);
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 5000);
    };
    const onSeekInput = () => {
      dragging = true;
      cur.textContent = fmt(parseFloat(seek.value));
    };
    const onSeekChange = () => {
      dragging = false;
      A.currentTime = parseFloat(seek.value);
      update(A.currentTime);
    };
    const lineHandlers = lines.map((l) => {
      const click = () => {
        A.currentTime = parseFloat(l.dataset["t"] || "0");
        if (A.paused) play.click();
      };
      const key = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          l.click();
        }
      };
      l.addEventListener("click", click);
      l.addEventListener("keydown", key);
      return () => {
        l.removeEventListener("click", click);
        l.removeEventListener("keydown", key);
      };
    });
    const onRetest = () => {
      A.currentTime = 0;
      last = -1;
      if (A.paused) play.click();
      else update(0);
    };

    play.addEventListener("click", onPlayClick);
    A.addEventListener("play", onPlay);
    A.addEventListener("pause", onPause);
    A.addEventListener("timeupdate", onTime);
    A.addEventListener("loadedmetadata", onMeta);
    A.addEventListener("ended", onEnded);
    A.addEventListener("error", fail);
    seek.addEventListener("input", onSeekInput);
    seek.addEventListener("change", onSeekChange);
    retest.addEventListener("click", onRetest);
    if (A.readyState >= 1) onMeta();
    if (A.error) fail();

    return () => {
      play.removeEventListener("click", onPlayClick);
      A.removeEventListener("play", onPlay);
      A.removeEventListener("pause", onPause);
      A.removeEventListener("timeupdate", onTime);
      A.removeEventListener("loadedmetadata", onMeta);
      A.removeEventListener("ended", onEnded);
      A.removeEventListener("error", fail);
      seek.removeEventListener("input", onSeekInput);
      seek.removeEventListener("change", onSeekChange);
      retest.removeEventListener("click", onRetest);
      lineHandlers.forEach((off) => off());
      clearTimeout(toastTimer);
      A.pause();
    };
  }, []);

  return (
    <section ref={rootRef} className="aisc-tc" aria-labelledby="aisc-tc-title-dental">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="tc-frame">
        <span className="tc-badge">Sample preview</span>
        <div className="tc-dash">
          <div>
            <h3>Practice Dashboard</h3>
            <p>Your dental practice</p>
          </div>
        </div>
        <div className="tc-body">
          <div className="tc-head">
            <div>
              <div className="tc-eyebrow">Live AI call demo</div>
              <h4 id="aisc-tc-title-dental">Joseph Called Amy</h4>
              <p>
                A live FAQ check on your new booking number, proof that inbound calling is working.
                Joseph, our AI test caller, asks the questions your patients ask, and Amy answers
                from your practice details. This call doesn't use your trial credits.
              </p>
            </div>
            <button className="tc-btn" type="button" data-act="retest">
              Replay call
            </button>
          </div>
          <ul className="tc-qs" aria-label="Questions Joseph asks">
            {QUESTIONS.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
          <div className="tc-player">
            <button className="tc-play" type="button" data-act="play" aria-label="Play sample call">
              ▶
            </button>
            <input
              className="tc-seek"
              type="range"
              min="0"
              max="164.6"
              step="0.1"
              defaultValue="0"
              aria-label="Seek"
            />
            <span className="tc-time">
              <span data-cur>0:00</span> / <span data-dur>2:44</span>
            </span>
          </div>
          <audio preload="metadata" src={AUDIO_SRC} />
          <div className="tc-script" role="log" aria-label="Call transcript">
            {LINES.map((l) => (
              <div key={l.t} className={`tc-line ${l.s}`} data-t={l.t} tabIndex={0}>
                <span className="who">{l.who}</span>
                <span>{l.text}</span>
              </div>
            ))}
            <span className="tc-done" hidden>
              All FAQs answered ✓
            </span>
          </div>
          <p className="tc-note">
            Sample practice and details. Your own test call recording appears on your dashboard and
            in your inbox after setup.
          </p>
        </div>
        <div className="tc-toast" role="status">
          Your test call is ready · Recording delivered to your inbox
        </div>
      </div>
    </section>
  );
}
