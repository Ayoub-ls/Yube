import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client. This BYPASSES Row Level Security
 * entirely — it must never be imported into anything that runs in the
 * browser, and every call site using it must independently validate
 * what it's about to write (RLS isn't there to catch mistakes here).
 *
 * Why this exists: right after `supabase.auth.signUp()`, there is no
 * active session yet if the Supabase project requires email
 * confirmation (the default setting). Without a session, `auth.uid()`
 * is null for the very next request, and the "clients own data" RLS
 * policy (`auth.uid() = user_id`) rejects the insert — every signup
 * would fail with "new row violates row-level security policy" until
 * the user confirms their email and logs in again, which isn't a
 * usable signup flow. The admin client lets the signup action insert
 * the initial clients row on the user's behalf, using the user_id we
 * already got back from signUp() — RLS just isn't part of the picture
 * for this one, deliberate, pre-validated write.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (server-only, never NEXT_PUBLIC_).'
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
