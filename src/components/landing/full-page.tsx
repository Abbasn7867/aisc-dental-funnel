import { Footer } from "@/components/site";
import { AnnouncementBar, Hero, LandingNav, TrustStrip } from "@/components/landing/hero";
import { Configurator } from "@/components/landing/configurator";
import { PainSection } from "@/components/landing/pain";
import { CallPlayer, ProofCall, TeamSection } from "@/components/landing/team";
import { CompareSlider, DashboardMock, DayTimeline, FlipCards } from "@/components/landing/story";
import { FinalBand, HowItWorks, LandingFaq, LandingPricing, ValueServices } from "@/components/landing/convert";
import { Recommender } from "@/components/recommender";

/** The full sales page — served at "/" (home). */
export function FullTourPage() {
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
        <Recommender />
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
