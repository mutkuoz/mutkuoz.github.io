# utku.space

Personal website for Mehmet Utku Öztürk, built with Astro and deployed to GitHub Pages. The site uses a newspaper-inspired, black-and-white design with light and dark themes.

The background is served as a preloaded WebP with a PNG fallback, and the display fonts are self-hosted to keep first paint independent of third-party font services.

## Site structure

```text
src/
├── content/
│   └── articles/          # one Markdown file per article
├── content.config.ts      # article frontmatter schema
├── data/                  # projects, papers, honours, associations: one source for the page, json-ld and llms.txt
├── lib/
│   ├── site.ts            # site constants and article helpers
│   ├── schema.ts          # the homepage's schema.org json-ld
│   └── llms.ts            # llms.txt and llms-full.txt builders
├── pages/
│   ├── articles/[id].astro
│   ├── articles/[id].md.ts  # markdown twin of each article
│   ├── llms.txt.ts
│   ├── llms-full.txt.ts
│   ├── rss.xml.ts
│   ├── sitemap.xml.ts
│   └── index.astro
└── styles/global.css
public/                    # static assets, robots.txt, indexnow key, and CNAME
archive/classic-homepage/  # the previous homepage design, parked: not built or linked
news-site/                 # separate static newsletter
```

The homepage is printed as an edition of The Utku Times, after [news.utku.space/times](https://news.utku.space/times/): three broadsheets on the fresco. It opens with the intro animation (once per visit, skippable). A1 is the front page: the lead profile, two stories, and the Utku Index of numbers with a live age. A2 holds honours & associations, a scrubbable timeline and every project; A3 holds research, interests, articles, a sudoku and the classifieds. It has a day and a night edition, a music player, and easter eggs (the terminal opens with `/`).

The page reads projects from `src/data/projects.ts`, papers from `src/data/research.ts`, honours from `src/data/honours.ts`, associations from `src/data/associations.ts`, and the article collection. The scores and the timeline live in `src/pages/index.astro`. The JSON-LD comes from `src/lib/schema.ts`; its `projects` list and the Work section of `src/lib/llms.ts` describe projects in prose and need updating by hand. Article pages are generated from the Markdown files in `src/content/articles/` during the build.

The page is self-contained: CSS, JS and data are inline, and fonts and images load from `https://utku.space` by absolute URL (GitHub Pages serves them with `access-control-allow-origin: *`), so the built `index.html` runs unchanged anywhere. The old address `utku.space/cv/` redirects to `/`. The previous homepage design is parked in `archive/classic-homepage/`, with a note on restoring it.

## cv.utku.space

`cv.utku.space` serves a copy of the homepage. The `cv` job in `.github/workflows/astro.yml` copies the built `index.html` into the `mutkuoz/cv` repository with a `CNAME` after each build; the copy's canonical URL points to `https://utku.space/`. One-time setup:

1. Create an empty public repository `mutkuoz/cv`.
2. Create a fine-grained personal access token with access to `mutkuoz/cv` only and the permission Contents: read and write. Save it in this repository as the Actions secret `CV_DEPLOY_TOKEN`.
3. Re-run the deploy workflow (or push to `main`). The `cv` job pushes `index.html`, `CNAME`, and `.nojekyll` to `mutkuoz/cv`.
4. In `mutkuoz/cv`, Settings → Pages: deploy from the `main` branch, root folder. The custom domain comes from the `CNAME`.
5. At the DNS provider, add a `CNAME` record for `cv` pointing to `mutkuoz.github.io`, then tick Enforce HTTPS once the certificate is issued.

Until the secret exists the job skips itself, and it never blocks the main deploy.

## Publishing an article

Add a Markdown file to `src/content/articles/`. Its filename becomes the URL, so `flydoom.md` is published at `/articles/flydoom/`.

Every article begins with this frontmatter:

```yaml
---
title: "article title"
description: "a short summary used on the homepage and in social metadata."
published: 2026-09-11
updated: 2026-09-12 # optional
readingTime: "4 min read"
tags:
  - topic
---
```

Write the article body below the frontmatter using standard Markdown. The collection schema validates the metadata, the homepage sorts articles newest first, and Astro generates each article page automatically. The sitemap, RSS feed, `llms.txt`, `llms-full.txt`, homepage JSON-LD, and `/articles/<id>.md` are rebuilt from the same collection, so nothing else needs editing.

The title and description are what search engines and language models quote. Page CSS lowercases everything, so writing them in normal sentence case changes nothing on the site but reads better in search results and AI answers.

After each deploy, the `indexnow` job submits the sitemap URLs to Bing, Yandex, Seznam, and Naver. Its key is public by design and lives in `public/<key>.txt`.

## Development

Requires Node.js 22.12 or newer and pnpm.

| Command | Action |
| :-- | :-- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start the local site at `localhost:4321` |
| `pnpm build` | Build the production site in `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm astro check` | Run Astro and TypeScript checks |

Pushes to `main` trigger `.github/workflows/astro.yml`, which builds the site and deploys `dist/` to GitHub Pages for [utku.space](https://utku.space).
