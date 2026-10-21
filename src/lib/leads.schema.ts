import { z } from "zod";

export const phoneDigits = (s: string) => s.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  business_name: z.string().trim().min(1, "Please enter your practice name").max(150),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().refine((v) => phoneDigits(v).length === 10, "Please enter a 10-digit US mobile number"),
  website: z.string().trim().max(255).optional().or(z.literal("")),
});

export const practiceSchema = z.object({
  locations: z.coerce.number({ invalid_type_error: "Enter a number" }).int().min(1, "At least 1").max(500),
  software: z.string().trim().max(200).optional().or(z.literal("")),
  problems: z.array(z.string().max(120)).max(20),
});

export const questionsSchema = z.object({
  q1: z.string().trim().max(200).optional().or(z.literal("")),
  q2: z.string().trim().max(200).optional().or(z.literal("")),
  q3: z.string().trim().max(200).optional().or(z.literal("")),
});

export const consentSchema = z.object({
  consent_sms_account: z.boolean(),
  consent_marketing: z.boolean(),
  plan: z.enum(["receptionist", "pro", "full"]),
  billing: z.enum(["monthly", "yearly"]),
});

export const trialFormSchema = contactSchema.merge(practiceSchema).merge(questionsSchema).merge(consentSchema);
export type TrialForm = z.infer<typeof trialFormSchema>;

const opt = (max: number) => z.string().trim().max(max).optional();
export const leadSubmissionSchema = trialFormSchema.extend({
  pain_ids: z.array(z.string().regex(/^p\d{1,2}$/)).max(54),
  utm_source: opt(100), utm_medium: opt(100), utm_campaign: opt(100),
  ref_code: opt(64),
});
export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;
