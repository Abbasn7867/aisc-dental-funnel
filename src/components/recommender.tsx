import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CtaButton } from "@/components/site";
import { AGENTS } from "@/lib/funnel";
import { getRecommendations } from "@/lib/recommend.functions";

type Result = Awaited<ReturnType<typeof getRecommendations>>;

const EXAMPLES = [
  "We miss calls at lunch and after 5pm, and no-shows are hurting our hygiene schedule.",
  "Insurance verification and intake forms eat up my front desk's morning.",
];

export function Recommender() {
  const run = useServerFn(getRecommendations);
  const [needs, setNeeds] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (needs.trim().length < 10 || loading) return;
    setLoading(true);
    setResult(null);
    try {
      setResult(await run({ data: { needs } }));
    } catch {
      setResult({ data: null, error: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const recs = result?.data?.recommendations ?? [];

  return (
    <section id="match" className="mx-auto max-w-6xl scroll-mt-28 px-6 pt-28">
      <div className="relative overflow-hidden rounded-[2.5rem] border bg-card p-8 shadow-soft md:p-12">
        <div className="blob -right-20 -top-20 h-72 w-72 bg-accent" />
        <div className="relative">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Find your fit</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-extrabold md:text-5xl">
            Tell us about your practice. <span className="text-gradient">We'll suggest your team.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Describe what slows your front desk down. Please don't include any patient details.
          </p>

          <form onSubmit={submit} className="mt-8">
            <label htmlFor="needs" className="sr-only">Your practice's needs</label>
            <textarea
              id="needs"
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
              maxLength={1500}
              rows={4}
              placeholder="e.g. Our phones ring off the hook on Monday mornings and we struggle to fill last-minute cancellations…"
              className="w-full rounded-2xl border border-input bg-background p-5 outline-none focus:border-primary"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button key={ex} type="button" onClick={() => setNeeds(ex)} className="rounded-full bg-mint-soft px-3 py-1.5 text-left text-xs font-semibold hover:bg-secondary">
                  {ex}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading || needs.trim().length < 10}
              className="mt-6 rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground shadow-glow transition hover:bg-primary-deep disabled:opacity-50"
            >
              {loading ? "Finding your team…" : "Recommend my AI team"}
            </button>
          </form>

          <div aria-live="polite" className="mt-8">
            {result?.error && <p className="rounded-2xl bg-secondary p-4 text-sm font-semibold">{result.error}</p>}
            {result?.data && (
              <div>
                <p className="text-lg font-semibold">{result.data.summary}</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {recs.map((r) => {
                    const a = AGENTS.find((x) => x.name.toLowerCase() === r.agent);
                    if (!a) return null;
                    return (
                      <article key={r.agent} className="flex gap-4 rounded-2xl border bg-background p-5">
                        <img src={a.photo} alt={`${a.name}, ${a.role}`} className={`h-14 w-14 shrink-0 rounded-full object-cover object-[50%_20%] ring-4 ring-offset-2 ${a.ring}`} />
                        <div>
                          <h3 className="font-extrabold">{a.name} <span className="font-semibold text-muted-foreground">· {a.role}</span></h3>
                          <p className="mt-1 text-sm text-muted-foreground">{r.reason}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
                {recs.length > 0 && <CtaButton size="lg" className="mt-8" />}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
