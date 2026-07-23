'use client';

import React, { useState, useRef, useEffect } from "react";
import { 
  Check, 
  Star, 
  Search, 
  Heart, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  DollarSign, 
  Volume2, 
  Menu, 
  X,
  Sparkles,
  ArrowRight,
  Phone,
  User,
  MapPin,
  HelpCircle,
  Play,
  Pause
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getOptimizedImageUrl } from "../../../lib/upload";
import { SimpleOrderForm } from "./SimpleOrderForm";
import "./simple.css";
import type { TemplateProps } from "../types";

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL'];

// Helper to render stars
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? 'fill-current' : 'opacity-30'}`} 
        />
      ))}
    </div>
  );
}

// Custom Waveform Audio Player for Audio Social Proofs
function AudioProofPlayer({ url, name, location, caption, primaryColor }: { url: string; name?: string; location?: string; caption?: string; primaryColor: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const frequencies = [15, 30, 45, 25, 60, 40, 75, 50, 35, 20, 45, 80, 55, 30, 65, 45, 20, 35, 50, 60, 40, 25, 15, 30, 45, 20];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative flex flex-col justify-between rounded-2xl border bg-white p-5 transition-all duration-300 border-[#E5E7EB] hover:border-[#1E3A8A]/40 hover:shadow-sm">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <div className="space-y-4">
        {/* Header: User Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 border border-[#E5E7EB] flex items-center justify-center text-slate-500 font-bold text-sm">
              {name ? name.trim().charAt(0) : "ز"}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">{name || "زبون موثق"}</h3>
              <p className="text-xs text-[#6B7280]">{location || 'الجزائر'} • مشتري مؤكد ✓</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-650">
            رأي صوتي
          </span>
        </div>

        {/* Audio Player Core Box */}
        <div className="rounded-xl bg-[#F9FAFB] p-4 border border-[#E5E7EB]">
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={handlePlayPause}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-all duration-200 active:scale-95 ${
                isPlaying 
                  ? 'bg-[#22C55E] hover:bg-[#22C55E]/90 ring-4 ring-[#22C55E]/20' 
                  : 'hover:opacity-90'
              }`}
              style={!isPlaying ? { backgroundColor: primaryColor } : {}}
              aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل الصوت"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white translate-x-[-1px]" />
              )}
            </button>

            {/* Interactive Waveform Visualizer */}
            <div className="flex flex-1 items-center justify-between h-10 gap-[2px]">
              {frequencies.map((height, idx) => {
                const activeFactor = isPlaying ? 0.7 + Math.sin((currentTime / (duration || 1)) * 15 + idx) * 0.3 : 0.4;
                const finalHeight = Math.max(12, height * activeFactor);
                const played = duration > 0 && (currentTime / duration) * frequencies.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-[3px] rounded-full transition-all duration-100 ${
                      isPlaying 
                        ? played 
                          ? 'bg-[#22C55E]' 
                          : 'bg-[#E5E7EB]'
                        : 'bg-gray-300'
                    }`}
                    style={{ height: `${finalHeight}%` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Timeline & Progress Indicator */}
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#6B7280]">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Transcript text / Caption */}
        {caption && (
          <blockquote className="text-sm italic text-slate-650 leading-relaxed bg-slate-50 p-3 rounded-lg border-l-2" style={{ borderLeftColor: primaryColor }}>
            "{caption}"
          </blockquote>
        )}
      </div>

      {/* Micro satisfaction badge */}
      <div className="mt-5 flex items-center justify-between border-t border-[#E5E7EB] pt-4 text-xs font-semibold text-[#6B7280]">
        <StarRating rating={5} />
        <span>تقييم الخدمة 5/5</span>
      </div>
    </div>
  );
}

export function SimpleTemplate({ page, client, theme }: TemplateProps) {
  const images = page.product_images || [];
  const colors = page.page_config?.colors || [];
  const sizes = page.page_config?.sizes || DEFAULT_SIZES;
  const audioProofs = page.social_proof?.filter((p) => p.type === 'audio' && p.url) || [];
  const imageProofs = page.social_proof?.filter((p) => p.type === 'image' && p.url) || [];
  const videoProofs = page.social_proof?.filter((p) => p.type === 'video' && p.url) || [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[Math.floor(sizes.length / 2)] || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeImage = colors.length > 0 ? colors[selectedColorIdx]?.url : images[activeImageIndex];
  const activeColorName = colors.length > 0 ? colors[selectedColorIdx]?.name : '';

  const hasDiscount = !!(page.original_price && page.original_price > page.price);
  const headline = page.page_config?.headline || page.product_name;
  const subheadline = page.page_config?.subheadline || page.description;

  const features = page.page_config?.features || [
    "توصيل سريع ومباشر إلى باب المنزل أو مقر عملك",
    "الدفع عند الاستلام بعد فحص السلعة ومعاينتها",
    "ضمان الجودة الحقيقية مع سرعة التجاوب والاستبدال",
    "منتج أصلي 100% مستورد بجودة عالية للتصنيع"
  ];

  const benefits = [
    {
      title: "توصيل سريع وآمن",
      desc: "نقوم بالتوصيل لكافة الولايات في وقت قياسي وبطريقة آمنة تضمن سلامة منتجك.",
      icon: Truck,
    },
    {
      title: "الدفع عند الاستلام",
      desc: "لا داعي لأي دفع مسبق، تفقد طلبك أولاً عند وصول الموزع ثم ادفع نقداً بكل أريحية.",
      icon: DollarSign,
    },
    {
      title: "ضمان الجودة",
      desc: "جميع المعروضات مضمونة ومطابقة تماماً للوصف والصور المرفقة مع سياسة استبدال مرنة.",
      icon: ShieldCheck,
    },
    {
      title: "دعم متواصل",
      desc: "فريق خدمة العملاء متواجد للإجابة على استفساراتك ومتابعة طلبيتك حتى تصلك.",
      icon: HelpCircle,
    }
  ];

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="simple-theme min-h-screen bg-white text-[#111827] selection:bg-slate-100" dir="rtl">
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          
          {/* Icons Left */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => scrollToSection("checkout-form")}
              className="relative rounded-full p-2 text-[#6B7280] transition-colors hover:bg-[#F9FAFB]" 
              style={{ color: theme.primary }}
              aria-label="سلة التسوق"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-[#22C55E]"></span>
            </button>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full p-2 text-[#6B7280] transition-colors hover:bg-[#F9FAFB] md:hidden"
              aria-label="القائمة الرئيسية"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Nav Links Center */}
          <nav className="hidden items-center gap-8 md:flex">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-semibold transition-colors" style={{ color: theme.primary }}>الرئيسية</button>
            <button onClick={() => scrollToSection("product-details")} className="font-medium text-[#6B7280] hover:text-[#111827] transition-colors">تفاصيل المنتج</button>
            <button onClick={() => scrollToSection("social-proof")} className="font-medium text-[#6B7280] hover:text-[#111827] transition-colors">آراء الزبائن</button>
            <button onClick={() => scrollToSection("checkout-form")} className="font-medium text-[#6B7280] hover:text-[#111827] transition-colors">اطلب الآن</button>
          </nav>

          {/* Logo Right */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm" style={{ backgroundColor: theme.primary }}>
              <Volume2 className="h-6 w-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight" style={{ color: theme.primary }}>{client.business_name}</span>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[#E5E7EB] bg-white md:hidden"
            >
              <div className="space-y-1 px-4 py-3 pb-4">
                <button 
                  onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setIsMobileMenuOpen(false); }}
                  className="block w-full py-2 text-right font-semibold"
                  style={{ color: theme.primary }}
                >
                  الرئيسية
                </button>
                <button 
                  onClick={() => scrollToSection("product-details")}
                  className="block w-full py-2 text-right font-medium text-[#6B7280]"
                >
                  المنتج
                </button>
                <button 
                  onClick={() => scrollToSection("social-proof")}
                  className="block w-full py-2 text-right font-medium text-[#6B7280]"
                >
                  آراء الزبائن
                </button>
                <button 
                  onClick={() => scrollToSection("checkout-form")}
                  className="block w-full py-2 text-right font-medium text-[#6B7280]"
                >
                  اطلب الآن
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Left Column: Product Image Container */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl bg-[#F9FAFB] p-6 sm:p-12 border border-[#E5E7EB] flex justify-center items-center">
              {activeImage ? (
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={getOptimizedImageUrl(activeImage, 800)} 
                  alt={page.product_name} 
                  className="max-h-[350px] w-auto object-contain sm:max-h-[450px]"
                />
              ) : (
                <div className="text-slate-350 text-sm py-12">لا توجد صورة للمنتج</div>
              )}
              {hasDiscount && (
                <div className="absolute top-4 right-4 rounded-full bg-[#22C55E] px-3 py-1 text-xs font-bold text-white shadow-sm">
                  عرض خاص
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Product Content Info */}
          <div className="order-1 flex flex-col justify-center space-y-6 lg:order-2">
            <div>
              <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700">
                منتج موثوق ومميز
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl md:text-5xl leading-tight">
                {headline}
              </h1>
              {subheadline && (
                <p className="mt-4 text-lg text-[#6B7280] leading-relaxed">
                  {subheadline}
                </p>
              )}
            </div>

            {/* Pricing block */}
            <div className="flex items-baseline gap-4 rounded-xl bg-[#F9FAFB] p-4 border border-[#E5E7EB] w-fit">
              <span className="text-3xl font-black" style={{ color: theme.primary }}>
                {page.price.toLocaleString('ar-DZ')} دج
              </span>
              {hasDiscount && page.original_price && (
                <>
                  <span className="text-lg text-[#6B7280] line-through">
                    {page.original_price.toLocaleString('ar-DZ')} دج
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[#22C55E]/10 px-2.5 py-0.5 text-xs font-bold text-[#22C55E]">
                    وفر {(page.original_price - page.price).toLocaleString('ar-DZ')} دج
                  </span>
                </>
              )}
            </div>

            {/* Feature Checkmarks */}
            <ul className="space-y-3">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/10 text-[#22C55E] mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-semibold text-[#111827]">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Call to action & trust triggers */}
            <div className="space-y-4 pt-2">
              <button 
                onClick={() => scrollToSection("checkout-form")}
                style={{ backgroundColor: theme.primary }}
                className="group flex w-full items-center justify-center gap-3 rounded-xl px-8 py-4 text-base font-bold text-white shadow-md transition-all hover:opacity-95 hover:shadow-lg focus:outline-none active:scale-[0.98] cursor-pointer"
              >
                اطلب الآن
                <ArrowRight className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </button>
              
              <div className="flex items-center justify-center gap-6 text-sm font-semibold text-[#6B7280]">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-[#22C55E]" />
                  توصيل سريع وآمن
                </span>
                <span className="h-4 w-[1px] bg-[#E5E7EB]"></span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-[#22C55E]" />
                  الدفع عند الاستلام
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Product Gallery Section */}
      {images.length > 1 && (
        <section className="bg-[#F9FAFB] py-12 border-y border-[#E5E7EB]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                معرض صور وتفاصيل المنتج
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-[#6B7280]">
                تصفح صور المنتج المختلفة بدقة عالية للتعرف على الجودة والتصميم.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-3xl">
              {/* Active image showcase with animation */}
              <div className="relative aspect-square w-full max-w-xl mx-auto overflow-hidden rounded-2xl bg-white p-6 sm:p-12 border border-[#E5E7EB] shadow-sm flex items-center justify-center">
                <motion.img 
                  key={activeImageIndex + "-gallery"}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={getOptimizedImageUrl(images[activeImageIndex], 800)} 
                  alt="تفاصيل المنتج" 
                  className="max-h-[300px] w-auto object-contain sm:max-h-[380px]"
                />
              </div>

              {/* Thumbnail list */}
              <div className="mt-6 grid grid-cols-4 gap-4 max-w-xl mx-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className="relative aspect-square overflow-hidden rounded-xl border-2 bg-white p-2 transition-all cursor-pointer"
                    style={{ borderColor: activeImageIndex === idx ? theme.primary : '#E5E7EB' }}
                  >
                    <img src={getOptimizedImageUrl(img, 200)} alt={`مصغر منتج ${idx + 1}`} className="h-full w-full object-contain" />
                    {activeImageIndex === idx && (
                      <span className="absolute inset-0 bg-slate-900/5"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Information Section */}
      <section id="product-details" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          
          {/* Right Column: Key Details */}
          <div className="space-y-6">
            <div className="border-b border-[#E5E7EB] pb-4">
              <span className="text-sm font-bold" style={{ color: theme.primary }}>المواصفات الأساسية</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                تفاصيل متميزة توفر لك أفضل تجربة اقتناء
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] py-3">
                <span className="font-bold text-[#111827]">اسم المنتج</span>
                <span className="text-[#6B7280]">{page.product_name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] py-3">
                <span className="font-bold text-[#111827]">السعر الحالي</span>
                <span className="text-lg font-black" style={{ color: theme.primary }}>{page.price.toLocaleString('ar-DZ')} دج</span>
              </div>
              {page.whatsapp && (
                <div className="flex items-center justify-between border-b border-[#E5E7EB] py-3">
                  <span className="font-bold text-[#111827]">تواصل واتساب</span>
                  <a href={`https://wa.me/${page.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline" style={{ color: theme.primary }}>
                    اضغط هنا للتواصل معنا
                  </a>
                </div>
              )}
            </div>

            {page.description && (
              <div className="rounded-xl bg-[#F9FAFB] p-5 border border-[#E5E7EB]">
                <h3 className="font-bold text-[#111827]">وصف المنتج</h3>
                <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                  {page.description}
                </p>
              </div>
            )}

            {/* Color variants selector if available */}
            {colors.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-sm font-bold text-slate-700 block">الألوان المتوفرة:</span>
                <div className="flex flex-wrap gap-2.5">
                  {colors.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColorIdx(idx)}
                      className="px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer"
                      style={{ 
                        borderColor: selectedColorIdx === idx ? theme.primary : '#E5E7EB',
                        backgroundColor: selectedColorIdx === idx ? '#F9FAFB' : 'white',
                      }}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Left Column: Benefits Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {benefits.map((benefit, idx) => {
              const IconComp = benefit.icon;
              return (
                <div key={idx} className="flex flex-col rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-all hover:shadow-md" style={{ borderRightWidth: '4px', borderRightColor: theme.primary }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 mb-4" style={{ color: theme.primary }}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#111827]">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Audio & Video & Image Proofs (Social Proofs) */}
      {(audioProofs.length > 0 || imageProofs.length > 0 || videoProofs.length > 0) && (
        <section id="social-proof" className="bg-white py-16 border-t border-[#E5E7EB]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-100">
                ★ تجارب واقعية وحقيقية
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                مراجعات وتجارب عملائنا الكرام
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-[#6B7280]">
                شاركنا زبائننا الكرام تجربتهم للمنتج وآرائهم حول التوصيل والجودة.
              </p>
            </div>

            {/* Audio reviews grid */}
            {audioProofs.length > 0 && (
              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {audioProofs.map((item, idx) => (
                  <AudioProofPlayer
                    key={idx}
                    url={item.url!}
                    caption={item.caption}
                    primaryColor={theme.primary}
                    name={`مشتري ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Video & Image reviews grid */}
            {(imageProofs.length > 0 || videoProofs.length > 0) && (
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {videoProofs.map((item, idx) => (
                  <div key={`video-${idx}`} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 space-y-3">
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video controls className="w-full rounded-xl max-h-[300px] object-cover shadow-sm bg-black" src={item.url} />
                    {item.caption && <p className="text-xs text-[#6B7280] text-center italic">"{item.caption}"</p>}
                  </div>
                ))}
                {imageProofs.map((item, idx) => (
                  <div key={`image-${idx}`} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 space-y-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getOptimizedImageUrl(item.url!, 600)} alt={item.caption || "تجربة العميل"} className="w-full rounded-xl max-h-[300px] object-cover shadow-sm" />
                    {item.caption && <p className="text-xs text-[#6B7280] text-center italic">"{item.caption}"</p>}
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>
      )}

      {/* Customer Reviews Text Cards */}
      {page.reviews && page.reviews.length > 0 && (
        <section className="bg-[#F9FAFB] py-16 border-y border-[#E5E7EB]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {/* Header & Overall stats */}
            <div className="flex flex-col items-center justify-between gap-6 border-b border-[#E5E7EB] pb-8 sm:flex-row">
              <div className="text-center sm:text-right">
                <h2 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                  تقييمات زبائننا الكرام
                </h2>
                <p className="mt-2 text-sm text-[#6B7280]">
                  التقييمات مأخوذة مباشرة من تعليقات الزبائن الذين اقتنوا المنتج وجربوه.
                </p>
              </div>
              
              <div className="flex flex-col items-center rounded-xl bg-white px-6 py-4 border border-[#E5E7EB] shadow-sm">
                <span className="text-3xl font-black text-[#111827]">4.9</span>
                <StarRating rating={5} />
                <span className="text-xs font-semibold text-[#6B7280] mt-1.5">مشتري مؤكد ✓</span>
              </div>
            </div>

            {/* Reviews Cards */}
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {page.reviews.map((review, idx) => (
                <div key={idx} className="flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    
                    {/* Rating & stars */}
                    <div className="flex items-center justify-between">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-[#6B7280]">مشتري مؤكد ✓</span>
                    </div>

                    {/* Review Text */}
                    <p className="text-sm text-[#111827] leading-relaxed font-medium">
                      "{review.text}"
                    </p>
                  </div>

                  {/* User Info footer */}
                  <div className="mt-6 flex items-center gap-3 border-t border-[#E5E7EB] pt-4">
                    <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {review.name.trim().charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#111827]">{review.name}</h4>
                      <p className="text-xs text-[#6B7280]">{review.location || "زبون موثق"}</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* Social Proof Trust Badges Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold tracking-wider uppercase" style={{ color: theme.primary }}>لماذا تشتري من متجرنا؟</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
            نحن نضمن لك خدمة تسوق استثنائية
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 mb-4" style={{ color: theme.primary }}>
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">أكثر من 10,000 عميل</h3>
            <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">سعداء جداً بخدمتهم في جميع الولايات الجزائرية.</p>
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 mb-4" style={{ color: theme.primary }}>
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">توصيل سريع</h3>
            <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">تنسيق فوري للمبيعات والشحن السريع لعنوانك.</p>
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 mb-4" style={{ color: theme.primary }}>
              <DollarSign className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">الدفع عند الاستلام</h3>
            <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">ادفع فقط للموزع عندما تستلم منتجك باليد.</p>
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 mb-4" style={{ color: theme.primary }}>
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">ضمان حقيقي</h3>
            <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">ندعم زبائننا بسياسة استبدال مرنة وسريعة جداً.</p>
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section className="bg-[#F9FAFB] py-16 border-t border-[#E5E7EB]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
              اطلب الآن للحصول على العرض
            </h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              املأ معلوماتك بالأسفل للتأكيد الفوري والشحن.
            </p>
          </div>

          <SimpleOrderForm
            pageId={page.id}
            clientId={client.id}
            pageSlug={page.slug}
            productName={page.product_name}
            price={page.price}
            selectedColorName={activeColorName || ''}
            selectedSize={selectedSize}
            sizes={sizes}
            onSizeChange={setSelectedSize}
            primaryColor={theme.primary}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-8">
        <div className="mx-auto max-w-7xl px-4 flex flex-col items-center justify-between gap-4 sm:px-6 lg:px-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ backgroundColor: theme.primary }}>
              <Volume2 className="h-5 w-5" />
            </div>
            <span className="text-base font-extrabold" style={{ color: theme.primary }}>{client.business_name}</span>
          </div>

          <p className="text-xs text-[#6B7280]">
            حقوق الطبع والنشر © {new Date().getFullYear()} {client.business_name}. جميع الحقوق محفوظة.
          </p>

          <div className="flex gap-4 text-xs text-[#6B7280]">
            <a href="#" className="hover:text-slate-900 transition-colors">سياسة الخصوصية</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-900 transition-colors">شروط الخدمة</a>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 sm:hidden z-45 shadow-lg flex items-center justify-between gap-4">
        <a
          href="#checkout-form"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("checkout-form");
          }}
          className="flex-1 text-center text-white font-black text-sm py-3.5 rounded-xl block cursor-pointer"
          style={{ backgroundColor: theme.primary }}
        >
          اطلب الآن
        </a>
        <div className="text-left shrink-0">
          <div className="text-[10px] text-slate-500 font-semibold text-right">السعر:</div>
          <div className="text-base font-black" style={{ color: theme.primary }}>
            {page.price.toLocaleString('ar-DZ')} دج
          </div>
        </div>
      </div>

    </div>
  );
}
