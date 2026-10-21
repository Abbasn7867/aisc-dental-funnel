import ogImage from "@/assets/og-image.png.asset.json";
import { SITE_URL } from "./funnel";

/** Per-page SEO head: unique title/description, canonical, Open Graph + Twitter cards. */
export function seoMeta(path: string, title: string, description: string) {
  const url = `${SITE_URL}${path}`;
  const image = `${SITE_URL}${ogImage.url}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
