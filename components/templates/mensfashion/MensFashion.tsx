"use client";

import React, { useState, useEffect } from 'react';
import { FashionOrderForm } from '../shared/FashionOrderForm';
import type { TemplateProps } from '../types';

// Fallback luxury high-res menswear images if page.product_images is empty or short
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop'
];

// Fallback reviews tailored for Algerian market in Arabic and French



export default function MensFashion({ page, client }: TemplateProps) {
  // Primary language: Arabic ('ar') or French ('fr')
  const [lang, setLang] = useState<'ar' | 'fr'>('ar');
  const isAr = lang === 'ar';

  // Product Gallery Images setup
  const galleryImages =
    page.product_images && page.product_images.length > 0
      ? page.product_images
      : FALLBACK_IMAGES;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Available Colors & Sizes
  const colors =
    page.page_config?.colors && page.page_config.colors.length > 0
      ? page.page_config.colors
      : isAr
        ? ['أسود']
        : ['Noir'];

  const sizes =
    page.page_config?.sizes && page.page_config.sizes.length > 0
      ? page.page_config.sizes
      : ['39', '40', '41', '42', '43', '44'];

  const [selectedColor, setSelectedColor] = useState(colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(sizes[1] || 'M');

  // Update selection if language changes and defaults switch
  useEffect(() => {
    if (!colors.includes(selectedColor)) {
      setSelectedColor(colors[0] || '');
    }
  }, [lang]);

  // Active Tab for details
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');

  // Reviews selection
  const reviewsList =
    page.reviews && page.reviews.length > 0
      ? page.reviews
      : null

  const scrollToOrderForm = () => {
    const el = document.getElementById('fashion-order-form-placeholder');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div
      className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-zinc-100 selection:text-zinc-950"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* LUXURY TOP ANNOUNCEMENT BAR */}
      <div className="bg-zinc-900 border-b border-zinc-800 text-zinc-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isAr
                ? 'توصيل سريع إلى 58 ولاية جزائرية | المعاينة والتجربة عند الاستلام'
                : 'Livraison rapide dans 58 Wilayas | Essayage & Paiement à la livraison'}
            </span>
          </div>

          {/* LANGUAGE SWITCHER BUTTON (Arabic / French strictly) */}
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-full p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLang('ar')}
              className={`px-3 py-1 rounded-full transition-all duration-200 ${isAr
                ? 'bg-zinc-100 text-zinc-950 shadow-xs'
                : 'text-zinc-400 hover:text-white'
                }`}
            >
              العربية
            </button>
            <button
              onClick={() => setLang('fr')}
              className={`px-3 py-1 rounded-full transition-all duration-200 ${!isAr
                ? 'bg-zinc-100 text-zinc-950 shadow-xs'
                : 'text-zinc-400 hover:text-white'
                }`}
            >
              Français
            </button>
          </div>
        </div>
      </div>

      {/* BRAND HEADER & NAVIGATION */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo / Client Business Name */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-serif font-extrabold text-xl tracking-tighter">
              {client.business_name ? client.business_name.charAt(0).toUpperCase() : 'H'}
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-widest text-white uppercase block leading-tight">
                {client.business_name || (isAr ? 'دار الأناقة الرجالية' : 'HAUSS & CO')}
              </span>
              <span className="text-[10px] tracking-widest text-zinc-400 uppercase block">
                {isAr ? 'الفخامة والأناقة الاستثنائية' : 'Haute Couture Masculine'}
              </span>
            </div>
          </div>

          {/* Luxury Badge */}
          <div className="hidden md:flex items-center gap-6 text-xs font-medium tracking-wide text-zinc-300">
            <a href="#gallery" className="hover:text-white transition-colors">
              {isAr ? 'المعرض والقصة' : 'Galerie & Coupe'}
            </a>
            <a href="#craftsmanship" className="hover:text-white transition-colors">
              {isAr ? 'جودة الخامات' : 'Qualité Noble'}
            </a>
            <a href="#reviews" className="hover:text-white transition-colors">
              {isAr ? 'تقييمات الزبائن' : 'Avis Clients'}
            </a>
            <a href="#guarantee" className="hover:text-white transition-colors">
              {isAr ? 'الضمان والشحن' : 'Garanties'}
            </a>
          </div>

          {/* Quick CTA */}
          <button
            onClick={scrollToOrderForm}
            className="rounded-full bg-zinc-100 px-5 py-2.5 text-xs font-bold text-zinc-950 uppercase tracking-wider hover:bg-zinc-200 transition-all duration-200 shadow-sm"
          >
            {isAr ? 'اطلب الآن' : 'Commander'}
          </button>
        </div>
      </header>

      {/* HERO & MAIN PRODUCT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT COLUMN: PRODUCT GALLERY */}
          <div id="gallery" className="lg:col-span-7 space-y-4">
            {/* Main Active Image Stage */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl group">
              <img
                src={galleryImages[activeImageIndex] || galleryImages[0]}
                alt={page.product_name}
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Luxury Badges on Image */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-700/80 px-3.5 py-1.5 text-xs font-bold tracking-widest text-zinc-100 uppercase">
                  {isAr ? 'تشكيلة 2026 الحصرية' : 'Collection Luxe 2026'}
                </span>
                {page.original_price && page.original_price > page.price && (
                  <span className="rounded-full bg-amber-500/90 text-zinc-950 font-extrabold px-3 py-1 text-xs tracking-wider shadow-md">
                    {isAr ? 'خصم خاص' : 'Offre Spéciale'}
                  </span>
                )}
              </div>

              {/* Image Navigation Arrows */}
              {galleryImages.length > 1 && (
                <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
                    }}
                    className="pointer-events-auto h-10 w-10 rounded-full bg-zinc-950/80 text-white flex items-center justify-center border border-zinc-700 hover:bg-white hover:text-zinc-950 transition-all shadow-lg"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
                    }}
                    className="pointer-events-auto h-10 w-10 rounded-full bg-zinc-950/80 text-white flex items-center justify-center border border-zinc-700 hover:bg-white hover:text-zinc-950 transition-all shadow-lg"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </div>
              )}

              {/* Image Counter Badge */}
              <div className="absolute bottom-4 right-4 rounded-full bg-zinc-950/70 backdrop-blur-xs px-3 py-1 text-[11px] font-mono text-zinc-300 border border-zinc-800">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[4/5] overflow-hidden rounded-xl border-2 transition-all duration-200 ${activeImageIndex === idx
                      ? 'border-white ring-2 ring-zinc-100/30'
                      : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${page.product_name} ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Material / Fit Highlights underneath gallery */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
                <div className="text-amber-400 text-lg mb-1">👔</div>
                <div className="text-xs font-bold text-zinc-100">
                  {isAr ? 'قصة إيطالية متناسقة' : 'Coupe Italienne'}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  {isAr ? 'تصميم عصري جذاب' : 'Ajustement Parfait'}
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
                <div className="text-amber-400 text-lg mb-1">✨</div>
                <div className="text-xs font-bold text-zinc-100">
                  {isAr ? 'خامة فاخرة 100%' : 'Tissu Noble 100%'}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  {isAr ? 'ملمس ناعم ومريح' : 'Douceur & Confort'}
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
                <div className="text-amber-400 text-lg mb-1">🇩🇿</div>
                <div className="text-xs font-bold text-zinc-100">
                  {isAr ? 'توصيل لـ 58 ولاية' : 'Livraison 58 Wilayas'}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  {isAr ? 'معاينة قبل الدفع' : 'Essayage Autorisé'}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRODUCT INFO & SELECTORS */}
          <div className="lg:col-span-5 space-y-6">

            {/* Header Eyebrow & Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-zinc-600" />
                <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                  {page.page_config?.headline || (isAr ? 'أناقة الرجل العصري' : 'L’Élégance Au Masculin')}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
                {page.product_name || (isAr ? 'سترة فاخرة بالقصة الملكية' : 'Veste De Costume Prestige')}
              </h1>

              {page.page_config?.subheadline && (
                <p className="text-sm text-zinc-400">
                  {page.page_config.subheadline}
                </p>
              )}

              {/* Star Rating & Review count */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center text-amber-400 text-sm">
                  ★★★★★
                </div>
                <span className="text-xs font-bold text-zinc-200">4.9 / 5.0</span>
                <span className="text-zinc-600">•</span>
                <a href="#reviews" className="text-xs text-zinc-400 underline hover:text-zinc-200">
                  ({reviewsList?.length} {isAr ? 'تقييمات موثقة' : 'Avis Vérifiés'})
                </a>
              </div>
            </div>

            {/* Price Box */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 space-y-2">
              <div className="text-xs font-medium text-zinc-400">
                {isAr ? 'السعر الشامل للضريبة والتوصيل:' : 'Prix TTC avec garantie:'}
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                  {page.price ? page.price.toLocaleString() : '12,500'} {isAr ? 'د.ج' : 'DZA'}
                </span>
                {page.original_price && page.original_price > page.price && (
                  <span className="text-lg font-medium text-zinc-500 line-through font-mono">
                    {page.original_price.toLocaleString()} {isAr ? 'د.ج' : 'DZA'}
                  </span>
                )}
              </div>

              {/* Stock Urgency Meter */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-zinc-300 mb-1.5 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    {isAr ? 'المخزون المتوفر في الجزائر:' : 'Stock restant disponible:'}
                  </span>
                  <span className="text-red-400 font-bold">
                    {isAr ? 'باقي 7 قطع فقط' : 'Seulement 7 pièces'}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 w-[82%]" />
                </div>
              </div>
            </div>

            {/* COLOR SELECTOR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                <span>{isAr ? 'اختر اللون:' : 'Choisissez La Couleur:'}</span>
                <span className="text-amber-400 font-normal">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((col) => {
                  const isSelected = selectedColor === col;
                  return (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`relative flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 ${isSelected
                        ? 'border-white bg-zinc-100 text-zinc-950 shadow-md'
                        : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700'
                        }`}
                    >
                      <span
                        className={`h-3.5 w-3.5 rounded-full border border-zinc-700 ${col.includes('أسود') || col.includes('Noir')
                          ? 'bg-zinc-950'
                          : col.includes('رمادي') || col.includes('Gris')
                            ? 'bg-zinc-600'
                            : col.includes('كحلي') || col.includes('Bleu')
                              ? 'bg-blue-950'
                              : col.includes('بيج') || col.includes('Beige')
                                ? 'bg-amber-100'
                                : 'bg-zinc-800'
                          }`}
                      />
                      <span>{col}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIZE SELECTOR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                <span>{isAr ? 'اختر المقاس:' : 'Sélectionnez La Taille:'}</span>
                <a href="#size-guide" className="text-zinc-400 hover:text-white underline text-[11px] font-normal">
                  {isAr ? 'دليل المقاسات' : 'Guide des Tailles'}
                </a>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`h-12 rounded-xl border font-mono text-sm font-bold transition-all duration-200 flex items-center justify-center ${isSelected
                        ? 'border-white bg-white text-zinc-950 shadow-lg scale-102'
                        : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700'
                        }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Short Product Description */}
            <div className="text-xs leading-relaxed text-zinc-300 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
              {page.description ||
                (isAr
                  ? 'تصميم فاخر مستوحى من كبرى دور الموضة العالمية. خامات ممتازة تمنحك الثقة، الراحة والمظهر الملكي في كل مناسبة. مصممة بعناية فائقة للرجل الجزائري الذي يبحث عن التفرد.'
                  : 'Création haut de gamme inspirée des plus grandes maisons de mode masculines. Tissu noble offrant un confort exceptionnel et une allure distinguée en toute occasion.')}
            </div>

            {/* PLACEHOLDER FOR REUSABLE FashionOrderForm COMPONENT */}
            <div className="pt-2">
              <FashionOrderForm
                pageId={page.id}
                clientId={client.id}
                pageSlug={client.slug}
                productName={page.product_name}
                price={page.price}
                selectedColorName={selectedColor}
                onColorChange={setSelectedColor}
                colors={colors}
                selectedSize={selectedSize}
                sizes={sizes}
                onSizeChange={setSelectedSize}
                primaryColor={page.page_config?.primaryColor || 'bg-zinc-900'}
              />
            </div>

            {/* TRUST BADGES UNDER ORDER FORM PLACEHOLDER */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-amber-400 font-bold text-sm">
                  🚚
                </div>
                <div className="text-[11px]">
                  <div className="font-bold text-white">
                    {isAr ? 'توصيل إلى 58 ولاية' : 'Livraison 58 Wilayas'}
                  </div>
                  <div className="text-zinc-400">
                    {isAr ? 'تسليم سريع باب المنزل' : 'Expédition rapide'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-amber-400 font-bold text-sm">
                  💵
                </div>
                <div className="text-[11px]">
                  <div className="font-bold text-white">
                    {isAr ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}
                  </div>
                  <div className="text-zinc-400">
                    {isAr ? 'بعد المعاينة والتجربة' : 'Après essayage'}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* LUXURY CRAFTSMANSHIP & DETAILS SECTION */}
      <section id="craftsmanship" className="border-t border-zinc-800 bg-zinc-900/40 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              {isAr ? 'فن الخياطة الرفيعة' : 'L’Art De La Haute Couture'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {isAr ? 'لماذا تختار مجموعتنا الفاخرة؟' : 'Pourquoi Choisir Notre Collection?'}
            </h2>
            <p className="text-sm text-zinc-400">
              {isAr
                ? 'نجمع بين الخامات الأوروبية العالية والتفاصيل الدقيقة لنقدم لك قطعة ملابس تدوم طويلاً وتمنحك هيبة لا تُضاهى.'
                : 'Nous combinons les meilleurs tissus et des finitions méticuleuses pour créer des pièces intemporelles.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 space-y-4 hover:border-zinc-700 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 text-xl font-serif font-bold">
                01
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                {isAr ? 'أنسجة أوروبية فاخرة' : 'Tissus Nobles Importés'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {isAr
                  ? 'تم اختيار الأقمشة بعناية فائقة لتكون خفيفة، تنفس بشكل طبيعي، وتقاوم التجاعيد مع الحفاظ على القوام الملكي طوال اليوم.'
                  : 'Sélection rigoureuse des matières pour assurer confort respirant et tenue impeccable toute la journée.'}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 space-y-4 hover:border-zinc-700 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 text-xl font-serif font-bold">
                02
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                {isAr ? 'قصة خياطة متقنة' : 'Coupe Ajustée Italienne'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {isAr
                  ? 'تصميم يبرز كتفي الرجل وقامته بشكل متناسق ومريح، مستوحى من أرقى تصاميم ميلانو وباريس.'
                  : 'Une coupe moderne qui met en valeur la silhouette masculine avec aisance et élégance.'}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 space-y-4 hover:border-zinc-700 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 text-xl font-serif font-bold">
                03
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                {isAr ? 'ضمان المعاينة قبل الدفع' : 'Inspection Avant Paiement'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {isAr
                  ? 'يمكنك فتح الطرد، تجربة المقاس ولمس جودة القماش بنفسك قبل تسليم المبلغ لعون التوصيل.'
                  : 'Vous avez le droit d’ouvrir le colis, d’essayer la tenue et de vérifier la qualité avant de payer.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SIZE GUIDE TABLE & SPECS ACCORDION */}
      <section id="size-guide" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-10 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                {isAr ? 'دليل المقاسات والمواصفات' : 'Guide Des Tailles & Spécifications'}
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">
                {isAr ? 'جدول القياسات الدقيق للرجال' : 'Tableau Des Mesures Masculines'}
              </h3>
            </div>

            {/* Tabs Switcher */}
            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'details'
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
                  }`}
              >
                {isAr ? 'جدول المقاسات' : 'Guide Tailles'}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'specs'
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
                  }`}
              >
                {isAr ? 'تركيب القماش' : 'Matière'}
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'shipping'
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
                  }`}
              >
                {isAr ? 'معلومات التوصيل' : 'Livraison'}
              </button>
            </div>
          </div>

          {/* TAB 1: SIZE TABLE */}
          {activeTab === 'details' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right text-zinc-300" dir={isAr ? 'rtl' : 'ltr'}>
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 text-center">{isAr ? 'المقاس' : 'Taille'}</th>
                    <th className="py-3 px-4 text-center">{isAr ? 'محيط الصدر (سم)' : 'Tour de Poitrine (cm)'}</th>
                    <th className="py-3 px-4 text-center">{isAr ? 'عرض الكتفين (سم)' : 'Carrure Épaules (cm)'}</th>
                    <th className="py-3 px-4 text-center">{isAr ? 'الطول الإجمالي (سم)' : 'Longueur Totale (cm)'}</th>
                    <th className="py-3 px-4 text-center">{isAr ? 'الوزن المناسب (كغ)' : 'Poids Recommandé (kg)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  <tr className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-bold text-white text-center">S</td>
                    <td className="py-3 px-4 text-center">96 - 100</td>
                    <td className="py-3 px-4 text-center">44</td>
                    <td className="py-3 px-4 text-center">70</td>
                    <td className="py-3 px-4 text-center">55 - 65</td>
                  </tr>
                  <tr className="hover:bg-zinc-800/40 bg-zinc-950/30">
                    <td className="py-3 px-4 font-bold text-white text-center">M</td>
                    <td className="py-3 px-4 text-center">100 - 104</td>
                    <td className="py-3 px-4 text-center">46</td>
                    <td className="py-3 px-4 text-center">72</td>
                    <td className="py-3 px-4 text-center">65 - 75</td>
                  </tr>
                  <tr className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-bold text-white text-center">L</td>
                    <td className="py-3 px-4 text-center">104 - 108</td>
                    <td className="py-3 px-4 text-center">48</td>
                    <td className="py-3 px-4 text-center">74</td>
                    <td className="py-3 px-4 text-center">75 - 85</td>
                  </tr>
                  <tr className="hover:bg-zinc-800/40 bg-zinc-950/30">
                    <td className="py-3 px-4 font-bold text-white text-center">XL</td>
                    <td className="py-3 px-4 text-center">108 - 112</td>
                    <td className="py-3 px-4 text-center">50</td>
                    <td className="py-3 px-4 text-center">76</td>
                    <td className="py-3 px-4 text-center">85 - 95</td>
                  </tr>
                  <tr className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-bold text-white text-center">XXL</td>
                    <td className="py-3 px-4 text-center">112 - 118</td>
                    <td className="py-3 px-4 text-center">52</td>
                    <td className="py-3 px-4 text-center">78</td>
                    <td className="py-3 px-4 text-center">95 - 105</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-[11px] text-zinc-500 mt-4 text-center">
                {isAr
                  ? '💡 ملاحظة: إذا كنت محتاراً بين مقاسين، يرجى اختيار المقاس الأكبر أو سنقوم بالاتصال بك هاتفياً لتحديد المقاس المضبوط.'
                  : '💡 Note: Si vous hésitez entre deux tailles, nous vous contacterons par téléphone pour valider la bonne mesure.'}
              </p>
            </div>
          )}

          {/* TAB 2: SPECS */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300">
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">
                  {isAr ? 'مواصفات الخامات والعناية' : 'Composition & Entretien'}
                </h4>
                <ul className="space-y-2 list-disc list-inside text-zinc-400">
                  <li>{isAr ? 'النسيج الخارجي: 80% صوف ناعم / 20% فيسكوز فاخر' : 'Tissu extérieur: 80% Laine noble / 20% Viscose'}</li>
                  <li>{isAr ? 'التبانة الداخلية: حرير ناعم ومريح مئة بالمائة' : 'Doublure intérieure: Soie synthétique ultra douce'}</li>
                  <li>{isAr ? 'طريقة الغسل: تنظيف جاف (Dry Clean) لحفظ الرونق' : 'Lavage à sec recommandé pour maintenir l’éclat'}</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">
                  {isAr ? 'مميزات التصميم' : 'Atouts Du Design'}
                </h4>
                <ul className="space-y-2 list-disc list-inside text-zinc-400">
                  <li>{isAr ? 'جيوب داخلية آمنة للمحفظة والهاتف' : 'Poches intérieures sécurisées pour portefeuille et smartphone'}</li>
                  <li>{isAr ? 'أزرار متينة مصقولة بالليزر' : 'Boutons renforcés finition laser de haute précision'}</li>
                  <li>{isAr ? 'ياقة كلاسيكية مشدودة ومتناسقة' : 'Col structuré style couturier italien'}</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: SHIPPING */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs text-zinc-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950">
                  <div className="font-bold text-white mb-1">
                    {isAr ? 'الجزائر العاصمة والولايات المجاورة' : 'Alger & Environs'}
                  </div>
                  <div className="text-amber-400 font-mono">24 - 48 {isAr ? 'ساعة' : 'Heures'}</div>
                </div>
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950">
                  <div className="font-bold text-white mb-1">
                    {isAr ? 'باقي الشمال والشرق والغرب' : 'Nord, Est & Ouest'}
                  </div>
                  <div className="text-amber-400 font-mono">2 - 4 {isAr ? 'أيام' : 'Jours'}</div>
                </div>
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950">
                  <div className="font-bold text-white mb-1">
                    {isAr ? 'الولايات الجنوبية' : 'Wilayas Du Sud'}
                  </div>
                  <div className="text-amber-400 font-mono">3 - 6 {isAr ? 'أيام' : 'Jours'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SOCIAL PROOF & MEDIA GALLERY SECTION */}
      {page.social_proof && page.social_proof.length > 0 && (
        <section className="border-t border-zinc-800 bg-zinc-950 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
              <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                {isAr ? 'تجارب الزبائن الحقيقية' : 'Photos & Témoignages En Direct'}
              </span>
              <h2 className="text-3xl font-serif font-bold text-white">
                {isAr ? 'صور وفيديوهات من زبائننا في الجزائر' : 'Nos Clients En Algérie'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.social_proof.map((proof, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3"
                >
                  {proof.url && (
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-zinc-950">
                      <img
                        src={proof.url}
                        alt={`Social proof ${idx}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  {proof.caption && (
                    <p className="text-xs text-zinc-300 italic font-serif">
                      "{proof.caption}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CUSTOMER REVIEWS SECTION */}
      <section id="reviews" className="border-t border-zinc-800 bg-zinc-900/30 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                {isAr ? 'مصداقية وثقة' : 'Avis Et Évaluations'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                {isAr ? 'آراء ورضا زبائننا الكرام' : 'Avis De Nos Clients En Algérie'}
              </h2>
            </div>

            {/* Overall Rating Score Card */}
            <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
              <div className="text-4xl font-extrabold text-white font-mono">4.9</div>
              <div>
                <div className="text-amber-400 text-sm">★★★★★</div>
                <div className="text-xs text-zinc-400">
                  {isAr ? 'استناداً إلى أكثر من 380 طلب' : 'Basé sur 380+ commandes'}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsList?.map((rev, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-4 hover:border-zinc-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-zinc-800 text-amber-400 flex items-center justify-center font-bold text-sm">
                      {rev.name ? rev.name.charAt(0) : 'Z'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{rev.name}</div>
                      {rev.location && (
                        <div className="text-xs text-zinc-400">{rev.location}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-amber-400 text-xs">★★★★★</div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  "{rev.text}"
                </p>

                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium pt-2 border-t border-zinc-900">
                  <span>✓</span>
                  <span>{isAr ? 'مشترٍ معتمد - تم التأكيد برقم الهاتف' : 'Acheteur Vérifié'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALGERIA DELIVERY PROCESS TIMELINE */}
      <section id="guarantee" className="border-t border-zinc-800 bg-zinc-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              {isAr ? 'خطوات الطلب التلقائية' : 'Processus De Commande Simple'}
            </span>
            <h2 className="text-3xl font-serif font-bold text-white">
              {isAr ? 'كيف يتم إرسال طلبك؟' : 'Comment Ça Marche?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 font-bold text-xl">
                1
              </div>
              <h3 className="text-base font-bold text-white">
                {isAr ? '1. إدخال المعلومات' : '1. Confirmation'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                {isAr
                  ? 'قم بتحديد المقاس واللون المفضل ثم ادخل اسمك ورقم هاتفك في الاستمارة أعلاه.'
                  : 'Choisissez la taille, la couleur et saisissez vos coordonnées.'}
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 font-bold text-xl">
                2
              </div>
              <h3 className="text-base font-bold text-white">
                {isAr ? '2. الاتصال والشحن' : '2. Expédition Express'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                {isAr
                  ? 'سيتصل بك فريقنا هاتفياً لتأكيد العنوان ثم نرسل الطرد عبر شركة التوصيل السريع.'
                  : 'Notre équipe vous appelle pour valider et expédie le colis rapidement.'}
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 font-bold text-xl">
                3
              </div>
              <h3 className="text-base font-bold text-white">
                {isAr ? '3. المعاينة والدفع' : '3. Essayage & Paiement'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                {isAr
                  ? 'تستلم الطرد، تعاين جودة القماش، تجرب المقاس، ثم تدفع المبلغ نقداً لعون التوصيل.'
                  : 'Vous recevez votre tenue, vous l’essayez et vous payez en espèces.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-12 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-serif font-extrabold text-base">
              {client.business_name ? client.business_name.charAt(0).toUpperCase() : 'H'}
            </div>
            <span className="text-lg font-serif font-bold text-white tracking-widest uppercase">
              {client.business_name || (isAr ? 'دار الأناقة الرجالية' : 'HAUSS & CO')}
            </span>
          </div>

          <p className="max-w-md mx-auto text-zinc-400">
            {isAr
              ? 'العلامة الفاخرة المعتمدة للأزياء الرجالية العصرية في الجزائر. جميع الحقوق محفوظة 2026.'
              : 'La référence de la mode masculine de prestige en Algérie. Tous droits réservés 2026.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-400 font-medium">
            <span>{isAr ? 'التوصيل لجميع الولايات (58 ولاية)' : 'Livraison 58 Wilayas'}</span>
            <span>•</span>
            <span>{isAr ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}</span>
            <span>•</span>
            <span>{isAr ? 'ضمان الاستبدال' : 'Garantie Échange'}</span>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE CTA BAR */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 p-3 sm:p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-semibold">
              {selectedColor} | {selectedSize}
            </div>
            <div className="text-base font-extrabold text-white font-mono">
              {page.price ? page.price.toLocaleString() : '12,500'} {isAr ? 'د.ج' : 'DZA'}
            </div>
          </div>

          <button
            onClick={scrollToOrderForm}
            className="flex-1 rounded-xl bg-white px-5 py-3 text-xs font-extrabold text-zinc-950 uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-lg text-center"
          >
            {isAr ? 'اطلب الآن (الدفع عند الاستلام)' : 'Commander (Paiement)'}
          </button>
        </div>
      </div>
    </div>
  );
}
