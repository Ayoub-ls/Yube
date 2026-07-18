import 'server-only';
import { createClient } from './supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';

// Route segments that already exist as real app routes. A client slug
// can never be one of these, or their public page would be unreachable
// (Next.js always resolves an explicit static route like /admin before
// falling back to the [clientSlug]/[pageSlug] dynamic route).
const RESERVED_SLUGS = new Set([
  'admin', 'dashboard', 'auth', 'api', 'pricing', '_next',
  'login', 'signup', 'logout', 'favicon.ico',
]);

export function slugify(input: string): string {
  return input
    .toString()
    .trim()
    .toLowerCase()
    // Keep Arabic letters, latin letters, numbers; turn everything else into '-'
    .replace(/[^\u0600-\u06FFa-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'store';
}

/**
 * Generates a unique client slug from a business name, appending a short
 * random suffix on collision (including collisions with reserved route
 * names like "admin" or "dashboard").
 */
export async function generateUniqueClientSlug(
  supabase: SupabaseClient,
  businessName: string
): Promise<string> {
  const base = slugify(businessName);
  let candidate = base;
  let attempt = 0;

  while (attempt < 20) {
    const isReserved = RESERVED_SLUGS.has(candidate);
    if (!isReserved) {
      const { data } = await supabase
        .from('clients')
        .select('id')
        .eq('slug', candidate)
        .maybeSingle();
      if (!data) return candidate;
    }
    attempt += 1;
    const suffix = Math.random().toString(36).slice(2, 6);
    candidate = `${base}-${suffix}`;
  }

  // Extremely unlikely fallback
  return `${base}-${Date.now().toString(36)}`;
}

/**
 * Generates a unique landing page slug *within a single client*.
 * (landing_pages has a unique(client_id, slug) constraint, so the same
 * page slug can be reused across different clients — only per-client
 * uniqueness matters here.)
 */
export async function generateUniquePageSlug(
  supabase: SupabaseClient,
  clientId: string,
  productName: string
): Promise<string> {
  const base = slugify(productName);
  let candidate = base;
  let attempt = 0;

  while (attempt < 20) {
    const { data } = await supabase
      .from('landing_pages')
      .select('id')
      .eq('client_id', clientId)
      .eq('slug', candidate)
      .maybeSingle();
    if (!data) return candidate;
    attempt += 1;
    const suffix = Math.random().toString(36).slice(2, 6);
    candidate = `${base}-${suffix}`;
  }

  return `${base}-${Date.now().toString(36)}`;
}

export async function getCurrentClient() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return client;
}

/**
 * Server-side admin check. Mirrors the logic already used in
 * middleware.ts and app/auth/actions.ts — is_admin column first,
 * RPC fallback. Kept in one place so future callers don't have to
 * re-implement the fallback logic themselves.
 */
export async function checkIsAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  try {
    const { data: clientData, error: clientErr } = await supabase
      .from('clients')
      .select('is_admin')
      .eq('user_id', userId)
      .maybeSingle();

    if (!clientErr && clientData && typeof clientData === 'object' && 'is_admin' in clientData) {
      return !!(clientData as any).is_admin;
    }
  } catch (e) {
    console.error('Error checking is_admin column:', e);
  }

  try {
    const { data: rpcData, error: rpcErr } = await supabase.rpc('is_admin');
    if (!rpcErr && rpcData !== null) {
      return !!rpcData;
    }
  } catch (e) {
    console.error('Error calling is_admin RPC:', e);
  }

  return false;
}

export async function getClientPages(clientId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching client pages:', error);
    return [];
  }
  return data || [];
}

export async function getPendingReviewPages() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*, clients(business_name, slug)')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching pending pages:', error);
    return [];
  }
  return data || [];
}

export async function getAllClientsForAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching clients for admin:', error);
    return [];
  }
  return data || [];
}
