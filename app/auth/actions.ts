'use server';

import { createClient } from '../../lib/supabase/server';
import { createAdminClient } from '../../lib/supabase/admin';
import { redirect } from 'next/navigation';
import { generateUniqueClientSlug, checkIsAdmin } from '../../lib/data';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const user = data.user;
  if (!user) {
    return { error: 'فشل تسجيل الدخول، يرجى المحاولة مرة أخرى' };
  }

  // Check admin status via the single shared helper (is_admin column,
  // with RPC fallback) — same logic used in middleware.ts and admin pages.
  const isAdmin = await checkIsAdmin(supabase, user.id);

  // Return success + destination instead of redirecting server-side here.
  // A server-side redirect() would navigate away before any client code
  // could fire the 'login' GA4 event — the component would already be
  // unmounted by the time a "success" state could be observed. The
  // client (login/page.tsx) fires the event, then performs the redirect
  // itself via router.push.
  return { success: true, destination: isAdmin ? '/admin' : '/dashboard' };
}

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const businessName = formData.get('businessName') as string;
  const whatsapp = formData.get('whatsapp') as string;

  if (!email || !password || !businessName) {
    return { error: 'يرجى ملء جميع الحقول الإلزامية' };
  }

  const supabase = createClient();
  const adminSupabase = createAdminClient();

  // 1. Sign up the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  const user = authData.user;
  if (!user) {
    return { error: 'فشل إنشاء الحساب، يرجى المحاولة مرة أخرى' };
  }

  // 2. Generate a unique store slug. Uses the admin client deliberately:
  // at this point there is no active session yet (see note on
  // createAdminClient), so an RLS-bound client couldn't see any existing
  // clients rows to check against — it would always think a slug is
  // free, even when it's already taken by someone else, and two clients
  // picking the same business name would hit a raw DB constraint error
  // instead of getting a clean auto-suffixed slug.
  const slug = await generateUniqueClientSlug(adminSupabase as any, businessName);

  // 3. Trial plans run for 14 days from signup — stored so the admin
  // panel can show clients when their trial/plan actually ends.
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  // 4. Insert into the clients table using the admin client. This
  // deliberately bypasses RLS: right after signUp(), there is no
  // session yet if the Supabase project requires email confirmation
  // (the default), so an RLS-bound insert using auth.uid() = user_id
  // would fail immediately with "new row violates row-level security
  // policy" — which is exactly the bug this fixes.
  const { error: dbError } = await adminSupabase.from('clients').insert({
    user_id: user.id,
    email: user.email,
    business_name: businessName,
    slug,
    whatsapp: whatsapp || null,
    plan: 'trial',
    plan_expires_at: trialEndsAt.toISOString(),
    status: 'active',
  });

  if (dbError) {
    console.error('Database client insertion error:', dbError);
    return { error: 'تم إنشاء الحساب ولكن فشل إعداد المتجر: ' + dbError.message };
  }

  // If Supabase requires email confirmation, signUp() returns a user but
  // no session — redirecting to /dashboard here would just bounce the
  // person straight back to /login via middleware (no session = not
  // authenticated), with no explanation of why. Tell them to check their
  // email instead of redirecting to a page they can't actually reach yet.
  if (!authData.session) {
    return {
      success: true,
      needsEmailConfirmation: true,
    };
  }

  // A session exists immediately (email confirmation is off on this
  // Supabase project). Same reasoning as login: return success instead
  // of redirecting server-side, so the client can fire the 'sign_up'
  // GA4 event before navigating away.
  return { success: true, needsEmailConfirmation: false, destination: '/dashboard' };
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}
