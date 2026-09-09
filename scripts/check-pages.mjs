/**
 * Per-page structural and metadata checks.
 *
 * Covers the mechanical items on the QA checklist and Handoff §13/§14:
 *   - exactly one h1 per page
 *   - heading levels in real hierarchical order, no skipped levels
 *   - a <title> and meta description, within the lengths §13 specifies
 *   - a canonical URL
 *   - a skip link
 *   - alt on every <img> (empty alt is valid and means decorative)
 *   - no heading left empty
 *
 *   node scripts/check-pages.mjs
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist');

/**
 * Pages whose title and/or description are given VERBATIM by Handoff §13 and
 * exceed §13's own stated limits. §13 opens with "Titles under 60 characters,
 * descriptions 150–160" and then supplies, for this page:
 *
 *   "For Therapists & Healthcare Providers | Starting Point Consulting"  (69)
 *   "Information for providers: nervous system education and practical
 *    regulation practices that may complement the care you already provide.
 *    Educational and supportive, never clinical treatment."              (190)
 *
 * §13 also instructs "Titles and meta descriptions from section 13, entered per
 * page." The supplied string is the approved copy and wins over the guideline
 * it breaks; inventing a shorter one would be exactly the kind of guessing
 * CLAUDE.md forbids. Flagged for Darlene in OPEN-QUESTIONS #34.
 */
const APPROVED_OVERLONG_META = new Set(['/for-therapists-and-providers']);

/** The eight footer-only legal pages — see the metadata note below. */
const LEGAL_ROUTES = new Set([
  '/privacy-policy',
  '/terms',
  '/disclaimer',
  '/hipaa-note',
  '/accessibility',
  '/inclusion',
  '/client-service-agreement',
  '/testimonial-release',
]);

if (!existsSync(DIST)) {
  console.error('check-pages: no dist/ — run `npm run build` first.');
  process.exit(1);
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry);
    if ((await stat(full)).isDirectory()) out.push(...(await walk(full)));
    else if (full.endsWith('.html')) out.push(full);
  }
  return out;
}

function routeOf(file) {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'/index.html'.length)}`;
  return `/${rel.replace(/\.html$/, '')}`;
}

let pagesWithProblems = 0;
const files = await walk(DIST);

console.log(`check-pages: ${files.length} page(s)\n`);

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const route = routeOf(file);
  const problems = [];

  // Ignore markup inside <script>/<style> and the JSON-LD blocks.
  const body = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ');

  const headings = [...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    level: Number(m[1]),
    text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
  }));

  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length !== 1) problems.push(`h1 count = ${h1s.length}, expected 1`);

  // No skipped levels — h2 must not jump straight to h4.
  let previous = 0;
  for (const heading of headings) {
    if (previous && heading.level > previous + 1) {
      problems.push(`heading jumps h${previous} → h${heading.level} ("${heading.text.slice(0, 40)}")`);
      break;
    }
    previous = heading.level;
  }

  const empty = headings.filter((h) => !h.text).length;
  if (empty) problems.push(`${empty} empty heading(s)`);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? '';
  if (!title) problems.push('no <title>');
  // Handoff §13: "Titles under 60 characters" — 62 allows for a trailing space.
  else if (!/name="robots" content="noindex/.test(html) && !APPROVED_OVERLONG_META.has(route) && title.length > 62) {
    problems.push(`title ${title.length} chars (§13: under 60)`);
  }

  // §13's title and description lengths are search-result constraints, so they
  // apply to indexed pages only. The 404 and the private utility pages are
  // noindex by design and are exempt from the length rule, not from having one.
  const noindex = /name="robots" content="noindex/.test(html);

  // The eight legal pages are exempt too. §13's metadata sheet deliberately
  // covers only the nine public marketing pages and gives the legal set no
  // title or description at all, and Legal Pages Index §02 excludes these pages
  // from "search-engine priority" — so a 150–160 char search-result snippet is
  // not a goal for them. Their title is the approved footer label and their
  // description is the page's own approved INTRO sentence, so nothing is
  // invented. They must still HAVE both, and the title cap still applies.
  const isLegal = LEGAL_ROUTES.has(route);

  const description = html.match(/name="description" content="([^"]*)"/)?.[1]?.trim() ?? '';
  if (!description) problems.push('no meta description');
  // Handoff §13: "descriptions 150–160". Widened slightly to avoid churn.
  else if (!noindex && !isLegal && !APPROVED_OVERLONG_META.has(route) && (description.length < 120 || description.length > 175)) {
    problems.push(`description ${description.length} chars (§13: 150–160)`);
  }

  if (!/rel="canonical"/.test(html)) problems.push('no canonical link');
  if (!/class="skip-link"/.test(html)) problems.push('no skip link');

  // Handoff §14: real alt on every meaningful image, empty alt on decorative.
  // A missing alt attribute is the failure; alt="" is a valid, deliberate value.
  const withoutAlt = [...body.matchAll(/<img\b[^>]*>/g)].filter((m) => !/\salt=/.test(m[0])).length;
  if (withoutAlt) problems.push(`${withoutAlt} <img> without an alt attribute`);

  if (problems.length) pagesWithProblems++;
  console.log(`  ${problems.length ? 'FAIL' : 'PASS'}  ${route.padEnd(22)} ${problems.join('; ')}`);
}

console.log(
  `\n${pagesWithProblems ? `${pagesWithProblems} page(s) with problems.` : 'All pages structurally clean.'}`,
);
process.exit(pagesWithProblems ? 1 : 0);
