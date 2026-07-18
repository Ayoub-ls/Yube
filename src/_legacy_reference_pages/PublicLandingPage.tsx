// src/pages/PublicLandingPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/db';
import { LandingPage, Client } from '../types';
import { Store, AlertTriangle, ArrowLeft } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

import SimpleTemplate from '../components/templates/SimpleTemplate';
import MultivariantTemplate from '../components/templates/MultivariantTemplate';
import PremiumTemplate from '../components/templates/PremiumTemplate';

export default function PublicLandingPage() {
  const { clientSlug, pageSlug } = useParams<{ clientSlug: string; pageSlug: string }>();
  
  const [page, setPage] = useState<LandingPage | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!clientSlug || !pageSlug) {
        setError('رابط الصفحة غير مكتمل.');
        setLoading(false);
        return;
      }

      try {
        const foundData = await db.pages.getBySlug(clientSlug, pageSlug);
        
        if (!foundData) {
          setError('عذراً، هذه الصفحة غير موجودة أو تم حذفها.');
          setLoading(false);
          return;
        }

        const { page: foundPage, client: foundClient } = foundData;

        // Validate state
        if (foundPage.status !== 'live') {
          setError('هذه الصفحة قيد المراجعة حالياً من قبل الإدارة ولم تنشر بعد.');
          setLoading(false);
          return;
        }

        if (foundClient.status !== 'active') {
          setError('هذا المتجر معلق مؤقتاً من قبل إدارة يوب.');
          setLoading(false);
          return;
        }

        setPage(foundPage);
        setClient(foundClient);
      } catch (err) {
        console.error(err);
        setError('حدث خطأ أثناء تحميل تفاصيل الصفحة.');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [clientSlug, pageSlug]);

  // Track landing page view
  useEffect(() => {
    if (page && client && clientSlug && pageSlug) {
      trackEvent('landing_page_view', {
        client_slug: clientSlug,
        page_slug: pageSlug,
        template_id: page.template_id,
      });
    }
  }, [page, client, clientSlug, pageSlug]);

  // Inject Facebook Pixel dynamically if pixel_id exists
  useEffect(() => {
    if (!client || !client.pixel_id) return;

    const scriptId = `fb-pixel-${client.id}`;
    if (!document.getElementById(scriptId)) {
      // 1. Script Tag
      const script = document.createElement('script');
      script.id = scriptId;
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${client.pixel_id}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);

      // 2. Noscript Tag
      const noscript = document.createElement('noscript');
      noscript.id = `${scriptId}-noscript`;
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = `https://www.facebook.com/tr?id=${client.pixel_id}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    }
  }, [client]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="border-4 border-emerald-500 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
        <p className="text-xs text-gray-400 font-bold mt-4" dir="rtl">جاري تجهيز صفحة البيع الآمنة...</p>
      </div>
    );
  }

  if (error || !page || !client) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl text-center space-y-6">
          <div className="bg-amber-100 text-amber-700 p-4 rounded-2xl w-fit mx-auto">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900">عذراً، الرابط غير متاح 🚫</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{error || 'يرجى مراجعة رابط المتجر وحاول مجدداً.'}</p>
          </div>

          <div className="border-t border-slate-50 pt-5 flex flex-col gap-2">
            <Link 
              to="/" 
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>الذهاب لموقع Yube الرئيسي</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Inject Meta Tags dynamically for SEO / GTM if pixel is enabled
  if (page.gtm_pixel) {
    // Add Facebook / GTM scripts cleanly
    const scriptId = `gtm-pixel-${page.id}`;
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${page.gtm_pixel}');
      `;
      document.head.appendChild(script);
    }
  }

  // Render appropriate template design
  return (
    <>
      {page.template_id === 'simple' && <SimpleTemplate page={page} client={client} />}
      {page.template_id === 'multivariant' && <MultivariantTemplate page={page} client={client} />}
      {page.template_id === 'premium' && <PremiumTemplate page={page} client={client} />}
    </>
  );
}
