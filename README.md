# utku.space

Personal website for Mehmet Utku Öztürk, built with Astro and deployed to GitHub Pages. The site uses a newspaper-inspired, black-and-white design with light and dark themes.

## Site structure

```text
src/
├── content/
│   └── articles/          # one Markdown file per article
├── content.config.ts      # article frontmatter schema
├── pages/
│   ├── articles/[id].astro
│   ├── sitemap.xml.ts
│   └── index.astro
└── styles/global.css
public/                    # static assets, metadata, and CNAME
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

Write the article body below the frontmatter using standard Markdown. The collection schema validates the metadata, the homepage sorts articles newest first, and Astro generates each article page automatically. The XML sitemap is rebuilt from the same collection.

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
