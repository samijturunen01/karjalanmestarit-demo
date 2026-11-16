import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// BASE_PATH lets the same build run at a domain root ("/") or under a GitHub
// Pages project path ("/<repo>/"). See docs/DEPLOYMENT.md.
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 2048,
  },
  ssr: {
    // bundle GSAP into the SSR build so its ESM entry resolves cleanly in Node
    noExternal: ['gsap'],
  },
});
