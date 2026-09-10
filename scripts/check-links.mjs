/**
 * Internal link crawler — working rule 3 ("every button, link, and CTA gets
 * checked, nothing dead, nothing pointing at a placeholder") and rule 4
 * ("a script that crawls internal links for 404s").
 *
 * Run against the built output:
 *   npm run qa          # build, then check
 *   npm run check:links # check an existing dist/
 *
 * What it checks:
 *   - every internal href resolves to a real page in dist/
 *   - every in-page #anchor target actually exists on the target page
 *   - every internal asset (img/src, link/href) exists in dist/
 *   - external links are listed, and any that is not on the approved
 *     Stripe/Calendly/mailto allow-list is reported for review
 *
 * Exit code 1 on any broken internal link so this can gate a commit.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { distDir } from './dist-dir.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = distDir();

/** Handoff §10 — the only external hosts the site is allowed to link to. */
const APPROVED_EXTERNAL = [
  'https://buy.stripe.com/',
  'https://calendly.com/darlene-startingpointconsulting/',
  // Own origin: canonical and og:url tags are absolute by design.
  'https://startingpointconsulting.com',
  // Webfonts, loaded by docs/tokens/fonts.css.
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

if (!existsSync(DIST)) {
  console.error('check-links: no dist/ — run `npm run build` first.');
  process.exit(1);
}


/**
 * Routes rendered on demand rather than written to disk.
 *
 * Since the purchase flow arrived, /checkout/<id> and /schedule/<id> are
 * server routes: they exist, but there is no HTML file to find, so a
 * file-based crawl would call every link to them broken. The adapter records
 * the authoritative patterns in .vercel/output/config.json, so they are read
 * from there rather than kept as a second list here that could drift.
 */
const onDemand = (() => {
  const config = join(root, '.vercel', 'output', 'config.json');
  if (!existsSync(config)) return [];
  try {
    return JSON.parse(readFileSync(config, 'utf8'))
      .routes.filter((r) => r.dest === '_render' && r.src)
      .map((r) => new RegExp(r.src));
  } catch {
    return [];
  }
})();

const isOnDemand = (route) => onDemand.some((re) => re.test(route));

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry);
    if ((await stat(full)).isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const allFiles = await walk(DIST);
const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));

/** dist/services/index.html -> "/services"; dist/index.html -> "/" */
function routeOf(file) {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'/index.html'.length)}`;
  return `/${rel.replace(/\.html$/, '')}`;
}

const routeToFile = new Map(htmlFiles.map((f) => [routeOf(f), f]));
const assetPaths = new Set(
  allFiles.map((f) => `/${relative(DIST, f).split(sep).join('/')}`),
);

/** Collect every id= and name= anchor target on a page. */
const anchorsByRoute = new Map();
for (const [route, file] of routeToFile) {
  const html = await readFile(file, 'utf8');
  const ids = new Set();
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
  for (const m of html.matchAll(/\sname="([^"]+)"/g)) ids.add(m[1]);
  anchorsByRoute.set(route, ids);
}

const broken = [];
const external = new Map();
let checked = 0;

for (const [route, file] of routeToFile) {
  const html = await readFile(file, 'utf8');

  const refs = [
    ...[...html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)].map((m) => ({ kind: 'link', value: m[1] })),
    ...[...html.matchAll(/<img\b[^>]*\ssrc="([^"]*)"/g)].map((m) => ({ kind: 'image', value: m[1] })),
    ...[...html.matchAll(/<link\b[^>]*\shref="([^"]*)"/g)].map((m) => ({ kind: 'asset', value: m[1] })),
  ];

  for (const { kind, value } of refs) {
    if (!value || value.startsWith('data:') || value.startsWith('#')) {
      // Same-page anchors.
      if (value.startsWith('#') && value.length > 1) {
        checked++;
        if (!anchorsByRoute.get(route)?.has(value.slice(1))) {
          broken.push({ route, kind: 'anchor', value, reason: 'no element with that id on this page' });
        }
      }
      continue;
    }

    if (/^(https?:)?\/\//.test(value)) {
      const list = external.get(value) ?? [];
      list.push(route);
      external.set(value, list);
      continue;
    }

    if (value.startsWith('mailto:') || value.startsWith('tel:')) continue;
    if (!value.startsWith('/')) {
      broken.push({ route, kind, value, reason: 'relative link — use a root-relative path' });
      continue;
    }

    checked++;
    const [path, hash] = value.split('#');
    const clean = path.replace(/\/$/, '') || '/';

    if (kind === 'link') {
      if (!routeToFile.has(clean)) {
        // An <a> may legitimately point at a file (a PDF), not a page, or at a
        // route the adapter renders on demand rather than writing to disk.
        if (!assetPaths.has(path) && !isOnDemand(clean)) {
          broken.push({ route, kind, value, reason: 'no such page or file in dist/' });
        }
        continue;
      }
      if (hash && !anchorsByRoute.get(clean)?.has(hash)) {
        broken.push({ route, kind: 'anchor', value, reason: `no #${hash} on ${clean}` });
      }
    } else if (!assetPaths.has(path)) {
      broken.push({ route, kind, value, reason: 'asset not found in dist/' });
    }
  }
}

/* ------------------------------- report ------------------------------- */

const isApproved = (url) => APPROVED_EXTERNAL.some((prefix) => url.startsWith(prefix));

console.log(`check-links: ${routeToFile.size} page(s), ${checked} internal reference(s) checked.\n`);

const unapproved = [...external.keys()].filter((url) => !isApproved(url));

if (unapproved.length) {
  console.log('External links NOT on the Handoff §10 allow-list — review each:');
  for (const url of unapproved) {
    console.log(`  ${url}\n    referenced by: ${[...new Set(external.get(url))].join(', ')}`);
  }
  console.log('');
}

if (broken.length) {
  // Group by target: one missing page referenced from the footer shows up on
  // every page, and listing it 26 times buries the actual count.
  const byTarget = new Map();
  for (const b of broken) {
    const key = `${b.kind}|${b.value}|${b.reason}`;
    const entry = byTarget.get(key) ?? { ...b, from: new Set() };
    entry.from.add(b.route);
    byTarget.set(key, entry);
  }

  console.error(
    `BROKEN: ${byTarget.size} distinct target(s), ${broken.length} reference(s) in total.\n`,
  );
  for (const b of [...byTarget.values()].sort((a, z) => a.value.localeCompare(z.value))) {
    const from = [...b.from];
    const shown = from.length > 4 ? `${from.slice(0, 4).join(', ')} +${from.length - 4} more` : from.join(', ');
    console.error(`  ${b.value}  (${b.kind})\n    ${b.reason}\n    from: ${shown}\n`);
  }
} else {
  console.log('No broken internal references.\n');
}

process.exit(broken.length ? 1 : 0);
