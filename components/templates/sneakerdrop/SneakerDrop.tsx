"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Clock,
  Zap,
  Volume2,
  Play,
  Share2,
  Info,
  Package,
  Ruler,
  Check,
  ArrowDown
} from 'lucide-react';
import { FashionOrderForm } from '../shared/FashionOrderForm';
import { TemplateProps } from '../types';



export default function SneakerDrop({ page, client }: TemplateProps) {
  // Config fallbacks
  const primaryColor = page.page_config?.primaryColor || '#ccff00';
  const defaultSizes = ['40', '41', '42', '43', '44', '45'];
  const sizes = page.page_config?.sizes?.length ? page.page_config.sizes : defaultSizes;

  const defaultColors = [
    'أسود ونيون / Noir & Néon'
  ];
  const colors = page.page_config?.colors?.length ? page.page_config.colors : defaultColors;

  const images = page.product_images?.length
    ? page.product_images
    : [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80'
    ];

  // Component state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[1] || sizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeSpecTab, setActiveSpecTab] = useState<'materials' | 'cushion' | 'shipping' | 'guarantee'>('materials');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<number | null>(null);

  // Stock status countdown simulation
  const [stockRemaining] = useState(14);
  const [timer, setTimer] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sticky bottom bar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToOrderForm = () => {
    const el = document.getElementById('fashion-order-form-placeholder');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const calculateDiscount = () => {
    if (!page.original_price || page.original_price <= page.price) return null;
    const diff = page.original_price - page.price;
    const percent = Math.round((diff / page.original_price) * 100);
    return percent;
  };

  const discountPercent = calculateDiscount();

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans antialiased selection:bg-lime-400 selection:text-black pb-24 dir-rtl">
      {/* 1. HYPE TICKER TOP BANNER */}
      <div
        className="overflow-hidden whitespace-nowrap py-2.5 text-xs font-black tracking-widest uppercase text-black"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="inline-flex animate-marquee space-x-8 space-x-reverse font-mono">
          <span>⚡ إصدار محدود جداً • DROP EXCLUSIF</span>
          <span>•</span>
          <span>🚚 توصيل سريع إلى 58 ولاية • LIVRAISON 58 WILAYAS</span>
          <span>•</span>
          <span>🛡️ الدفع عند الاستلام بعد المعاينة • PAIEMENT À LA LIVRAISON</span>
          <span>•</span>
          <span>🔥 الكمية المتوفرة تكتمل قريباً</span>
          <span>•</span>
          <span>⚡ إصدار محدود جداً • DROP EXCLUSIF</span>
          <span>•</span>
          <span>🚚 توصيل سريع إلى 58 ولاية</span>
        </div>
      </div>

      {/* 2. BRAND HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl px-4 py-3.5 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-black text-xl tracking-tighter shadow-lg shadow-lime-500/10"
              style={{ backgroundColor: primaryColor }}
            >
              SNKRS
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block uppercase leading-none">
                {client.business_name || 'SNKRS DROP DZ'}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider">
                إصدار حصري 2026 • ALGERIA RELEASE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-xs font-mono text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>الطلب متوفر الآن</span>
            </div>

            <button
              onClick={scrollToOrderForm}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all hover:scale-105 active:scale-95 text-black flex items-center gap-1.5"
              style={{ backgroundColor: primaryColor }}
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>اطلب الآن</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO & MAIN PRODUCT SECTION */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT COLUMN: GALLERY & VISUAL DISPLAY (LG: 7 Cols) */}
          <div className="lg:col-span-7 space-y-4 relative">

            {/* Background Typography Watermark */}
            <div className="absolute -top-10 right-0 text-7xl md:text-9xl font-black text-zinc-900/40 select-none pointer-events-none font-mono uppercase tracking-tighter">
              SNKRS//DZ
            </div>

            {/* MAIN IMAGE CONTAINER */}
            <div className="relative group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md shadow-2xl aspect-[4/3] md:aspect-[16/11] flex items-center justify-center">

              {/* Top Badges */}
              <div className="absolute top-4 right-4 z-20 flex flex-wrap gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-black uppercase text-black tracking-wider shadow-md flex items-center gap-1"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Flame className="h-3.5 w-3.5 fill-current" />
                  إصدار حصري
                </span>

                {discountPercent && (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-red-600 text-white shadow-md">
                    -{discountPercent}% خصم
                  </span>
                )}
              </div>

              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-zinc-950/80 border border-zinc-800 text-zinc-300 backdrop-blur-md">
                  تصوير حقيقي 100%
                </span>
              </div>

              {/* Sneaker Main Image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={images[selectedImageIndex]}
                  alt={page.product_name}
                  initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                  onClick={() => setIsZoomOpen(true)}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none">
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="p-2.5 rounded-2xl bg-black/60 text-white hover:bg-black/90 transition-all border border-white/10 pointer-events-auto backdrop-blur-md"
                    aria-label="الصورة السابقة"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="p-2.5 rounded-2xl bg-black/60 text-white hover:bg-black/90 transition-all border border-white/10 pointer-events-auto backdrop-blur-md"
                    aria-label="الصورة التالية"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Zoom Trigger Button */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-4 left-4 z-20 p-2.5 rounded-2xl bg-black/70 text-white hover:bg-black border border-white/10 backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-bold"
              >
                <Maximize2 className="h-4 w-4" />
                <span className="hidden sm:inline">تكبير الصورة</span>
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-black/70 border border-white/10 text-xs font-mono text-zinc-300 backdrop-blur-md">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* THUMBNAIL GRID */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative rounded-2xl overflow-hidden border-2 aspect-square bg-zinc-900 transition-all ${selectedImageIndex === idx
                      ? 'border-lime-400 scale-105 shadow-lg shadow-lime-500/20'
                      : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-700'
                      }`}
                  >
                    <img src={img} alt={`مصغرة ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* FEATURES BADGES BAR */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3 text-center space-y-1">
                <Truck className="h-5 w-5 mx-auto text-emerald-400" />
                <span className="text-xs font-bold block text-white">توصيل سريع</span>
                <span className="text-[10px] text-zinc-400 block font-mono">58 ولاية خلال 24-48h</span>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3 text-center space-y-1">
                <ShieldCheck className="h-5 w-5 mx-auto text-lime-400" />
                <span className="text-xs font-bold block text-white">معاينة قبل الدفع</span>
                <span className="text-[10px] text-zinc-400 block font-mono">افحص المنتج بنفسك</span>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3 text-center space-y-1">
                <RotateCcw className="h-5 w-5 mx-auto text-cyan-400" />
                <span className="text-xs font-bold block text-white">ضمان المقاس</span>
                <span className="text-[10px] text-zinc-400 block font-mono">تبديل للمقاس مجاناً</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: PRODUCT INFO & DROP CONFIGURATION (LG: 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Header info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-lime-400" />
                  {page.page_config?.headline || 'إصدار حصري محدود • LIMITED DROP'}
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                  متوفر حالياً
                </span>
              </div>

              {/* Giant Title */}
              <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                {page.product_name}
              </h1>

              {/* Subheadline or short tagline */}
              {page.page_config?.subheadline && (
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                  {page.page_config.subheadline}
                </p>
              )}

              {/* Rating badge */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white font-mono">4.9 / 5.0</span>
                <span className="text-xs text-zinc-500 font-mono">({page.reviews?.length || 24} تقييم موثق)</span>
              </div>
            </div>

            {/* PRICE & DISCOUNT BOX */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block font-mono">سعر الإطلاق الحصري:</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl md:text-4xl font-black font-mono text-white tracking-tight">
                      {page.price.toLocaleString()} <span className="text-lime-400 text-xl font-bold">د.ج</span>
                    </span>

                    {page.original_price && page.original_price > page.price && (
                      <span className="text-base text-zinc-500 line-through font-mono">
                        {page.original_price.toLocaleString()} د.ج
                      </span>
                    )}
                  </div>
                </div>

                {discountPercent && (
                  <div className="text-right">
                    <span className="px-3 py-1.5 rounded-xl bg-red-600/90 text-white font-black text-sm uppercase tracking-wider block font-mono shadow-lg">
                      توفير {discountPercent}%
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-300 font-mono">
                  <Truck className="h-3.5 w-3.5 text-emerald-400" />
                  الدفع عند الاستلام بعد المعاينة
                </span>
                <span className="text-lime-400 font-mono font-bold">شحن لـ 58 ولاية</span>
              </div>
            </div>

            {/* LIVE STOCK & COUNTDOWN TIMER */}
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900 border border-zinc-800/90 rounded-3xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="text-red-400 font-bold">باقي {stockRemaining} قطع فقط في المخزون!</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-400">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  <span>تنتهي الكمية خلال:</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: '82%', backgroundColor: primaryColor }}
                />
              </div>

              {/* Countdown timer numbers */}
              <div className="flex justify-between items-center text-center font-mono text-xs pt-1">
                <div className="flex gap-2 mx-auto text-zinc-200">
                  <div className="bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                    <span className="text-base font-black font-mono block text-white">{String(timer.hours).padStart(2, '0')}</span>
                    <span className="text-[10px] text-zinc-500">ساعة</span>
                  </div>
                  <span className="text-xl font-bold self-center text-zinc-600">:</span>
                  <div className="bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                    <span className="text-base font-black font-mono block text-white">{String(timer.minutes).padStart(2, '0')}</span>
                    <span className="text-[10px] text-zinc-500">دقيقة</span>
                  </div>
                  <span className="text-xl font-bold self-center text-zinc-600">:</span>
                  <div className="bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                    <span className="text-base font-black font-mono block text-white" style={{ color: primaryColor }}>
                      {String(timer.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-zinc-500">ثانية</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLOR SELECTOR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>اللون المتاح / Couleur</span>
                </span>
                <span className="text-zinc-400 font-mono">{selectedColor}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {colors.map((colorName, idx) => {
                  const isSelected = selectedColor === colorName;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(colorName)}
                      className={`px-3 py-2.5 rounded-2xl border text-xs font-bold text-right transition-all flex items-center justify-between ${isSelected
                        ? 'border-lime-400 bg-zinc-900 text-white shadow-md'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                    >
                      <span className="truncate">{colorName}</span>
                      {isSelected && <Check className="h-4 w-4 text-lime-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIZE SELECTOR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Ruler className="h-4 w-4 text-lime-400" />
                  <span>المقاس / Pointure (EU)</span>
                </span>

                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-lime-400 hover:underline font-mono flex items-center gap-1"
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>دليل المقاسات</span>
                </button>
              </div>

              {/* Sizing Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {sizes.map((sizeVal) => {
                  const isSelected = selectedSize === sizeVal;
                  return (
                    <button
                      key={sizeVal}
                      onClick={() => setSelectedSize(sizeVal)}
                      className={`h-12 rounded-2xl border font-mono font-black text-sm transition-all flex flex-col items-center justify-center relative ${isSelected
                        ? 'border-lime-400 text-black shadow-lg scale-105'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                        }`}
                      style={{
                        backgroundColor: isSelected ? primaryColor : undefined
                      }}
                    >
                      <span>{sizeVal}</span>
                      {sizeVal === '42' && (
                        <span className="text-[9px] font-sans font-normal text-red-500 block -mt-1">
                          آخر 2
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ORDER CTA BUTTON (SCROLLS TO FORM) */}
            <div className="space-y-2 pt-2">
              <button
                onClick={scrollToOrderForm}
                className="w-full py-4 rounded-2xl font-black text-lg text-black uppercase tracking-wider shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                style={{ backgroundColor: primaryColor }}
              >
                <Zap className="h-5 w-5 fill-current" />
                <span>طلب المنتج الآن (الدفع عند الاستلام)</span>
                <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
              </button>

              <p className="text-[11px] text-center text-zinc-500 font-mono">
                🔒 الدفع نقدًا عند الاستلام بعد تفحص الحذاء وتجربته
              </p>
            </div>

            {/* DESCRIPTION ACCORDION */}
            {page.description && (
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 space-y-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block font-mono">
                  وصف المنتج / Description
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line dir-rtl">
                  {page.description}
                </p>
              </div>
            )}

          </div>

        </div>

        {/* 4. ORDER FORM PLACEHOLDER CONTAINER */}
        <section className="mt-16 md:mt-24 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase text-black inline-block"
              style={{ backgroundColor: primaryColor }}
            >
              استمارة الطلب المباشر
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-white">
              أكد طلبك الآن ودع الباقي علينا
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-lg mx-auto dir-rtl">
              أدخل معلوماتك أدناه وسيتم التواصل معك هاتفياً لتأكيد إرسال الطرد إلى ولايتك في أسرع وقت.
            </p>
          </div>

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
            primaryColor={primaryColor}
          />
        </section>

        {/* 5. PRODUCT SPECS & DETAILS SECTION */}
        <section className="mt-20 md:mt-28 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
              مواصفات الجودة والابتكار
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto font-mono">
              تصميم هيب عصري مصنع بأجود المواد لتوفير الراحة التامة والشكل المتألق
            </p>
          </div>

          {/* Specs Navigation Tabs */}
          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'materials', label: 'المواد والخامات / Matériaux' },
              { id: 'cushion', label: 'النعل الهوائي / Semelle Air' },
              { id: 'shipping', label: 'التوصيل والشحن / Livraison' },
              { id: 'guarantee', label: 'الضمان والمعاينة / Garantie' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSpecTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${activeSpecTab === tab.id
                  ? 'bg-zinc-100 text-black shadow-lg scale-105'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="max-w-4xl mx-auto bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
            {activeSpecTab === 'materials' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3 dir-rtl">
                  <h3 className="text-xl font-black text-white">جلد ومواد عالية الجودة 100%</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    تم تصميم الجزء العلوي من الحذاء باستعمال طبقات متينة مقاومة للتآكل والخدش، مع فتحات تهوية دقيقة تضمن جفاف القدمين طوال اليوم.
                  </p>
                  <ul className="text-xs text-zinc-300 space-y-2 font-mono">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-lime-400" />
                      <span>جلد طبيعي معزز بطبقات بريميوم</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-lime-400" />
                      <span>خياطة مزدوجة متينة للحواف</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-lime-400" />
                      <span>رباط حذاء متين مضاد للتمدد</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl overflow-hidden border border-zinc-800 aspect-video">
                  <img
                    src={images[1] || images[0]}
                    alt="تفاصيل الخامات"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {activeSpecTab === 'cushion' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3 dir-rtl">
                  <h3 className="text-xl font-black text-white">تقنية امتصاص الصدمات Air Cushion</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    نعل كوتشوك مطاطي مرن ومزود بنظام وسائد هوائية لامتصاص الصدمات أثناء المشي لمسافات طويلة أو ممارسة الرياضة.
                  </p>
                  <ul className="text-xs text-zinc-300 space-y-2 font-mono">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      <span>راحه تامة لأسفل القدم والظهر</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      <span>نعل سفلي مضاد للانزلاق على السطوح المبللة</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl overflow-hidden border border-zinc-800 aspect-video">
                  <img
                    src={images[2] || images[0]}
                    alt="تفاصيل النعل"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {activeSpecTab === 'shipping' && (
              <div className="space-y-4 dir-rtl">
                <h3 className="text-xl font-black text-white">التوصيل إلى 58 ولاية جزائرية</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1">
                    <span className="text-xs text-lime-400 font-bold font-mono">العاصمة والولايات المجاورة</span>
                    <span className="text-sm font-bold block text-white">خلال 24 ساعة فقط</span>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1">
                    <span className="text-xs text-lime-400 font-bold font-mono">باقي الولايات الشمالية والشرق والغرب</span>
                    <span className="text-sm font-bold block text-white">خلال 48 ساعة</span>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1">
                    <span className="text-xs text-lime-400 font-bold font-mono">ولايات الجنوب الكبير</span>
                    <span className="text-sm font-bold block text-white">من 3 إلى 4 أيام</span>
                  </div>
                </div>
              </div>
            )}

            {activeSpecTab === 'guarantee' && (
              <div className="space-y-4 dir-rtl">
                <h3 className="text-xl font-black text-white">سياسة المعاينة والضمان الذهبي</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  نحن نضمن لك حق تجربة الحذاء وفحصه كاملاً أمام موزع التوصيل قبل دفع أي سنتيم. وفي حال وجود أي مشكلة في المقاس يتم استبداله مجاناً.
                </p>
                <div className="flex items-center gap-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-xs font-mono text-emerald-400">
                  <ShieldCheck className="h-6 w-6 shrink-0" />
                  <span>ضمان الرضا 100% • 100% Satisfait ou Remboursé</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 6. SOCIAL PROOF & UGC FEED */}
        {page.social_proof?.length > 0 && (
          <section className="mt-20 md:mt-28 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-lime-400">
                #SNKRS_ALGERIA
              </span>
              <h2 className="text-2xl md:text-4xl font-black uppercase text-white">
                تجارب وصور الزبائن الحقيقية
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                مقاطع وصور تم التقاطها من طرف زبائننا بعد استلام طرودهم
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {page.social_proof.map((item, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-3xl overflow-hidden p-4 space-y-3 hover:border-zinc-700 transition-all"
                >
                  {item.type === 'image' && item.url && (
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-950">
                      <img src={item.url} alt="اثبات اجتماعي" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {item.type === 'audio' && (
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <Volume2 className="h-4 w-4 text-lime-400" />
                          تسجيل صوتي للزبون
                        </span>
                        <span>0:24</span>
                      </div>

                      <button
                        onClick={() => setIsPlayingAudio(isPlayingAudio === index ? null : index)}
                        className="w-full py-2.5 rounded-xl bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-700"
                      >
                        <Play className="h-4 w-4 fill-current text-lime-400" />
                        <span>{isPlayingAudio === index ? 'إيقاف الصوتي' : 'استماع لشهادة الزبون'}</span>
                      </button>
                    </div>
                  )}

                  {item.caption && (
                    <p className="text-xs text-zinc-300 font-medium dir-rtl">
                      "{item.caption}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. REVIEWS SECTION */}
        <section className="mt-20 md:mt-28 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-4xl font-black uppercase text-white">
              آراء الزبائن والتقييمات
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-zinc-400 font-mono">4.9 من أصل 5 بناءً على تجارب حقيقية</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {(page.reviews?.length ? page.reviews : [
              { name: 'كريم.م', location: 'وهران', rating: 5, text: 'وصلني الكوتشوك اليوم في وهران، الجودة ما شاء الله والمقاس جاني سوا سوا. شكراً ليكم.' },
              { name: 'ياسين.ب', location: 'الجزائر العاصمة', rating: 5, text: 'التوصيل كان في 24 ساعة فقط، فحصت السلعة وقستها عاد خلصت. سيرفيس ممتاز.' },
              { name: 'حمزة.ت', location: 'قسنطينة', rating: 5, text: 'Le produit est magnifique, exact à la photo. Je recommande fortement!' },
              { name: 'سفيان.ع', location: 'سطيف', rating: 5, text: 'خفيفة بزاف في الرجل ونعل مريح للرياضة والمشي. ربي يوفقكم.' },
              { name: 'أمين.ك', location: 'عنابة', rating: 5, text: 'Qualité au top! Emballage nickel et livraison rapide.' },
              { name: 'فاروق.م', location: 'باتنة', rating: 5, text: 'أفضل حذاء شريتو هاد العام. اللون والماتريال طوب.' }
            ]).map((rev, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/70 border border-zinc-800/90 rounded-3xl p-5 space-y-3 flex flex-col justify-between hover:border-zinc-700 transition-all dir-rtl"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{rev.name}</span>
                    {rev.location && (
                      <span className="text-[11px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800">
                        📍 {rev.location}
                      </span>
                    )}
                  </div>
                  <div className="flex text-amber-400 text-xs">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    "{rev.text}"
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    زبون موثوق (Achat Vérifié)
                  </span>
                  <span>الجزائر 🇩🇿</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. FOOTER */}
        <footer className="mt-24 border-t border-zinc-800/80 pt-12 pb-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center font-black text-black text-sm"
              style={{ backgroundColor: primaryColor }}
            >
              SNKRS
            </div>
            <span className="text-sm font-black tracking-wider text-white uppercase">
              {client.business_name || 'SNKRS DROP ALGERIA'}
            </span>
          </div>

          <p className="text-xs text-zinc-500 max-w-md mx-auto font-mono dir-rtl">
            جميع الحقوق محفوظة © 2026. متجر الكوتشوك والأحذية العصرية في الجزائر.
            <br />
            Livraison 58 Wilayas • Paiement à la livraison
          </p>
        </footer>

      </main>

      {/* 9. STICKY BOTTOM BUY BAR */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 inset-x-0 z-50 bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-xl px-4 py-3 shadow-2xl"
          >
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={images[0]}
                  alt="مصغرة"
                  className="h-12 w-12 rounded-xl object-cover border border-zinc-800 shrink-0"
                />
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-bold text-white block truncate max-w-[180px]">
                    {page.product_name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    المقاس: <strong className="text-white">{selectedSize}</strong> • {selectedColor}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono">
                  <span className="text-[10px] text-zinc-500 block">السعر:</span>
                  <span className="text-base md:text-lg font-black text-white">
                    {page.price.toLocaleString()} <span className="text-lime-400 text-xs">د.ج</span>
                  </span>
                </div>

                <button
                  onClick={scrollToOrderForm}
                  className="px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-black flex items-center gap-1.5 shadow-lg transition-transform active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Zap className="h-4 w-4 fill-current" />
                  <span>اطلب الآن</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 10. IMAGE ZOOM LIGHTBOX MODAL */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setIsZoomOpen(false)}
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <img
                src={images[selectedImageIndex]}
                alt="تكبير الصورة"
                className="max-w-full max-h-full object-contain rounded-2xl border border-zinc-800 shadow-2xl"
              />
              <button
                onClick={() => setIsZoomOpen(false)}
                className="absolute top-4 right-4 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold border border-zinc-700"
              >
                إغلاق (إلغاء التكبير)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 11. SIZE GUIDE MODAL */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 dir-rtl"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full space-y-4 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-lg font-black uppercase flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-lime-400" />
                  دليل المقاسات (Guide des Tailles)
                </h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-zinc-400">
                جدول قياس طول القدم بالسنتيمتر مقارنة بمقاسات الحذاء الأوروبية (EU):
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse font-mono">
                  <thead>
                    <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                      <th className="p-2 border border-zinc-800">المقاس (EU)</th>
                      <th className="p-2 border border-zinc-800">طول القدم (cm)</th>
                      <th className="p-2 border border-zinc-800">المقاس الأمريكي (US)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-zinc-300">
                    <tr><td className="p-2 font-bold text-lime-400">40</td><td className="p-2">25.0 cm</td><td className="p-2">7.0</td></tr>
                    <tr><td className="p-2 font-bold text-lime-400">41</td><td className="p-2">25.5 cm</td><td className="p-2">8.0</td></tr>
                    <tr><td className="p-2 font-bold text-lime-400">42</td><td className="p-2">26.5 cm</td><td className="p-2">8.5</td></tr>
                    <tr><td className="p-2 font-bold text-lime-400">43</td><td className="p-2">27.5 cm</td><td className="p-2">9.5</td></tr>
                    <tr><td className="p-2 font-bold text-lime-400">44</td><td className="p-2">28.0 cm</td><td className="p-2">10.0</td></tr>
                    <tr><td className="p-2 font-bold text-lime-400">45</td><td className="p-2">29.0 cm</td><td className="p-2">11.0</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 text-[11px] text-zinc-400 font-sans">
                💡 نصيحة: إذا كنت بين مقاسين، ننصح دائماً بطلب المقاس الأكبر لضمان أفضل راحة للقدم.
              </div>

              <button
                onClick={() => setShowSizeGuide(false)}
                className="w-full py-2.5 bg-zinc-100 text-black font-bold text-xs rounded-xl"
              >
                فهمت، العودة للاختيار
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
