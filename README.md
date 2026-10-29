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

The homepage opens with a short intro animation (once per visit, skippable), then the biography, (some) work, associations, research, articles, and contact sections. (some) work shows the desk engraving beside the "work" projects and expands, on hover or click, to all projects in three columns: open-source, work, and unpublished.

Projects live in `src/data/projects.ts`, which the (some) work section and the cv page both render. Two more places describe them in prose and need updating by hand: the `projects` JSON-LD list in `src/pages/index.astro` and the Work section of `src/lib/llms.ts`. Associations live in `src/data/associations.ts`. Article index entries and individual `/articles/<id>/` pages are generated from the Markdown files in `src/content/articles/` during the Astro build.

## The cv page

`src/pages/cv.astro` builds the application-file version of the site: utku.space plus honours, SAT scores, a timeline, minigames, and eight easter eggs. It is built to `/cv/index.html` and kept self-contained: CSS, JS, and data are inline, and fonts and images load from `https://utku.space` by absolute URL (GitHub Pages serves them with `access-control-allow-origin: *`). It reads projects from `src/data/projects.ts`, associations from `src/data/associations.ts`, papers from `src/data/research.ts`, and the article collection, so it stays in step with the homepage. It is `noindex` and left out of the sitemap.

It is served at `utku.space/cv/` and, through the `cv` job in `.github/workflows/astro.yml`, at `cv.utku.space`: after each build the job copies the page into the `mutkuoz/cv` repository with a `CNAME`. One-time setup:

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
