# The classic homepage (parked)

`index.astro` here is utku.space's homepage as it was before The Utku Times edition replaced it:
black on white, all lowercase, the intro, the music player, (some) work, associations, research,
articles, contact, snake, and the sky animation on the day/night toggle.

It is kept for reference and is not built, routed, linked, or type-checked (`archive/` sits outside
`src/pages/` and is excluded in `tsconfig.json`).

To bring it back, copy it over `src/pages/index.astro`. Its imports are written relative to
`src/pages/`, so they resolve from there. It needs `src/styles/global.css` (still used by the article
pages) and reads the same data as the current homepage: `src/data/*`, `src/lib/site.ts` and
`src/lib/schema.ts`.
