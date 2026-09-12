/**
 * Site photo slots — the three placeholder photographs from Pending Items §03
 * that Darlene can fill from the admin dashboard.
 *
 * The public pages that show these are prerendered, so a slot is read at
 * BUILD time. A swap made in the dashboard therefore appears on the next
 * deploy; the dashboard triggers one through VERCEL_DEPLOY_HOOK_URL when that
 * variable is set, and says plainly when it is not. Articles are different:
 * their pages render per request, so publishing is immediate.
 *
 * Server-side only.
 */
import { publicClient, supabaseConfigured, mediaUrl } from './supabase.js';

/** Slot id → where it appears and the shape the page expects. */
export const SLOTS = {
  'home-hero': {
    label: 'Homepage hero',
    where: 'Home, beside the headline (Image Map HOME-01)',
    ratio: '4:5',
    note: 'Until a photo is set, the emblem medallion stands in, per Blueprints Page 01 §1.',
  },
  speaking: {
    label: 'Speaking',
    where: 'Speaking page hero, right column (Image Map SPK-01)',
    ratio: '4:5',
    note: 'Until a photo is set, the approved founder portrait stands in.',
  },
  'our-approach': {
    label: 'Our Approach',
    where: 'Our Approach, supporting image between sections 2 and 4',
    ratio: '3:2',
    note: 'Until a photo is set, the brand-colour placeholder frame shows.',
  },
};

/**
 * All slots that currently have a photo, keyed by slot id, each with a
 * ready-to-use public `src`. Returns {} when Supabase is not configured or
 * unreachable, so a build never fails because of a photo.
 */
export async function loadSlots() {
  if (!supabaseConfigured()) return {};
  try {
    const { data, error } = await publicClient().from('site_photos').select('slot, storage_path, alt');
    if (error) throw error;
    return Object.fromEntries(
      (data ?? []).map((row) => [row.slot, { src: mediaUrl(row.storage_path), alt: row.alt }]),
    );
  } catch (error) {
    console.warn('[photos] could not load site_photos; using placeholders —', error?.message ?? error);
    return {};
  }
}

/** One slot, or null. */
export async function loadSlot(slot) {
  return (await loadSlots())[slot] ?? null;
}
