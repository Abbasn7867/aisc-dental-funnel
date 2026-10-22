import amyPhoto from "@/assets/amy.png.asset.json";
import leenaPhoto from "@/assets/leena.jpg.asset.json";
import kimPhoto from "@/assets/kim.jpg.asset.json";
import morganPhoto from "@/assets/morgan.jpg.asset.json";
import stephaniePhoto from "@/assets/stephanie.jpg.asset.json";
import trishaPhoto from "@/assets/trisha.jpg.asset.json";
import elisePhoto from "@/assets/elise.jpg.asset.json";
import josephPhoto from "@/assets/joseph.jpg.asset.json";

export type Billing = "monthly" | "yearly";

export const PLANS = [
  {
    id: "receptionist",
    name: "Receptionist",
    monthly: 497,
    yearly: 437,
    popular: false,
    blurb: "Amy answers every call and books appointments around the clock.",
    features: ["Amy (Receptionist)", "24/7 calls & booking", "Your instant test call"],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 1497,
    yearly: 1317,
    popular: true,
    blurb: "Amy plus scheduling, follow-up and performance reporting.",
    features: [
      "Everything in Receptionist",
      "Leena — Schedule Optimizer",
      "Stephanie — Follow-up",
      "Trisha — Practice Manager",
    ],
  },
  {
    id: "full",
    name: "Full Team",
    monthly: 1997,
    yearly: 1757,
    popular: false,
    blurb: "All 8 AI employees covering every front-office pain point.",
    features: ["All 8 AI employees", "Every pain point covered", "Dedicated onboarding"],
  },
] as const;

export function planPrice(plan: (typeof PLANS)[number], billing: Billing) {
  return billing === "yearly" ? plan.yearly : plan.monthly;
}

export const formatUsd = (n: number) => `$${n.toLocaleString("en-US")}`;

export const AGENTS = [
  { name: "Amy", photo: amyPhoto.url, role: "Receptionist", color: "bg-agent-amy", ring: "ring-agent-amy", count: 7, area: "Appointment Booking & Scheduling" },
  { name: "Leena", photo: leenaPhoto.url, role: "Schedule Optimizer", color: "bg-agent-leena", ring: "ring-agent-leena", count: 4, area: "Rescheduling, No-Shows & Late Arrivals" },
  { name: "Kim", photo: kimPhoto.url, role: "Case Acceptance", color: "bg-agent-kim", ring: "ring-agent-kim", count: 3, area: "Clinical Communication Gaps" },
  { name: "Morgan", photo: morganPhoto.url, role: "Patient Intake", color: "bg-agent-morgan", ring: "ring-agent-morgan", count: 14, area: "Intake, Consent Forms, Eligibility & Benefits" },
  { name: "Stephanie", photo: stephaniePhoto.url, role: "Follow-up", color: "bg-agent-stephanie", ring: "ring-agent-stephanie", count: 5, area: "Recall, Retention & Re-Engagement" },
  { name: "Trisha", photo: trishaPhoto.url, role: "Practice Manager", color: "bg-agent-trisha", ring: "ring-agent-trisha", count: 6, area: "Practice Intelligence & Reporting" },
  { name: "Elise", photo: elisePhoto.url, role: "Patient Experience", color: "bg-agent-elise", ring: "ring-agent-elise", count: 7, area: "Review & Reputation Management" },
  { name: "Joseph", photo: josephPhoto.url, role: "Fax Management", color: "bg-agent-joseph", ring: "ring-agent-joseph", count: 8, area: "Referral & Care Coordination" },
] as const;

export const LEGAL = {
  privacy: "https://aisolutioncompany.com/privacy-policy",
  terms: "https://aisolutioncompany.com/terms-of-service",
  cookies: "https://aisolutioncompany.com/cookie-policy",
  accessibility: "https://aisolutioncompany.com/accessibility-statement",
};

export const DASHBOARD_URL = "https://aisolutioncompany.com/practice/dashboard";
export const SETUP_URL = "https://aisolutioncompany.com/practice/setup";

// [ADD INTRO VIDEO URL] Public URL of the intro video (mp4). The "Watch the Intro" button and the video section appear once this is set.
export const INTRO_VIDEO_URL = "";

// [ADD FINAL DOMAIN] Canonical/OG base URL for this funnel. Update when the funnel's domain is confirmed.
export const SITE_URL = "https://aisolutioncompany.com";

export const CONSENT_SMS =
  "I agree to receive text messages and calls, including automated and AI-assisted calls, from AI Solution Company at the number provided about my free trial, account setup and service notices. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase.";
export const CONSENT_MARKETING =
  "Yes, send me offers and product updates from AI Solution Company by text and email. Reply STOP or unsubscribe anytime.";
