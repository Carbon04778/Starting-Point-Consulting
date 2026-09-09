/**
 * Legal text fidelity check.
 *
 * CLAUDE.md: legal text must never be paraphrased or reconstructed. The pages
 * render a parse of `docs/legal-source/*.txt` rather than a transcription (see
 * src/lib/legal.js), which removes the chance of a typo — but not the chance of
 * a rendering bug silently dropping a clause. This asserts, against the BUILT
 * html, that every approved line actually reaches the page.
 *
 * It checks three things:
 *   1. Every non-marker source line appears verbatim in the rendered page.
 *   2. The four advisory callouts do NOT appear (OPEN-QUESTIONS #6).
 *   3. No bracketed placeholder survives into the output.
 *
 *   node scripts/check-legal.mjs   (run by `npm run qa`)
 */
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertLegalSetIntact, EFFECTIVE_DATE } from '../src/lib/legal.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Inline tags close up; block tags become a space. */
const textOf = (html) => {
  const start = html.indexOf('<article');
  const end = html.indexOf('</article>');
  if (start < 0 || end < 0) return '';
  return html
    .slice(start, end)
    .replace(/<\/?(a|em|strong|b|i|span)\b[^>]*>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const ADVISORY = 'qualified legal counsel';

let problems = 0;
let verified = 0;

console.log('Legal text — rendered pages against the approved extraction\n');

let pages;
try {
  pages = assertLegalSetIntact();
} catch (error) {
  console.log(`  FAIL  ${error.message}`);
  console.log('\n1 problem(s).');
  process.exit(1);
}

for (const page of pages) {
  const built = join(root, 'dist', page.slug, 'index.html');

  let rendered;
  try {
    rendered = textOf(await readFile(built, 'utf8'));
  } catch {
    console.log(`  FAIL  ${page.slug} — not built (run npm run build first)`);
    problems++;
    continue;
  }

  const source = await readFile(join(root, 'docs', 'legal-source', `${page.slug}.txt`), 'utf8');

  const lines = source
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line !== '---' && !/^(EYEBROW|TITLE|LAST UPDATED|INTRO):/.test(line))
    .map((line) =>
      line
        .replace(/^##\s+/, '')
        .replace(/^-\s+/, '')
        .replace(/^\[CALLOUT\]\s*/, ''),
    );

  let missing = 0;

  for (const line of lines) {
    if (line.includes(ADVISORY)) continue; // dropped by decision, checked below
    verified++;
    if (!rendered.includes(line)) {
      missing++;
      if (missing <= 3) console.log(`        missing: ${line.slice(0, 96)}…`);
    }
  }

  for (const key of ['EYEBROW', 'TITLE', 'INTRO']) {
    const value = source.match(new RegExp(`^${key}: (.+)$`, 'm'))?.[1]?.trim();
    if (!value) continue;
    verified++;
    if (!rendered.includes(value)) {
      missing++;
      console.log(`        missing ${key}: ${value.slice(0, 80)}…`);
    }
  }

  if (rendered.includes(ADVISORY)) {
    missing++;
    console.log('        advisory callout leaked into the page — see OPEN-QUESTIONS #6');
  }

  // Bracketed text that is genuinely part of the approved document, not a
  // placeholder waiting to be filled. The Testimonial & Media Release is a form
  // the signer marks up, so "[yes / no]" is content and must survive.
  const DOCUMENT_BRACKETS = new Set(['[yes / no]']);

  const placeholder = [...rendered.matchAll(/\[[^\]]{3,}\]/g)]
    .map((match) => match[0])
    .find((match) => !DOCUMENT_BRACKETS.has(match));

  if (placeholder) {
    missing++;
    console.log(`        unresolved placeholder: ${placeholder}`);
  }

  problems += missing;
  console.log(
    `  ${missing ? 'FAIL' : 'PASS'}  ${page.slug.padEnd(26)} ${String(lines.length).padStart(3)} lines`,
  );
}

console.log(
  problems
    ? `\n${problems} problem(s).`
    : `\n${verified} approved strings render verbatim. No advisory text, no placeholders.` +
        `\nEffective date in use: ${EFFECTIVE_DATE}.`,
);

process.exit(problems ? 1 : 0);
