'use client';

import { useState } from 'react';
import { Truck, ShieldCheck, RotateCcw, Check } from 'lucide-react';
import { getOptimizedImageUrl } from '../../../lib/upload';
import { VoiceNotePlayer } from '../shared/VoiceNotePlayer';
import { RitaOrderForm } from './RitaOrderForm';
import './rita.css';
import type { TemplateProps } from '../types';

const DEFAULT_SIZES = ['36', '37', '38', '39', '40', '41'];

export function RitaTemplate({ page, client, theme }: TemplateProps) {
  const colors = page.page_config?.colors || [];
  const sizes = page.page_config?.sizes || DEFAULT_SIZES;
  const audioProofs = page.social_proof.filter((p) => p.type === 'audio' && p.url);
  const fallbackImage = page.product_images[0] || '';

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[Math.floor(sizes.length / 2)] || '');

  const activeImage = colors.length > 0 ? colors[selectedColorIdx]?.url : fallbackImage;
  const activeColorName = colors.length > 0 ? colors[selectedColorIdx]?.name : '';
  const hasDiscount = !!(page.original_price && page.original_price > page.price);

  const headline = page.page_config?.headline || `تألقي بأناقة استثنائية مع ${page.product_name}`;
  const subheadline = page.page_config?.subheadline || page.description;

  return (
    <div className="rita-theme min-h-screen bg-[#07070a] text-slate-200 font-sans antialiased pb-28">
      <div className="bg-[#121115] text-white py-2.5 text-center text-xs md:text-sm font-semibold tracking-wide flex justify-center items-center gap-3 border-b border-gold-900/30 px-4">
        <span className="inline-flex items-center gap-1.5 text-[#cf9b32]">
          ✨ جودة فاخرة تستحق الثقة
        </span>
        <span className="hidden sm:inline text-slate-700">|</span>
        <span className="inline-flex items-center gap-1 text-[#fdfaf2]">
          ⚡ الدفع عند الاستلام متاح لكل الولايات
        </span>
      </div>

      <header className="bg-[#0f0f13]/95 backdrop-blur-md sticky top-0 sm:static py-4.5 px-4 shadow-md border-b border-gold-900/20 z-40 max-w-[480px] mx-auto w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col select-none">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white font-serif">
              {client.business_name}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 bg-gold-950/45 border border-gold-800/30 px-3 py-1 rounded-full shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#cf9b32] animate-pulse shrink-0"></div>
            <span className="text-[10px] font-bold text-gold-300 leading-none">الدفع عند الاستلام</span>
          </div>
        </div>
      </header>

      <main className="max-w-[480px] mx-auto bg-[#0f0f13] min-h-screen shadow-2xl border-x border-gold-900/10 overflow-hidden relative pb-12">
        {/* HERO */}
        <section className="relative px-4 pt-5 pb-6">
          <div className="mb-4 text-center">
            <h2 className="text-xl md:text-2xl font-extrabold text-white leading-snug tracking-tight">
              {headline}
            </h2>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gold-900/20 bg-[#16151c] min-h-[350px]">
            {hasDiscount && (
              <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md border border-gold-900/30 py-2.5 px-4 rounded-2xl shadow-2xl z-10 flex flex-col items-center font-sans">
                <span className="text-red-400 text-xs line-through font-bold opacity-75">{page.original_price?.toLocaleString('ar-DZ')} دج</span>
                <span className="text-[#cf9b32] font-black text-xl leading-tight">{page.price.toLocaleString('ar-DZ')} دج</span>
              </div>
            )}

            {activeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getOptimizedImageUrl(activeImage, 800)}
                alt={page.product_name}
                className="w-full h-auto object-cover max-h-[420px]"
              />
            ) : (
              <div className="aspect-square flex items-center justify-center text-slate-500 text-sm">لا توجد صورة</div>
            )}

            {activeColorName && (
              <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-slate-950/80 border border-slate-800/60 px-2 py-1 rounded-full font-medium">
                اللون المعروض: {activeColorName}
              </div>
            )}
          </div>

          {colors.length > 1 && (
            <div className="grid grid-cols-3 gap-2 mt-3.5 px-1">
              {colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`border-2 rounded-xl overflow-hidden transition-all duration-300 aspect-square ${
                    selectedColorIdx === idx ? 'border-[#cf9b32] ring-2 ring-[#cf9b32]/30' : 'border-slate-850 bg-slate-950'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getOptimizedImageUrl(color.url, 200)} className="w-full h-full object-cover" alt={color.name} />
                </button>
              ))}
            </div>
          )}

          {subheadline && (
            <div className="mt-5 text-center px-2">
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{subheadline}</p>
            </div>
          )}
        </section>

        {/* Color selector spec board (text list, mirrors the thumbnail selector above for clarity) */}
        {colors.length > 0 && (
          <section className="px-4 mb-6">
            <div className="bg-[#15141c] border border-gold-900/20 rounded-3xl p-4.5 shadow-sm">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-slate-400">اختر لون المنتج المفضل:</span>
                <span className="text-[11px] font-extrabold text-[#cf9b32] bg-gold-950/40 px-2.5 py-0.5 rounded-lg border border-gold-800/20">
                  {activeColorName}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`flex-1 flex items-center justify-between p-2 px-3 rounded-2xl border-2 transition-all text-right ${
                      selectedColorIdx === idx ? 'border-[#cf9b32] bg-gold-950/30 text-[#cf9b32]' : 'border-slate-850 bg-[#1e1d24] text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[11px] font-bold">{color.name}</span>
                    {selectedColorIdx === idx && <Check className="w-3.5 h-3.5 text-[#cf9b32]" />}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Real testimonials only — text reviews + real uploaded audio */}
        {(page.reviews.length > 0 || audioProofs.length > 0) && (
          <section className="px-4 py-6 bg-[#131218] border-y border-gold-900/10">
            <h3 className="text-base font-extrabold text-white text-center mb-4">آراء زبوناتنا 💬</h3>
            <div className="space-y-4">
              {page.reviews.slice(0, 5).map((r, i) => (
                <div key={`r-${i}`} className="bg-[#1a1922] rounded-3xl p-3.5 border border-gold-900/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-white">{r.name}</h4>
                    <div className="flex gap-0.5">
                      {[...Array(r.rating || 5)].map((_, j) => (
                        <span key={j} className="text-amber-500 text-xs">★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs italic leading-relaxed">"{r.text}"</p>
                </div>
              ))}
              {audioProofs.map((proof, i) => (
                <div key={`a-${i}`} className="bg-[#1a1922] rounded-3xl p-3.5 border border-gold-900/10">
                  {proof.caption && <p className="text-slate-300 text-xs italic mb-2">"{proof.caption}"</p>}
                  <VoiceNotePlayer
                    src={proof.url!}
                    playingAudioSrc={null}
                    onPlay={() => {}}
                    onPause={() => {}}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trust badges — generic, defensible policy claims (no fabricated stats) */}
        <section className="px-4 py-6 bg-[#131218] border-b border-gold-900/10">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center p-2.5 bg-[#1a1922] rounded-2xl border border-gold-900/5">
              <div className="w-10 h-10 rounded-full bg-gold-950/40 border border-gold-800/30 flex items-center justify-center mb-2">
                <Truck className="w-5 h-5 text-[#cf9b32]" />
              </div>
              <h5 className="text-[11px] font-bold text-white leading-tight">توصيل سريع</h5>
              <p className="text-[9px] text-slate-400 mt-1 leading-normal">لكافة ولايات الجزائر</p>
            </div>
            <div className="flex flex-col items-center p-2.5 bg-[#1a1922] rounded-2xl border border-gold-900/5">
              <div className="w-10 h-10 rounded-full bg-gold-950/40 border border-gold-800/30 flex items-center justify-center mb-2">
                <ShieldCheck className="w-5 h-5 text-[#cf9b32]" />
              </div>
              <h5 className="text-[11px] font-bold text-white leading-tight">الدفع بعد المعاينة</h5>
              <p className="text-[9px] text-slate-400 mt-1 leading-normal">افتحي الطرد ثم ادفعي</p>
            </div>
            <div className="flex flex-col items-center p-2.5 bg-[#1a1922] rounded-2xl border border-gold-900/5">
              <div className="w-10 h-10 rounded-full bg-gold-950/40 border border-gold-800/30 flex items-center justify-center mb-2">
                <RotateCcw className="w-5 h-5 text-[#cf9b32]" />
              </div>
              <h5 className="text-[11px] font-bold text-white leading-tight">ضمان الاستبدال</h5>
              <p className="text-[9px] text-slate-400 mt-1 leading-normal">تواصلي معنا للاستبدال</p>
            </div>
          </div>
        </section>

        {/* Order form */}
        <section className="px-4 py-3 bg-[#0f0f13]">
          <RitaOrderForm
            pageId={page.id}
            clientId={client.id}
            pageSlug={page.slug}
            productName={page.product_name}
            price={page.price}
            selectedColorName={activeColorName || ''}
            selectedSize={selectedSize}
            sizes={sizes}
            onSizeChange={setSelectedSize}
          />
        </section>

        <footer className="mt-8 text-center px-4 py-8 border-t border-gold-900/15 bg-[#121115] text-slate-500">
          <p className="text-xs font-black uppercase tracking-widest text-[#cf9b32] font-serif">{client.business_name}</p>
          <p className="text-[9px] mt-4 opacity-70">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
        </footer>
      </main>

      {/* Sticky mobile CTA — scrolls to the order form instead of duplicating price/urgency copy */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#131218]/95 backdrop-blur-md border-t border-gold-900/15 p-3 flex justify-center items-center shadow-[0_-8px_30px_rgba(0,0,0,0.4)] max-w-[480px] mx-auto">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('.order-card-container')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full bg-gold-gradient text-slate-950 font-black py-3.5 px-4 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(207,155,50,0.2)] flex items-center justify-center gap-2 text-center cursor-pointer"
        >
          <span>اطلبي الآن — {page.price.toLocaleString('ar-DZ')} دج</span>
        </a>
      </div>
    </div>
  );
}
