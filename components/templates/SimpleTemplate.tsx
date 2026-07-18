import { CheckCircle, Truck, ShieldCheck } from 'lucide-react';
import { OrderForm } from '../../app/[clientSlug]/[pageSlug]/OrderForm';
import { getOptimizedImageUrl } from '../../lib/upload';
import type { TemplateProps } from './types';

export function SimpleTemplate({ page, client, theme }: TemplateProps) {
  const hasDiscount = !!(page.original_price && page.original_price > page.price);
  const images = page.product_images || [];
  const reviews = page.reviews || [];
  const socialProof = page.social_proof || [];

  return (
    <div className="min-h-screen bg-white font-sans" dir="rtl">
      <div className="max-w-xl mx-auto px-4 pt-6 pb-28">
        <div className="rounded-3xl overflow-hidden bg-slate-100 aspect-square flex items-center justify-center mb-3">
          {images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getOptimizedImageUrl(images[0], 800)} alt={page.product_name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-300 text-sm">لا توجد صورة</span>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 mb-5 overflow-x-auto">
            {images.slice(1, 8).map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={getOptimizedImageUrl(img, 200)}
                alt={`${page.product_name} ${i + 2}`}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
              />
            ))}
          </div>
        )}

        <h1 className="text-xl font-black text-slate-900 mb-2">{page.product_name}</h1>

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-2xl font-black" style={{ color: theme.primary }}>
            {page.price?.toLocaleString('ar-DZ')} دج
          </span>
          {hasDiscount && (
            <span className="text-sm text-slate-400 line-through">
              {page.original_price?.toLocaleString('ar-DZ')} دج
            </span>
          )}
        </div>

        {page.description && (
          <p className="text-sm text-slate-600 leading-relaxed mb-6">{page.description}</p>
        )}

        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-slate-50 rounded-2xl p-3 text-center space-y-1">
            <Truck className="w-5 h-5 mx-auto text-slate-400" />
            <p className="text-[10px] font-bold text-slate-500">توصيل 58 ولاية</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 text-center space-y-1">
            <ShieldCheck className="w-5 h-5 mx-auto text-slate-400" />
            <p className="text-[10px] font-bold text-slate-500">الدفع عند الاستلام</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 text-center space-y-1">
            <CheckCircle className="w-5 h-5 mx-auto text-slate-400" />
            <p className="text-[10px] font-bold text-slate-500">جودة مضمونة</p>
          </div>
        </div>

        {socialProof.length > 0 && (
          <div className="space-y-3 mb-6">
            {socialProof.map((item, i) => (
              <div key={i} className="space-y-1.5">
                {item.type === 'image' && item.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getOptimizedImageUrl(item.url, 700)} alt={item.caption || ''} className="w-full rounded-2xl" />
                )}
                {item.type === 'audio' && item.url && <audio controls className="w-full" src={item.url} />}
                {item.type === 'video' && item.url && (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video controls className="w-full rounded-2xl" src={item.url} />
                )}
                {item.caption && <p className="text-[11px] text-slate-400 text-center">{item.caption}</p>}
              </div>
            ))}
          </div>
        )}

        {reviews.length > 0 && (
          <div className="space-y-3 mb-6">
            <h2 className="text-sm font-bold text-slate-800">آراء الزبائن</h2>
            {reviews.slice(0, 5).map((r, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{r.name}</span>
                  <span className="text-amber-500 text-xs">{'★'.repeat(r.rating || 5)}</span>
                </div>
                <p className="text-xs text-slate-500">{r.text}</p>
                {r.location && <p className="text-[10px] text-slate-400">{r.location}</p>}
              </div>
            ))}
          </div>
        )}

        <OrderForm
          pageId={page.id}
          clientId={client.id}
          pageSlug={page.slug}
          productName={page.product_name}
          price={page.price}
          primaryColor={theme.primary}
        />

        {page.whatsapp && (
          <p className="text-center text-xs text-slate-400 mt-4">
            أو تواصل معنا مباشرة عبر{' '}
            <a
              href={`https://wa.me/${page.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
              style={{ color: theme.primary }}
            >
              واتساب
            </a>
          </p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 sm:hidden z-10">
        <a
          href="#checkout-form"
          className="block text-center text-white font-black text-sm py-3 rounded-xl"
          style={{ backgroundColor: theme.primary }}
        >
          اطلب الآن — {page.price?.toLocaleString('ar-DZ')} دج
        </a>
      </div>
    </div>
  );
}
