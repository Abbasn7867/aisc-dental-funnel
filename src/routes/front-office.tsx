import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/site";
import { AnnouncementBar, Hero, LandingNav, TrustStrip } from "@/components/landing/hero";
import { Configurator } from "@/components/landing/configurator";
import { PainSection } from "@/components/landing/pain";
import { CallPlayer, ProofCall, TeamSection } from "@/components/landing/team";
import { CompareSlider, DashboardMock, DayTimeline, FlipCards } from "@/components/landing/story";
import { FinalBand, HowItWorks, LandingFaq, LandingPricing, ValueServices } from "@/components/landing/convert";
import { seoMeta } from "@/lib/seo";

export const Route = createFileRoute("/front-office")({
  head: () =>
    seoMeta(
      "/front-office",
      "AI Front Office for Dental Practices — 54 Problems Solved | AI Solution Company",
      "Amy and 7 more AI employees answer, book, follow up and report for your dental practice 24/7. 14-day free trial, $0 setup during launch.",
    ),
  component: FrontOffice,
});

function FrontOffice() {
  return (
    <div>
      <AnnouncementBar />
      <LandingNav />
      <main>
        <Hero />
        <TrustStrip />
        <PainSection />
        <Configurator />
        <TeamSection />
        <ProofCall />
        <CallPlayer />
        <DayTimeline />
        <CompareSlider />
        <DashboardMock />
        <HowItWorks />
        <FlipCards />
        <ValueServices />
        <LandingPricing />
        <LandingFaq />
        <FinalBand />
      </main>
      <Footer />
    </div>
  );
}
