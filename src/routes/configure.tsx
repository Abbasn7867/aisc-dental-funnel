import { createFileRoute } from "@tanstack/react-router";
import { Footer, Nav } from "@/components/site";
import { Configurator } from "@/components/landing/configurator";
import { seoMeta } from "@/lib/seo";

export const Route = createFileRoute("/configure")({
  head: () =>
    seoMeta(
      "/configure",
      "Build Your AI Front Office | AI Solution Company",
      "Toggle all 54 dental front-office pain points and see which AI employees and plan fit your practice.",
    ),
  component: () => (
    <div>
      <Nav />
      <main><Configurator standalone /></main>
      <Footer />
    </div>
  ),
});
