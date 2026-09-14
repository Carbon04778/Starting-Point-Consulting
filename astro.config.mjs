// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// True under  (and therefore on Vercel); false under .
const isBuild = process.argv.includes('build');

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

  vite: {
    ssr: {
      // Bundle the article renderers AND their dependency trees into the
      // server build. Left external, Vercel's file tracing missed
      // sanitize-html's dependencies ("Cannot find module 'htmlparser2'" in
      // the live function, fine on Windows), and every route that imported
      // src/lib/articles.js returned 500. Listing sanitize-html alone was not
      // enough: its own require() calls stayed external. /api/health checks.
      //
      // Build only. In dev, Vite's module runner cannot execute these CJS
      // packages inline ("require is not defined"); left external there, Node
      // loads them from node_modules as normal.
      noExternal: isBuild ? [
        'marked',
        'sanitize-html',
        // sanitize-html's dependencies
        'htmlparser2', 'postcss', 'deepmerge', 'escape-string-regexp',
        'is-plain-object', 'parse-srcset', 'launder',
        // htmlparser2's
        'domhandler', 'domutils', 'domelementtype', 'entities',
        // postcss's
        'nanoid', 'picocolors', 'source-map-js',
        // launder's, and domutils'
        'dayjs', 'dom-serializer',
      ] : [],
    },
  },
});
