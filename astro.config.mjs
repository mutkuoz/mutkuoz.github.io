// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://utku.space',
  // the cv was utku.space/cv/ before it became the homepage
  redirects: { '/cv': '/' },
  vite: {
    plugins: [tailwindcss()]
  }
});