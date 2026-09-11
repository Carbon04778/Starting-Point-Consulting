// Exports the client-delivered downloadable resources from HTML to PDF.
//
//   npm run export:resources
//
// Source: docs/reference/downloadable-resources/*.html — the September 2026
// "DOWNLOADABLE RESOURCES - CURRENT" package. Its DISTRIBUTION STATUS.txt says
// "these are HTML documents that print cleanly to PDF. Export each resource
// that is cleared for public download to PDF before publishing it on the
// website." This script is that export step.
//
// Output: assets/downloadable-resources/<slug>.pdf, which `npm run sync:assets`
// then serves at /assets/downloadable-resources/<slug>.pdf. The PDFs are
// committed, so the site build never needs a browser; re-run this only when a
// document in the package changes (e.g. when the finalised Speaker Kit lands).
//
// Only documents listed in CLEARED below are exported. "Start Where You Are"
// is a client resource, given directly by Darlene, and must never be exported
// here or served from the site — DISTRIBUTION STATUS, and Hadley's note of
// 10 September 2026.
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'docs', 'reference', 'downloadable-resources');
const DEST = join(root, 'assets', 'downloadable-resources');

/** Source filename -> served slug. Cleared for public download per DISTRIBUTION STATUS.txt. */
const CLEARED = {
  'Starting Point - Provider Resource.html': 'starting-point-provider-resource.pdf',
  'Starting Point - Speaker Kit.html': 'starting-point-speaker-kit.pdf',
  'Starting Point - Overview One-Pager.html': 'starting-point-overview-one-pager.pdf',
};

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error('export-resources: no Chrome/Edge found. Set CHROME_PATH to a browser executable.');
  process.exit(1);
}

mkdirSync(DEST, { recursive: true });

for (const [source, slug] of Object.entries(CLEARED)) {
  const input = join(SRC, source);
  if (!existsSync(input)) {
    console.error(`export-resources: missing source ${input}`);
    process.exit(1);
  }
  const output = join(DEST, slug);
  // The documents are JS-rendered bundles, so give the page a virtual-time
  // budget to finish rendering before printing.
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      '--virtual-time-budget=15000',
      `--print-to-pdf=${output}`,
      pathToFileURL(input).href,
    ],
    { stdio: 'ignore' },
  );
  const bytes = statSync(output).size;
  if (bytes < 10_000) {
    console.error(`export-resources: ${slug} is only ${bytes} bytes — the document probably did not render.`);
    process.exit(1);
  }
  console.log(`export-resources: ${source} -> assets/downloadable-resources/${slug} (${Math.round(bytes / 1024)} KB)`);
}
