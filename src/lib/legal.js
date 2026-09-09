/**
 * Legal page source loader.
 *
 * WHY THIS PARSES A FILE INSTEAD OF THE PAGES HOLDING THE TEXT.
 *
 * CLAUDE.md is emphatic that legal text must never be paraphrased or
 * reconstructed. `scripts/extract-legal.mjs` already pulls all eight pages
 * verbatim out of the approved prototype into `docs/legal-source/*.txt`, and
 * the result was verified two ways (OPEN-QUESTIONS #4). Retyping those 463
 * lines into Astro files would put a human transcription step between the
 * approved text and the page — exactly the risk the rule exists to prevent.
 *
 * So the text is never retyped: the pages render this parse of the extracted
 * files. Re-running the extractor propagates any correction straight through,
 * and `npm run check:copy` still asserts the protected sentences.
 *
 * THE SOURCE GRAMMAR (all eight files, no exceptions — asserted below):
 *
 *   EYEBROW: <text>              header, once
 *   TITLE: <text>                header, once
 *   LAST UPDATED: <text>         header, optional (6 of 8)
 *   INTRO: <text>                header, once
 *   ---                          ends the header block
 *   ## <text>                    section heading (63 across the set)
 *     - <text>                   list item, two-space indent (85)
 *   [CALLOUT] <text>             emphasis block (7)
 *   <text>                       paragraph
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE_DIR = join(process.cwd(), 'docs', 'legal-source');

/**
 * CLAUDE.md: "Launch date: September 21, 2026. This is the effective date to
 * hard-code into the Client Service Agreement page." The CSA's own placeholder
 * reads "[PRE-LAUNCH PLACEHOLDER — effective date is the website launch date]",
 * which ties the other five `[Effective date]` markers to the same day.
 *
 * The advisory callouts also mention unfilled "business address" and
 * "governing state" placeholders. Both are stale: Utah is already written into
 * Terms §15 and CSA §11, and the Sandy, UT address is already inline in five
 * files. The effective date is the only placeholder that was still open.
 */
export const EFFECTIVE_DATE = 'September 21, 2026';

const PLACEHOLDERS = [
  '[PRE-LAUNCH PLACEHOLDER — effective date is the website launch date]',
  '[Effective date]',
];

/**
 * Advisory callouts are notes to Darlene, not policy: they tell the reader the
 * document has not been through counsel. Publishing them would undercut the
 * page. OPEN-QUESTIONS #6 records the decision to drop these four and publish
 * the other three verbatim.
 *
 * Identified by content rather than by filename so that a reworded advisory
 * still drops, and asserted by count below so that a *new* callout can never
 * disappear silently.
 */
const isAdvisory = (text) => text.includes('qualified legal counsel');

const EXPECTED_ADVISORY = 4;
const EXPECTED_PUBLISHED = 3;

/** Approved text is never rewritten — but a bare email should still be usable. */
const linkifyEmail = (text) =>
  text.replace(
    /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/gi,
    '<a href="mailto:$1">$1</a>',
  );

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Escape first, then linkify, so the source can never inject markup. */
const inline = (text) => linkifyEmail(escapeHtml(text));

