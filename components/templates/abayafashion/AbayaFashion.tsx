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
import { AnimatePresence, motion } from 'framer-motion';
import { VoiceNotePlayer } from '../shared/VoiceNotePlayer';
import { SocialProofVideo } from '../shared/SocialProofVideo';



export default function AbayaFashion({ page, client, theme }: TemplateProps) {
  const themePrimary = theme?.primary || '#1A1816';
  const themeAccent = theme?.accent || '#D4AF37';

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


  // Audio playing simulation state
  const [playingAudioSrc, setPlayingAudioSrc] = useState<string | null>(null);

  const faqItems = [
    {
      qAr: 'كيف تتم عملية الشراء والدفع؟',

      aAr: 'الدفع يكون عند الاستلام فقط (Paiement à la livraison). بعد تأكيد طلبك، سيتصل بك فريقنا لتأكيد العنوان ثم نرسل لك الطرد مع شركة التوصيل وتدفعين بعد استلام ومعاينة الحقيبة.',

    },
    {
      qAr: 'هل يمكنني معاينة الحقيبة قبل الدفع لعامل التوصيل؟',
      aAr: 'نعم بكل تأكيد! يحق لك فتح الطرد وتفحص الحقيبة والتأكد من جودتها ومطابقتها للصور قبل تسليم المبلغ لموزع التوصيل.',

    },
    {
      qAr: 'ما هي مدة التوصيل إلى ولايتي؟',

      aAr: 'التوصيل يستغرق من 24 إلى 48 ساعة للولايات الرئيسية والعاصمة، ومن 2 إلى 4 أيام لباقي 58 ولاية جزائرية.',

    }
  ];

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Lightbox modal state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const primaryHeadline = page.page_config?.headline || page.product_name || 'عباية ملكية فاخرة بقماش الكريب الياباني';
  const subHeadline = page.page_config?.subheadline || page.description || 'تصميم إمبراطوري راقٍ يجمع بين الأصالة العربية والفخامة المعاصرة • Collection Haute Couture 2026';



  const reviewsList = page.reviews && page.reviews.length > 0 ? page.reviews : null;

  const socialProofList = page.social_proof && page.social_proof.length > 0 ? page.social_proof : null;

  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="min-h-screen bg-[#FAF7F2] text-[var(--t-primary)] font-sans selection:bg-[var(--t-accent)]/30 selection:text-[var(--t-primary)]"
      style={{ '--t-primary': themePrimary, '--t-accent': themeAccent } as React.CSSProperties}
    >

      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-[var(--t-primary)] via-[#2D2823] to-[var(--t-primary)] text-[#D8C29D] py-2.5 px-4 text-center text-xs md:text-sm font-medium border-b border-[var(--t-accent)]/30 shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="hidden sm:flex items-center gap-2 text-[var(--t-accent)] text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[var(--t-accent)] animate-pulse" />
            <span>عرض حصري - Offre Exclusive</span>
          </div>
          <div className="flex-1 text-center font-serif dir-rtl">
            <span>توصيل سريع إلى 58 ولاية 🇩🇿 | الدفع عند الاستلام بعد الفحص • Livraison 58 Wilayas - Paiement à la Livraison</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[var(--t-accent)] text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--t-accent)]" />
            <span>ضمان الجودة 100%</span>
          </div>
        </div>
      </div>

      {/* 2. HEADER & BRAND NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD1] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--t-primary)] to-[#36302A] p-0.5 shadow-md flex items-center justify-center border border-[var(--t-accent)]">
              <div className="w-full h-full rounded-full bg-[var(--t-primary)] flex items-center justify-center">
                <span className="text-[var(--t-accent)] font-serif text-xl font-bold tracking-widest">👑</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--t-primary)] tracking-tight">
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
              <Truck className="w-4 h-4 text-[var(--t-accent)]" />
              <span>توصيل 58 ولاية</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--t-accent)]" />
              <span>فحص قبل الدفع</span>
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={scrollToOrderForm}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--t-accent)] via-[var(--t-accent)] to-[var(--t-accent)] hover:brightness-110 text-[var(--t-primary)] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95"
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
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#F2ECE3] border-2 border-[#E8DFD1] shadow-2xl shadow-[var(--t-accent)]/10 group">
              <img
                src={images[selectedImage]}
                alt={page.product_name}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
                onClick={() => setLightboxImage(images[selectedImage])}
              />

              {/* Luxury Badge Overlays */}
              <div className="absolute top-4 right-4 bg-[var(--t-primary)]/90 backdrop-blur-md text-[var(--t-accent)] border border-[var(--t-accent)]/50 px-4 py-1.5 rounded-full text-xs font-serif font-semibold shadow-lg flex items-center gap-1.5 dir-rtl">
                <Sparkles className="w-3.5 h-3.5 text-[var(--t-accent)]" />
                <span>إصدار إمبراطوري فاخر</span>
              </div>

              <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md text-[var(--t-primary)] px-3 py-1.5 rounded-xl text-xs font-medium shadow-md border border-[#E8DFD1] pointer-events-auto flex items-center gap-1.5 dir-rtl">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>متوفر في المخزون (En stock)</span>
                </div>

                <button
                  onClick={() => setLightboxImage(images[selectedImage])}
                  className="bg-[var(--t-primary)]/80 text-[#FAF7F2] p-2.5 rounded-full backdrop-blur-md hover:bg-[var(--t-primary)] transition-colors pointer-events-auto border border-white/20 shadow-md"
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
                    ? 'border-[var(--t-accent)] ring-4 ring-[var(--t-accent)]/20 scale-95 shadow-md'
                    : 'border-[#E8DFD1] hover:border-[var(--t-accent)] opacity-70 hover:opacity-100'
                    }`}
                >
                  <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Quick Guarantees bar under image */}
            <div className="grid grid-cols-3 gap-2 bg-[#F5EFE6] border border-[#E8DFD1] p-3 rounded-2xl text-center text-xs text-[#5C5449] dir-rtl">
              <div className="p-1">
                <div className="font-bold text-[var(--t-primary)]">100% أصلي</div>
                <div className="text-[10px] text-[#8C7A6B]">Tissu Certifié</div>
              </div>
              <div className="p-1 border-r border-l border-[#E8DFD1]">
                <div className="font-bold text-[var(--t-primary)]">توصيل 58 ولاية</div>
                <div className="text-[10px] text-[#8C7A6B]">Livraison Express</div>
              </div>
              <div className="p-1">
                <div className="font-bold text-[var(--t-primary)]">معاينة قبل الدفع</div>
                <div className="text-[10px] text-[#8C7A6B]">Paiement à la livraison</div>
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS & BUYING OPTIONS (6 COLUMNS) */}
          <div className="lg:col-span-6 space-y-6 dir-rtl">

            {/* Tagline */}
            <div className="inline-flex items-center gap-2 bg-[var(--t-accent)]/15 border border-[var(--t-accent)]/40 text-[var(--t-accent)] px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider">
              <span>✦</span>
              <span>مجموعة الفخامة والأنوثة • Collection Prestige 2026</span>
            </div>

            {/* Product Headline */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--t-primary)] leading-tight mb-2">
                {primaryHeadline}
              </h2>
              <p className="text-sm sm:text-base text-[#6E675F] font-sans leading-relaxed">
                {subHeadline}
              </p>
            </div>


            {/* PRICE DISPLAY */}
            <div className="bg-gradient-to-r from-[var(--t-primary)] via-[#2A241F] to-[var(--t-primary)] p-6 rounded-3xl text-white shadow-xl border border-[var(--t-accent)]/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 translate-x-[-20%] translate-y-[-20%] w-32 h-32 bg-[var(--t-accent)]/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex flex-wrap items-baseline gap-4 mb-3">
                <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[var(--t-accent)] tracking-tight">
                  {page.price ? page.price.toLocaleString() : '12,900'} <span className="text-lg font-sans text-white font-medium">د.ج</span>
                </span>

                {page.original_price && page.original_price >= page.price * 2 && (
                  <span className="text-lg sm:text-xl text-gray-400 line-through font-sans">
                    {page.original_price.toLocaleString()} د.ج
                  </span>
                )}

                {page.original_price && page.original_price >= page.price * 2 ? (
                  <span className="bg-[var(--t-accent)] text-[var(--t-primary)] font-extrabold text-xs px-3 py-1 rounded-full shadow-sm">
                    توفير {((page.original_price - page.price)).toLocaleString()} د.ج
                  </span>
                ) : page.original_price && page.original_price < page.price * 2 ? (
                  <span className="bg-[var(--t-accent)] text-[var(--t-primary)] font-extrabold text-xs px-3 py-1 rounded-full shadow-sm">
                    تخفيض {((page.original_price - page.price) / page.original_price * 100).toFixed(2).toLocaleString()} %
                  </span>
                ) : null}
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--t-accent)]/90 border-t border-[var(--t-accent)]/20 pt-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--t-accent)]" />
                  <span>عرض لفترة محدودة جداً</span>
                </div>
              </div>
            </div>

            {/* 4. COLOR SELECTOR */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#E8DFD1] shadow-xs">
              <div className="flex justify-between items-center text-sm font-bold text-[var(--t-primary)]">
                <span>اختر اللون المطلوب (Couleur) :</span>
                <span className="text-xs font-semibold text-[var(--t-accent)]">{selectedColor}</span>
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
                        ? 'border-[var(--t-accent)] bg-[#FAF6EE] text-[var(--t-primary)] shadow-sm ring-2 ring-[var(--t-accent)]/30'
                        : 'border-[#E8DFD1] bg-white text-[#5C5449] hover:border-[var(--t-accent)]'
                        }`}
                    >
                      <span className="truncate">{colorName}</span>
                      <div className={`w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center ${isSelected ? 'bg-[var(--t-accent)] border-[var(--t-accent)]' : ''}`}>
                        {isSelected && <Check className="w-3 h-3 text-[var(--t-primary)]" />}
                      </div>
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
                primaryColor={page.page_config?.primaryColor || 'var(--t-accent)'}
              />
            </div>

          </div>
        </section>

        {/* 9. SOCIAL PROOF & VOICE REVIEWS */}
        <section className="space-y-8 dir-rtl">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--t-primary)]">
              تجارب وإطلالات زبوناتنا الوفيات
            </h2>
            <p className="text-sm text-[#6E675F]">
              صور وفيديوهات وتسجيلات صوتية حقيقية تم مشاركتها من زبوناتنا بعد استلام طلبياتهن
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {socialProofList?.map((item, idx) => (
              <div key={idx} className="bg-white flex flex-col items-center justify-center rounded-2xl border border-[#E8DFD1] p-3 shadow-xs space-y-3">
                {item.type === 'audio' ? (
                  <div className="bg-[#FAF6EE] p-4 rounded-xl border border-[#E8C280] space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--t-accent)]">
                      <span className="flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4" />
                        <span>تسجيل صوتي للزبونة</span>
                      </span>
                      <span className="bg-[var(--t-accent)]/20 px-2 py-0.5 rounded-full text-[10px]">0:42</span>
                    </div>
                    <VoiceNotePlayer
                      src={item.url || ""}
                      playingAudioSrc={playingAudioSrc}
                      onPlay={setPlayingAudioSrc}
                      onPause={() => setPlayingAudioSrc(null)}
                    />
                    <p className="text-[11px] text-[#6E675F] italic text-center">
                      {item.caption || 'تسجيل صوتي من زبونة بعد معاينة الطلبية'}
                    </p>
                  </div>
                ) : item.type === 'video' ? (
                  <div className="w-full space-y-2">
                    <SocialProofVideo src={item.url} className="aspect-square rounded-xl" fill />
                    {item.caption && (
                      <p className="text-xs text-[#5C5449] font-medium text-center line-clamp-2">
                        {item.caption}
                      </p>
                    )}
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
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--t-primary)]">
                تقييمات العملاء (Avis Clients)
              </h2>
              <p className="text-xs sm:text-sm text-[#8C7A6B]">
                آراء حقيقية من زبوناتنا في مختلف ولايات الوطن
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#FAF7F2] px-4 py-2 rounded-2xl border border-[#E8DFD1]">
              <div className="text-2xl font-serif font-bold text-[var(--t-primary)]">4.9</div>
              <div>
                <div className="flex text-[var(--t-accent)]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[var(--t-accent)]" />
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
                    <div className="w-9 h-9 rounded-full bg-[var(--t-primary)] text-[var(--t-accent)] font-bold text-xs flex items-center justify-center">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[var(--t-primary)]">{rev.name}</div>
                      {rev.location && (
                        <div className="text-[11px] text-[#8C7A6B]">{rev.location}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex text-[var(--t-accent)]">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[var(--t-accent)]" />
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
            <h2 className="text-2xl font-serif font-bold text-[var(--t-primary)]">
              الأسئلة الشائعة (Foire Aux Questions)
            </h2>
            <p className="text-xs sm:text-sm text-[#6E675F]">
              كل ما تحتاجين معرفته حول عملية الطلب والتوصيل والضمان
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[var(--t-accent)]/20 bg-[#FAF9F6] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-right flex items-center justify-between gap-3 text-[#1A1A1A] font-bold text-sm sm:text-base cursor-pointer"
                  >
                    <span>{faq.qAr}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[var(--t-accent)] transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-[var(--t-accent)]/15 pt-3">
                          {faq.aAr}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* 12. STICKY MOBILE CTA BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--t-primary)]/95 backdrop-blur-md p-3 border-t border-[var(--t-accent)]/30 shadow-2xl dir-rtl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-[var(--t-accent)]/80">السعر الإجمالي :</div>
            <div className="text-lg font-serif font-bold text-[var(--t-accent)]">
              {page.price ? page.price.toLocaleString() : '12,900'} د.ج
            </div>
          </div>

          <button
            onClick={scrollToOrderForm}
            className="flex-1 bg-gradient-to-r from-[var(--t-accent)] via-[var(--t-accent)] to-[var(--t-accent)] hover:brightness-110 text-[var(--t-primary)] font-bold text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>اطلب الآن • Commander</span>
          </button>
        </div>
      </div>

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
      <footer className="bg-[#13110E] text-[#8C7A6B] py-12 border-t border-[var(--t-accent)]/20 text-xs dir-rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--t-primary)] border border-[var(--t-accent)] flex items-center justify-center text-[var(--t-accent)] font-bold text-sm">
                👑
              </div>
              <div>
                <div className="font-serif font-bold text-base text-white">{client.business_name}</div>
                <div className="text-[10px] text-[var(--t-accent)]">جميع الحقوق محفوظة © 2026 • Tous droits réservés</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[var(--t-accent)]">
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
