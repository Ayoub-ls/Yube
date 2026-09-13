'use client'

import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

import type { TemplateProps } from '../types';
import { OrderForm } from '../shared/OrderForm';
import problemSolutionImage from './speakerland1_cleaned-min.jpg';
import solutionKitImage from './speakerland2_cleaned-min.jpeg';
import howItWorksImage from './speakerlanding_cleaned-min.jpeg';

// Format price in Algerian Dinars (DZD / دج)
function formatAlgerianPrice(price: number): string {
  if (typeof price !== 'number' || isNaN(price)) return '0 دج';
  return price.toLocaleString('fr-DZ') + ' دج';
}

// Generate clean and safe WhatsApp URL with Algerian phone support
function getWhatsAppUrl(phone: string | null | undefined, productName: string): string | null {
  if (!phone || typeof phone !== 'string') return null;
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  if (!digitsOnly) return null;

  // Format Algerian mobile numbers (05, 06, 07 -> 2135, 2136, 2137)
  let normalizedNumber = digitsOnly;
  if (normalizedNumber.startsWith('0') && normalizedNumber.length === 10) {
    normalizedNumber = '213' + normalizedNumber.slice(1);
  }

  const message = `السلام عليكم، حاب نطلب ${productName}`;
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}

// The selected color theme is the source of truth for Speaker branding.
function resolveThemeColors(theme?: TemplateProps["theme"]): {
  primary: string;
  accent: string;
} {
  return {
    primary: theme?.primary?.trim() || "#111827",
    accent: theme?.accent?.trim() || "#16a34a",
  };
}

