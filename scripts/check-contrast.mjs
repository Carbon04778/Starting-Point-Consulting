/**
 * Contrast check for the token pairings the site actually uses.
 *
 * Handoff §03 "Accessibility rules for color" and Start Here §06 both single
 * out the same risk: "Check contrast carefully where gold sits on cream — that
 * is the pairing most likely to fail." This encodes those rules so a future
 * change that reintroduces gold-500 body text fails the build instead of
 * shipping.
 *
 * WCAG 2.1 AA: 4.5:1 for normal text, 3:1 for large text (≥18.66px bold or
 * ≥24px regular) and for UI component boundaries.
 *
 *   node scripts/check-contrast.mjs
 *
 * Colours are read from docs/tokens/colors.css so this can never drift from
 * the design system.
 */
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = await readFile(join(root, 'docs', 'tokens', 'colors.css'), 'utf8');

/** Pull the literal hex tokens (skip the `var(--x)` semantic aliases). */
const tokens = Object.fromEntries(
  [...css.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})\s*;/g)].map((m) => [m[1], m[2]]),
);

const srgb = (hex) =>
  [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });

const luminance = (hex) => {
  const [r, g, b] = srgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};


/**
 * Translucent-over-solid composite, for the footer newsletter field. The
 * prototype builds that control out of rgba() white over the footer gradient,
 * so the pairing can only be checked against the resulting flat colour.
 * Registered as a pseudo-token so the pairs table below reads the same as the
 * rest.
 */
const blend = (fg, bg, alpha) => {
  const mix = (i) =>
    Math.round(
      parseInt(fg.slice(i, i + 2), 16) * alpha + parseInt(bg.slice(i, i + 2), 16) * (1 - alpha),
    )
      .toString(16)
      .padStart(2, '0');
  return `#${mix(1)}${mix(3)}${mix(5)}`;
};

// The footer gradient runs sage-700 → ink-800, so the newsletter field is
// checked at BOTH ends: whichever is worse is the one that matters.
tokens['field-ground-ink'] = blend(tokens.white, tokens['ink-800'], 0.06);
tokens['field-border-ink'] = blend(tokens.white, tokens['ink-800'], 0.4);
tokens['field-border-sage'] = blend(tokens.white, tokens['sage-700'], 0.4);

/**
 * Each entry: what it is, foreground token, background token, and the minimum
 * this particular usage must clear.
 */
const pairs = [
  // Body and headings — Handoff §03: "Body text is ink-800 on cream or white."
  ['Body text on cream page wash', 'ink-800', 'sand-50', 4.5],
  ['Body text on warm sand', 'ink-800', 'sand-100', 4.5],
  ['Body text on white card', 'ink-800', 'white', 4.5],
  ['Headings on cream', 'ink-900', 'sand-50', 4.5],

  // "Muted text is ink-500 minimum; never use ink-400 or ink-300 for paragraphs."
  ['Muted caption on cream', 'ink-500', 'sand-50', 4.5],
  ['Muted caption on white', 'ink-500', 'white', 4.5],

  // THE flagged pairing. gold-700 is "the accessible gold" for type under 18px.
  ['Eyebrow / link, gold-700 on cream', 'gold-700', 'sand-50', 4.5],
  ['Eyebrow / link, gold-700 on warm sand', 'gold-700', 'sand-100', 4.5],
  ['Eyebrow / link, gold-700 on white', 'gold-700', 'white', 4.5],
  ['Link on gold-50 callout', 'gold-700', 'gold-50', 4.5],
  ['Callout body text on gold-50', 'ink-800', 'gold-50', 4.5],

  // Primary button. Handoff §03 specifies a white label; at 2.81:1 that fails
  // AA for the 15–16px button type, so the label is ink-900 (approved
  // deviation — see docs/OPEN-QUESTIONS.md). Button text is normal-size text
  // under WCAG, so the threshold is 4.5:1, not 3:1.
  ['Primary button label', 'ink-900', 'gold-500', 4.5],
  ['Primary button label, hover', 'ink-900', 'gold-600', 4.5],

  // Dark surfaces: sand-100 for text, gold-300 for accents.
  ['Text on deep sage band', 'sand-100', 'sage-700', 4.5],
  ['Text on ink band', 'sand-100', 'ink-800', 4.5],
  ['Accent on deep sage band', 'gold-300', 'sage-700', 4.5],
  ['Accent on ink band', 'gold-300', 'ink-800', 4.5],
  ['Footer link, sand-200 on ink', 'sand-200', 'ink-800', 4.5],
  ['Footer link hover, gold-200 on ink', 'gold-200', 'ink-800', 4.5],

  // Chips.
  ['Chip label, sage-700 on sage-50', 'sage-700', 'sage-50', 4.5],

  // Form error text.
  ['Form error text on white', 'danger-500', 'white', 4.5],
  // Footer newsletter field — built from rgba() over the footer gradient.
  // A control's boundary needs 3:1 (WCAG 1.4.11); the prototype's 20% white
  // gives 1.91:1, which is why the build uses 40%. See OPEN-QUESTIONS #29.
  ['Newsletter placeholder on field', 'sand-300', 'field-ground-ink', 4.5],
  ['Newsletter typed text on field', 'white', 'field-ground-ink', 4.5],
  ['Newsletter field border on ink end', 'field-border-ink', 'ink-800', 3],
  ['Newsletter field border on sage end', 'field-border-sage', 'sage-700', 3],
  ['Newsletter submit fill on ink end', 'gold-500', 'ink-800', 3],
  ['Newsletter submit arrow, ink-900 on gold-500', 'ink-900', 'gold-500', 3],
  ['Newsletter error text on ink', 'gold-200', 'ink-800', 4.5],
];

/**
 * Combinations Handoff §03 explicitly forbids. These must FAIL — if one ever
 * passes, the palette changed and the rule needs revisiting.
 */
const mustFail = [
  ['gold-500 small text on cream (forbidden)', 'gold-500', 'sand-50', 4.5],
  ['gold-500 small text on white (forbidden)', 'gold-500', 'white', 4.5],
  ['white button label on gold-500 (the reason we use ink-900)', 'white', 'gold-500', 4.5],
];

let failures = 0;

console.log('Contrast — token pairings in use\n');
for (const [label, fg, bg, min] of pairs) {
  const r = ratio(tokens[fg], tokens[bg]);
  const ok = r >= min;
  if (!ok) failures++;
  console.log(
    `  ${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2)}:1  (min ${min})  ${label}  [${fg} on ${bg}]`,
  );
}

console.log('\nGuard — combinations the design system forbids\n');
for (const [label, fg, bg, min] of mustFail) {
  const r = ratio(tokens[fg], tokens[bg]);
  const stillFails = r < min;
  if (!stillFails) failures++;
  console.log(
    `  ${stillFails ? 'OK  ' : 'WARN'}  ${r.toFixed(2)}:1  ${label} — ${
      stillFails ? 'correctly below AA, keep using gold-700' : 'now passes; revisit Handoff §03'
    }`,
  );
}

console.log(`\n${failures ? `${failures} problem(s).` : 'All pairings clear their threshold.'}`);
process.exit(failures ? 1 : 0);
