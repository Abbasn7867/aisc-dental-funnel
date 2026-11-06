import { createOpenAI } from "@ai-sdk/openai";
import { NoObjectGeneratedError, Output, streamText } from "ai";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";
const RUN_ID = "X-Lovable-AIG-Run-ID";

export const AGENT_KEYS = ["amy", "leena", "morgan", "kim", "stephanie", "elise", "joseph", "trisha"] as const;

const schema = z.object({
  summary: z.string(),
  recommendations: z.array(z.object({ agent: z.enum(AGENT_KEYS), reason: z.string() })),
});
export type Recommendation = z.infer<typeof schema>;

const INSTRUCTIONS = `You advise US dental practice owners on which AI employees from AI Solution Company's "Complete AI Front Office" fit their needs.
Team (key: name, role, covers):
amy: Annie, Receptionist, answering calls 24/7 and appointment booking & scheduling
leena: Sarah, Schedule Optimizer, rescheduling, no-shows & late arrivals
morgan: Paula, Patient Intake, intake, consent forms, eligibility & benefits, coverage changes
kim: Claire, Case Acceptance, clinical communication gaps
stephanie: Fiona, Follow-up, recall, retention & re-engagement
elise: Emily, Patient Experience, review & reputation management
joseph: David, Fax Management, referral & care coordination
trisha: Megan, Practice Manager, practice intelligence & reporting
Rules: recommend 1 to 4 agents, most relevant first, each with one or two plain-English sentences tied to what the owner wrote. Write a one-sentence summary.
Never invent statistics, percentages or prices. Never use the words guaranteed, certified, demo, #1 or "replace your staff"; position the team as support that frees staff for in-person work. Give no clinical or dental advice. If the input is unrelated to running a dental practice, return an empty recommendations list and a summary asking them to describe their front-office challenges.`;

function runIdFetch() {
  let runId: string | undefined;
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (runId && !headers.has(RUN_ID)) headers.set(RUN_ID, runId);
    const res = await fetch(input, { ...init, headers });
    runId ??= res.headers.get(RUN_ID)?.trim() || undefined;
    return res;
  };
}

export async function recommendAgents(needs: string): Promise<{ data: Recommendation | null; error: string | null }> {
  const apiKey = process.env['LOVABLE_API_KEY'];
  if (!apiKey) return { data: null, error: "The recommender isn't configured yet." };

  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch(),
  });

  let failure: unknown;
  try {
    const result = streamText({
      model: provider.responses(MODEL),
      instructions: INSTRUCTIONS,
      messages: [{ role: "user", content: needs }],
      output: Output.object({ schema }),
      maxRetries: 0,
      onError: ({ error }) => {
        failure = error;
      },
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const out = await result.output;
    const seen = new Set<string>();
    out.recommendations = out.recommendations.filter((r) => !seen.has(r.agent) && seen.add(r.agent)).slice(0, 4);
    return { data: out, error: null };
  } catch (e) {
    const err = (failure ?? e) as { statusCode?: number; message?: string };
    console.error("recommendAgents failed", err?.statusCode, err?.message);
    if (NoObjectGeneratedError.isInstance(e)) return { data: null, error: "We couldn't read the recommendation. Please try again." };
    if (err?.statusCode === 429) return { data: null, error: "Lots of requests right now. Please try again in a minute." };
    if (err?.statusCode === 402) return { data: null, error: "The recommender is temporarily unavailable." };
    return { data: null, error: "Something went wrong. Please try again." };
  }
}
