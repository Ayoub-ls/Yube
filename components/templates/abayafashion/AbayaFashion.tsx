"use client";

import React, { useState } from 'react';
import { FashionOrderForm } from '../shared/FashionOrderForm';
import type { TemplateProps } from '../types';

import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  ChevronDown,
  Volume2,
  Play,
  Pause,
  Maximize2,
  Heart,
  ShoppingBag,
  Award,
  Box,
  Feather,
  Clock,
  Phone,
  HelpCircle,
  X
} from 'lucide-react';


export default function AbayaFashion({ page, client }: TemplateProps) {
  // Default fallback data for Algerian luxury Abaya
  const defaultImages = [
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1200&auto=format&fit=crop',
  ];

  const images = page.product_images && page.product_images.length > 0
    ? page.product_images
    : defaultImages;

  const [selectedImage, setSelectedImage] = useState(0);

  // Color options
  const defaultColors = [
    'أسود ملكي | Noir Royal',
  ];
  const colors = page.page_config?.colors && page.page_config.colors.length > 0
    ? page.page_config.colors
    : defaultColors;
  const [selectedColor, setSelectedColor] = useState(colors[0] || '');

  // Size options
  const defaultSizes = [
    'S',
    'M',
    'L',
    'XL',
  ];
  const sizes = page.page_config?.sizes && page.page_config.sizes.length > 0
    ? page.page_config.sizes
    : defaultSizes;
  const [selectedSize, setSelectedSize] = useState(sizes[1] || sizes[0] || '');

  // Size Guide Modal State
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Audio playing simulation state
  const [isPlayingAudio, setIsPlayingAudio] = useState<number | null>(null);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Lightbox modal state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const primaryHeadline = page.page_config?.headline || page.product_name || 'عباية ملكية فاخرة بقماش الكريب الياباني';
  const subHeadline = page.page_config?.subheadline || 'تصميم إمبراطوري راقٍ يجمع بين الأصالة العربية والفخامة المعاصرة • Collection Haute Couture 2026';



  const reviewsList = page.reviews && page.reviews.length > 0 ? page.reviews : null;

  const socialProofList = page.social_proof && page.social_proof.length > 0 ? page.social_proof : null;

  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1816] font-sans selection:bg-[#D4AF37]/30 selection:text-[#1A1816]">

      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-[#1A1816] via-[#2D2823] to-[#1A1816] text-[#D8C29D] py-2.5 px-4 text-center text-xs md:text-sm font-medium border-b border-[#D4AF37]/30 shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="hidden sm:flex items-center gap-2 text-[#C5A059] text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span>عرض حصري - Offre Exclusive</span>
          </div>
          <div className="flex-1 text-center font-serif dir-rtl">
            <span>توصيل سريع إلى 58 ولاية 🇩🇿 | الدفع عند الاستلام بعد الفحص • Livraison 58 Wilayas - Paiement à la Livraison</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[#C5A059] text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>ضمان الجودة 100%</span>
          </div>
        </div>
      </div>

      {/* 2. HEADER & BRAND NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD1] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1A1816] to-[#36302A] p-0.5 shadow-md flex items-center justify-center border border-[#D4AF37]">
              <div className="w-full h-full rounded-full bg-[#1A1816] flex items-center justify-center">
                <span className="text-[#D4AF37] font-serif text-xl font-bold tracking-widest">👑</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1816] tracking-tight">
                {client.business_name || 'دار العباية الملكية'}
              </h1>
              <p className="text-[10px] sm:text-xs text-[#8C7A6B] tracking-wider font-sans uppercase">
                Haute Couture • الجزائر
              </p>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="hidden md:flex items-center gap-6 text-xs text-[#4A453E]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              <span>توصيل 58 ولاية</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>فحص قبل الدفع</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>قماش ياباني أصلي</span>
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={scrollToOrderForm}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#B8860B] hover:brightness-110 text-[#1A1816] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>اطلب الآن • Commander</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-24">

        {/* 3. HERO & PRODUCT PRESENTATION SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* IMAGE GALLERY (6 COLUMNS ON LARGE SCREENS) */}
          <div className="lg:col-span-6 space-y-4">

            {/* Main Featured Image */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#F2ECE3] border-2 border-[#E8DFD1] shadow-2xl shadow-amber-900/10 group">
              <img
                src={images[selectedImage]}
                alt={page.product_name}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
                onClick={() => setLightboxImage(images[selectedImage])}
              />

              {/* Luxury Badge Overlays */}
              <div className="absolute top-4 right-4 bg-[#1A1816]/90 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/50 px-4 py-1.5 rounded-full text-xs font-serif font-semibold shadow-lg flex items-center gap-1.5 dir-rtl">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>إصدار إمبراطوري فاخر</span>
              </div>

              <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md text-[#1A1816] px-3 py-1.5 rounded-xl text-xs font-medium shadow-md border border-[#E8DFD1] pointer-events-auto flex items-center gap-1.5 dir-rtl">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>متوفر في المخزون (En stock)</span>
                </div>

                <button
                  onClick={() => setLightboxImage(images[selectedImage])}
                  className="bg-[#1A1816]/80 text-[#FAF7F2] p-2.5 rounded-full backdrop-blur-md hover:bg-[#1A1816] transition-colors pointer-events-auto border border-white/20 shadow-md"
                  title="توسيع الصورة • Zoom"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === idx
                    ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/20 scale-95 shadow-md'
                    : 'border-[#E8DFD1] hover:border-[#C5A059] opacity-70 hover:opacity-100'
                    }`}
                >
                  <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Quick Guarantees bar under image */}
            <div className="grid grid-cols-3 gap-2 bg-[#F5EFE6] border border-[#E8DFD1] p-3 rounded-2xl text-center text-xs text-[#5C5449] dir-rtl">
              <div className="p-1">
                <div className="font-bold text-[#1A1816]">100% أصلي</div>
                <div className="text-[10px] text-[#8C7A6B]">Tissu Certifié</div>
              </div>
              <div className="p-1 border-r border-l border-[#E8DFD1]">
                <div className="font-bold text-[#1A1816]">توصيل 58 ولاية</div>
                <div className="text-[10px] text-[#8C7A6B]">Livraison Express</div>
              </div>
              <div className="p-1">
                <div className="font-bold text-[#1A1816]">معاينة قبل الدفع</div>
                <div className="text-[10px] text-[#8C7A6B]">Paiement à la livraison</div>
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS & BUYING OPTIONS (6 COLUMNS) */}
          <div className="lg:col-span-6 space-y-6 dir-rtl">

            {/* Tagline */}
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#8C6D23] px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider">
              <span>✦</span>
              <span>مجموعة الفخامة والأنوثة • Collection Prestige 2026</span>
            </div>

            {/* Product Headline */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1A1816] leading-tight mb-2">
                {primaryHeadline}
              </h2>
              <p className="text-sm sm:text-base text-[#6E675F] font-sans leading-relaxed">
                {subHeadline}
              </p>
            </div>


            {/* PRICE DISPLAY */}
            <div className="bg-gradient-to-r from-[#1A1816] via-[#2A241F] to-[#1A1816] p-6 rounded-3xl text-white shadow-xl border border-[#D4AF37]/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 translate-x-[-20%] translate-y-[-20%] w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex flex-wrap items-baseline gap-4 mb-3">
                <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#D4AF37] tracking-tight">
                  {page.price ? page.price.toLocaleString() : '12,900'} <span className="text-lg font-sans text-white font-medium">د.ج</span>
                </span>

                {page.original_price && (
                  <span className="text-lg sm:text-xl text-gray-400 line-through font-sans">
                    {page.original_price.toLocaleString()} د.ج
                  </span>
                )}

                {page.original_price && page.original_price > page.price && (
                  <span className="bg-[#C5A059] text-[#1A1816] font-extrabold text-xs px-3 py-1 rounded-full shadow-sm">
                    توفير {((page.original_price - page.price)).toLocaleString()} د.ج
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-amber-200/90 border-t border-amber-500/20 pt-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>عرض لفترة محدودة جداً</span>
                </div>
                <div className="font-semibold text-[#D4AF37]">
                  السعر شامل التغليف الفاخر 🎁
                </div>
              </div>
            </div>

            {/* 4. COLOR SELECTOR */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#E8DFD1] shadow-xs">
              <div className="flex justify-between items-center text-sm font-bold text-[#1A1816]">
                <span>اختر اللون المطلوب (Couleur) :</span>
                <span className="text-xs font-semibold text-[#C5A059]">{selectedColor}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                {colors.map((colorName, index) => {
                  const isSelected = selectedColor === colorName;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedColor(colorName)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${isSelected
                        ? 'border-[#D4AF37] bg-[#FAF6EE] text-[#1A1816] shadow-sm ring-2 ring-[#D4AF37]/30'
                        : 'border-[#E8DFD1] bg-white text-[#5C5449] hover:border-[#C5A059]'
                        }`}
                    >
                      <span className="truncate">{colorName}</span>
                      <div className={`w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center ${isSelected ? 'bg-[#D4AF37] border-[#D4AF37]' : ''}`}>
                        {isSelected && <Check className="w-3 h-3 text-[#1A1816]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. SIZE SELECTOR & SIZE GUIDE */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#E8DFD1] shadow-xs">
              <div className="flex justify-between items-center text-sm font-bold text-[#1A1816]">
                <span>اختر المقاس المناسب (Taille) :</span>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-[#9E7C2B] underline underline-offset-4 hover:text-[#1A1816] font-semibold flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>دليل المقاسات • Guide des Tailles</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {sizes.map((sizeName, index) => {
                  const isSelected = selectedSize === sizeName;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedSize(sizeName)}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all duration-200 ${isSelected
                        ? 'border-[#D4AF37] bg-[#1A1816] text-[#D4AF37] shadow-md'
                        : 'border-[#E8DFD1] bg-white text-[#4A453E] hover:border-[#C5A059]'
                        }`}
                    >
                      {sizeName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. FASHION ORDER FORM PLACEHOLDER INSERTION */}
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
                primaryColor={page.page_config?.primaryColor || '#D4AF37'}
              />
            </div>

          </div>
        </section>

        {/* 7. FABRIC & QUALITY HIGHLIGHTS SECTION */}
        <section className="bg-gradient-to-b from-[#1A1816] to-[#28231E] rounded-3xl text-[#FAF7F2] p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-[#D4AF37]/30">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 dir-rtl">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Feather className="w-3.5 h-3.5" />
              <span>جودة لا تضاهى • Qualité Supérieure</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#D4AF37]">
              سر الفخامة: قماش الكريب الملكي الأصلي
            </h2>
            <p className="text-sm sm:text-base text-[#D0C5B6] font-sans">
              تم اختيار أقمشتنا بعناية فائقة لتوفير أقصى درجات الراحة والانسيابية مع السواد الكاحل الذي لا يبهت بالغسيل.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 dir-rtl">
            <div className="bg-[#24201A]/80 p-6 rounded-2xl border border-[#D4AF37]/20 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">سواد ملكي داكن</h3>
              <p className="text-xs text-[#B5A898] leading-relaxed">
                Noir profond premium يضمن إطلالة هادئة وفاخرة تحافظ على رونقها طوال اليوم.
              </p>
            </div>

            <div className="bg-[#24201A]/80 p-6 rounded-2xl border border-[#D4AF37]/20 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">انسيابية وتنفس</h3>
              <p className="text-xs text-[#B5A898] leading-relaxed">
                خامة خفيفة مريحة لجميع الفصول ولا تسبب أي حرارة أو انزعاج أثناء الارتداء.
              </p>
            </div>

            <div className="bg-[#24201A]/80 p-6 rounded-2xl border border-[#D4AF37]/20 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">مقاوم للتجعد والتنسل</h3>
              <p className="text-xs text-[#B5A898] leading-relaxed">
                Anti-plis & anti-boulochage لا تحتاج للكي المستمر وتبقى مرتبة دائماً.
              </p>
            </div>

            <div className="bg-[#24201A]/80 p-6 rounded-2xl border border-[#D4AF37]/20 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">تطريز وخياطة إمبراطورية</h3>
              <p className="text-xs text-[#B5A898] leading-relaxed">
                تفاصيل دقيقة بأيدي أمهر الخياطين المتخصصين في العبايات الخليجية والجزائرية.
              </p>
            </div>
          </div>
        </section>

        {/* 8. PREMIUM PACKAGING SECTION */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DFD1] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center dir-rtl">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#F5EFE6] border border-[#E8DFD1] text-[#8C6D23] px-3.5 py-1 rounded-full text-xs font-semibold">
              <Box className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>تغليف إمبراطوري مجاني • Emballage Cadeau Offert</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1816]">
              تصلك في علبة هدايا مخملية فاخرة
            </h2>

            <p className="text-sm text-[#6E675F] leading-relaxed font-sans">
              نهتم بأدق التفاصيل لتصلك الطلبية كهدية ملكية تليق بمقامك، العباية مغلفة داخل علبة صلبة بحفظ حريري مع عينة معطرة مجانية برائحة المسك الشرقي.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-[#4A453E]">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#8C6D23] flex items-center justify-center font-bold text-xs">✓</div>
                <span>علبة صلبة مغلفة بشريط ذهبي أنيق • Coffret Luxe</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#8C6D23] flex items-center justify-center font-bold text-xs">✓</div>
                <span>كيس حريري واقٍ لحفظ العباية عند السفر • Sac en Soie</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#8C6D23] flex items-center justify-center font-bold text-xs">✓</div>
                <span>هدية مجانية: قارورة عطر زيتي مسك ملكي فاخر • Parfum Offert</span>
              </li>
            </ul>

            <button
              onClick={scrollToOrderForm}
              className="mt-4 bg-[#1A1816] hover:bg-[#36302A] text-[#D4AF37] font-serif font-bold text-sm px-6 py-3 rounded-2xl shadow-lg transition-all border border-[#D4AF37]/40 inline-flex items-center gap-2"
            >
              <span>طلب العباية مع التغليف الفاخر</span>
              <span>←</span>
            </button>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1000&auto=format&fit=crop"
                alt="تغليف فاخر"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816]/70 via-transparent to-transparent flex items-end p-6">
                <span className="text-white text-xs font-serif font-bold">
                  * الصورة حقيقية لعلبة التغليف الخاصة بطلبيات زبوناتنا
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 9. SOCIAL PROOF & VOICE REVIEWS */}
        <section className="space-y-8 dir-rtl">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1816]">
              تجارب وإطلالات زبوناتنا الوفيات
            </h2>
            <p className="text-sm text-[#6E675F]">
              صور وفيديوهات وتسجيلات صوتية حقيقية تم مشاركتها من زبوناتنا بعد استلام طلبياتهن
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {socialProofList?.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#E8DFD1] p-3 shadow-xs space-y-3">
                {item.type === 'audio' ? (
                  <div className="bg-[#FAF6EE] p-4 rounded-xl border border-[#E8C280] space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-[#8C6D23]">
                      <span className="flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4" />
                        <span>تسجيل صوتي للزبونة</span>
                      </span>
                      <span className="bg-[#D4AF37]/20 px-2 py-0.5 rounded-full text-[10px]">0:42</span>
                    </div>

                    <button
                      onClick={() => setIsPlayingAudio(isPlayingAudio === idx ? null : idx)}
                      className="w-full bg-[#1A1816] text-[#D4AF37] py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md hover:bg-[#36302A] transition-colors"
                    >
                      {isPlayingAudio === idx ? (
                        <>
                          <Pause className="w-4 h-4 text-amber-400" />
                          <span>إيقاف التشغيل • Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span>استماع للتسجيل الصوتي</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-[#6E675F] italic text-center">
                      {item.caption || 'تسجيل صوتي من زبونة بعد معاينة الطلبية'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer relative group"
                      onClick={() => item.url && setLightboxImage(item.url)}
                    >
                      <img
                        src={item.url || images[0]}
                        alt="صورة زبونة"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                    {item.caption && (
                      <p className="text-xs text-[#5C5449] font-medium text-center line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 10. REVIEWS SECTION */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DFD1] shadow-lg space-y-8 dir-rtl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#F0E8DD] pb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1816]">
                تقييمات العملاء (Avis Clients)
              </h2>
              <p className="text-xs sm:text-sm text-[#8C7A6B]">
                آراء حقيقية من زبوناتنا في مختلف ولايات الوطن
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#FAF7F2] px-4 py-2 rounded-2xl border border-[#E8DFD1]">
              <div className="text-2xl font-serif font-bold text-[#1A1816]">4.9</div>
              <div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <div className="text-[10px] text-[#8C7A6B]">من أصل 5 نجوم</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsList?.map((rev, idx) => (
              <div key={idx} className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E8DFD1] space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[#1A1816] text-[#D4AF37] font-bold text-xs flex items-center justify-center">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#1A1816]">{rev.name}</div>
                      {rev.location && (
                        <div className="text-[11px] text-[#8C7A6B]">{rev.location}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed font-sans">
                  "{rev.text}"
                </p>

                <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 pt-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>طلب مؤكد وتوصيل مستلم (Achat Vérifié)</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 11. FAQ ACCORDION */}
        <section className="bg-[#F5EFE6] rounded-3xl p-8 sm:p-12 border border-[#E8DFD1] space-y-6 dir-rtl">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-[#1A1816]">
              الأسئلة الشائعة (Foire Aux Questions)
            </h2>
            <p className="text-xs sm:text-sm text-[#6E675F]">
              كل ما تحتاجين معرفته حول عملية الطلب والتوصيل والضمان
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                q: 'كم يستغرق التوصيل وكيف يتم الدفع؟',
                a: 'التوصيل سريع جداً يستغرق من 24 إلى 48 ساعة فقط لمعظم الولايات (وإلى غاية 3 أيام للولايات البعيدة). الدفع يكون عند الاستلام بعد معاينة وفحص العباية بنفسك.'
              },
              {
                q: 'هل يمكنني التأكد وفحص القماش قبل دفع المبلغ؟',
                a: 'نعم بالتأكيد! يمكنك فتح الطرد وفحص جودة العباية والمقاس أمام موزع الشركة قبل تسليم أي مبلغ، لضمان اطمئنانك التام.'
              },
              {
                q: 'ماذا أفعل إذا كان المقاس غير مناسب بعد القياس؟',
                a: 'نوفر خدمة الاستبدال المجاني والسريع للمقاسات خلال 7 أيام من تاريخ الاستلام، فقط تواصل معنا وسنقوم بإرسال المقاس البديل فوراً.'
              }
            ].map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-[#E8DFD1] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-right p-4 font-bold text-sm text-[#1A1816] flex items-center justify-between gap-2"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#C5A059] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-[#5C5449] border-t border-[#F0E8DD] bg-[#FAF7F2] leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* 12. STICKY MOBILE CTA BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A1816]/95 backdrop-blur-md p-3 border-t border-[#D4AF37]/30 shadow-2xl dir-rtl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-amber-200/80">السعر الإجمالي :</div>
            <div className="text-lg font-serif font-bold text-[#D4AF37]">
              {page.price ? page.price.toLocaleString() : '12,900'} د.ج
            </div>
          </div>

          <button
            onClick={scrollToOrderForm}
            className="flex-1 bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#B8860B] hover:brightness-110 text-[#1A1816] font-bold text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>اطلب الآن • Commander</span>
          </button>
        </div>
      </div>

      {/* 13. SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#D4AF37] shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 left-4 text-[#8C7A6B] hover:text-[#1A1816] p-1 rounded-full bg-[#FAF7F2]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-serif font-bold text-[#1A1816]">
                دليل المقاسات الجزائرية (Guide des Tailles)
              </h3>
              <p className="text-xs text-[#8C7A6B]">
                اختر المقاس المناسب حسب طولك الإجمالي بالطول (cm)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-[#1A1816] text-[#D4AF37]">
                    <th className="p-2.5 rounded-r-xl">المقاس (Taille)</th>
                    <th className="p-2.5">الطول المناسب (Taille/cm)</th>
                    <th className="p-2.5 rounded-l-xl">الكتف / العرض</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD1] text-[#4A453E]">
                  <tr><td className="p-2.5 font-bold">52 (S)</td><td className="p-2.5">150 cm - 155 cm</td><td className="p-2.5">عادي (Standard)</td></tr>
                  <tr><td className="p-2.5 font-bold">54 (M)</td><td className="p-2.5">156 cm - 162 cm</td><td className="p-2.5">عادي (Standard)</td></tr>
                  <tr><td className="p-2.5 font-bold">56 (L)</td><td className="p-2.5">163 cm - 168 cm</td><td className="p-2.5">واسع (Large)</td></tr>
                  <tr><td className="p-2.5 font-bold">58 (XL)</td><td className="p-2.5">169 cm - 174 cm</td><td className="p-2.5">واسع (Large)</td></tr>
                  <tr><td className="p-2.5 font-bold">60 (XXL)</td><td className="p-2.5">175 cm وأكثر</td><td className="p-2.5">فضفاض (Ample)</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#FAF6EE] p-3 rounded-xl text-[11px] text-[#8C6D23] border border-[#E8C280] text-center">
              💡 ملاحظة: جميع العبايات مصممة بستايل فضفاض أنيق وسترة كاملة.
            </div>

            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full bg-[#1A1816] text-[#D4AF37] font-bold py-2.5 rounded-xl text-xs"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      )}

      {/* 14. LIGHTBOX IMAGE MODAL */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <img src={lightboxImage} alt="صورة مكبرة" className="w-full h-full object-contain rounded-2xl" />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-2 left-2 bg-white/20 text-white p-2 rounded-full backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#13110E] text-[#8C7A6B] py-12 border-t border-[#D4AF37]/20 text-xs dir-rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1A1816] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                👑
              </div>
              <div>
                <div className="font-serif font-bold text-base text-white">{client.business_name}</div>
                <div className="text-[10px] text-[#C5A059]">جميع الحقوق محفوظة © 2026 • Tous droits réservés</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#C5A059]">
              <span>توصيل لـ 58 ولاية</span>
              <span>•</span>
              <span>الدفع عند الاستلام</span>
              <span>•</span>
              <span>ضمان الأصالة</span>
            </div>
          </div>

          <p className="text-center text-[11px] text-[#6E675F]">
            متجر متخصص في أحدث صيحات العباية الخليجية والشرقية الفاخرة بالجزائر.
          </p>
        </div>
      </footer>

    </div>
  );
}
