import { createClient } from '../../../lib/supabase/server';
import { notFound } from 'next/navigation';
import { PageViewTracker } from './PageViewTracker';
import { getThemeColor } from '../../../lib/themeColors';
import { getTemplateComponent } from '../../../components/templates/registry';
import Script from 'next/script';

interface PublicLandingPageProps {
  params: {
    clientSlug: string;
    pageSlug: string;
  };
}

export default async function PublicPage({ params }: PublicLandingPageProps) {
  const { clientSlug, pageSlug } = params;
  const supabase = createClient();

  // 1. Resolve the client by slug
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('slug', clientSlug)
    .maybeSingle();

  if (!client) notFound();

  // 2. Resolve the page — must belong to this client, match the slug,
  // AND be status = 'live'. Any of these failing is a 404, not an error,
  // so unpublished/rejected/other-client pages never leak.
  const { data: page } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('client_id', client.id)
    .eq('slug', pageSlug)
    .eq('status', 'live')
    .maybeSingle();

  if (!page) notFound();

  const theme = getThemeColor(page.color_theme);

  // Picks the right template component based on this page's template_id.
  // See components/templates/registry.tsx to add new themes.
  const Template = getTemplateComponent(page.template_id);

  return (
    <>
      {/* This client's OWN Meta Pixel — separate from your platform-wide
          GA4. Only injected if the client has configured a pixel_id in
          their dashboard settings. Lives here (not inside each template)
          so every theme gets tracking automatically without having to
          re-implement it. */}
      {client.pixel_id && (
        <>
          <Script id="fb-pixel" strategy="afterInteractive">
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
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${client.pixel_id}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      <PageViewTracker clientSlug={client.slug} pageSlug={page.slug} templateId={page.template_id} />

      <Template
        page={{
          id: page.id,
          slug: page.slug,
          product_name: page.product_name,
          price: page.price,
          original_price: page.original_price,
          description: page.description,
          whatsapp: page.whatsapp,
          product_images: page.product_images || [],
          social_proof: page.social_proof || [],
          reviews: page.reviews || [],
          page_config: page.page_config || null,
        }}
        client={{ id: client.id, slug: client.slug, business_name: client.business_name }}
        theme={theme}
      />
    </>
  );
}
