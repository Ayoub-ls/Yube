import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Optimize performance: Skip Supabase session checks entirely for public pages,
  // anonymous ad-traffic routes, and assets.
  const isProtectedPath =
    path.startsWith('/dashboard') ||
    path.startsWith('/admin') ||
    path.startsWith('/auth') ||
    path.startsWith('/checkout') ||
    path.startsWith('/payment');

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

  // Redirect /checkout routes to /payment
  if (path.startsWith('/checkout')) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/payment';
    return redirectWithCookies(redirectUrl);
  }

  // Protect /dashboard routes
  if (path.startsWith('/dashboard')) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      return redirectWithCookies(redirectUrl);
    }

    try {
      const { data: client } = await supabase
        .from('clients')
        .select('id, is_admin')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!client) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/payment';
        return redirectWithCookies(redirectUrl);
      }

      if (!client.is_admin) {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('status, expires_at')
          .eq('client_id', client.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!subscription) {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = '/payment';
          return redirectWithCookies(redirectUrl);
        }

        const isExpired = subscription.expires_at
          ? new Date(subscription.expires_at).getTime() < Date.now()
          : true;
        const isPending = subscription.status === 'pending_payment';

        if (isExpired || isPending || subscription.status === 'expired') {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = '/payment';
          return redirectWithCookies(redirectUrl);
        }
      }
    } catch (e) {
      console.error('Error in middleware dashboard gate:', e);
    }
  }

  // Protect /payment routes (ensure active users don't get stuck here)
  if (path.startsWith('/payment')) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      return redirectWithCookies(redirectUrl);
    }

    try {
      const { data: client } = await supabase
        .from('clients')
        .select('id, is_admin')
        .eq('user_id', user.id)
        .maybeSingle();

      if (client) {
        if (client.is_admin) {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = '/admin';
          return redirectWithCookies(redirectUrl);
        }

        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('status, expires_at')
          .eq('client_id', client.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (subscription && subscription.status === 'active') {
          const isExpired = subscription.expires_at
            ? new Date(subscription.expires_at).getTime() < Date.now()
            : false;

          if (!isExpired) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/dashboard';
            return redirectWithCookies(redirectUrl);
          }
        }
      }
    } catch (e) {
      console.error('Error in middleware payment gate:', e);
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
