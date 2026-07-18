import './globals.css';
import { Metadata } from 'next';
import Script from 'next/script';
import { GA4_ID } from '../lib/analytics';

export const metadata: Metadata = {
  title: 'Yube - Algerian COD Landing Page Builder',
  description: 'منصة إنشاء صفحات الهبوط لمنتجات التجارة الإلكترونية والدفع عند الاستلام',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {GA4_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