export default function Speaker({ page, client, theme }: TemplateProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleOrderClick = () => {
    const el = document.getElementById('order-form-container') || document.querySelector('form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Safe destructuring with fallbacks
  const {
    product_name = 'كيت تنظيف سبيكر الهاتف',
    price = 0,
    original_price = null,
    description = null,
    whatsapp = page.whatsapp,
    product_images = [],
    social_proof = [],
    reviews = [],
    page_config = null,
  } = page || {};

  const businessName = client?.business_name || 'المتجر الإلكتروني';

  const headline =
    page_config?.headline || 'نظّف سبيكر تلفونك بسهولة ✨';
  const subheadline =
    page_config?.subheadline ||
    'تخلّص من الغبرة والأوساخ اللي تتجمع في فتحات السبيكر بطريقة بسيطة وسريعة.';

  // Image list handling
  const validImages = Array.isArray(product_images)
    ? product_images.filter((img) => typeof img === 'string' && img.trim().length > 0)
    : [];

  const activeImage =
    validImages.length > 0
      ? validImages[Math.min(selectedImageIndex, validImages.length - 1)]
      : null;

  // Discount calculation
  const hasDiscount =
    typeof original_price === 'number' && original_price > price && price > 0;
  const savingsAmount = hasDiscount && original_price ? original_price - price : 0;
  const discountPercentage =
    hasDiscount && original_price
      ? Math.round(((original_price - price) / original_price) * 100)
      : 0;

  // WhatsApp Link
  const whatsappUrl = getWhatsAppUrl(whatsapp, product_name);

  // Colors
  const colors = resolveThemeColors(theme);

  // Filter valid reviews (up to 3)
  const validReviews = Array.isArray(reviews)
    ? reviews.filter((r) => r && typeof r.text === 'string' && r.text.trim().length > 0).slice(0, 3)
    : [];

  // Filter valid social proof media
  const validSocialProof = Array.isArray(social_proof)
    ? social_proof.filter((item) => item && item.url && typeof item.url === 'string' && item.url.trim().length > 0)
    : [];

  const showSocialProofSection = validReviews.length > 0 || validSocialProof.length > 0;

  return (
    <div
      dir="rtl"
      lang="ar"
      className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-[var(--speaker-accent)] selection:text-[var(--speaker-primary)] pb-24 md:pb-12"
      style={{
        fontFamily: "'Tajawal', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        '--speaker-primary': colors.primary,
        '--speaker-accent': colors.accent,
        '--speaker-primary-soft': `${colors.primary}1A`,
        '--speaker-accent-soft': `${colors.accent}1A`,
        '--speaker-accent-faint': `${colors.accent}0D`,
      } as React.CSSProperties}
    >
      {/* Top Reassurance & Store Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--speaker-accent)] animate-pulse" />
            <span className="font-bold text-slate-800 text-sm sm:text-base tracking-tight">
              {businessName}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/60">
            <svg
              className="w-3.5 h-3.5 text-[var(--speaker-accent)] shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">توصيل 58 ولاية • الدفع عند الاستلام</span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-4 sm:pt-6 space-y-6 sm:space-y-8">

        {/* ==================================================
            1. HERO SECTION
           ================================================== */}
        <section
          id="hero-section"
          className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-sm transition-all"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">

            {/* Image Gallery */}
            <div className="flex flex-col gap-3">
              <div className="relative w-full aspect-square bg-slate-50/80 rounded-2xl p-4 flex items-center justify-center border border-slate-100 overflow-hidden group">
                {hasDiscount && (
                  <span className="absolute top-3 right-3 z-10 bg-[var(--speaker-accent)] text-[var(--speaker-primary)] text-xs sm:text-sm font-black px-3 py-1 rounded-full shadow-xs">
                    تخفيض {discountPercentage}%
                  </span>
                )}

                {activeImage ? (
                  <img
                    id="hero-main-product-image"
                    src={activeImage}
                    alt={product_name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="eager"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                    <svg
                      className="w-16 h-16 mb-2 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium">{product_name}</span>
                  </div>
                )}
              </div>

              {/* Thumbnails if multiple images */}
              {validImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
                  {validImages.map((imgUrl, index) => (
                    <button
                      key={index}
                      id={`thumbnail-btn-${index}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 bg-slate-50 transition-all p-1 ${selectedImageIndex === index
                        ? 'border-[var(--speaker-accent)] ring-2 ring-[var(--speaker-accent-soft)] scale-102'
                        : 'border-slate-200/80 hover:border-slate-300 opacity-75 hover:opacity-100'
                        }`}
                      aria-label={`عرض الصورة ${index + 1}`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product_name} - ${index + 1}`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Purchase Action */}
            <div className="flex flex-col justify-between h-full space-y-4 sm:space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[var(--speaker-accent-faint)] text-[var(--speaker-primary)] text-xs font-bold px-3 py-1 rounded-full border border-[var(--speaker-accent-soft)] mb-2.5">
                  <span>✨ متوفر في المخزون</span>
                  <span>•</span>
                  <span>أصلي 100%</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
                  {headline}
                </h1>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                  {subheadline}
                </p>

                {description && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-xs sm:text-sm text-slate-700 leading-normal mb-4">
                    {description}
                  </div>
                )}
              </div>

              {/* Pricing Block */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100/90 space-y-2">
                <div className="text-xs text-slate-500 font-medium">السعر الحالي:</div>
                <div className="flex items-baseline flex-wrap gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {formatAlgerianPrice(price)}
                  </span>

                  {hasDiscount && original_price && (
                    <span className="text-base sm:text-lg line-through text-slate-400 font-bold">
                      {formatAlgerianPrice(original_price)}
                    </span>
                  )}

                  {hasDiscount && savingsAmount > 0 && (
                    <span className="text-xs font-bold bg-[var(--speaker-accent-soft)] text-[var(--speaker-primary)] px-2.5 py-1 rounded-lg">
                      وفّر {formatAlgerianPrice(savingsAmount)}
                    </span>
                  )}
                </div>
              </div>

              {/* Primary CTA (WhatsApp) */}
              <div className="space-y-3 pt-1">
                {whatsappUrl ? (
                  <a
                    id="hero-whatsapp-order-btn"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 text-white font-black text-base sm:text-lg py-3.5 px-6 rounded-2xl shadow-md transition-all duration-200 transform active:scale-98 hover:brightness-105"
                    style={{ backgroundColor: colors.accent, color: colors.primary }}
                  >
                    <svg
                      className="w-6 h-6 shrink-0 fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>اطلب الآن عبر واتساب</span>
                  </a>
                ) : (
                  <div className="w-full text-center py-3 px-4 bg-slate-100 text-slate-700 rounded-2xl text-sm font-semibold">
                    للطلب والاستفسار يرجى التواصل مع المتجر
                  </div>
                )}

                {/* Trust reassurances */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 text-[11px] sm:text-xs text-slate-600 font-medium">
                  <div className="bg-slate-50 border border-slate-100/90 rounded-xl p-2 flex flex-col items-center">
                    <span className="text-base mb-0.5">📦</span>
                    <span>دفع عند الاستلام</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100/90 rounded-xl p-2 flex flex-col items-center">
                    <span className="text-base mb-0.5">🚚</span>
                    <span>توصيل سريع 58 ولاية</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100/90 rounded-xl p-2 flex flex-col items-center">
                    <span className="text-base mb-0.5">🔍</span>
                    <span>معاينة قبل الدفع</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            2. PROBLEM → SOLUTION
           ================================================== */}
        <section
          id="problem-solution-section"
          className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-sm space-y-6"
        >

          <img
            src={problemSolutionImage.src}
            alt="مشكلة اتساخ سبيكر الهاتف والحل"
            width={problemSolutionImage.width}
            height={problemSolutionImage.height}
            className="w-full h-auto rounded-2xl"
          />

          {/* Solution Kit Features */}
          <img
            src={solutionKitImage.src}
            alt="مميزات كيت تنظيف السبيكر"
            width={solutionKitImage.width}
            height={solutionKitImage.height}
            className="w-full h-auto rounded-2xl"
          />
        </section>

        {/* ==================================================
            3. HOW IT WORKS
           ================================================== */}
        <section
          id="how-it-works-section"
          className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-sm space-y-6"
        >
          <div className="text-center space-y-1">
            <span className="text-xs font-black text-slate-500 tracking-wider">
              طريقة الاستعمال السريعة
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              في 3 خطوات بسيطة فقط ⏱️
            </h2>
          </div>

          <img
            src={howItWorksImage.src}
            alt="طريقة استعمال كيت تنظيف السبيكر"
            width={howItWorksImage.width}
            height={howItWorksImage.height}
            className="w-full h-auto rounded-2xl"
          />
        </section>

        {/* ==================================================
            4. SOCIAL PROOF / REVIEWS
           ================================================== */}
        {showSocialProofSection && (
          <section
            id="social-proof-section"
            className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-sm space-y-6"
          >
            <div className="text-center space-y-1">
              <span className="text-xs font-black text-[var(--speaker-primary)] bg-[var(--speaker-accent-faint)] border border-[var(--speaker-accent-soft)] px-3 py-1 rounded-full">
                تجارب الزبائن
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-1">
                واش قالو اللي شراو علينا من قبل في الجزائر ⭐ (منتجات اخرى)
              </h2>
            </div>

            {/* Media Proof if available */}
            {validSocialProof.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {validSocialProof.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden p-3 flex flex-col items-center"
                  >
                    {item.type === 'image' && item.url && (
                      <img
                        src={item.url}
                        alt={item.caption || 'صورة تجربة الزبون'}
                        className="w-full h-48 object-contain rounded-xl bg-white"
                        loading="lazy"
                      />
                    )}

                    {item.type === 'video' && item.url && (
                      <video
                        src={item.url}
                        controls
                        className="w-full h-48 rounded-xl bg-black"
                      />
                    )}

                    {item.type === 'audio' && item.url && (
                      <div className="w-full py-4 px-2">
                        <audio src={item.url} controls className="w-full" />
                      </div>
                    )}

                    {item.caption && (
                      <p className="text-xs text-slate-600 text-center mt-2.5 font-medium">
                        {item.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Reviews (up to 3) */}
            {validReviews.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {validReviews.map((rev, index) => {
                  const ratingCount = Math.max(1, Math.min(5, rev.rating || 5));
                  return (
                    <div
                      key={index}
                      className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex text-[var(--speaker-accent)] text-xs">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={i < ratingCount ? 'text-[var(--speaker-accent)]' : 'text-slate-200'}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] text-[var(--speaker-primary)] bg-[var(--speaker-accent-faint)] px-2 py-0.5 rounded-md font-bold">
                            طلب مؤكد
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          "{rev.text}"
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{rev.name}</span>
                        {rev.location && (
                          <span className="text-slate-500 text-[11px]">{rev.location}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ==================================================
            5. FINAL CTA
           ================================================== */}
        <section
          id="final-cta-section"
          className="bg-[var(--speaker-primary)] text-white rounded-3xl p-6 sm:p-8 text-center space-y-5 relative overflow-hidden shadow-lg"
        >
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--speaker-accent)]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[var(--speaker-accent)]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold text-[var(--speaker-accent)] bg-white/10 border border-white/20 px-3 py-1 rounded-full">
              توصيل سريع متوفر الآن
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              جاهز تنظف سبيكر تلفونك؟ 🔥
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              احصل على كيت التنظيف الخاص بك وخلّي فتحات الهاتف نقية ومحمية من تراكم الغبار.
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {formatAlgerianPrice(price)}
              </span>
              {hasDiscount && original_price && (
                <span className="text-base sm:text-lg line-through text-slate-400 font-bold">
                  {formatAlgerianPrice(original_price)}
                </span>
              )}
            </div>

            {whatsappUrl && (
              <div className="w-full max-w-md pt-2">
                <a
                  id="final-whatsapp-order-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 text-slate-900 bg-[var(--speaker-accent)] hover:brightness-110 font-black text-base sm:text-lg py-3.5 px-6 rounded-2xl shadow-md transition-all duration-200 transform active:scale-98"
                >
                  <svg
                    className="w-6 h-6 shrink-0 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>اطلب الآن عبر واتساب</span>
                </a>
              </div>
            )}


            <span className="text-[11px] sm:text-xs text-slate-400 mt-2">
              الدفع عند الاستلام بعد تفقد السلعة 🇩🇿
            </span>
          </div>
        </section>
        <section id="order-form-container" className="max-w-xl mx-auto px-4 pb-28 pt-4">
          <OrderForm
            pageId={page.id}
            clientId={client.id}
            pageSlug={page.slug}
            productName={page.product_name}
            price={page.price}
            primaryColor={colors.accent}
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto px-4 mt-8 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} {businessName}. جميع الحقوق محفوظة.</p>
        <p className="mt-1 text-[11px] text-slate-400/80">
          منتج مخصص لتنظيف فتحات السبيكر بلطف وأمان.
        </p>
      </footer>

      {/* ==================================================
          STICKY MOBILE CTA BAR (ORDER BUTTON)
         ================================================== */}
      {price > 0 && (
        <div
          id="sticky-mobile-cta"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 shadow-lg flex items-center justify-between gap-3"
        >
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-medium">السعر:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900 leading-tight">
                {formatAlgerianPrice(price)}
              </span>
              {hasDiscount && original_price && (
                <span className="text-xs line-through text-slate-400">
                  {formatAlgerianPrice(original_price)}
                </span>
              )}
            </div>
          </div>

          <button
            id="mobile-bar-order-btn"
            type="button"
            onClick={handleOrderClick}
            className="flex-1 flex items-center justify-center gap-2 text-white font-black text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 hover:brightness-105 cursor-pointer"
            style={{ backgroundColor: colors.accent, color: colors.primary }}
          >
            <span>اطلب الآن</span>
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
}
