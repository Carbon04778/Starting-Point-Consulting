/** Admin sign-out. POST only, so a crafted link cannot log Darlene out. */
import { sessionClient } from '../../../lib/supabase.js';

export const prerender = false;

export async function POST(ctx) {
  await sessionClient(ctx).auth.signOut();
  return new Response(null, { status: 303, headers: { Location: '/admin/login?signed-out' } });
}

export function GET() {
  return new Response(null, { status: 303, headers: { Location: '/admin' } });
}
