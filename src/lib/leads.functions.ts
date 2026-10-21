import { createServerFn } from "@tanstack/react-start";
import { leadSubmissionSchema } from "@/lib/leads.schema";

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => leadSubmissionSchema.parse(d))
  .handler(async ({ data }) => {
    const { buildLeadRow, insertLead, forwardLead, webhookPayload } = await import("@/lib/leads.server");
    const now = new Date().toISOString();
    const row = buildLeadRow(data, now);
    const ok = await insertLead(row);
    if (!ok) return { ok: false as const, error: "We couldn't save your details. Please try again." };
    await forwardLead(webhookPayload(row, now));
    return { ok: true as const };
  });
