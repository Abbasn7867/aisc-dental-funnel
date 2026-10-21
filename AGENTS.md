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
