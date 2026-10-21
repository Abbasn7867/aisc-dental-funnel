import { describe, expect, it } from "vitest";
import { ALL_PAIN_IDS, PLAN_AGENTS, idsForAgents, recommendPlan } from "@/lib/configurator";

describe("configurator plan recommendation", () => {
  it("only Amy's items → Receptionist", () => {
    expect(recommendPlan(idsForAgents(["amy"]))).toBe("receptionist");
  });
  it("only Amy, Leena, Stephanie, Trisha items → Pro", () => {
    expect(recommendPlan(idsForAgents(PLAN_AGENTS.pro))).toBe("pro");
  });
  it("any Morgan item → Full Team", () => {
    expect(recommendPlan([...idsForAgents(["amy"]), ...idsForAgents(["morgan"]).slice(0, 1)])).toBe("full");
  });
  it("everything on → Full Team", () => {
    expect(ALL_PAIN_IDS).toHaveLength(54);
    expect(recommendPlan(ALL_PAIN_IDS)).toBe("full");
  });
});
