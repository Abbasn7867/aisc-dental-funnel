# Roadmap

- [x] Replace the full-tour opening photo's woman with the user's Amy agent; full face verified at 1137px and 390px

- [x] Photo framing: no cut-off faces (focal points, 4:3 cards, QA at 360/768/1280/1920)
- [x] Polish: new photos (hero desktop + mobile, proof call, pricing header, final CTA, free-trial/thank-you backgrounds)
- [x] Polish: scroll progress bar, page fade between routes, button press scale, anchor offset, film grain
- [x] Polish: agent cards snap-scroll on mobile + agent-color glow on hover
- [x] Polish: hero word reveal + number count-ups
- [x] Final QA pass: 54/54 pain points verified on /front-office + /configure, banned-word sweep, platform names removed from p31, "Sample dashboard" relabeled, exact badges confirmed
- [x] SEO: unique titles (home = "AI Receptionist & Front Office for Dental Practices | AI Solution Company"), canonical + og:url + og:image + twitter:image per page, branded 1200×630 share image, sitemap.xml, robots.txt with Sitemap line, Organization + Product JSON-LD (no ratings), h1 on every page
- [x] Performance: lazy-loading on all below-fold images, hero font preloaded
- [x] Tracking: cookie banner now site-wide from __root, GA4 + Meta pixel load only after "Accept all", "Lead" event fires on successful /free-trial submission (no form values sent)
- [ ] Hero: semi side pose of Amy (head tilted, gaze to the left) matching the uploaded reference, uniform across phone, tablet and desktop
- [ ] Polish (next): magnetic hover, CTA ripple, cursor glow on pricing/dark sections, animated section dividers, self-drawing icons, timeline parallax
- [ ] GoHighLevel webhook URL — waiting on user
- [x] Install supplied Meta pixel 2206705753230004, standard Lead and offer_click, regional blocking, versioned consent evidence, withdrawal and linked privacy supplement; tests pass
- [ ] Verify published pixel delivery and Meta receipt — no public deployment yet; SDK loaded in preview but no event transmission observed (synthetic signup saved, withdrawal and blocked-region checks passed)
- [ ] Connect GA4 — connection declined; measurement ID unavailable
- [ ] Final funnel domain — confirm, then update SITE_URL in src/lib/funnel.ts (canonical, OG URLs, sitemap, robots)
