import { describe, expect, it } from "vitest";
import { CATEGORIES } from "@/data/painPoints";

describe("pain points", () => {
  it("has all 54 pain points with unique ids", () => {
    const ids = CATEGORIES.flatMap((c) => c.items.map((i) => i.id));
    expect(ids.length).toBe(54);
    expect(new Set(ids).size).toBe(54);
  });
  it("has 11 categories", () => {
    expect(CATEGORIES.length).toBe(11);
  });
});
