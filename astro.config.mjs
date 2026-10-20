// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { site } from './src/config/site.ts';

export default defineConfig({
  site: site.url,
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'never',
  // `ruta.html` → URLs limpias sin barra final en Cloudflare Pages
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'monthly',
    }),
  ],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Big Shoulders Display',
      cssVariable: '--fuente-rotulo',
      weights: [800, 900],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Impact', 'Arial Narrow', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans',
      cssVariable: '--fuente-cuerpo',
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Segoe UI', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--fuente-datos',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Consolas', 'Courier New', 'monospace'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Caveat Brush',
      cssVariable: '--fuente-plumon',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Comic Sans MS', 'cursive'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
