'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Heart,
  Share2,
  Check,
  ChevronRight,
  ChevronLeft,
  Ruler,
  Play,
  Volume2,
  Instagram,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  Maximize2,
  Award,
  Globe,
  PhoneCall
} from 'lucide-react';
import { FashionOrderForm } from "../shared/FashionOrderForm";
import type { TemplateProps } from '../types';
import { VoiceNotePlayer } from '../shared/VoiceNotePlayer';



// High Quality Luxury Default Imagery for Algerian Women's Boutique
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop', // Elegant Silk Satin Dress
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', // Chic Evening Gown
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop', // Luxury Nude Couture
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop', // High Fashion Dress Detail
];



export default function WomansFashion({ page, client }: TemplateProps) {
  // Language State: 'ar' (Arabic - Primary) or 'fr' (French - Secondary)
  const [lang, setLang] = useState<'ar' | 'fr'>('ar');

  // Product Images
  const images = page?.product_images && page.product_images.length > 0
    ? page.product_images
    : DEFAULT_IMAGES;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [playingAudioSrc, setPlayingAudioSrc] = useState<string | null>(null);

  // Configuration options
  const colors = page?.page_config?.colors && page.page_config.colors.length > 0
    ? page.page_config.colors
    : ["الاسود", "البني"];

  const sizes = page?.page_config?.sizes && page.page_config.sizes.length > 0
    ? page.page_config.sizes
    : ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'];

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[1] || 'M (38)');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'fabric' | 'shipping'>('desc');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Calculated Pricing
  const price = page?.price || 8900;
  const originalPrice = page?.original_price || Math.round(price * 1.35);
  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 35;
  const primaryColor = page?.page_config?.primaryColor || '#b48c3a';

  // Headlines
  const headline = page?.page_config?.headline || (
    lang === 'ar'
      ? 'فستان السهرة الملكي من الحرير الفاخر'
      : 'Robe de Soirée Royale en Soie Luxe'
  );

  const subheadline = page?.page_config?.subheadline || (
    lang === 'ar'
      ? 'تصميم أنيق مستوحى من كبرى دور الأزياء العالمية مع لمسة أنثوية راقية تبرز جمالك'
      : 'Une création élégante inspirée des plus grandes maisons de couture avec une touche féminine raffinée'
  );

  const productName = page?.product_name || (
    lang === 'ar' ? 'فستان سهرة حريري فاخر - Tendance Haute Couture' : 'Robe de Soirée Silk Luxe - Édition Limitée'
  );

  const reviewsList = page?.reviews && page.reviews.length > 0 ? page.reviews : null;
  const socialProofList = page?.social_proof && page.social_proof.length > 0 ? page.social_proof : null;

  // Scroll smooth to order form placeholder
  const scrollToOrderForm = () => {
    const target = document.getElementById('order-form-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#faf7f2] font-sans text-[#1e293b] selection:bg-[#c5a059]/20 selection:text-[#8a6528]"
    >
      {/* 1. TOP ANNOUNCEMENT BAR (Algerian Ecommerce Trust) */}
      <div className="bg-[#1e293b] px-4 py-2.5 text-center text-xs font-medium text-[#f3e7cb]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-amber-200/90 text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-[#c5a059]" />
            <span>{lang === 'ar' ? 'تشكيلة صيف 2026 الحصرية' : 'Collection Exclusive 2026'}</span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4 w-full sm:w-auto text-center font-semibold text-xs">
            <span className="inline-flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-[#c5a059]" />
              {lang === 'ar' ? 'توصيل سريع لـ 58 ولاية' : 'Livraison rapide 58 Wilayas'}
            </span>
            <span className="text-[#c5a059]/40">•</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#c5a059]" />
              {lang === 'ar' ? 'الدفع عند الاستلام بعد المعاينة' : 'Paiement à la livraison'}
            </span>
          </div>

          {/* Language Selector Switcher */}
          <div className="flex items-center gap-1 bg-white/10 rounded-full p-0.5 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setLang('ar')}
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${lang === 'ar'
                ? 'bg-[#c5a059] text-slate-950 shadow-sm'
                : 'text-gray-300 hover:text-white'
                }`}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => setLang('fr')}
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${lang === 'fr'
                ? 'bg-[#c5a059] text-slate-950 shadow-sm'
                : 'text-gray-300 hover:text-white'
                }`}
            >
              Français
            </button>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION BAR */}
      <header className="sticky top-0 z-40 border-b border-[#e8decb]/60 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-[#c5a059] shadow-md shadow-slate-950/10">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1e293b] block">
                {client?.business_name || 'MAISON DE LUXE'}
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-[#8a6528] uppercase block">
                {lang === 'ar' ? 'أزياء نسائية فاخرة • الجزائر' : 'Haute Couture Féminine • Algérie'}
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all ${isFavorite
                ? 'border-rose-300 bg-rose-50 text-rose-500 shadow-sm'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              aria-label="Wishlist"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={scrollToOrderForm}
              className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-[#1e293b] px-5 py-2.5 text-xs font-bold text-[#f3e7cb] shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 hover:scale-[1.02]"
            >
              <ShoppingBag className="h-4 w-4 text-[#c5a059]" />
              <span>{lang === 'ar' ? 'طلب سريع الآن' : 'Commander Maintenant'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
        {/* 3. HERO & PRODUCT PRESENTATION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT/RIGHT COLUMN: GALLERY & IMAGES (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Interactive Image Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-[#e8decb]/80 shadow-xl shadow-amber-950/5 group">
              {/* Offer Badges */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <span className="rounded-full bg-[#1e293b] px-3.5 py-1.5 text-xs font-extrabold text-[#c5a059] shadow-lg backdrop-blur-md border border-[#c5a059]/30">
                  {lang === 'ar' ? 'تشكيلة حصرية 2026' : 'Nouvelle Collection'}
                </span>
                {discountPercent > 0 && (
                  <span className="rounded-full bg-rose-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-lg">
                    -{discountPercent}% {lang === 'ar' ? 'خصم خاص' : 'RÉDUCTION'}
                  </span>
                )}
              </div>

              {/* Free Delivery Tag inside Algeria */}
              <div className="absolute bottom-4 left-4 z-10 rounded-2xl bg-white/90 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-slate-800 border border-gray-200 shadow-md flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-[#8a6528]" />
                <span>{lang === 'ar' ? 'توصيل مجاني بالعاصمة' : 'Livraison Offerte sur Alger'}</span>
              </div>

              {/* Image Container with Smooth Animation */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    src={images[selectedImageIndex]}
                    alt={productName}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="h-full w-full object-cover object-top cursor-zoom-in transition-transform duration-700 group-hover:scale-105"
                    onClick={() => setIsZoomOpen(true)}
                  />
                </AnimatePresence>

                {/* Zoom hint icon button */}
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute top-4 left-4 z-10 rounded-full bg-white/80 p-2.5 text-slate-700 backdrop-blur-md shadow-md hover:bg-white hover:text-black transition-all"
                  aria-label="Zoom image"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              {/* Carousel Next/Prev Controls */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                    }
                    className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-800 backdrop-blur-md shadow-md transition-all hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-800 backdrop-blur-md shadow-md transition-all hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Bar */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${selectedImageIndex === idx
                      ? 'border-[#1e293b] ring-2 ring-[#c5a059] ring-offset-2'
                      : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PRODUCT DETAILS & OPTIONS (5 cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Header info & Title */}
            <div>
              {/* Category & Rating */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#1e293b]/5 px-3 py-1 text-xs font-bold text-[#8a6528]">
                  <Award className="h-3.5 w-3.5 text-[#c5a059]" />
                  {lang === 'ar' ? 'تشكيلة زارا وميشكي الفاخرة' : 'Inspiration Zara & Meshki'}
                </span>

                <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200/60">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>5.0</span>
                  <span className="text-gray-400">({reviewsList?.length ? reviewsList?.length + 124 : 0} {lang === 'ar' ? 'تقييم' : 'avis'})</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1e293b] leading-tight">
                {headline}
              </h1>

              {/* Subheadline */}
              <p className="mt-2 text-sm text-gray-600 leading-relaxed font-normal">
                {subheadline}
              </p>
            </div>

            {/* Price Box */}
            <div className="rounded-3xl bg-white p-5 border border-[#e8decb]/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="block text-xs font-medium text-gray-500">
                  {lang === 'ar' ? 'السعر الحالي (الدفع عند الاستلام)' : 'Prix Actuel (Paiement à la livraison)'}
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="font-serif text-3xl font-black text-[#1e293b]">
                    {price.toLocaleString('fr-DZ')} <span className="text-base font-sans font-bold text-[#8a6528]">د.ج / DA</span>
                  </span>
                  {originalPrice && (
                    <span className="text-sm font-semibold text-gray-400 line-through">
                      {originalPrice.toLocaleString('fr-DZ')} د.ج
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                  {lang === 'ar' ? 'متوفر في المخزون' : 'En Stock Disponibilité'}
                </span>
                <p className="mt-1 text-[11px] text-gray-500">
                  {lang === 'ar' ? 'تسليم خلال 24-48 ساعة' : 'Expédition sous 24h'}
                </p>
              </div>
            </div>

            {/* COLOR SELECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1e293b] text-sm">
                  {lang === 'ar' ? 'اختر اللون:' : 'Choisissez la Couleur:'}{' '}
                  <span className="text-[#8a6528] font-semibold">{colors[selectedColorIndex]}</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {colors.map((col, idx) => {
                  const isSelected = selectedColorIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`group relative flex items-center gap-2 rounded-2xl border-2 px-3.5 py-2 text-xs font-bold transition-all ${isSelected
                        ? 'border-[#1e293b] bg-white text-[#1e293b] shadow-md ring-2 ring-[#c5a059]/40'
                        : 'border-gray-200 bg-white/80 text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      <span className="relative flex h-5 w-5 overflow-hidden rounded-full border border-gray-300 shadow-inner" style={{ backgroundColor: col.startsWith('http') || col.startsWith('/') ? undefined : col }}>
                        {(col.startsWith('http') || col.startsWith('/')) && (
                          <img src={col} alt={col} className="h-full w-full object-cover" />
                        )}
                      </span>
                      <span>{col}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#8a6528]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIZE SELECTION & GUIDE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1e293b] text-sm">
                  {lang === 'ar' ? 'المقاس المتوفر:' : 'Taille Disponible:'}{' '}
                  <span className="text-[#8a6528] font-semibold">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#8a6528] hover:underline"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  {lang === 'ar' ? 'جدول المقاسات بالسنتمتر' : 'Guide des Tailles en cm'}
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`flex h-11 items-center justify-center rounded-2xl text-xs font-bold transition-all ${isSelected
                        ? 'bg-[#1e293b] text-[#c5a059] shadow-lg shadow-slate-900/20 ring-2 ring-[#c5a059]'
                        : 'bg-white text-slate-800 border border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DIRECT ORDER CTA BUTTON SCROLL */}
            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToOrderForm}
                className="w-full relative overflow-hidden rounded-2xl bg-[#1e293b] py-4 px-6 text-center text-sm font-extrabold text-[#f3e7cb] shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] group"
              >
                <div className="flex items-center justify-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-[#c5a059] group-hover:animate-bounce" />
                  <span>
                    {lang === 'ar'
                      ? 'اطلب الآن - الدفع عند الاستلام'
                      : 'Commander Maintenant - Paiement à la Livraison'}
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] text-amber-200/70 font-normal">
                  {lang === 'ar' ? 'توصيل سريع إلى 58 ولاية • عاين قبل الشراء' : 'Livraison rapide vers 58 Wilayas'}
                </div>
              </button>
            </div>

            {/* TRUST GUARANTEES BADGES */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 rounded-2xl bg-white p-3 border border-gray-100 shadow-sm">
                <Truck className="h-5 w-5 text-[#8a6528] flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[#1e293b] block">
                    {lang === 'ar' ? '58 ولاية جزائرية' : '58 Wilayas'}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {lang === 'ar' ? 'توصيل لباب المنزل' : 'Livraison à domicile'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl bg-white p-3 border border-gray-100 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-[#8a6528] flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[#1e293b] block">
                    {lang === 'ar' ? 'الدفع بعد المعاينة' : 'Paiement Sécurisé'}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {lang === 'ar' ? 'افحص طلبك أولاً' : 'Vérifiez avant de payer'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 4. ORDER FORM PLACEHOLDER SECTION */}
        <section id="order-form-section" className="mt-14 sm:mt-20">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold tracking-widest text-[#8a6528] uppercase">
              {lang === 'ar' ? 'تأكيد الطلب السريع' : 'Confirmation Rapide'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1e293b] mt-1">
              {lang === 'ar' ? 'اختر مقاسك ولونك ثم أكمل طلبك' : 'Choisissez vos options et validez'}
            </h2>
          </div>

          {/* Place order form placeholder here as strictly mandated by exact requirements */}
          <FashionOrderForm
            pageId={page?.id || 'page-101'}
            clientId={client?.id || 'client-dz'}
            pageSlug={page?.slug || 'femme-luxe-dz'}
            productName={productName}
            price={price}
            selectedColorName={colors[selectedColorIndex]}
            colors={colors}
            onColorChange={(color) => setSelectedColorIndex(colors.findIndex((c) => c === color))}
            selectedSize={selectedSize}
            sizes={sizes}
            onSizeChange={(sz) => setSelectedSize(sz)}
            primaryColor={primaryColor || '#1e293b'}
          />
        </section>

        {/* 5. TABS: DESCRIPTION, FABRIC & CARE, SHIPPING TIMELINE */}
        <section className="mt-16 sm:mt-24 rounded-3xl bg-white p-6 sm:p-10 border border-[#e8decb]/80 shadow-lg shadow-amber-950/5">
          <div className="flex border-b border-gray-100 overflow-x-auto gap-4 sm:gap-8 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('desc')}
              className={`font-serif text-base sm:text-lg font-bold pb-2 transition-all border-b-2 whitespace-nowrap ${activeTab === 'desc'
                ? 'border-[#1e293b] text-[#1e293b]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
            >
              {lang === 'ar' ? 'تفاصيل الفستان والقصة' : 'Description & Coupe'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fabric')}
              className={`font-serif text-base sm:text-lg font-bold pb-2 transition-all border-b-2 whitespace-nowrap ${activeTab === 'fabric'
                ? 'border-[#1e293b] text-[#1e293b]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
            >
              {lang === 'ar' ? 'نوع القماش والعناية' : 'Tissu & Entretien'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`font-serif text-base sm:text-lg font-bold pb-2 transition-all border-b-2 whitespace-nowrap ${activeTab === 'shipping'
                ? 'border-[#1e293b] text-[#1e293b]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
            >
              {lang === 'ar' ? 'الشحن لـ 58 ولاية' : 'Livraison 58 Wilayas'}
            </button>
          </div>

          <div className="mt-6 text-sm leading-relaxed text-gray-700">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <p>
                  {page?.description || (
                    lang === 'ar'
                      ? 'صُمم هذا الفستان خصيصاً للمرأة الجزائرية البحثة عن الفخامة والأناقة في المناسبات الكبيرة والأعراس. يتميز بقماش الحرير الفاخر ذو الانسيابية العالية مع تطريز دقيق وقصة تبرز الجمال الطبيعي بقالب عصري راقي مستوحى من كبرى الدور الفرنسية.'
                      : 'Créée spécialement pour la femme moderne à la recherche de glamour et d\'élégance. Confectionnée dans un satin de soie fluide de première qualité avec des finitions impeccables faites à la main.'
                  )}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#8a6528]" />
                    <span>{lang === 'ar' ? 'قماش حريري فاخر غير شفاف' : 'Soie lourde non transparente'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#8a6528]" />
                    <span>{lang === 'ar' ? 'سحاب مخفي مرن من الخلف' : 'Fermeture éclair invisible'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#8a6528]" />
                    <span>{lang === 'ar' ? 'قصة مريحة تناسب جسم المرأة' : 'Coupe flatteuse et confortable'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#8a6528]" />
                    <span>{lang === 'ar' ? 'إنهاء يدوي عالي الدقة' : 'Finitions haute couture'}</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'fabric' && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-[#faf7f2] p-4 border border-amber-900/10">
                  <h4 className="font-bold text-[#1e293b] mb-1">
                    {lang === 'ar' ? 'تركيبة التخيط:' : 'Composition du tissu:'}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {lang === 'ar' ? '95% حرير ساتان ناعم + 5% إيلاستين للتمدد الخفيف والراحة' : '95% Soie Satinée + 5% Élasthanne'}
                  </p>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <p>• {lang === 'ar' ? 'غسيل يدوي بماء بارد أو غسيل جاف (Dry Clean)' : 'Lavage à la main à l\'eau froide ou nettoyage à sec'}</p>
                  <p>• {lang === 'ar' ? 'كي بدرجة حرارة منخفضة جداً مع قطعة قماش عازلة' : 'Repassage à basse température avec pattemouille'}</p>
                  <p>• {lang === 'ar' ? 'تجنب استخدام المبيضات أو التجفيف الحراري' : 'Ne pas utiliser d\'eau de javel'}</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-[#faf7f2] p-4 text-center">
                    <MapPin className="h-6 w-6 text-[#8a6528] mx-auto mb-2" />
                    <h5 className="font-bold text-xs text-[#1e293b]">{lang === 'ar' ? 'العاصمة والمحيط' : 'Alger & Environs'}</h5>
                    <p className="text-xs text-gray-500 mt-1">24 ساعة (توصيل مجاني)</p>
                  </div>
                  <div className="rounded-2xl bg-[#faf7f2] p-4 text-center">
                    <Truck className="h-6 w-6 text-[#8a6528] mx-auto mb-2" />
                    <h5 className="font-bold text-xs text-[#1e293b]">{lang === 'ar' ? 'الولايات الكبرى (وهران، قسنطينة)' : 'Grandes Wilayas'}</h5>
                    <p className="text-xs text-gray-500 mt-1">48 - 72 ساعة</p>
                  </div>
                  <div className="rounded-2xl bg-[#faf7f2] p-4 text-center">
                    <Clock className="h-6 w-6 text-[#8a6528] mx-auto mb-2" />
                    <h5 className="font-bold text-xs text-[#1e293b]">{lang === 'ar' ? 'ولايات الجنوب والشمال' : 'Toutes les Wilayas'}</h5>
                    <p className="text-xs text-gray-500 mt-1">3 - 4 أيام عمل</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 7. SOCIAL PROOF & ALGERIAN BUYER AUDIOS/VIDEOS */}
        <section className="mt-16 sm:mt-24 rounded-3xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-xl mx-auto text-center mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-[#c5a059] border border-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              {lang === 'ar' ? 'ثقة ومصداقية 100%' : 'Preuves Sociales & Avis'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
              {lang === 'ar' ? 'آراء وتجارب الزبونات بالصوت والصورة' : 'Témoignages Réels des Clientes'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialProofList?.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs text-amber-200">
                    <span className="font-bold flex items-center gap-1">
                      {item.type === 'audio' && <Volume2 />}
                      {item.type === 'image' && <Instagram className="h-4 w-4 text-[#c5a059]" />}
                      {item.type === 'video' && <Play className="h-4 w-4 text-[#c5a059]" />}
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-300">
                      {lang === 'ar' ? 'زبونة موثقة' : 'Acheteuse vérifiée'}
                    </span>
                  </div>

                  {item.type === 'image' && item.url && (
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/20">
                      <img src={item.url} alt="Customer Proof" className="h-full w-full object-cover" />
                    </div>
                  )}

                  {item.type === 'audio' && (
                    <div className="rounded-xl bg-black/40 p-4 mb-3 border border-white/10 ">

                      <VoiceNotePlayer
                        src={item.url || ""}
                        playingAudioSrc={playingAudioSrc}
                        onPlay={setPlayingAudioSrc}
                        onPause={() => setPlayingAudioSrc(null)}
                      />

                    </div>
                  )}

                  {item.type === 'video' && item.url && (
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/20 group cursor-pointer">
                      <img src={item.url} alt="Video preview" className="h-full w-full object-cover opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="h-12 w-12 rounded-full bg-[#c5a059] text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="h-5 w-5 fill-slate-950 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-200 leading-relaxed font-normal">
                    {item.caption || (lang === 'ar' ? 'تجربة ممتازة وتوصيل في قمة السرعة' : 'Superbe expérience')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. ALGERIAN REVIEWS SECTION */}
        <section className="mt-16 sm:mt-24">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1e293b]">
              {lang === 'ar' ? 'تقييمات العملاء في الجزائر' : 'Avis Clients Vérifiés en Algérie'}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {lang === 'ar' ? 'أكثر من 500+ زبونة راضية في جميع الولايات' : 'Plus de 500 clientes satisfaites'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsList?.map((rev, index) => (
              <div
                key={index}
                className="rounded-3xl bg-white p-6 border border-[#e8decb]/80 shadow-md shadow-amber-950/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf7f2] font-serif font-bold text-[#8a6528]">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1e293b]">{rev.name}</h4>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#8a6528]" />
                          {rev.location || (lang === 'ar' ? 'الجزائر' : 'Algérie')}
                        </span>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{rev.text}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {lang === 'ar' ? 'تم الشراء والمعاينة' : 'Achat vérifié'}
                  </span>
                  <span>منذ 3 أيام</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 9. STICKY MOBILE BOTTOM BAR */}
      <div className="sticky bottom-0 z-40 lg:hidden border-t border-[#e8decb] bg-white/95 backdrop-blur-md px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <span className="block text-[10px] text-gray-500">{selectedSize} • {colors[selectedColorIndex]}</span>
            <span className="font-serif text-lg font-black text-[#1e293b]">
              {price.toLocaleString('fr-DZ')} <span className="text-xs font-sans text-[#8a6528]">د.ج</span>
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToOrderForm}
            className="flex-1 rounded-2xl bg-[#1e293b] px-4 py-3 text-center text-xs font-extrabold text-[#f3e7cb] shadow-lg shadow-slate-950/20 active:scale-95 transition-transform"
          >
            {lang === 'ar' ? 'اطلب الآن (دفع عند الاستلام)' : 'Commander Maintenant'}
          </button>
        </div>
      </div>

      {/* 10. LUXURY FOOTER */}
      <footer className="mt-20 border-t border-[#e8decb] bg-[#1e293b] text-white py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#f3e7cb]">
              {client?.business_name || 'MAISON DE LUXE'}
            </span>
            <p className="mt-2 text-xs text-gray-300 leading-relaxed">
              {lang === 'ar'
                ? 'متجر أزياء نسائية فاخر متخصص في فساتين السهرة الكوتور في الجزائر. جودة مضمونة وتوصيل لجميع الولايات.'
                : 'Boutique en ligne de haute couture féminine en Algérie. Qualité certifiée et livraison 58 wilayas.'}
            </p>
          </div>

          <div className="space-y-2 text-xs text-gray-300">
            <h4 className="font-bold text-[#c5a059]">{lang === 'ar' ? 'خدمة العملاء والضمان' : 'Service Client'}</h4>
            <p>• {lang === 'ar' ? 'توصيل سريع لجميع الـ 58 ولاية' : 'Livraison rapide 58 Wilayas'}</p>
            <p>• {lang === 'ar' ? 'الدفع نقدًا عند الاستلام' : 'Paiement à la livraison'}</p>
            <p>• {lang === 'ar' ? 'إمكانية معاينة وتجريب المقاس' : 'Essayage à la livraison'}</p>
          </div>

          <div className="space-y-2 text-xs text-gray-300">
            <h4 className="font-bold text-[#c5a059]">{lang === 'ar' ? 'تواصل معنا' : 'Contact'}</h4>
            <p className="flex items-center justify-center md:justify-start gap-1 text-amber-100">
              <PhoneCall className="h-3.5 w-3.5 text-[#c5a059]" />
              {page?.whatsapp || '+213 550 00 00 00'}
            </p>
            <p className="text-[11px] text-gray-400">الجزائر العاصمة - Algérie</p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-[11px] text-gray-400">
          © {new Date().getFullYear()} {client?.business_name || 'Maison de Luxe'}. Tous droits réservés. Designed for Algerian Market.
        </div>
      </footer>

      {/* SIZE GUIDE MODAL */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-gray-200"
            >
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-4 left-4 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Ruler className="h-5 w-5 text-[#8a6528]" />
                <h3 className="font-serif text-lg font-bold text-[#1e293b]">
                  {lang === 'ar' ? 'جدول القياسات بالسنتمتر (cm)' : 'Guide des Tailles (cm)'}
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#faf7f2] text-[#1e293b]">
                      <th className="p-2.5 border border-gray-200 font-bold">{lang === 'ar' ? 'المقاس' : 'Taille'}</th>
                      <th className="p-2.5 border border-gray-200 font-bold">{lang === 'ar' ? 'الصدر' : 'Poitrine'}</th>
                      <th className="p-2.5 border border-gray-200 font-bold">{lang === 'ar' ? 'الخصر' : 'Taille'}</th>
                      <th className="p-2.5 border border-gray-200 font-bold">{lang === 'ar' ? 'الورك' : 'Hanches'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    <tr>
                      <td className="p-2.5 border font-bold bg-[#faf7f2]/50">S (36)</td>
                      <td className="p-2.5 border">84 - 88 cm</td>
                      <td className="p-2.5 border">64 - 68 cm</td>
                      <td className="p-2.5 border">90 - 94 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border font-bold bg-[#faf7f2]/50">M (38)</td>
                      <td className="p-2.5 border">88 - 92 cm</td>
                      <td className="p-2.5 border">68 - 72 cm</td>
                      <td className="p-2.5 border">94 - 98 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border font-bold bg-[#faf7f2]/50">L (40)</td>
                      <td className="p-2.5 border">92 - 96 cm</td>
                      <td className="p-2.5 border">72 - 76 cm</td>
                      <td className="p-2.5 border">98 - 102 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border font-bold bg-[#faf7f2]/50">XL (42)</td>
                      <td className="p-2.5 border">96 - 102 cm</td>
                      <td className="p-2.5 border">76 - 82 cm</td>
                      <td className="p-2.5 border">102 - 108 cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-[11px] text-gray-500 text-center">
                {lang === 'ar'
                  ? 'ملاحظة: القياسات مضبوطة بدقة. إذا كنت بين مقاسين ننصح باختيار المقاس الأكبر.'
                  : 'Si vous hésitez entre deux tailles, nous vous conseillons d\'opter pour la taille supérieure.'}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX ZOOM MODAL */}
      <AnimatePresence>
        {isZoomOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 z-50 rounded-full bg-white/20 p-3 text-white hover:bg-white/40"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={images[selectedImageIndex]}
              alt={productName}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
