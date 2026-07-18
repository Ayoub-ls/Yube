import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Optimize performance: Skip Supabase session checks entirely for public pages,
  // anonymous ad-traffic routes, and assets.
  const isProtectedPath = path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/auth');

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!isProtectedPath) {
    return response;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  // Fetch the current user session
  const { data: { user } } = await supabase.auth.getUser();

  // Helper function to check admin status from DB (column or RPC)
  const checkIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      const { data: clientData, error: clientErr } = await supabase
        .from('clients')
        .select('is_admin')
        .eq('user_id', userId)
        .maybeSingle();

      if (!clientErr && clientData && typeof clientData === 'object' && 'is_admin' in clientData) {
        return !!clientData.is_admin;
      }
    } catch (e) {
      console.error('Error checking is_admin column in clients:', e);
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
  };

  // Helper to construct a redirect response that preserves updated (or refreshed) cookies
  const redirectWithCookies = (targetUrl: URL | string) => {
    const redirectResponse = NextResponse.redirect(targetUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  };

  // Protect /dashboard routes
  if (path.startsWith('/dashboard')) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      return redirectWithCookies(redirectUrl);
    }
  }

  // Protect /admin routes
  if (path.startsWith('/admin')) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      return redirectWithCookies(redirectUrl);
    }
    
    const isAdmin = await checkIsAdmin(user.id);
    if (!isAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return redirectWithCookies(redirectUrl);
    }
  }

  // Redirect authenticated users trying to access login/signup back to dashboard/admin
  if (path.startsWith('/auth/login') || path.startsWith('/auth/signup')) {
    if (user) {
      const redirectUrl = request.nextUrl.clone();
      const isAdmin = await checkIsAdmin(user.id);
      if (isAdmin) {
        redirectUrl.pathname = '/admin';
      } else {
        redirectUrl.pathname = '/dashboard';
      }
      return redirectWithCookies(redirectUrl);
    }
  }

  return response;
}
