import { describe, expect, it } from "vitest";
import { PLANS, planPrice } from "@/lib/funnel";

const byId = (id: string) => PLANS.find((p) => p.id === id)!;

describe("pricing", () => {
  it("monthly prices are 497 / 1497 / 1997", () => {
    expect(PLANS.map((p) => planPrice(p, "monthly"))).toEqual([497, 1497, 1997]);
  });
  it("yearly prices are 437 / 1317 / 1757 per month", () => {
    expect(PLANS.map((p) => planPrice(p, "yearly"))).toEqual([437, 1317, 1757]);
  });
  it("Pro is the most popular plan", () => {
    expect(byId("pro").popular).toBe(true);
  });
});
