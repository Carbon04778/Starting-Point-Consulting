/**
 * XML sitemap — Handoff §17 launch checklist ("Sitemap submitted; Google
 * Search Console and Bing Webmaster Tools verified").
 *
 * Lists the PUBLIC pages only. Deliberately absent, per Handoff §10 and
 * Darlene's decision of 15 Sept 2026 ("keep them noindex, out of navigation,
 * and excluded from the sitemap"):
 *   - the three /schedule/* post-payment pages
 *   - the seven /checkout/* pages
 *   - /new-client-intake
 *   - /admin/* and /api/*
 *   - pages that are not built yet (Client Resources, Free guide)
 *
 * Rendered per request so an article Darlene publishes is listed at once.
 */
import { routes, business } from '../config/site.js';
import { listPublished } from '../lib/articles.js';

export const prerender = false;

const PUBLIC_ROUTES = [
  routes.home,
  routes.services,
  routes.individualSessions,
  routes.speaking,
  routes.booking,
  routes.startingPoints,
  routes.about,
  routes.ourApproach,
  routes.faq,
  routes.forTherapistsAndProviders,
  routes.contact,
  routes.privacyPolicy,
  routes.terms,
  routes.disclaimer,
  routes.hipaaNote,
  routes.accessibility,
  routes.inclusion,
  routes.clientServiceAgreement,
  routes.testimonialRelease,
];

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET({ site }) {
  const origin = (site ?? new URL(`https://${business.domain}`)).href.replace(/\/$/, '');

  let articles = [];
  try {
    articles = await listPublished();
  } catch (error) {
    console.warn('[sitemap] articles unavailable —', error?.message ?? error);
  }

  const urls = [
    ...PUBLIC_ROUTES.map((path) => ({ loc: `${origin}${path === '/' ? '/' : path}` })),
    ...articles.map((a) => ({
      loc: `${origin}${routes.startingPoints}/${a.slug}`,
      lastmod: a.published_at ? new Date(a.published_at).toISOString().slice(0, 10) : null,
    })),
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        ({ loc, lastmod }) =>
          `  <url><loc>${escape(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
      )
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  });
}
