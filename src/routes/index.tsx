import { createFileRoute } from "@tanstack/react-router";
import { FullTourPage } from "@/components/landing/full-page";
import { SITE_URL } from "@/lib/funnel";
import { seoMeta } from "@/lib/seo";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "AI Solution Company",
      url: SITE_URL,
      description: "The AI front office for dental practices: 8 AI employees, led by Annie, that answer, book, follow up and report 24/7.",
    },
    {
      "@type": "Product",
      name: "AI Front Office for Dental Practices",
      brand: { "@type": "Organization", name: "AI Solution Company" },
      description: "8 AI employees, led by Annie the AI receptionist, that answer calls 24/7, book appointments and follow up with patients for dental practices.",
      offers: [
        { "@type": "Offer", name: "Receptionist" },
        { "@type": "Offer", name: "Pro" },
        { "@type": "Offer", name: "Elite" },
      ],
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    ...seoMeta(
      "/",
      "AI Receptionist & Front Office for Dental Practices | AI Solution Company",
      "Annie and 7 more AI employees answer calls 24/7, book appointments and follow up with patients. Start a 14-day free trial of the full platform — no credit card required.",
    ),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(JSON_LD) }],
  }),
  component: FullTourPage,
});
