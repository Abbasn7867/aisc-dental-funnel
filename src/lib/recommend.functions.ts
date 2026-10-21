import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({ needs: z.string().trim().min(10).max(1500) });

export const getRecommendations = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data }) => {
    const { recommendAgents } = await import("./recommend.server");
    return recommendAgents(data.needs);
  });
