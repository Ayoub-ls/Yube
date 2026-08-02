"use client"

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  Play,
  Pause,
  Maximize2,
  X,
  Check,
  Ruler,
  ShoppingBag,
  ArrowDown,
  Award,
  Scissors,
  Box,
  BadgePercent,
  RotateCcw,
  Volume2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { TemplateProps } from '../types';
import { FashionOrderForm } from "../shared/FashionOrderForm";
import { VoiceNotePlayer } from "../shared/VoiceNotePlayer";

export default function LuxuryFashion({ page, client }: TemplateProps) {
  // Safe fallbacks for prop structures
  const productName = page?.product_name || "فستان السهرة الفاخر - Collection Signature";
  const price = page?.price;
  const originalPrice = page?.original_price;
  const description =
    page?.description ||
    "قطعة فاخرة مصممة بعناية فائقة من أجود أنواع الحرير والقماش الإيطالي المجلوب خصيصاً لخلق إطلالة استثنائية تجمع بين العصرنة والأصالة الباريسية. تم تصنيع كل قطعة بلمسات يدوية دقيقة في ورشنا المتخصصة لضمان الفخامة والراحة التامة.";

  const images = page?.product_images?.length
    ? page.product_images
    : [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    ];

  const colors = page?.page_config?.colors?.length
    ? page.page_config.colors
    : ["الاسود"]


  const sizes = page?.page_config?.sizes?.length
    ? page.page_config.sizes
    : ["S", "M", "L", "XL"];

  const reviews = page?.reviews?.length
    ? page.reviews
    : null

  const socialProof = page?.social_proof?.length
    ? page.social_proof : null


  const businessName = client?.business_name || "MAISON D'ÉLÉGANCE";
  const headline =
    page?.page_config?.headline || "المجموعة الحصرية • Collection Haute Couture";
  const subheadline =
    page?.page_config?.subheadline ||
    "تصاميم فريدة مستوحاة من عروض الأزياء الباريسية بلمسة عربية معاصرة";

  // Interactive States
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || "M");
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [playingAudioSrc, setPlayingAudioSrc] = useState<string | null>(null);

  const orderFormRef = useRef<HTMLDivElement>(null);

  const scrollToOrderForm = () => {
    if (orderFormRef.current) {
      orderFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Currency Formatter
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("ar-DZ").format(amount) + " د.ج";
  };

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0B0B0B] font-sans selection:bg-[#C5A059] selection:text-white dir-rtl text-right overflow-x-hidden">
      {/* 1. EDITORIAL HEADER & BRAND BAR */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE6DF]/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Right side: Brand Logo / Name */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#8C8275] border-l border-[#D4C5B3] pl-3">
              HAUTE COUTURE
            </span>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-serif tracking-wider text-[#0B0B0B] font-medium uppercase">
                {businessName}
              </span>
              <span className="text-[10px] text-[#C5A059] tracking-[0.25em] font-mono">
                PARIS & ALGIERS
              </span>
            </div>
          </div>

          {/* Center: Delivery badge */}
          <div className="hidden md:flex items-center space-x-2 space-x-reverse text-xs text-[#5A554E] bg-[#F5F0EB] px-4 py-1.5 rounded-full border border-[#E8E1D7]">
            <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>توصيل سريع و مجاني إلى 58 ولاية • Livraison 58 Wilayas</span>
          </div>

          {/* Left side: Quick CTA button */}
          <button
            onClick={scrollToOrderForm}
            className="group relative inline-flex items-center space-x-2 space-x-reverse px-5 py-2.5 rounded-full bg-[#0B0B0B] text-[#FDFBF7] text-xs font-medium tracking-wider hover:bg-[#2C2C2A] transition-all duration-300 shadow-sm"
          >
            <span>طلب سريع</span>
            <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059] transition-transform group-hover:scale-110" />
          </button>
        </div>
      </header>

      {/* 2. EDITORIAL HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden border-b border-[#EAE6DF]">
        {/* Ambient Subtle Gradient & Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left/Main Column: Campaign Typography */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-6 space-y-8 z-10"
            >
              <div className="inline-flex items-center space-x-2 space-x-reverse px-3.5 py-1 rounded-full bg-[#F5F0EB] border border-[#E3DACD]">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-xs font-mono tracking-widest text-[#5A554E] uppercase">
                  {headline}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#0B0B0B] leading-[1.1] tracking-tight font-light">
                  {productName}
                </h1>
                <p className="text-lg md:text-xl text-[#5A554E] font-serif italic max-w-xl leading-relaxed">
                  "{subheadline}"
                </p>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline space-x-4 space-x-reverse pt-2">
                <span className="text-3xl md:text-4xl font-serif text-[#0B0B0B] font-normal tracking-tight">
                  {formatPrice(price)}
                </span>
                {originalPrice && (
                  <span className="text-xl font-serif text-[#8C8275] line-through opacity-70">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                {discountPercentage && (
                  <span className="inline-flex items-center text-xs font-mono px-3 py-1 rounded-full bg-[#0B0B0B] text-[#C5A059] border border-[#C5A059]/30">
                    <BadgePercent className="w-3 h-3 ml-1" />
                    وفر {discountPercentage}%
                  </span>
                )}
              </div>

              {/* Key Features Quick Icons */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EAE6DF]/80 text-xs text-[#5A554E]">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Award className="w-4 h-4 text-[#C5A059]" />
                  <span>حرير وقماش إيطالي ممتاز 100%</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>دفع بعد القياس والمعاينة</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                <button
                  onClick={scrollToOrderForm}
                  className="px-8 py-4 rounded-full bg-[#0B0B0B] text-[#FDFBF7] text-sm font-medium tracking-widest uppercase hover:bg-[#2C2C2A] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 space-x-reverse group"
                >
                  <span>اقتني الفخامة الآن • Commander</span>
                  <ArrowDown className="w-4 h-4 text-[#C5A059] group-hover:translate-y-1 transition-transform" />
                </button>
                <a
                  href="#gallery"
                  className="px-6 py-4 rounded-full bg-transparent border border-[#0B0B0B]/20 text-[#0B0B0B] text-sm font-medium tracking-wider hover:bg-[#0B0B0B]/5 transition-all text-center"
                >
                  استعراض الصور • Galerie
                </a>
              </div>
            </motion.div>

            {/* Right Column: High Fashion Hero Portrait */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[#EAE6DF] group">
                <img
                  src={images[selectedImage] || images[0]}
                  alt={productName}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/40 via-transparent to-transparent opacity-80" />

                {/* Magazine Overlay Badge */}
                <div className="absolute bottom-6 right-6 left-6 flex justify-between items-end text-white text-xs">
                  <div className="bg-[#0B0B0B]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                    <p className="font-serif italic text-sm text-[#E6D7C3]">
                      "Édition Limitée"
                    </p>
                    <p className="text-[10px] text-gray-300">
                      صنع بحرفية فائقة في الجزائر
                    </p>
                  </div>
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white transition-all shadow-md"
                    title="تكبير الصورة"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT GALLERY SECTION */}
      <section id="gallery" className="py-20 bg-[#F7F5F0] border-b border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#8C8275]">
              LOOKBOOK & DETAILS
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#0B0B0B]">
              معرض الصور الفاخرة
            </h2>
            <p className="text-sm text-[#5A554E] italic font-serif">
              انقر على أي صورة لمعاينتها بدقة عالية أو استكشاف التفاصيل الدقيقة للخياطة
            </p>
          </div>

          {/* Main Gallery Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Primary Large View */}
            <div className="lg:col-span-8 relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#EBE4DC] border border-[#EAE6DF] shadow-md group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={`${productName} view ${selectedImage + 1}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover object-center cursor-zoom-in"
                  onClick={() => setLightboxOpen(true)}
                />
              </AnimatePresence>

              {/* Navigation Controls */}
              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#FDFBF7]/80 hover:bg-[#FDFBF7] text-[#0B0B0B] transition-all shadow-md"
                aria-label="Previous image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#FDFBF7]/80 hover:bg-[#FDFBF7] text-[#0B0B0B] transition-all shadow-md"
                aria-label="Next image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="absolute top-4 right-4 bg-[#0B0B0B]/70 text-white text-xs font-mono px-3 py-1 rounded-full backdrop-blur-sm">
                {selectedImage + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Navigation Column */}
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-300 text-right ${selectedImage === idx
                    ? "border-[#0B0B0B] ring-2 ring-[#C5A059]/50 scale-[1.02]"
                    : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                  {selectedImage === idx && (
                    <div className="absolute bottom-2 right-2 bg-[#0B0B0B] text-[#C5A059] p-1 rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 & 5. SELECTORS: COLOR & SIZE SPECIFICATIONS */}
      <section className="py-16 bg-[#FDFBF7] border-b border-[#EAE6DF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F5F0EB] rounded-3xl p-8 md:p-12 border border-[#EAE6DF] shadow-sm space-y-10">
            {/* COLOR SELECTOR */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-serif text-[#0B0B0B] font-medium">
                  اللون المختار • Couleur Sélectionnée:
                </span>
                <span className="text-xs font-mono text-[#C5A059] font-medium">
                  {colors && colors[selectedColor] || "اللون الأساسي"}
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                {colors && colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`group relative flex items-center space-x-3 space-x-reverse px-4 py-2.5 rounded-full border transition-all duration-300 ${selectedColor === color
                      ? "bg-[#0B0B0B] text-white border-[#0B0B0B] shadow-md"
                      : "bg-white text-[#0B0B0B] border-[#E0D8CE] hover:border-[#0B0B0B]"
                      }`}
                  >
                    <span className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-300 flex-shrink-0" style={{ backgroundColor: color }}>

                    </span>
                    <span className="text-xs font-medium dir-rtl">
                      {color}
                    </span>
                    {selectedColor === color && (
                      <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* SIZE SELECTOR */}
            <div className="space-y-4 pt-6 border-t border-[#EAE6DF]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-serif text-[#0B0B0B] font-medium">
                  المقاس المتوفر • Taille Disponible:
                </span>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="inline-flex items-center space-x-1 space-x-reverse text-xs text-[#C5A059] hover:underline font-mono"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>دليل المقاسات • Guide des Tailles</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {sizes.map((sz, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-14 h-12 rounded-xl text-xs font-mono font-medium transition-all duration-200 flex items-center justify-center ${selectedSize === sz
                      ? "bg-[#0B0B0B] text-[#C5A059] border-2 border-[#C5A059] shadow-md scale-105"
                      : "bg-white text-[#0B0B0B] border border-[#E0D8CE] hover:border-[#0B0B0B]"
                      }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              <p className="text-xs text-[#8C8275] italic pt-2">
                * جميع المقاسات مطابقة للمعايير القياسية الباريسية (Standard Européen)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FASHION STORY & CRAFTSMANSHIP */}
      <section className="py-24 bg-[#0B0B0B] text-[#FDFBF7] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono tracking-[0.4em] uppercase text-[#C5A059]">
                L'ART DE LA HAUTE COUTURE
              </span>
              <h2 className="text-3xl md:text-5xl font-serif leading-tight font-light text-white">
                قصة الإتقان والفخامة الباريسية
              </h2>
              <p className="text-base md:text-lg text-[#D4C5B3] font-serif leading-relaxed">
                {description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs text-[#E6D7C3]">
                <div className="p-4 rounded-xl bg-[#171717] border border-[#2C2C2A] space-y-2">
                  <Scissors className="w-5 h-5 text-[#C5A059]" />
                  <h4 className="font-serif text-sm font-semibold text-white">
                    قصة وتفصيل يدوية
                  </h4>
                  <p className="text-[#A3998E]">
                    تمت الخياطة بدقة متناهية تحت إشراف خبراً الأزياء في الجزائر وباريس.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#171717] border border-[#2C2C2A] space-y-2">
                  <Box className="w-5 h-5 text-[#C5A059]" />
                  <h4 className="font-serif text-sm font-semibold text-white">
                    تغليف فاخر إهداء
                  </h4>
                  <p className="text-[#A3998E]">
                    تأتي القطعة داخل علبة حماية فاخرة توقيع الدار مجهزة للإهداء المباشر.
                  </p>
                </div>
              </div>
            </div>

            {/* Story Editorial Portrait */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-[#2C2C2A] shadow-2xl">
                <img
                  src={images[1] || images[0]}
                  alt="Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIFESTYLE CAMPAIGN BANNER */}
      <section className="relative py-32 bg-fixed bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${images[2] || images[0]})` }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white space-y-6">
          <span className="text-xs font-mono tracking-[0.5em] uppercase text-[#C5A059]">
            CAMPAIGN 2026
          </span>
          <h2 className="text-4xl md:text-6xl font-serif leading-tight">
            "الأناقة هي اللغة الوحيدة التي لا تفقد بريقها أبداً"
          </h2>
          <p className="text-sm md:text-base font-mono text-[#D4C5B3] uppercase tracking-widest">
            — MAISON D'ÉLÉGANCE EXCLUSIVE
          </p>
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS */}
      <section className="py-20 bg-[#FDFBF7] border-b border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono tracking-[0.3em] text-[#8C8275] uppercase">
              AVIS CLIENTS VERIFIÉS
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#0B0B0B]">
              آراء زبائننا الكرام
            </h2>
            <div className="flex items-center justify-center space-x-1 space-x-reverse text-[#C5A059] pt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="text-xs font-mono text-[#0B0B0B] mr-2">(5.0 / 5)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews?.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[#F5F0EB] p-8 rounded-2xl border border-[#EAE6DF] shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#C5A059]">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0B0B] text-[#C5A059]">
                      مشتري مؤكد
                    </span>
                  </div>
                  <p className="text-sm text-[#3A352E] font-serif leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E0D8CE] flex items-center justify-between text-xs">
                  <span className="font-serif font-bold text-[#0B0B0B]">
                    {rev.name}
                  </span>
                  <span className="text-[#8C8275] font-mono">
                    {rev.location || "الجزائر"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SOCIAL PROOF MASONRY GALLERY (IMAGES, AUDIO, VIDEO) */}
      <section className="py-20 bg-[#F7F5F0] border-b border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono tracking-[0.3em] text-[#8C8275] uppercase">
              TÉMOIGNAGES & MÉDIAS
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#0B0B0B]">
              تجارب حية ومعاينات مصورة
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {
              socialProof?.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FDFBF7] rounded-2xl overflow-hidden border border-[#EAE6DF] shadow-sm flex flex-col group"
                >
                  {item.type === "image" && item.url && (
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={item.url}
                        alt="Social proof"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {item.type === "video" && item.url && (
                    <div className="relative aspect-square overflow-hidden bg-black flex items-center justify-center">
                      <img
                        src={item.url}
                        alt="Video preview"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute p-4 rounded-full bg-[#0B0B0B]/80 text-[#C5A059] border border-[#C5A059]/40 cursor-pointer hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  {item?.type === "audio" && (
                    <div className="p-6 bg-[#0B0B0B] text-white flex-1 flex flex-col justify-between space-y-4">
                      <div className="flex items-center space-x-3 space-x-reverse text-[#C5A059]">
                        <Volume2 className="w-5 h-5 animate-pulse" />
                        <span className="text-xs font-mono">تسجيل صوتي لزبونة</span>
                      </div>

                      <div className="space-y-2">

                        <VoiceNotePlayer
                          src={item.url || ""}
                          playingAudioSrc={playingAudioSrc}
                          onPlay={setPlayingAudioSrc}
                          onPause={() => setPlayingAudioSrc(null)}
                        />
                      </div>
                    </div>
                  )}

                  {item.caption && (
                    <div className="p-4 text-xs font-serif text-[#5A554E] border-t border-[#EAE6DF]">
                      {item.caption}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 10. LUXURY FEATURES & SERVICE PILLARS */}
      <section className="py-20 bg-[#F5F0EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#EAE6DF] space-y-3">
              <Truck className="w-6 h-6 text-[#C5A059]" />
              <h3 className="font-serif font-semibold text-lg text-[#0B0B0B]">
                توصيل سريع لـ 58 ولاية
              </h3>
              <p className="text-xs text-[#5A554E] leading-relaxed">
                توصيل آمن وسريع باب المنزل في جميع الولايات الجزائرية في مدة قصيرة.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#EAE6DF] space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
              <h3 className="font-serif font-semibold text-lg text-[#0B0B0B]">
                معاينة وقيم قبل الدفع
              </h3>
              <p className="text-xs text-[#5A554E] leading-relaxed">
                دفع عند الاستلام مع إمكانية معاينة جودة القماش والقياس قبل تسليم المبلغ.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#EAE6DF] space-y-3">
              <Award className="w-6 h-6 text-[#C5A059]" />
              <h3 className="font-serif font-semibold text-lg text-[#0B0B0B]">
                خامات أوروبية عالية الجودة
              </h3>
              <p className="text-xs text-[#5A554E] leading-relaxed">
                أنسجة حريرية فاخرة وخياطة متقنة تضمن لك المتانة والأناقة المستمرة.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#EAE6DF] space-y-3">
              <RotateCcw className="w-6 h-6 text-[#C5A059]" />
              <h3 className="font-serif font-semibold text-lg text-[#0B0B0B]">
                ضمان الاستبدال
              </h3>
              <p className="text-xs text-[#5A554E] leading-relaxed">
                إمكانية تبديل المقاس بسهولة وسرعة في حال عدم مطابقة الخيار المطلوب.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL LUXURY CTA & ORDER FORM PLACEHOLDER INSERTION POINT */}
      <section ref={orderFormRef} className="py-24 bg-[#0B0B0B] text-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.4em] text-[#C5A059]">
              COMMANDE EXCLUSIVE
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white font-light">
              احجز قطعتك الفاخرة الآن
            </h2>
            <p className="text-sm md:text-base text-[#D4C5B3] font-serif italic max-w-xl mx-auto">
              تأكيد الطلب يستغرق أقل من دقيقة. الدفع يكون نقداً عند المعاينة والاستلام.
            </p>
          </div>

          {/* HERE IS THE REUSABLE ORDER FORM PLACEHOLDER */}
          {/* FashionOrderForm goes here */}
          <div className="bg-[#FDFBF7] text-[#0B0B0B] p-6 md:p-10 rounded-3xl shadow-2xl border border-[#C5A059]/40">
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
              primaryColor={page.page_config?.primaryColor || '#D4A373'}
            />
          </div>

          <div className="mt-8 text-center text-xs text-[#8C8275] font-mono space-y-2">
            <p>🔒 جميع المعاملات آمنة ومضمونة 100% مع خيار المعاينة قبل الدفع</p>
            <p>© 2026 {businessName} • Tous Droits Réservés • Haute Couture Algiers</p>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY FLOATING ORDER BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#0B0B0B]/95 backdrop-blur-md border-t border-[#2C2C2A] flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-[#8C8275]">السعر النهائي</span>
          <span className="text-lg font-serif font-semibold text-white">
            {formatPrice(price)}
          </span>
        </div>
        <button
          onClick={scrollToOrderForm}
          className="px-6 py-3 rounded-full bg-[#C5A059] text-[#0B0B0B] text-xs font-medium tracking-wider uppercase font-sans hover:bg-white transition-colors shadow-lg"
        >
          اطلب الآن • Commander
        </button>
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 left-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={images[selectedImage]}
              alt="Fullscreen detail view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIZE GUIDE MODAL */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FDFBF7] text-[#0B0B0B] p-8 rounded-3xl max-w-lg w-full space-y-6 shadow-2xl border border-[#EAE6DF]"
            >
              <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-4">
                <h3 className="font-serif text-xl font-semibold">
                  دليل المقاسات • Guide des Tailles
                </h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto text-xs font-mono">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-[#F5F0EB] text-[#0B0B0B]">
                      <th className="p-2 border border-[#EAE6DF]">المقاس</th>
                      <th className="p-2 border border-[#EAE6DF]">الصدر (cm)</th>
                      <th className="p-2 border border-[#EAE6DF]">الخصر (cm)</th>
                      <th className="p-2 border border-[#EAE6DF]">الأوراك (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-[#EAE6DF] font-bold">S / 36</td>
                      <td className="p-2 border border-[#EAE6DF]">82 - 86</td>
                      <td className="p-2 border border-[#EAE6DF]">62 - 66</td>
                      <td className="p-2 border border-[#EAE6DF]">88 - 92</td>
                    </tr>
                    <tr className="bg-[#F9F7F3]">
                      <td className="p-2 border border-[#EAE6DF] font-bold">M / 38</td>
                      <td className="p-2 border border-[#EAE6DF]">86 - 90</td>
                      <td className="p-2 border border-[#EAE6DF]">66 - 70</td>
                      <td className="p-2 border border-[#EAE6DF]">92 - 96</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#EAE6DF] font-bold">L / 40</td>
                      <td className="p-2 border border-[#EAE6DF]">90 - 94</td>
                      <td className="p-2 border border-[#EAE6DF]">70 - 74</td>
                      <td className="p-2 border border-[#EAE6DF]">96 - 100</td>
                    </tr>
                    <tr className="bg-[#F9F7F3]">
                      <td className="p-2 border border-[#EAE6DF] font-bold">XL / 42</td>
                      <td className="p-2 border border-[#EAE6DF]">94 - 98</td>
                      <td className="p-2 border border-[#EAE6DF]">74 - 78</td>
                      <td className="p-2 border border-[#EAE6DF]">100 - 104</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-[#8C8275] italic leading-relaxed">
                * في حال محتارة بين مقاسين، نوصي باختيار المقاس الأكبر، كما يمكنك تجربة القطعة أثناء التوصيل قبل دفع المبلغ.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
