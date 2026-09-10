/**
 * Where the built HTML actually is.
 *
 * The Vercel adapter changes this depending on whether the build produced any
 * on-demand routes. While the whole site was static it wrote `dist/`. As soon
 * as the first server endpoint appeared (`/api/csa-acceptance`, needed because
 * CSA acceptance must be logged before payment) the adapter split the output:
 * prerendered HTML moved to `dist/client/` and the function bundle to
 * `.vercel/output/`.
 *
 * Every QA script silently found nothing when that happened. Resolving the
 * directory in one place, rather than hardcoding `dist` in four, means the
 * next adapter change breaks one file instead of four — and `--dir` lets a
 * check run against a downloaded deployment.
 */
import { existsSync } from 'node:fs';
import { join, dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * @returns {string} absolute path to the directory holding the built site
 */
export function distDir() {
  // `--dir some/path` overrides everything, for checking a real deployment.
  const flag = process.argv.indexOf('--dir');
  if (flag !== -1 && process.argv[flag + 1]) {
    const given = process.argv[flag + 1];
    return isAbsolute(given) ? given : resolve(root, given);
  }

  const candidates = [
    join(root, 'dist', 'client'), // adapter output once a server route exists
    join(root, 'dist'), // fully static build
    join(root, '.vercel', 'output', 'static'), // adapter's deployable copy
  ];

  const found = candidates.find((dir) => existsSync(join(dir, 'index.html')));

  if (!found) {
    console.error(
      'No built site found. Run `npm run build` first.\nLooked in:\n  ' +
        candidates.map((c) => c.replace(root + '\\', '').replace(root + '/', '')).join('\n  '),
    );
    process.exit(1);
  }

  return found;
}
