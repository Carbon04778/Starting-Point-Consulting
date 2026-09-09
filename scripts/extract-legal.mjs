/**
 * Extracts the approved legal page text out of the interactive prototype.
 *
 *   node scripts/extract-legal.mjs
 *
 * Why this exists
 * ---------------
 * `docs/reference/approved-ui-mockup.html` is a self-contained bundle: a
 * base64 manifest of every module, unpacked by an inline loader at runtime.
 * That is why the file reads as unparseable when you grep it as static text.
 *
 * Decoding the manifest yields the original source modules, and the eight legal
 * pages are present verbatim as the exact files Master Copy §19 names as the
 * source of approved text — PrivacyPolicy.jsx, Terms.jsx, Disclaimer.jsx,
 * HipaaNote.jsx, Accessibility.jsx, Inclusion.jsx, ClientAgreement.jsx and
 * TestimonialRelease.jsx.
 *
 * So the legal copy is placed verbatim from the approved source. It is never
 * retyped, paraphrased, or reconstructed.
 *
 * Output
 * ------
 *   docs/legal-source/<page>.jsx   the decoded module, exactly as bundled
 *   docs/legal-source/<page>.txt   the same page as plain reading text
 *   docs/legal-source/REPORT.md    callouts and bracketed placeholders found
 *
 * The .txt files are for reading and diffing against the mockup in a browser.
 * The build places text from the .jsx modules.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'docs', 'reference', 'approved-ui-mockup.html');
const OUT = join(root, 'docs', 'legal-source');

/** Module id -> the page it is, and the filename Master Copy §19 names. */
const LEGAL_MODULES = {
  'cecf86ed-bef8-4c9d-ac4c-0d4ccb09aa0e': ['privacy-policy', 'Privacy Policy', 'PrivacyPolicy.jsx'],
  '675e0610-ec57-4b16-a54b-6a8c6c08f6e0': ['terms', 'Terms & Conditions', 'Terms.jsx'],
  '385b3b39-3838-45e4-aee5-876cc1a032a7': ['disclaimer', 'Disclaimer', 'Disclaimer.jsx'],
  '0db0ea85-d034-4b27-8c30-573d8003fd06': ['hipaa-note', 'HIPAA Note', 'HipaaNote.jsx'],
  '9e6aafc4-698d-429c-9e35-2a6e90e99724': ['accessibility', 'Accessibility Statement', 'Accessibility.jsx'],
  '7a24c629-86f1-4cab-810e-645ef7c76f85': ['inclusion', 'Non-Discrimination & Inclusion', 'Inclusion.jsx'],
  '60935886-87ab-4c0a-ae54-5c9faac865a9': ['client-service-agreement', 'Client Service Agreement', 'ClientAgreement.jsx'],
  '6d3dc8e4-701c-43de-8841-ddc91a684c6f': ['testimonial-release', 'Testimonial & Media Release', 'TestimonialRelease.jsx'],
};

const html = await readFile(SRC, 'utf8');

function bundlerTag(type) {
  const open = `<script type="__bundler/${type}">`;
  const start = html.indexOf(open);
  if (start < 0) throw new Error(`bundle: no ${type} tag — the mockup file may have changed format`);
  const from = start + open.length;
  return html.slice(from, html.indexOf('</scr' + 'ipt>', from));
}

const manifest = JSON.parse(bundlerTag('manifest'));

function decode(entry) {
  let buf = Buffer.from(entry.data, 'base64');
  if (entry.compressed) {
    for (const fn of [zlib.gunzipSync, zlib.inflateSync, zlib.brotliDecompressSync]) {
      try {
        return fn(buf).toString('utf8');
      } catch {
        /* try the next codec */
      }
    }
  }
  return buf.toString('utf8');
}

