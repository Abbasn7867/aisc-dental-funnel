import { useEffect, useState } from "react";
import { PhoneCall, Play, Square } from "lucide-react";
import { AGENT_PHOTOS, Waveform } from "./shared";

const MAX = 240;
const GREETINGS = [
  { label: "Warm & Friendly", text: "Thanks for calling Bright Smiles Dental! This is Amy. How can I help you today?" },
  { label: "Short & Direct", text: "Bright Smiles Dental, this is Amy. How may I help?" },
  { label: "New Patient Focus", text: "Thanks for calling Bright Smiles Dental, now welcoming new patients! This is Amy. How can I help?" },
];
const VOICES = ["Warm", "Bright", "Calm"];

/** Interactive "How Should Amy Answer?" preview for the self-setup section. */
export function GreetingPreview() {
  const [text, setText] = useState(GREETINGS[0]!.text);
  const [voice, setVoice] = useState(VOICES[0]!);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setPlaying(false), 3200);
    return () => clearTimeout(t);
  }, [playing]);

  return (
    <div className="mx-auto mt-10 max-w-4xl rounded-[1.75rem] border bg-card p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-extrabold">How Should Amy Answer?</h3>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">Sample</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Pick a ready-made greeting or write your own — this is the first thing your callers hear.</p>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Ready-made greetings">
        {GREETINGS.map((g) => (
          <button
            key={g.label}
            onClick={() => setText(g.text)}
            aria-pressed={text === g.text}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${text === g.text ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="greeting-text" className="text-sm font-bold">Your Greeting</label>
          <textarea
            id="greeting-text"
            value={text}
            maxLength={MAX}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <p className={`mt-1 text-right text-xs font-bold tabular-nums ${text.length >= MAX ? "text-destructive" : "text-muted-foreground"}`}>
            {text.length}/{MAX}
          </p>
          <p className="mt-3 text-sm font-bold">Amy's Voice</p>
          <div className="mt-2 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Voice">
            {VOICES.map((v) => (
              <button
                key={v}
                role="radio"
                aria-checked={voice === v}
                onClick={() => setVoice(v)}
                className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${voice === v ? "border-primary bg-mint-soft text-foreground" : "bg-card hover:border-primary"}`}
              >
                {v}
              </button>
            ))}
            <button
              onClick={() => setPlaying((p) => !p)}
              className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground shadow-glow hover:bg-primary-deep"
            >
              {playing ? <Square className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              {playing ? "Stop" : "Hear It"}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border bg-background p-4">
          <div className="flex items-center justify-between border-b pb-3">
            <p className="flex items-center gap-2 text-sm font-extrabold"><PhoneCall className="h-4 w-4 text-primary" /> What Callers Hear</p>
            <span className="rounded-full bg-mint-soft px-2 py-0.5 text-xs font-bold">{voice} voice</span>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <img src={AGENT_PHOTOS.amy} alt="Amy, AI receptionist" className="h-10 w-10 shrink-0 rounded-full object-cover object-[50%_20%] ring-2 ring-agent-amy ring-offset-2" />
            <div className="min-w-0 flex-1">
              <p className="rounded-2xl rounded-tl-md bg-secondary px-4 py-3 text-sm">{text || "…"}</p>
              <div className="mt-3 pl-1"><Waveform active={playing} bars={20} /></div>
              <p className="mt-1 pl-1 text-xs font-semibold text-muted-foreground">{playing ? "Playing preview…" : "Press Hear It to preview"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
