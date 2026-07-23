'use client';

import { useState } from 'react';
import { Sparkles, Zap, ShieldCheck, Truck, Award, BadgeDollarSign, Star, Ruler, X } from 'lucide-react';
import { getOptimizedImageUrl } from '../../../lib/upload';
import { VoiceNotePlayer } from '../shared/VoiceNotePlayer';
import { PairDZOrderModal } from './PairDZOrderModal';
import './pairdz.css';
import type { TemplateProps } from '../types';

const DEFAULT_SIZES = ['2', '4', '6', '8', '10', '12', '14', '16'];

export function PairDZTemplate({ page, client, theme }: TemplateProps) {
  const images = page.product_images.length > 0 ? page.product_images : [''];
  const sizes = page.page_config?.sizes || DEFAULT_SIZES;
  const audioProofs = page.social_proof.filter((p) => p.type === 'audio' && p.url);

  const [activeIndex, setActiveIndex] = useState(0);
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({});
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [playingAudioSrc, setPlayingAudioSrc] = useState<string | null>(null);

  const totalQuantity = Object.values(sizeQuantities).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = totalQuantity * page.price;

  const summaryParts: string[] = [];
  Object.keys(sizeQuantities).forEach((size) => {
    const qty = sizeQuantities[size];
    if (qty > 0) summaryParts.push(`(مقاس ${size} × ${qty})`);
  });
  const selectedSummary = summaryParts.length > 0 ? summaryParts.join(' + ') : 'لم يتم اختيار أي مقاس';

  const updateSizeQty = (size: string, change: number) => {
    setSizeQuantities((prev) => {
      const current = prev[size] || 0;
      const next = Math.max(0, Math.min(20, current + change));
      return { ...prev, [size]: next };
    });
  };

  const handleOpenOrderModal = () => {
    if (totalQuantity === 0) {
      alert('يرجى اختيار مقاس واحد على الأقل قبل الطلب.');
      return;
    }
    setIsOrderModalOpen(true);
  };

  return (
    <div className="pairdz-theme min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇩🇿</span>
            <div>
              <h1 className="text-lg font-extrabold text-algeria-green leading-none">{client.business_name}</h1>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Premium Kids Wear</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-algeria-green px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
            <span>دفع عند الاستلام في 58 ولاية</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-12 flex-1 w-full pb-28 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative bg-white border border-slate-100 rounded-3xl overflow-hidden aspect-square pairdz-custom-shadow group">
              <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm text-algeria-gold text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 border border-slate-100">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>جودة ممتازة</span>
              </div>
              {images[activeIndex] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getOptimizedImageUrl(images[activeIndex], 800)}
                  alt={page.product_name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">لا توجد صورة</div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-3">
                {images.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`relative bg-white rounded-2xl overflow-hidden aspect-[4/3] transition-all duration-200 ${
                      index === activeIndex ? 'border-2 border-algeria-green shadow-sm' : 'border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getOptimizedImageUrl(src, 300)} alt={`عرض ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2 text-right">
              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>المنتج الأكثر طلباً في فئة الأطفال</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold lg:leading-tight text-slate-900 leading-none">
                {page.page_config?.headline || page.product_name}
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-none">
                {page.page_config?.subheadline || page.description || ''}
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between text-right">
              <div className="space-y-1">
                <span className="text-3xl font-black text-algeria-green flex items-baseline gap-1" dir="ltr">
                  <span className="text-sm font-bold text-slate-500 mr-1">د.ج</span>
                  <span>{totalPrice.toLocaleString('ar-DZ')}</span>
                </span>
              </div>
            </div>

            {/* Size + quantity selector */}
            {sizes.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 text-sm">اختر المقاسات والكمية:</label>
                  <button
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-xs font-bold text-algeria-green hover:underline focus:outline-none"
                  >
                    جدول المقاسات
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {sizes.map((size) => {
                    const qty = sizeQuantities[size] || 0;
                    const hasQty = qty > 0;
                    return (
                      <div
                        key={size}
                        className={`rounded-2xl p-3 flex flex-col items-center justify-center transition-all ${
                          hasQty ? 'border-2 border-algeria-green bg-emerald-50 text-algeria-green' : 'border border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <span className="font-bold text-lg leading-none">{size}</span>
                        <div className="flex items-center bg-slate-50 rounded-xl p-1 w-full justify-between border border-slate-100 mt-2">
                          <button
                            type="button"
                            onClick={() => updateSizeQty(size, -1)}
                            className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-sm w-6 text-center text-slate-700">{qty}</span>
                          <button
                            type="button"
                            onClick={() => updateSizeQty(size, 1)}
                            className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={handleOpenOrderModal}
              className="w-full bg-algeria-green hover:bg-emerald-800 text-white py-5 rounded-3xl font-extrabold text-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 border-b-4 border-emerald-950 active:scale-[0.98] focus:outline-none"
            >
              <Zap className="w-6 h-6 fill-amber-300 text-amber-300" />
              <span>اطلب الآن - دفع عند الاستلام</span>
            </button>

            {/* Trust badges — generic, defensible policy claims only */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white px-4 py-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-algeria-green flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">توصيل للولايات</h4>
                  <p className="text-[10px] text-slate-400">توصيل منزلي سريع ومضمون</p>
                </div>
              </div>
              <div className="bg-white px-4 py-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-algeria-red flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">جودة مضمونة 100%</h4>
                  <p className="text-[10px] text-slate-400">قماش ناعم وخياطة ممتازة</p>
                </div>
              </div>
              <div className="bg-white px-4 py-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <BadgeDollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">دفع عند الاستلام</h4>
                  <p className="text-[10px] text-slate-400">لا تدفع شيئاً حتى تستلم طقمك</p>
                </div>
              </div>
            </div>

            {/* Real testimonials — text reviews + real uploaded audio only */}
            {(page.reviews.length > 0 || audioProofs.length > 0) && (
              <div className="space-y-3">
                {page.reviews.slice(0, 4).map((r, i) => (
                  <div key={`r-${i}`} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800">{r.name}</span>
                      <span className="text-amber-500 text-xs">{'★'.repeat(r.rating || 5)}</span>
                    </div>
                    <p className="text-xs text-slate-500">{r.text}</p>
                  </div>
                ))}
                {audioProofs.map((proof, i) => (
                  <div key={`a-${i}`} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm">
                    {proof.caption && <p className="text-xs text-slate-500 italic mb-2">"{proof.caption}"</p>}
                    <VoiceNotePlayer
                      src={proof.url!}
                      playingAudioSrc={playingAudioSrc}
                      onPlay={setPlayingAudioSrc}
                      onPause={() => setPlayingAudioSrc(null)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Size chart modal — generic, accurate reference info, not a fabricated claim */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsSizeChartOpen(false)}>
          <div
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-l from-algeria-green to-emerald-800 p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5" />
                <h3 className="font-extrabold text-lg">جدول المقاسات والأعمار</h3>
              </div>
              <button onClick={() => setIsSizeChartOpen(false)} className="text-white hover:text-slate-200 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500 leading-relaxed">
                نوصي باختيار المقاس المعتاد لطفلك. إذا كان طفلك أطول قليلاً، يرجى اختيار مقاس واحد أكبر لراحة أفضل.
              </p>
              <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-sm">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold">
                    <tr>
                      <th className="px-4 py-3">المقاس</th>
                      <th className="px-4 py-3">العمر المقترح</th>
                      <th className="px-4 py-3">الطول التقريبي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {[
                      ['2', '1 - 2 سنوات', '86 - 92 سم'],
                      ['4', '3 - 4 سنوات', '98 - 104 سم'],
                      ['6', '5 - 6 سنوات', '110 - 116 سم'],
                      ['8', '7 - 8 سنوات', '122 - 128 سم'],
                      ['10', '9 - 10 سنوات', '134 - 140 سم'],
                      ['12', '11 - 12 سنة', '146 - 152 سم'],
                      ['14', '13 - 14 سنة', '158 - 164 سم'],
                      ['16', '15 - 16 سنة', '170 - 176 سم'],
                    ].map(([size, age, height]) => (
                      <tr key={size} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-algeria-green">{size}</td>
                        <td className="px-4 py-3">{age}</td>
                        <td className="px-4 py-3">{height}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => setIsSizeChartOpen(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-extrabold transition-all"
              >
                حـسناً، فهمت
              </button>
            </div>
          </div>
        </div>
      )}

      <PairDZOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        pageId={page.id}
        clientId={client.id}
        pageSlug={page.slug}
        productName={page.product_name}
        totalPrice={totalPrice}
        selectedSummary={selectedSummary}
        totalQuantity={totalQuantity}
        onOrderSuccess={() => setSizeQuantities({})}
      />

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-100 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] px-3 py-2.5 flex sm:hidden gap-2.5 items-center justify-between">
        <div className="space-y-0.5 shrink-0">
          <span className="text-[9px] xs:text-[10px] text-slate-400 font-bold block leading-none">السعر الإجمالي:</span>
          <span className="text-lg xs:text-2xl font-black text-algeria-green block">
            {totalPrice.toLocaleString('ar-DZ')}
            <span className="text-[10px] xs:text-xs font-semibold text-slate-500 mr-0.5 xs:mr-1">د.ج</span>
          </span>
        </div>
        <button
          onClick={handleOpenOrderModal}
          className="flex-1 bg-algeria-green hover:bg-emerald-800 text-white py-3 px-4 rounded-xl xs:py-4 xs:px-6 xs:rounded-2xl font-extrabold text-xs xs:text-base shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <Zap className="w-4 h-4 xs:w-4.5 xs:h-4.5 fill-amber-300 text-amber-300" />
          <span>اطلب الآن</span>
        </button>
      </div>
    </div>
  );
}