/** Turn a legal JSX module into plain reading text. */
function toPlainText(jsx) {
  const lines = [];

  const attr = (name) => {
    const m = jsx.match(new RegExp(`${name}="([^"]*)"`));
    return m ? m[1] : null;
  };

  // JS string escapes (\u2019 for a curly apostrophe, \' inside a quoted
  // string) survive into the bundled source and must be decoded, or the
  // published legal text would show the literal escape sequence.
  const unescapeJs = (s) =>
    s
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/\\n/g, ' ')
      .replace(/\\(['"\\])/g, '$1');

  const clean = (s) =>
    unescapeJs(s)
      .replace(/\{'([^']*)'\}/g, '$1')
      .replace(/\{"([^"]*)"\}/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

  const eyebrow = attr('eyebrow');
  const title = attr('title');
  const intro = attr('intro');
  const updated = attr('updated');

  if (eyebrow) lines.push(`EYEBROW: ${eyebrow}`);
  if (title) lines.push(`TITLE: ${title}`);
  if (updated) lines.push(`LAST UPDATED: ${updated}`);
  if (intro) lines.push('', `INTRO: ${intro}`);
  lines.push('', '---', '');

  // Walk the body in source order.
  const blockRe =
    /<LegalCallout>([\s\S]*?)<\/LegalCallout>|<LegalH>([\s\S]*?)<\/LegalH>|<LegalP>([\s\S]*?)<\/LegalP>|\bul\(\[([\s\S]*?)\]\)/g;

  for (const m of jsx.matchAll(blockRe)) {
    if (m[1] !== undefined) lines.push(`[CALLOUT] ${clean(m[1])}`, '');
    else if (m[2] !== undefined) lines.push(`## ${clean(m[2])}`, '');
    else if (m[3] !== undefined) lines.push(clean(m[3]), '');
    else if (m[4] !== undefined) {
      for (const item of m[4].matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g)) {
        lines.push(`  - ${clean(item[1] ?? item[2])}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

await mkdir(OUT, { recursive: true });

const report = [
  '# Legal source — extraction report',
  '',
  'Generated by `node scripts/extract-legal.mjs` from',
  '`docs/reference/approved-ui-mockup.html`. Do not edit by hand.',
  '',
  'Every page below is the approved text, verbatim, from the module Master Copy',
  '§19 names as its source. Two things need a decision before these pages ship —',
  'see `docs/OPEN-QUESTIONS.md`.',
  '',
];

for (const [id, [slug, name, sourceFile]] of Object.entries(LEGAL_MODULES)) {
  const entry = manifest[id];
  if (!entry) {
    console.error(`extract-legal: module ${id} (${name}) not in the manifest — mockup file changed?`);
    process.exitCode = 1;
    continue;
  }

  const jsx = decode(entry);
  await writeFile(join(OUT, `${slug}.jsx`), jsx);
  await writeFile(join(OUT, `${slug}.txt`), toPlainText(jsx));

  const callouts = [...jsx.matchAll(/<LegalCallout>([\s\S]*?)<\/LegalCallout>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim(),
  );
  const placeholders = [...new Set([...jsx.matchAll(/\[[A-Za-z][^\]\n]{2,70}\]/g)].map((m) => m[0]))];

  report.push(
    `## ${name}`,
    '',
    `- Source module: \`${sourceFile}\` (bundle id \`${id}\`)`,
    `- Extracted to: \`docs/legal-source/${slug}.txt\``,
    `- Bracketed placeholders: ${placeholders.length ? placeholders.map((p) => `\`${p}\``).join(', ') : 'none'}`,
    `- Callout blocks: ${callouts.length}`,
  );

  for (const c of callouts) {
    // A callout that talks about counsel/templates is a note to Darlene's
    // lawyer. Anything else is client-facing content and must publish.
    const advisory = /legal counsel|not legal advice|template release|starting point\.\s*Please/i.test(c);
    report.push(`  - **${advisory ? 'ADVISORY — decision needed' : 'CLIENT-FACING — publish'}:** ${c}`);
  }
  report.push('');
}

await writeFile(join(OUT, 'REPORT.md'), report.join('\n'));
console.log(`extract-legal: ${Object.keys(LEGAL_MODULES).length} page(s) -> docs/legal-source/`);
