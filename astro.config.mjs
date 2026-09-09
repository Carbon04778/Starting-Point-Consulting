// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Starting Point Consulting — build configuration.
//
// Hosting model (CLAUDE.md): built on Hadley's Vercel/Supabase accounts now,
// transferred to Darlene's at project completion. Nothing account-specific is
// hardcoded here — deployment targets and keys come from environment variables.
export default defineConfig({
  site: 'https://startingpointconsulting.com',

  // `server` output is needed from Phase 4 onward: the Client Service Agreement
  // acceptance log and the New Client Intake write to Supabase through server
  // endpoints, so the service key never reaches the browser. Public marketing
  // pages are prerendered individually via `export const prerender = true`.
  output: 'static',
  adapter: vercel(),

  // `assets/` is the client-delivered source of truth and is never edited.
  // `npm run sync:assets` copies it into public/assets/ with web-safe filenames
  // (Handoff §17: "Image filenames renamed before upload").
  publicDir: './public',
});
