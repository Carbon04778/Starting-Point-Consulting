/**
 * Copy fidelity check.
 *
 * QA checklist, item 1: "Copy matches docs/reference/04-master-website-copy.md
 * exactly (or the two late corrections in CLAUDE.md), no paraphrasing."
 *
 * This cannot verify every sentence automatically, but it can hard-fail on the
 * two things that actually carry risk:
 *
 *   REQUIRED  — lines the reference docs say must not change or must appear in
 *               full: the boundary sentence, the integration disclaimers, the
 *               psychedelic FAQ answer, Darlene's two late corrections, and
 *               every approved price.
 *
 *   FORBIDDEN — wording and routes explicitly retired in Handoff §16 and the
 *               "Superseded" notes: the old keynote price, the universal
 *               "Book a call" CTA, referral-process language, and any
 *               standalone Pricing page.
 *
 *   node scripts/check-copy.mjs
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { distDir } from './dist-dir.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = distDir();

if (!existsSync(DIST)) {
  console.error('check-copy: no dist/ — run `npm run build` first.');
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

/** Strip tags and normalise entities and whitespace so wrapped HTML matches. */
function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

const norm = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();

const pages = new Map();
for (const file of await walk(DIST)) {
  pages.set(routeOf(file), textOf(await readFile(file, 'utf8')));
}

/* ------------------------------------------------------------------ */
/* Must appear, verbatim                                               */
/* ------------------------------------------------------------------ */

const BOUNDARY =
  'This work is educational and supportive. It is not psychotherapy, counseling, diagnosis, or medical treatment, and it does not replace care from licensed healthcare or mental health professionals.';

const required = [
  // Handoff §11 — "Boundary sentence, on every service area."
  ['Boundary sentence', BOUNDARY, ['/services', '/speaking', '/individual-sessions']],

  // Master Copy §03 — "must appear in full". Legal Pages Index §03.
  [
    'Integration scope disclaimer (long, §03)',
    'We work with people only after their experiences. We do not supply, administer, or recommend any substance, and we neither encourage nor discourage its use.',
    ['/', '/services'],
  ],

  // Master Copy §06 — the shorter approved wording, on the pricing page.
  [
    'Integration scope disclaimer (short, §06)',
    'Integration support is non-clinical education and somatic practice, offered only for experiences that have already occurred.',
    ['/individual-sessions'],
  ],

  // Legal Pages Index §03 — the complete answer must not change.
  [
    'Psychedelic-assisted sessions FAQ answer',
    'No. We offer integration support only, and psychedelics remain illegal in Utah. We work with people only after their experiences. We do not supply, administer, or recommend any substance, we neither encourage nor discourage its use, and we do not help plan or prepare for it.',
    ['/faq'],
  ],

  // Legal Pages Index §03 — scope lines that must not change.
  ['Scope line: not psychotherapy', 'Our work is educational and supportive, not psychotherapy.', ['/faq']],
  [
    'Scope line: complement not replace',
    'Our services complement, but do not replace, care from licensed medical and mental health professionals.',
    ['/faq'],
  ],

  // CLAUDE.md — Darlene's two late corrections. Apply exactly, do not paraphrase.
  [
    'Late correction 1 — Speaking travel line',
    'Keynotes, panels, and facilitated conversations. Based in Utah and available for engagements nationally and internationally.',
    ['/individual-sessions'],
  ],
  [
    'Late correction 2 — FAQ in-person answer',
    'Yes. We offer in-person workshops, training, and speaking, and we travel for engagements, including internationally. Starting Point Consulting is based in Utah and works nationwide.',
    ['/faq'],
  ],

  // Handoff §01 — service area wording, and §13 lists the places it must appear.
  [
    'Service area line',
    'Based in Utah. Working virtually and on site nationwide.',
    ['/', '/contact'],
  ],

  // Handoff §08 — "Prices are approved and must not change."
  ['Price $175', '$175', ['/individual-sessions']],
  ['Price $250', '$250', ['/individual-sessions']],
  ['Price $295', '$295', ['/individual-sessions']],
  ['Price $640', '$640', ['/individual-sessions']],
  ['Price $825', '$825', ['/individual-sessions']],

  // Handoff §01 — founder identity, and §13 "in visible copy on Home and About".
  ['Founder name and credentials', 'Darlene Erich, MBA, BSN, RN', ['/about']],

  // Blueprints Global 03 — footer baseline, on every page.
  [
    'Footer baseline',
    'educational and supportive, not therapy or medical care',
    [...pages.keys()],
  ],
];

/* ------------------------------------------------------------------ */
/* Must NOT appear anywhere — Handoff §16 and §18                      */
/* ------------------------------------------------------------------ */

const forbidden = [
  ['Retired keynote pricing', 'Keynotes start at'],
  ['Retired keynote pricing figure', '$2,500'],
  ['Retired universal CTA', 'Book a discovery call'],
  ['Retired universal CTA', 'Book a call'],
  ['Retired referral language', 'referral form'],
  ['Retired referral language', 'how to refer'],
  ['Retired referral language', 'send your client'],
  ['Retired referral language', 'somatic referral'],
  ['Retired page name', 'For referring professionals'],
  ['Retired one-pager', 'Referral One-Pager'],
  ['Placeholder price token', '$[0,000]'],
  ['Unreplaced placeholder', 'PLACEHOLDER'],
  ['Unreplaced effective date', '[Effective date]'],
  ['Lorem ipsum', 'Lorem ipsum'],
  // Handoff §07 — there is no standalone public Pricing page.
  ['Standalone Pricing route', 'href="/pricing"'],
];

/* ------------------------------------------------------------------ */

let failures = 0;

console.log(`check-copy: ${pages.size} page(s)\n`);
console.log('Required — approved copy that must appear verbatim\n');

for (const [label, phrase, routes] of required) {
  for (const route of routes) {
    const text = pages.get(route);
    if (text === undefined) {
      console.log(`  SKIP  ${label} — ${route} not built yet`);
      continue;
    }
    const ok = text.includes(norm(phrase));
    if (!ok) failures++;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}  ${route}`);
  }
}

console.log('\nForbidden — wording and routes explicitly retired\n');

// Check forbidden phrases against raw HTML so href= patterns are catchable.
const rawByRoute = new Map();
for (const file of await walk(DIST)) rawByRoute.set(routeOf(file), await readFile(file, 'utf8'));

for (const [label, phrase] of forbidden) {
  const hits = [];
  for (const [route, raw] of rawByRoute) {
    const haystack = phrase.includes('href=') ? raw : textOf(raw);
    if (haystack.toLowerCase().includes(phrase.toLowerCase())) hits.push(route);
  }
  if (hits.length) failures++;
  console.log(`  ${hits.length ? 'FAIL' : 'OK  '}  ${label}: "${phrase}"${hits.length ? `  found on ${hits.join(', ')}` : ''}`);
}

console.log(`\n${failures ? `${failures} problem(s).` : 'Copy checks passed.'}`);
process.exit(failures ? 1 : 0);
