/**
 * Starting Points — the article model shared by the public pages and the
 * admin editor. Server-side only (it renders Markdown to HTML).
 *
 * Everything here traces to Blueprints Page 07/08 and Master Copy §09/§10.
 */
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { publicClient } from './supabase.js';

/** Master Copy §09 "Filters" — "All" is a filter, never a stored category. */
export const CATEGORIES = ['Nervous System', 'Resilience', 'Leadership', 'For Individuals', 'Healthcare'];

/** Filter chips as shown, with the query-string value each one uses. */
export const FILTERS = [
  { label: 'All', value: '' },
  ...CATEGORIES.map((c) => ({ label: c, value: slugify(c) })),
];

/** "leading-from-a-regulated-place" from "Leading from a Regulated Place". */
export function slugify(text) {
  return String(text ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function categoryFromFilter(value) {
  return CATEGORIES.find((c) => slugify(c) === value) ?? null;
}

/** ~230 words a minute, never below 1. Recomputed on every save. */
export function readMinutes(markdown) {
  const words = String(markdown ?? '')
    .replace(/[#>*_`\-\[\]()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

/* ------------------------------------------------------------------ */
/* Markdown → safe HTML                                                */
/* ------------------------------------------------------------------ */

marked.setOptions({ gfm: true, breaks: false });

/**
 * The only HTML an article body may contain. Matches what the prototype's
 * `Body` wrapper styles: paragraphs, one level of subheading (h2, with h3
 * allowed), lists, a pull quote, emphasis, links. No images inline — the lead
 * image is the article's image (Blueprints Page 08 §3). No raw HTML, no
 * scripts, no styles, ever.
 */
const SANITIZE = {
  allowedTags: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'strong', 'em', 'a', 'br', 'hr'],
  allowedAttributes: { a: ['href', 'rel', 'target'] },
  allowedSchemes: ['https', 'mailto'],
  transformTags: {
    // Every outbound link opens safely in a new tab (Handoff §06: external
    // documents open in a new tab).
    a: (tagName, attribs) => {
      const href = attribs.href ?? '';
      const internal = href.startsWith('/') || href.startsWith('#');
      return {
        tagName,
        attribs: internal
          ? { href }
          : { href, rel: 'noopener noreferrer', target: '_blank' },
      };
    },
    // Authors may type "# Heading"; the page already has its h1, so demote.
    h1: 'h2',
    h4: 'h3',
    h5: 'h3',
    h6: 'h3',
  },
};

export function renderMarkdown(markdown) {
  const html = marked.parse(String(markdown ?? ''), { async: false });
  return sanitizeHtml(html, SANITIZE);
}

/* ------------------------------------------------------------------ */
/* Public reads                                                        */
/* ------------------------------------------------------------------ */

const CARD_COLUMNS =
  'id, slug, title, category, summary, read_minutes, lead_image_path, lead_image_alt, published_at';

/**
 * Published articles, newest first. Optionally one category.
 * RLS already hides drafts from the anon key; the status filter here is for
 * clarity and for the index that backs it.
 */
export async function listPublished({ category = null } = {}) {
  let query = publicClient()
    .from('articles')
    .select(CARD_COLUMNS)
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) throw new Error(`articles: list failed — ${error.message}`);
  return data ?? [];
}

/** One published article by slug, or null. Drafts return null to the public. */
export async function getPublished(slug) {
  const { data, error } = await publicClient()
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw new Error(`articles: get failed — ${error.message}`);
  return data;
}

/**
 * Blueprints Page 08 §5 "three related-article cards": same category first,
 * newest first, then any category to fill three. Never the article itself.
 */
export async function related(article, limit = 3) {
  const same = (await listPublished({ category: article.category })).filter((a) => a.id !== article.id);
  if (same.length >= limit) return same.slice(0, limit);
  const rest = (await listPublished()).filter(
    (a) => a.id !== article.id && !same.some((s) => s.id === a.id),
  );
  return [...same, ...rest].slice(0, limit);
}

/** "September 12, 2026" — the "[Date]" in the meta line (Master Copy §10). */
export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Denver', // Utah, per business.serviceArea
  });
}
