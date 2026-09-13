# utku.space

Personal website for Mehmet Utku Öztürk, built with Astro and deployed to GitHub Pages. The site uses a newspaper-inspired, black-and-white design with light and dark themes.

The background is served as a preloaded WebP with a PNG fallback, and the display fonts are self-hosted to keep first paint independent of third-party font services.

## Site structure

```text
src/
├── content/
│   └── articles/          # one Markdown file per article
├── content.config.ts      # article frontmatter schema
├── data/research.ts       # papers: homepage, json-ld, and llms.txt read from here
├── lib/
│   ├── site.ts            # site constants and article helpers
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
news-site/                 # separate static newsletter
```

The homepage contains the biography, selected work, research, articles, and contact sections. Article index entries and individual `/articles/<id>/` pages are generated from the Markdown files in `src/content/articles/` during the Astro build.

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
