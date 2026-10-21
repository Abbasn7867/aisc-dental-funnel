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
      description: "The AI front office for dental practices: 8 AI employees, led by Amy, that answer, book, follow up and report 24/7.",
    },
    {
      "@type": "Product",
      name: "AI Front Office for Dental Practices",
      brand: { "@type": "Organization", name: "AI Solution Company" },
      description: "8 AI employees, led by Amy the AI receptionist, that answer calls 24/7, book appointments and follow up with patients for dental practices.",
      offers: [
        { "@type": "Offer", name: "Receptionist", price: "497", priceCurrency: "USD" },
        { "@type": "Offer", name: "Pro", price: "1497", priceCurrency: "USD" },
        { "@type": "Offer", name: "Full Team", price: "1997", priceCurrency: "USD" },
      ],
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    ...seoMeta(
      "/",
      "AI Receptionist & Front Office for Dental Practices | AI Solution Company",
      "Amy and 7 more AI employees answer calls 24/7, book appointments and follow up with patients. Start a 14-day free trial of the full platform.",
    ),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(JSON_LD) }],
  }),
  component: FullTourPage,
});
