'use client';

import { COLOR_THEMES } from '../types';
import type { WizardData } from '../types';
import { getOptimizedImageUrl } from '../../../lib/upload';
import { CheckCircle } from 'lucide-react';

export function PreviewStep({ data }: { data: WizardData }) {
  const theme = COLOR_THEMES.find((c) => c.id === data.colorTheme) || COLOR_THEMES[0];
  const price = parseInt(data.price, 10) || 0;
  const originalPrice = parseInt(data.originalPrice, 10) || 0;
  const hasDiscount = originalPrice > price && price > 0;
  const mainImage = data.images.find((i) => i.uploadedUrl)?.uploadedUrl;

  return (
    <div className="space-y-4 py-2">
      <div>
        <h2 className="text-lg font-black text-slate-900 text-center">معاينة صفحتك</h2>
        <p className="text-[11px] text-slate-400 text-center mt-1">هكذا ستظهر صفحتك تقريباً للزبائن</p>
      </div>

      {/* Simplified inline preview — a full pixel-identical iframe render
          of the live template is intentionally out of scope for this
          pass; this card shows the key content the reviewer/client cares
          about before submitting. */}
      <div className="border border-slate-200 rounded-3xl overflow-hidden">
        <div className="aspect-video bg-slate-100 flex items-center justify-center">
          {mainImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getOptimizedImageUrl(mainImage, 600)} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-300 text-xs">لا توجد صورة</span>
          )}
        </div>
        <div className="p-5 space-y-3">
          <h3 className="font-black text-slate-900">{data.productName || 'اسم المنتج'}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black" style={{ color: theme.hex }}>
              {price.toLocaleString('ar-DZ')} دج
            </span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">{originalPrice.toLocaleString('ar-DZ')} دج</span>
            )}
          </div>
          {data.description && <p className="text-xs text-slate-500 leading-relaxed">{data.description}</p>}

          <div className="flex flex-wrap gap-2 pt-2 text-[10px] text-slate-400">
            <span className="bg-slate-50 px-2.5 py-1 rounded-full">📸 {data.images.length} صور</span>
            <span className="bg-slate-50 px-2.5 py-1 rounded-full">⭐ {data.reviews.length} تقييمات</span>
            <span className="bg-slate-50 px-2.5 py-1 rounded-full">🎬 {data.socialProof.length} أدلة ثقة</span>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-2.5">
        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-emerald-700 leading-relaxed">
          بمجرد الإرسال، ستُنشر صفحتك مباشرة ويمكنك مشاركة رابطها فوراً.
        </p>
      </div>
    </div>
  );
}
