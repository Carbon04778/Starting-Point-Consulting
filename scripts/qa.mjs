/**
 * QA runner — runs every automated check and reports all of them, then exits
 * non-zero if any failed.
 *
 * Chaining the checks with `&&` would stop at the first failure, which during
 * an in-progress build means the link crawler (legitimately red until every
 * page exists) hides every other result. Working rule 4 wants the checks run
 * after meaningful changes, so they all have to actually run.
 *
 *   npm run qa
 *
 * This does NOT replace the manual pass in docs/QA-CHECKLIST.md. It covers the
 * things a script can settle: dead internal links, missing assets, broken
 * anchors, and token contrast. Copy fidelity, mobile layout, keyboard order,
 * and focus visibility are still checked by hand, per page.
 */
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const steps = [
  ['Build', 'npm', ['run', 'build']],
  ['Internal links', 'node', ['scripts/check-links.mjs']],
  ['Page structure', 'node', ['scripts/check-pages.mjs']],
  ['Copy fidelity', 'node', ['scripts/check-copy.mjs']],
  ['Legal text fidelity', 'node', ['scripts/check-legal.mjs']],
  ['Colour contrast', 'node', ['scripts/check-contrast.mjs']],
];

const results = [];

for (const [name, cmd, args] of steps) {
  console.log(`\n${'='.repeat(64)}\n${name}\n${'='.repeat(64)}`);
  const run = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
  results.push([name, run.status === 0]);

  // Nothing downstream can run without a build.
  if (name === 'Build' && run.status !== 0) break;
}

console.log(`\n${'='.repeat(64)}\nQA summary\n${'='.repeat(64)}`);
for (const [name, ok] of results) console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}`);

const failed = results.filter(([, ok]) => !ok).length;
console.log(failed ? `\n${failed} check(s) failed.\n` : '\nAll automated checks passed.\n');
process.exit(failed ? 1 : 0);
