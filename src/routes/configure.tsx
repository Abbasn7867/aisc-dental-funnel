import { createFileRoute } from "@tanstack/react-router";
import { Footer, Nav } from "@/components/site";
import { Configurator } from "@/components/landing/configurator";

export const Route = createFileRoute("/configure")({
  head: () => ({
    meta: [
      { title: "Build Your AI Front Office | AI Solution Company" },
      { name: "description", content: "Toggle all 54 dental front-office pain points and see which AI employees and plan fit your practice." },
      { property: "og:title", content: "Build your AI front office" },
      { property: "og:description", content: "Pick the problems you want solved. See your AI team and recommended plan instantly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <div>
      <Nav />
      <main><Configurator standalone /></main>
      <Footer />
    </div>
  ),
});
