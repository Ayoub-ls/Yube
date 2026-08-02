"use client"

import React, { useState } from "react";
import { OrderForm } from "../shared/OrderForm";
import type { TemplateProps } from '../types';


// Visual fallback imagery tailored for luxury car heating/cooling cup holder
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop", // Car interior console
  "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop", // Metallic automotive detail
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop", // Dark luxury car cockpit
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"  // Sport vehicle console
];

export default function Gadget({ page, client }: TemplateProps) {
  // Safe default props fallback
  const productName = page?.product_name || "حامل الأكواب الحراري للسيارة الذكي (2 في 1)";
  const headline = page?.page_config?.headline || "تكنولوجيا التبريد والتسخين الفائق للسيارات | Technologie Thermique Automobile";
  const subheadline = page?.page_config?.subheadline || "حافظ على مشروباتك مثلجة (-3°م) أو ساخنة (+65°م) طوال رحلتك في السيارة بكل سهولة وأمان";
  const price = page?.price || 8500;
  const originalPrice = page?.original_price || 12000;
  const businessName = client?.business_name || "لوكس درايف الجزائر | LUXDRIVE DZ";

  const images = (page?.product_images && page.product_images.length > 0)
    ? page.product_images
    : DEFAULT_IMAGES;

  const reviews = (page?.reviews && page.reviews.length > 0)
    ? page.reviews
    : null;

  // Interactive States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [thermalMode, setThermalMode] = useState<"cool" | "heat">("cool");
  const [reviewFilter, setReviewFilter] = useState<"all" | "5star">("all");
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Currency Formatter for DZD
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('fr-DZ').format(val) + " د.ج";
  };

  const scrollToOrder = () => {
    const el = document.getElementById("order-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredReviews = reviewFilter === "5star"
    ? reviews?.filter(r => r.rating === 5)
    : reviews;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black pb-28" dir="rtl">

      {/* Top Announcement Bar */}
      <div className="bg-[#111111] border-b border-white/10 py-2.5 px-4 text-center text-xs md:text-sm font-semibold tracking-wide text-zinc-300 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span>🇩🇿 توصيل سريع لجميع ولايات الجزائر الـ 58 | الدفع عند الاستلام بعد المعاينة والفحص</span>
        <span className="hidden md:inline text-white/20">|</span>
        <span className="hidden md:inline text-zinc-400 font-mono text-xs uppercase tracking-widest">Livraison 58 Wilayas</span>
      </div>

      {/* Navigation / Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 px-6 md:px-10 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white flex items-center justify-center rounded-sm font-black text-black text-xl italic font-serif">
              V
            </div>
            <div>
              <span className="text-lg md:text-xl font-bold tracking-tight uppercase italic text-white block">
                {businessName}
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-medium block">
                ÉQUIPEMENT AUTOMOBILE DE LUXE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 bg-white/5 px-3.5 py-1.5 rounded border border-white/10 text-xs font-semibold uppercase tracking-widest text-zinc-300">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>ضمان لمدة سنة كاملة | Garantie 1 An</span>
            </div>
            <button
              onClick={scrollToOrder}
              className="bg-white hover:bg-gray-200 text-black font-black px-5 py-2.5 rounded text-xs md:text-sm uppercase tracking-tighter transition-all transform active:scale-95 shadow-lg shadow-white/5"
            >
              اطلب الآن | Commander
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-12">

        {/* HERO SECTION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">

          {/* GALLERY & THERMAL DEMO SHOWCASE (Left/Top on Mobile) */}
          <div className="lg:col-span-7 space-y-5">

            {/* Main Stage Card */}
            <div className={`relative rounded-3xl bg-zinc-950 border transition-all duration-500 overflow-hidden shadow-2xl group ${thermalMode === 'cool'
              ? 'border-sky-500/30 shadow-sky-950/20'
              : 'border-red-500/30 shadow-red-950/20'
              }`}>

              {/* Thermal Mode Active Ambient Light Overlay */}
              <div className={`absolute inset-0 opacity-20 pointer-events-none transition-all duration-700 bg-gradient-to-tr ${thermalMode === 'cool'
                ? 'from-sky-900 via-transparent to-cyan-950'
                : 'from-red-900 via-transparent to-amber-950'
                }`} />

              {/* Badges Overlay */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-zinc-800 text-xs text-amber-400 font-bold tracking-wide">
                  ⭐ 4.9 / 5 (1,480+ تقييم)
                </span>
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-zinc-800 text-xs text-zinc-300 font-mono">
                  12V Plug & Play
                </span>
              </div>

              {/* Dynamic Temperature Reading Indicator */}
              <div className="absolute top-4 left-4 z-20">
                <div className={`px-3.5 py-1.5 rounded-2xl bg-black/90 border backdrop-blur-md flex items-center gap-2 font-mono text-xs font-bold transition-all shadow-xl ${thermalMode === 'cool'
                  ? 'border-sky-500/50 text-sky-400'
                  : 'border-red-500/50 text-red-400'
                  }`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${thermalMode === 'cool' ? 'bg-sky-400' : 'bg-red-500'
                    }`} />
                  <span>{thermalMode === 'cool' ? '-3°C تبريد سريع' : '+65°C تسخين فائق'}</span>
                </div>
              </div>

              {/* Main Product Image View */}
              <div className="relative aspect-4/3 md:aspect-16/10 w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
                <img
                  src={images[activeImageIndex]}
                  alt={productName}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Fullscreen Zoom Trigger */}
                <button
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute bottom-4 left-4 p-3 rounded-2xl bg-black/70 hover:bg-black border border-zinc-800 text-zinc-300 transition-all backdrop-blur-sm"
                  title="توسيع الصورة"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </button>
              </div>

              {/* Thermal Mode Switcher Controls */}
              <div className="p-4 bg-zinc-900/90 border-t border-zinc-800/80 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setThermalMode('cool')}
                  className={`py-3 px-4 rounded-2xl border font-bold text-xs md:text-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 ${thermalMode === 'cool'
                    ? 'bg-sky-950/60 border-sky-500 text-sky-300 shadow-lg shadow-sky-950/50 ring-1 ring-sky-500/50'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m9-9H3m15.364 6.364l-12.728-12.728m0 12.728l12.728-12.728" />
                  </svg>
                  <span>وضع التبريد (-3°C) | Froid</span>
                </button>

                <button
                  onClick={() => setThermalMode('heat')}
                  className={`py-3 px-4 rounded-2xl border font-bold text-xs md:text-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 ${thermalMode === 'heat'
                    ? 'bg-red-950/60 border-red-500 text-red-300 shadow-lg shadow-red-950/50 ring-1 ring-red-500/50'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  <span>وضع التسخين (+65°C) | Chaud</span>
                </button>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border transition-all ${activeImageIndex === idx
                    ? 'border-amber-400 ring-2 ring-amber-400/20 scale-105'
                    : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                >
                  <img src={imgUrl} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>

          {/* PRODUCT SPECIFICATIONS & ORDER DETAILS (Right Side) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>تكنولوجيا ألمانية متطورة للسيارات</span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mb-2">
                {productName}
              </h1>
              <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-sans">
                {headline}
              </p>
            </div>

            {/* Price Showcase Card */}
            <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-3 relative overflow-hidden">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight">
                  {formatPrice(price)}
                </span>
                {originalPrice && (
                  <span className="text-lg md:text-xl text-zinc-500 line-through font-mono">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>شامل التوصيل السريع لـ 58 ولاية + الضمان الكامل</span>
              </div>
            </div>

            {/* Description Summary */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 text-sm text-zinc-300 leading-relaxed space-y-2">
              <p>{subheadline}</p>
              <div className="pt-2 grid grid-cols-2 gap-2 text-xs text-zinc-400 border-t border-zinc-900 font-mono">
                <div>⚡ القوة: 12V / 36W</div>
                <div>🌡️ المدى: -3°C إلى 65°C</div>
                <div>🔇 الضوضاء: أقل من 30dB</div>
                <div>🚗 التوافق: جميع السيارات</div>
              </div>
            </div>

            {/* CTA Scroll Button */}
            <button
              onClick={scrollToOrder}
              className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-zinc-100 text-black font-black text-base md:text-lg transition-all transform active:scale-98 shadow-xl shadow-white/10 flex items-center justify-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>طلب مباشر - الدفع عند الاستلام | Commander</span>
            </button>

          </div>

        </div>

        {/* FEATURES GRID SECTION */}
        <section className="my-16 md:my-24 border-t border-zinc-900 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              لماذا يعتبر حامل الأكواب الحراري الخيار الأول في الجزائر؟
            </h2>
            <p className="text-sm text-zinc-400">
              Pourquoi choisir notre porte-gobelet chauffant et refroidissant ?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-sky-950/60 border border-sky-800/40 flex items-center justify-center text-sky-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">تبريد فائق لـ -3° مئوية</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                حافظ على المشروبات الغازية، العصائر، والمياه في قمة الانتعاش حتى في أشد أيام الصيف حرارة بالصحراء الجزائرية.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">تسخين سريع لـ +65° مئوية</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                استمتع بقهوتك، شايك، أو حليب الأطفال ساخناً في الرحلات والسفر الطويل دون الحاجة للتوقف في المقاهي.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">سهل التركيب (Plug & Play 12V)</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                يتصل بمقبس ولاعة السيارة 12V مباشرة بدون أي تعديلات كهربائية يناسب كافة أنواع السيارات والشاحنات.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">حماية الذكية للبطارية</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                مزود بنظام حماية ذكي يفصل الجهاز تلقائياً عند انخفاض الجهد لحماية بطارية سيارتك ومحركها.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">تشغيل صامت بدون ضجيج</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                مروحة تبريد توربينية فائقة الهدوء بمستوى صوت أقل من 30 ديسيبل لضمان راحتك وأناقة المقصورة.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">توصيل شامل لـ 58 ولاية</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                نضمن لك وصول الطلب حتى باب منزلك أو مقر عملك مع إمكانية فتح الطرد واختبار المنتج قبل دفع المباشر.
              </p>
            </div>

          </div>
        </section>

        {/* SOCIAL PROOF / ALGERIA CUSTOMER SHOWCASE */}
        {page?.social_proof && page.social_proof.length > 0 && (
          <section className="my-16 border-t border-zinc-900 pt-16">
            <h2 className="text-2xl font-black text-white text-center mb-8">
              تجارب عملائنا في مختلف الولايات | Photos & Vidéos Clients
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {page.social_proof.map((sp, idx) => (
                <div key={idx} className="rounded-2xl bg-zinc-950 border border-zinc-900 overflow-hidden">
                  {sp.url && (
                    <img src={sp.url} alt={`تجربة عميل ${idx + 1}`} className="w-full h-48 object-cover" />
                  )}
                  {sp.caption && (
                    <p className="p-4 text-xs text-zinc-300 font-sans">{sp.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ORDER FORM SECTION PLACEHOLDER RESERVED LOCATION */}
        <section id="order-section" className="my-16 scroll-mt-24">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
              طلب المنتج عبر نموذج الشراء المباشر
            </h2>
            <p className="text-xs text-zinc-400">
              Remplissez les informations ci-dessous pour confirmer votre commande
            </p>
          </div>

          {/* Reserved OrderForm Placeholder Integration */}
          <OrderForm
            pageId={page?.id}
            clientId={client?.id}
            pageSlug={client?.slug}
            productName={productName}
            price={price}
            primaryColor={page?.page_config?.primaryColor || "#0A0A0A"}
          />
        </section>

        {/* REVIEWS SECTION */}
        <section className="my-16 border-t border-zinc-900 pt-16 space-y-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl font-black text-white">4.9</span>
                <div className="flex text-amber-400 text-lg">★★★★★</div>
                <span className="text-xs text-zinc-400">({reviews?.length} تقييمات موثقة)</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                آراء وانطباعات الزبائن | Avis Clients Verified
              </h2>
            </div>

            {/* Filter controls */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-4 py-2 rounded-xl border transition-all ${reviewFilter === 'all'
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
              >
                جميع التقييمات ({reviews?.length})
              </button>
              <button
                onClick={() => setReviewFilter('5star')}
                className={`px-4 py-2 rounded-xl border transition-all ${reviewFilter === '5star'
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
              >
                5 نجوم فقط ★★★★★
              </button>
            </div>
          </div>

          {/* Review cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews?.map((rev, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-amber-400 text-sm">
                      {rev.name ? rev.name.charAt(0) : "Z"}
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">{rev.name}</span>
                      <span className="text-xs text-zinc-400 block">{rev.location || "الجزائر"}</span>
                    </div>
                  </div>
                  <div className="text-amber-400 text-sm">
                    {"★".repeat(rev.rating || 5)}
                  </div>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  "{rev.text}"
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>مشتري مؤكد | Acheteur Vérifié</span>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* FOOTER */}
        <footer className="mt-20 border-t border-zinc-900 pt-12 text-center text-xs text-zinc-500 space-y-4">
          <div className="flex justify-center items-center gap-6 text-zinc-400 font-medium">
            <span>توصيل 58 ولاية</span>
            <span>•</span>
            <span>الدفع عند الاستلام</span>
            <span>•</span>
            <span>ضمان الجودة 100%</span>
          </div>
          <p className="max-w-md mx-auto leading-relaxed">
            جميع الحقوق محفوظة © {new Date().getFullYear()} {businessName}. تجهيزات وإكسسوارات السيارات عالية الجودة بالجزائر.
          </p>
        </footer>

      </main>

      {/* FULLSCREEN IMAGE ZOOM MODAL */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={images[activeImageIndex]}
            alt="صورة مكبرة للمنتج"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-zinc-800"
          />
        </div>
      )}

      {/* STICKY MOBILE BOTTOM BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t border-zinc-900 p-3 backdrop-blur-lg flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-xs text-zinc-400 font-sans">السعر الاجمالي</span>
          <span className="text-lg font-black text-amber-400 font-mono">
            {formatPrice(price)}
          </span>
        </div>
        <button
          onClick={scrollToOrder}
          className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-extrabold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span>اطلب الآن | Commander</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

    </div>
  );
}
