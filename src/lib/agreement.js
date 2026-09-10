/**
 * Identifies WHICH Client Service Agreement a person accepted.
 *
 * CLAUDE.md: "CSA acceptance happens before Stripe payment, and must be logged
 * with a timestamp. This is the reason we're not using a plain Stripe
 * checkbox." A timestamp alone is only half an answer — it says when someone
 * agreed but not what they agreed to. The CSA has an effective date and the
 * Legal Pages Index already references a revision log, so the wording will
 * change. These two values are what let anyone, later, reconstruct the exact
 * text a given client accepted.
 *
 * Both are computed at BUILD time from the same source file the public
 * /client-service-agreement page renders, so the recorded hash and the
 * published page can never drift apart.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE = join(process.cwd(), 'docs', 'legal-source', 'client-service-agreement.txt');

/**
 * Human-readable version. The CSA's own effective date, which CLAUDE.md fixes
 * at 21 September 2026 and `legal.js` renders on the page itself.
 */
export const AGREEMENT_VERSION = '2026-09-21';

/**
 * SHA-256 of the approved agreement text, normalised for line endings so a
 * Windows checkout and a Linux CI build produce the same digest.
 *
 * If the agreement text is ever revised, this changes automatically and new
 * acceptances record the new digest. Older rows keep the old one — which is
 * the entire point.
 */
export const AGREEMENT_HASH = createHash('sha256')
  .update(readFileSync(SOURCE, 'utf8').replace(/\r\n/g, '\n').trim())
  .digest('hex');
