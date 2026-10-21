import { CATEGORIES, type AgentKey } from "@/data/painPoints";

export type PlanId = "receptionist" | "pro" | "full";

export const ALL_PAIN_IDS = CATEGORIES.flatMap((c) => c.items.map((i) => i.id));
const AGENT_OF = new Map(CATEGORIES.flatMap((c) => c.items.map((i) => [i.id, i.agent] as const)));

export const PLAN_AGENTS: Record<PlanId, AgentKey[]> = {
  receptionist: ["amy"],
  pro: ["amy", "leena", "stephanie", "trisha"],
  full: ["amy", "leena", "morgan", "kim", "stephanie", "elise", "joseph", "trisha"],
};

export function idsForAgents(agents: AgentKey[]) {
  return ALL_PAIN_IDS.filter((id) => agents.includes(AGENT_OF.get(id)!));
}

/** Smallest plan whose agents cover every enabled pain point. */
export function recommendPlan(enabled: Iterable<string>): PlanId {
  const agents = new Set<AgentKey>();
  for (const id of enabled) {
    const a = AGENT_OF.get(id);
    if (a) agents.add(a);
  }
  const fits = (p: PlanId) => [...agents].every((a) => PLAN_AGENTS[p].includes(a));
  if (fits("receptionist")) return "receptionist";
  if (fits("pro")) return "pro";
  return "full";
}
