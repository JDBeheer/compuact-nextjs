# Claude Code — Project instructies

## Project
Compu Act Opleidingen — Microsoft Office trainingen website
- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (Postgres + Auth)
- **Hosting:** Vercel
- **Branches:** `main` (productie), `staging` (preview/test)

## Deploy discipline (Vercel)

Elke push naar `main` triggert een Vercel production build. Voor deze
repo duurt een build ~1 minuut en dat kost build-minuten op ons plan.
Daarom:

- **Default = lokaal previewen.** Gebruik `npm run dev` of `npx next build`
  om wijzigingen te valideren voordat je commit+pushed. Niet pushen
  "om te kijken of het werkt".
- **Batch visuele iteraties.** Bij design/copy wijzigingen: meerdere
  iteraties lokaal, dan 1 commit met de eindversie. Niet 5x pushen
  om een padding te tweaken.
- **Docs-only commits krijgen `[skip ci]`.** README, CLAUDE.md,
  strategie/*.md, pure JSON-data — commit message eindigt op
  `[skip ci]`. Vercel skipt dan de build.
- **Scheid code en docs.** Niet mengen in één commit. Anders kun je
  geen skip-ci gebruiken.
- **Vraag toestemming voor pushen.** Expliciet: "Dit triggert een
  Vercel production deploy, ok?" Wacht op ja.
- **Feature branches voor risicovol werk.** Preview deploys op
  branches zijn goedkoper dan repeated prod deploys.
- **Bugfixes/redirects** direct naar prod deployen en mergen naar main + staging.
- **Nieuwe features** op staging branch, testen op preview URL, dan mergen naar main.

Bij twijfel: NIET pushen. Beter één keer extra vragen.

## Taalgebruik
- Gebruik "je" ipv "u" in alle klant-facing teksten
- Admin/CMS interface in het Nederlands
- Code comments in het Engels

## Belangrijke env vars
Alle env vars staan op Vercel (17 stuks). Lokaal in `.env.local`.
Nooit secrets committen.
