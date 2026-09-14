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

/**
 * Slot id → where it appears, the shape the page expects, and the default.
 *
 * Defaults are Darlene's photographs of 14 September 2026 (her note is in
 * assets/photos/photo-handoff-note-2026-09-14.txt), served web-sized from
 * assets/ by scripts/sync-assets.mjs. A photo uploaded to the slot from the
 * dashboard replaces the default; removing it restores the default.
 */
export const SLOTS = {
  'home-hero': {
    label: 'Homepage hero',
    where: 'Home, beside the headline (Image Map HOME-01)',
    ratio: '4:5',
    note: 'Default: Darlene’s hero-homepage.jpg (red-rock canyon), centre-cropped to 4:5.',
    fallback: {
      src: '/assets/photos/hero-homepage.jpg',
      alt: 'Red-rock canyon country under a clear sky, snow-capped mountains on the horizon',
    },
  },
  speaking: {
    label: 'Speaking',
    where: 'Speaking page hero, right column (Image Map SPK-01)',
    ratio: '4:5',
    note: 'Default: the founder portrait. Darlene has not sent a speaking-to-a-room photograph.',
    fallback: null, // speaking.astro renders the portrait itself when the slot is empty
  },
  'our-approach': {
    label: 'Our Approach',
    where: 'Our Approach, supporting image between sections 2 and 4',
    ratio: '3:2',
    note: 'Default: Darlene’s our-approach.jpg (alpine lake), an exact 3:2.',
    fallback: {
      src: '/assets/photos/our-approach.jpg',
      alt: 'A still alpine lake reflecting pines and snow-streaked peaks',
    },
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

/** One slot: the dashboard photo if set, else the slot's default, else null. */
export async function loadSlot(slot) {
  return (await loadSlots())[slot] ?? SLOTS[slot]?.fallback ?? null;
}
