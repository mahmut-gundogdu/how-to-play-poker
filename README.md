# Hold'em Coach

A four-step Texas Hold'em course for complete beginners: the ten hand rankings,
a hand-naming drill, showdown puzzles, and a play-chip table with a coach.

Implemented from the Claude Design source `Holdem Coach.dc.html`
(project `f46b0bce-24b5-4afe-84ba-ffb673cb8d27`).

## Stack

- **Next.js 15 App Router + React 19**, TypeScript.
- **SSG for every page.** No request-time data, so `next build` prerenders all
  eight content pages (4 pages × 2 locales) plus `robots.txt` and `sitemap.xml`
  to static HTML. `next start` serves them; the output also works behind a CDN.
- **No CSS framework** — design tokens from the source live in
  `src/styles/globals.css`.

## Languages

English (`/en/…`) and Turkish (`/tr/…`), with localised URL slugs:

| Page | English | Turkish |
| --- | --- | --- |
| The ten hands | `/en` | `/tr` |
| Name the hand | `/en/drill` | `/tr/eli-adlandir` |
| Who wins? | `/en/showdown` | `/tr/kim-kazanir` |
| Play a hand | `/en/play` | `/tr/oyna` |

`/` redirects to `/en`. Copy lives in `src/i18n/en.ts` and `src/i18n/tr.ts`,
both typed against `src/i18n/types.ts`, so a missing string is a build error.
Hand descriptions are generated per-locale (English needs `a pair of aces`,
Turkish needs `as çifti`), as are the table-talk lines, which additionally
switch to second person for the human player.

## SEO

- Static HTML for every route, including the full ranking chart and FAQ, which
  render server-side with no client JavaScript.
- Per-page `<title>`/description, canonical URLs, `hreflang` alternates for
  both locales plus `x-default`, Open Graph and Twitter tags.
- `WebSite` JSON-LD, `sitemap.xml` with language alternates, `robots.txt`.
- Set `NEXT_PUBLIC_SITE_URL` to the real origin before deploying — it is the
  base for canonicals, alternates and the sitemap.

## Layout

```
src/lib/poker.ts    deck, hand evaluation, drill/showdown generators, bot policy
src/lib/chart.ts    the ten example hands on the ranking chart
src/lib/routes.ts   localised slugs
src/lib/seo.ts      canonical + hreflang metadata
src/i18n/           typed dictionaries (en, tr)
src/components/     Learn (server) · Drill, Showdown, PlayTable (client)
src/app/[locale]/   locale layout, index (learn) and [page] for the other three
```

## Commands

```bash
npm run dev        # http://localhost:3000
npm run build      # prerenders every route
npm start
npm run typecheck
```
