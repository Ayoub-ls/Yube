import { createClient } from '../../lib/supabase/server';
import { createAdminClient } from '../../lib/supabase/admin';
import { redirect } from 'next/navigation';
import { logout } from '../auth/actions';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { User, LogOut, LayoutGrid, FileText, ShoppingCart, Settings, Users } from 'lucide-react';
import SupportBubble from '@/components/support/SupportBubble';
import { NotificationBell } from '@/components/dashboard/notifications/NotificationBell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // Fetch client details to check active status and load pixel ID
  const { data: client } = await supabase
    .from('clients')
    .select('id, pixel_id, is_admin')
    .eq('user_id', user.id)
    .maybeSingle();

  // Gating check: redirect to payment page if user is not admin and does not have active subscription
  if (!client) {
    redirect('/payment');
  } else if (!client.is_admin) {
    // Fetch latest subscription from subscriptions table
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!subscription) {
      redirect('/payment');
    }

    let status = subscription.status;
    const isExpired = subscription.expires_at
      ? new Date(subscription.expires_at).getTime() < Date.now()
      : true;

    if (status === 'active' && isExpired) {
      // Update subscription status to expired in the DB
      const adminSupabase = createAdminClient();
      await adminSupabase
        .from('subscriptions')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('id', subscription.id);

      // Keep clients table plan & status in sync
      await adminSupabase
        .from('clients')
        .update({ plan: 'expired', plan_expires_at: subscription.expires_at })
        .eq('id', client.id);

      status = 'expired';
    }

    if (status === 'pending_payment' || status === 'expired') {
      redirect('/payment');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      {client?.pixel_id && (
        <Script id="fb-pixel-dashboard" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${client.pixel_id}');
          `}
        </Script>
      )}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo-full.png" alt="Yube" width={100} height={54.5} className="" priority />
            <span className="text-lg font-black tracking-tight text-slate-900">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell clientId={client.id} />

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium">{user.email}</span>
            </div>

            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50/50 px-3 py-1.5 rounded-xl transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 -mb-px overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-3 border-b-2 border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-800 transition shrink-0"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>لوحة التحكم</span>
          </Link>
          <Link
            href="/dashboard/pages"
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-3 border-b-2 border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-800 transition shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>صفحاتي</span>
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-3 border-b-2 border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-800 transition shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>الطلبيات</span>
          </Link>
          <Link
            href="/dashboard/crm"
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-3 border-b-2 border-transparent hover:border-slate-300"
          >
            <Users className="w-3.5 h-3.5" />
            <span>CRM</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-3 border-b-2 border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-800 transition shrink-0"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>الإعدادات</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {children}
      </main>
      <SupportBubble />
    </div>
  );
}
