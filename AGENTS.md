<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- AI features call the Lovable AI Gateway only from server functions (`*.server.ts` helpers loaded inside `*.functions.ts` handlers) — keeps the key and prompts off the client.
- Pain points, categories and agent identities live in `src/data/painPoints.ts`; landing components render from it and never hard-code pain points — keeps all 54 in one place.
- The bottom offer bar and exit pop-up are mounted once in `__root.tsx` and hide themselves on /free-trial and /thank-you.
- Trial leads are inserted and forwarded to the CRM from a TanStack server function (`src/lib/leads.functions.ts` → `leads.server.ts`), not an edge function — one stateless call keeps insert + webhook together; the webhook URL lives in the `GHL_WEBHOOK_URL` secret.
- The `leads` table is insert-only for the public (no SELECT policy) — visitors must never read other leads.
- Referral `?ref=` and UTM capture run in `__root.tsx` on every navigation via `src/lib/tracking.ts`; analytics events fire only after "Accept all" cookie consent.
- Browser measurement uses one shared regional/consent gate in tracking.ts, versioned visitor-choice evidence, and no form-field payloads; unknown or unassessed countries fail closed to preserve the chosen no-banner restriction. Trial conversions fire only after successful persistence; no CAPI or customer matching is installed.
- The home page "/" renders the full sales page (`FullTourPage` in src/components/landing/full-page.tsx); /front-office permanently redirects to "/" — the old short home page confused visitors into thinking updates were missing.