function parse(slug, raw) {
  const [header, ...rest] = raw.split(/^---$/m);
  if (rest.length === 0) throw new Error(`legal/${slug}: no '---' header separator`);

  const meta = {};
  for (const [, key, value] of header.matchAll(/^([A-Z][A-Z ]*):\s*(.+)$/gm)) {
    meta[key] = value.trim();
  }

  for (const required of ['EYEBROW', 'TITLE', 'INTRO']) {
    if (!meta[required]) throw new Error(`legal/${slug}: missing ${required}`);
  }

  let lastUpdated = meta['LAST UPDATED'] ?? null;
  if (lastUpdated) {
    for (const placeholder of PLACEHOLDERS) {
      lastUpdated = lastUpdated.replace(placeholder, EFFECTIVE_DATE);
    }
    if (lastUpdated.includes('[')) {
      throw new Error(`legal/${slug}: unresolved placeholder in "${lastUpdated}"`);
    }
  }

  const blocks = [];
  let dropped = 0;
  let published = 0;
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: 'p', html: inline(paragraph.join(' ')) });
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    blocks.push({ type: 'ul', items: list.map(inline) });
    list = [];
  };
  const flush = () => {
    flushParagraph();
    flushList();
  };

  for (const line of rest.join('---').split('\n')) {
    const text = line.trim();

    if (!text) {
      flush();
      continue;
    }

    if (text.startsWith('## ')) {
      flush();
      blocks.push({ type: 'h2', text: text.slice(3).trim() });
      continue;
    }

    if (/^-\s+/.test(text)) {
      flushParagraph();
      list.push(text.replace(/^-\s+/, ''));
      continue;
    }

    if (text.startsWith('[CALLOUT]')) {
      flush();
      const body = text.slice('[CALLOUT]'.length).trim();
      if (isAdvisory(body)) {
        dropped += 1;
      } else {
        published += 1;
        blocks.push({ type: 'callout', html: inline(body) });
      }
      continue;
    }

    flushList();
    paragraph.push(text);
  }
  flush();

  return {
    slug,
    eyebrow: meta.EYEBROW,
    title: meta.TITLE,
    navLabel: NAV_LABEL[slug] ?? meta.TITLE,
    intro: meta.INTRO,
    lastUpdated,
    blocks,
    dropped,
    published,
  };
}

/**
 * Browser-tab / search titles.
 *
 * Handoff §13's metadata sheet covers the nine public pages and gives the legal
 * set nothing, so the title follows §13's own pattern — "<Page> | Starting
 * Point Consulting" — over the **approved footer label** from Legal Pages Index
 * §01 rather than the full document title. That keeps every one of them inside
 * §13's "under 60 characters" (the longest lands at 58) and reuses a string
 * Darlene already approved, instead of inventing a shorter one.
 *
 * Only Inclusion actually differs from its on-page H1: "Non-Discrimination &
 * Inclusion" as the label, "Non-Discrimination & Inclusion Statement" as the
 * H1, both approved.
 */
const NAV_LABEL = {
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms & Conditions',
  disclaimer: 'Disclaimer',
  'hipaa-note': 'HIPAA Note',
  accessibility: 'Accessibility Statement',
  inclusion: 'Non-Discrimination & Inclusion',
  'client-service-agreement': 'Client Service Agreement',
  'testimonial-release': 'Testimonial Release',
};

const cache = new Map();

/** Parse one page by slug, e.g. `getLegalPage('privacy-policy')`. */
export function getLegalPage(slug) {
  if (!cache.has(slug)) {
    cache.set(slug, parse(slug, readFileSync(join(SOURCE_DIR, `${slug}.txt`), 'utf8')));
  }
  return cache.get(slug);
}

/**
 * Whole-set guard, run once at build time. If the extractor output changes
 * shape — a new callout, a lost heading, a fresh placeholder — the build fails
 * here rather than quietly publishing something nobody approved.
 */
export function assertLegalSetIntact() {
  const slugs = readdirSync(SOURCE_DIR)
    .filter((f) => f.endsWith('.txt'))
    .map((f) => f.replace(/\.txt$/, ''));

  const pages = slugs.map(getLegalPage);
  const dropped = pages.reduce((n, p) => n + p.dropped, 0);
  const published = pages.reduce((n, p) => n + p.published, 0);

  if (pages.length !== 8) throw new Error(`legal: expected 8 pages, found ${pages.length}`);
  if (dropped !== EXPECTED_ADVISORY) {
    throw new Error(
      `legal: expected ${EXPECTED_ADVISORY} advisory callouts to drop, dropped ${dropped}. ` +
        'The extracted text changed — re-check OPEN-QUESTIONS #6 before shipping.',
    );
  }
  if (published !== EXPECTED_PUBLISHED) {
    throw new Error(
      `legal: expected ${EXPECTED_PUBLISHED} published callouts, found ${published}.`,
    );
  }
  return pages;
}
