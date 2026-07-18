'use client';

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Battery,
  ShieldCheck,
  Smartphone,
  Star,
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  Truck,
  CreditCard,
  Users,
  Award,
  AlertCircle,
  Gift
} from "lucide-react";
import AudioReviews from "./AudioReviews";
import { PremiumOrderForm } from "./PremiumOrderForm";
import { getOptimizedImageUrl } from "../../../lib/upload";
import type { TemplateProps } from "../types";
import "./premium.css";

export function PremiumTemplate({ page, client, theme }: TemplateProps) {
  const colors = page.page_config?.colors || [];
  const sizes = page.page_config?.sizes || [];
  const audioProofs = page.social_proof?.filter((p) => p.type === 'audio' && p.url) || [];
  const fallbackImage = page.product_images[0] || '';

  // Setup state
  const initialImage = colors.length > 0 ? colors[0].url : fallbackImage;
  const [activeImage, setActiveImage] = useState<string>(initialImage);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '');
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [showStickyCTA, setShowStickyCTA] = useState<boolean>(false);

  // Sync active image with state changes
  useEffect(() => {
    const initialImg = colors.length > 0 ? colors[0].url : fallbackImage;
    setActiveImage(initialImg);
    setSelectedColorIdx(0);
    setSelectedSize(sizes[0] || '');
  }, [page.product_images, colors, sizes, fallbackImage]);

  const orderFormRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const audioReviewsRef = useRef<HTMLDivElement>(null);

  // Sync active image when color changes
  const handleColorChange = (idx: number) => {
    setSelectedColorIdx(idx);
    const colorUrl = colors[idx]?.url;
    if (colorUrl) {
      setActiveImage(colorUrl);
    }
  };

  const handleThumbnailClick = (imgUrl: string) => {
    setActiveImage(imgUrl);
    const colorIdx = colors.findIndex(c => c.url === imgUrl);
    if (colorIdx !== -1) {
      setSelectedColorIdx(colorIdx);
    }
  };

  // Image Gallery list
  const galleryImages = colors.length > 0 ? colors.map(c => c.url) : page.product_images;

  // Features mapping
  const defaultFeatures = [
    {
      title: "بطارية تدوم طويلاً",
      description: "شحنة واحدة تكفي لعدة أيام من العمل المتواصل بدون انقطاع.",
      iconName: "Battery"
    },
    {
      title: "سهل الاستخدام والتكامل",
      description: "يدعم الاتصال والأجهزة المحمولة مع واجهة تشغيل باللغة العربية.",
      iconName: "Smartphone"
    },
    {
      title: "صناعة فاخرة ممتازة",
      description: "تم اختباره واختياره بعناية لتقديم أرقى تجربة استخدام تليق بكم.",
      iconName: "Award"
    }
  ];

  const features = page.page_config?.features || defaultFeatures;

  function getFeatureIcon(iconName: string) {
    switch (iconName) {
      case 'Award': return <Award className="w-5 h-5" />;
      case 'Shield': return <ShieldCheck className="w-5 h-5" />;
      case 'Gift': return <Gift className="w-5 h-5" />;
      case 'Battery': return <Battery className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  }

  // Reviews mapping
  const defaultReviews = [
    {
      name: "عبد الرحمن التميمي",
      location: "الجزائر العاصمة",
      rating: 5,
      text: "المنتج مذهل وتصميمه غاية في الأناقة والجمال. التوصيل كان سريع جداً والدفع عند الاستلام مريح."
    },
    {
      name: "سارة الشمري",
      location: "وهران",
      rating: 5,
      text: "اشتريت المنتج وطلع يجنن. جودة تضاهي المنتجات العالمية وبسعر مناسب جداً."
    },
    {
      name: "فيصل المطيري",
      location: "قسنطينة",
      rating: 5,
      text: "خدمة العملاء سريعة جداً وساعدوني في اختيار مقاسي الصحيح. السلعة ممتازة وخفيفة للغاية."
    },
    {
      name: "ليلى الهاشم",
      location: "عنابة",
      rating: 5,
      text: "المنتج جودته ممتازة جداً والتغليف فخم يشبه تغليف المجوهرات الفاخرة. استجابة سريعة وخامته متينة."
    }
  ];

  const displayReviews = page.reviews && page.reviews.length > 0 ? page.reviews : defaultReviews;

  // Social Proof stats
  const stats = [
    {
      id: 1,
      number: "+10,000",
      label: "عميل سعيد",
      sublabel: "ثقة متبادلة وتجربة مميزة",
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 2,
      number: "98٪",
      label: "نسبة رضا",
      sublabel: "تقييمات متميزة للمنتج والخدمة",
      icon: <Award className="w-6 h-6" />
    },
    {
      id: 3,
      number: "الدفع",
      label: "عند الاستلام",
      sublabel: "افحص المنتج بكل طمأنينة قبل الدفع",
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      id: 4,
      number: "شحن",
      label: "سريع وآمن",
      sublabel: "لباب بيتك خلال 24-48 ساعة",
      icon: <Truck className="w-6 h-6" />
    }
  ];

  // Scroll handler for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      if (orderFormRef.current) {
        const formTop = orderFormRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (window.scrollY > 500 && formTop > windowHeight - 100) {
          setShowStickyCTA(true);
        } else {
          setShowStickyCTA(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const headline = page.page_config?.headline || `تألق مع ${page.product_name}`;
  const subheadline = page.page_config?.subheadline || page.description || '';
  const hasDiscount = !!(page.original_price && page.original_price > page.price);
  const discountAmount = hasDiscount ? (page.original_price! - page.price) : 0;
  const activeColorName = colors.length > 0 ? colors[selectedColorIdx]?.name : '';

  return (
    <div dir="rtl" className="premium-theme min-h-screen antialiased selection:bg-[var(--color-gold-accent)]/20 selection:text-[var(--color-gold-accent)]">

      {/* 1. Header */}
      <header className="h-16 flex items-center justify-between px-6 md:px-10 border-b border-[#EAE6E1] bg-white/50 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-sm bg-[var(--color-gold-accent)]">
            <span>{client.business_name[0]?.toUpperCase() || 'Y'}</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">{client.business_name}</span>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium opacity-75">
          <button onClick={() => scrollToSection(galleryRef)} className="hover:text-[var(--color-gold-accent)] transition-colors cursor-pointer">معرض الصور</button>
          <button onClick={() => scrollToSection(galleryRef)} className="hover:text-[var(--color-gold-accent)] transition-colors cursor-pointer">المميزات</button>
          <button onClick={() => scrollToSection(reviewsRef)} className="hover:text-[var(--color-gold-accent)] transition-colors cursor-pointer">آراء العملاء</button>
          <button onClick={() => scrollToSection(audioReviewsRef)} className="hover:text-[var(--color-gold-accent)] transition-colors cursor-pointer">تجارب صوتية</button>
          <button onClick={() => scrollToSection(orderFormRef)} className="hover:text-[var(--color-gold-accent)] transition-colors cursor-pointer">طلب الشراء</button>
        </nav>

        <button
          onClick={() => scrollToSection(orderFormRef)}
          className="text-white px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 hover:bg-[var(--color-gold-dark)] bg-[var(--color-gold-accent)]"
          id="header_cta_btn"
        >
          <ShoppingBag className="w-4 h-4" />
          اطلب الآن
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-16">

        {/* SECTION 1: Hero */}
        <section className="relative overflow-hidden py-12 md:py-20">
          <div className="grid md:grid-cols-12 gap-12 items-center">

            {/* Hero text */}
            <div className="md:col-span-7 text-right space-y-6 md:space-y-8 z-10">
              <div className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-[var(--color-gold-accent)]">
                <span className="w-8 h-[1px] bg-[var(--color-gold-accent)]"></span>
                الإصدار الحصري المميز
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-[#1A1A1A]">
                {headline}
              </h1>

              {subheadline && (
                <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
                  {subheadline}
                </p>
              )}

              {/* Promo elements */}
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600">
                <span className="bg-[#F5F2EF] px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-gold-accent)]"></span>
                  شحن آمن لجميع الولايات
                </span>
                <span className="bg-[#F5F2EF] px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-gold-accent)]"></span>
                  الدفع نقداً بعد المعاينة عند الاستلام
                </span>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => scrollToSection(orderFormRef)}
                  className="text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2 bg-[var(--color-gold-accent)] hover:bg-[var(--color-gold-dark)] shadow-[var(--color-gold-accent)]/20"
                  id="hero_cta_order"
                >
                  <ShoppingBag className="w-5 h-5" />
                  اطلب الآن
                </button>
                <button
                  onClick={() => scrollToSection(galleryRef)}
                  className="bg-white border border-[#EAE6E1] text-gray-700 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all cursor-pointer flex items-center justify-center gap-1"
                  id="hero_cta_more"
                >
                  شاهد المزيد
                  <ArrowLeft className="w-4 h-4 mr-1" />
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="md:col-span-5 relative flex justify-center">
              <div className="absolute inset-0 rounded-full filter blur-3xl w-72 h-72 mx-auto my-auto opacity-70 bg-[var(--color-gold-accent)]/10"></div>
              <div className="relative bg-white rounded-[2rem] p-6 shadow-sm border border-[#EAE6E1] max-w-sm w-full">
                <div className="aspect-square rounded-2xl overflow-hidden bg-[#F5F2EF] relative">
                  {activeImage ? (
                    <img
                      src={getOptimizedImageUrl(activeImage, 600)}
                      alt={page.product_name}
                      className="w-full h-full object-cover animate-fadeIn"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">لا توجد صورة</div>
                  )}
                  <div className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm bg-[var(--color-gold-accent)]">
                    الأكثر مبيعاً
                  </div>
                </div>

                {/* Micro metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-[var(--color-luxury-bg)] p-3 rounded-xl border border-[#EAE6E1]">
                    <div className="text-[10px] text-gray-400 font-semibold">الضمان والموثوقية</div>
                    <div className="font-bold text-[#1A1A1A] mt-0.5">أصلي 100%</div>
                  </div>
                  <div className="bg-[var(--color-luxury-bg)] p-3 rounded-xl border border-[#EAE6E1]">
                    <div className="text-[10px] text-gray-400 font-semibold">التوصيل والسرعة</div>
                    <div className="font-bold text-[#1A1A1A] mt-0.5">سريع وآمن</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2 & 3: Product Gallery & Information */}
        <section ref={galleryRef} className="py-8">
          <div className="grid md:grid-cols-12 gap-8 items-start">

            {/* Gallery Section */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#EAE6E1] flex flex-col gap-4">
                <div className="aspect-square bg-[#F5F2EF] rounded-2xl overflow-hidden relative">
                  {activeImage ? (
                    <img
                      src={getOptimizedImageUrl(activeImage, 600)}
                      alt={page.product_name}
                      className="w-full h-full object-cover transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">لا توجد صورة</div>
                  )}
                  {hasDiscount && (
                    <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm text-[var(--color-gold-accent)]">
                      وفر {discountAmount.toLocaleString('ar-DZ')} دج
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {galleryImages.length > 1 && (
                  <div className="flex gap-3 justify-center overflow-x-auto py-1">
                    {galleryImages.map((img, index) => {
                      const isSelected = activeImage === img;
                      return (
                        <button
                          key={index}
                          onClick={() => handleThumbnailClick(img)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                            isSelected ? "scale-95 shadow-sm border-[var(--color-gold-accent)]" : "border-[#EAE6E1] opacity-60 hover:opacity-100"
                          }`}
                          id={`gallery_thumb_${index}`}
                        >
                          <img src={getOptimizedImageUrl(img, 200)} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Information & Features Section */}
            <div className="md:col-span-7 space-y-6">
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-[#EAE6E1] space-y-6">

                {/* Heading & Pricing */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end pb-4 border-b border-[#EAE6E1]">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A]">{page.product_name}</h2>
                      <p className="text-xs text-gray-400 mt-1">منتج متميز وراقٍ</p>
                    </div>

                    <div className="text-left">
                      <div className="text-2xl md:text-3xl font-bold text-[var(--color-gold-accent)]">{page.price.toLocaleString('ar-DZ')} دج</div>
                      {hasDiscount && (
                        <div className="text-sm text-gray-400 line-through">{page.original_price?.toLocaleString('ar-DZ')} دج</div>
                      )}
                    </div>

                    {hasDiscount && (
                      <div className="bg-[#F5F2EF] px-3 py-1.5 rounded-full text-xs font-bold text-[var(--color-gold-accent)]">
                        تخفيض خاص
                      </div>
                    )}
                  </div>
                </div>

                {/* Color Selector */}
                {colors.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-[#EAE6E1]">
                    <label className="text-xs font-bold text-gray-400 block">اختر اللون المفضل:</label>
                    <div className="flex items-center gap-3 flex-wrap">
                      {colors.map((color, idx) => {
                        const isSelected = selectedColorIdx === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleColorChange(idx)}
                            className={`w-10 h-10 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                              isSelected ? "border-[var(--color-gold-accent)] ring-4 ring-[var(--color-gold-accent)]/10 scale-105" : "border-[#EAE6E1] hover:scale-105"
                            }`}
                            title={color.name}
                            id={`color_selector_${idx}`}
                          >
                            <span className="w-7 h-7 rounded-full overflow-hidden block">
                              <img src={getOptimizedImageUrl(color.url, 100)} className="w-full h-full object-cover" alt={color.name} />
                            </span>
                          </button>
                        );
                      })}
                      {activeColorName && (
                        <span className="text-xs text-gray-600 font-medium mr-1">{activeColorName}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {sizes.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-400 block">المقاس المطلوب:</label>
                      <button
                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                        className="text-xs hover:underline font-bold cursor-pointer text-[var(--color-gold-accent)]"
                      >
                        دليل اختيار القياسات الصحيحة
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {sizes.map(size => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-11 h-11 rounded-xl border text-sm font-bold transition-all cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? "bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-sm"
                                : "bg-[var(--color-luxury-bg)] border-[#EAE6E1] text-[#1A1A1A] hover:border-gray-400"
                            }`}
                            id={`size_selector_${size}`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>

                    {showSizeGuide && (
                      <div className="p-4 bg-[#F5F2EF] rounded-2xl border border-[#EAE6E1] text-xs text-gray-600 space-y-2 animate-fadeIn">
                        <p className="font-bold text-[#1A1A1A]">كيف تختار القياس الصحيح؟</p>
                        <p>تأكد من اختيار المقاس الأقرب لمقاساتك المعتادة.</p>
                        <p className="text-[10px] text-gray-400">ملاحظة: يمكنك إتمام الطلب الآن وسيتواصل معك موظفنا هاتفياً لمساعدتك في تأكيد مقاسك بدقة بالغة.</p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => scrollToSection(orderFormRef)}
                  className="w-full text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer bg-[var(--color-gold-accent)] hover:bg-[var(--color-gold-dark)] shadow-md shadow-[var(--color-gold-accent)]/10"
                >
                  <ShoppingBag className="w-5 h-5" />
                  احجز طلبك الآن بقيمة {page.price.toLocaleString('ar-DZ')} دج
                </button>

              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: Customer Reviews */}
        <section ref={reviewsRef} className="py-8 space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1 bg-[#F5F2EF] px-4 py-1.5 rounded-full text-sm font-extrabold shadow-sm border border-[#EAE6E1] text-[var(--color-gold-accent)]">
              ⭐ 4.9 من 5
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">تجارب عملائنا الكرام</h2>
            <div className="w-12 h-0.5 mx-auto rounded-full bg-[var(--color-gold-accent)]"></div>
            <p className="text-sm text-gray-500">
              تقييمات حقيقية وموثقة من مختلف الولايات والمناطق.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayReviews.slice(0, 4).map((review, idx) => (
              <div key={idx} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-[#EAE6E1] flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3 text-right">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-[#EAE6E1] bg-[var(--color-luxury-bg)] flex items-center justify-center font-bold text-sm">
                      {review.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-[#1A1A1A]">{review.name}</h4>
                      <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3 fill-emerald-100" />
                        عميل موثق
                      </div>
                    </div>
                  </div>

                  <div className="flex text-amber-400 justify-end">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    "{review.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                  <span>{review.location || 'شراء مؤكد'}</span>
                  <span className="bg-[var(--color-luxury-bg)] px-2 py-0.5 rounded border border-[#EAE6E1]">طلب مأكد</span>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* Audio Social Proof Section */}
        <div ref={audioReviewsRef} className="scroll-mt-20">
          <AudioReviews proofs={audioProofs} />
        </div>

        {/* Dynamic Image/Video Social Proof Section */}
        {page.social_proof && page.social_proof.some(p => p.type !== 'audio' && p.url) && (
          <section className="py-8 bg-white rounded-[2.5rem] border border-[#EAE6E1] p-6 md:p-10 space-y-6 shadow-sm">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">معاينة واقعية للمنتج 📸</h3>
              <div className="w-12 h-0.5 mx-auto rounded-full bg-[var(--color-gold-accent)]"></div>
              <p className="text-xs text-gray-500">معاينة الصور والفيديوهات المسجلة للتأكد من جودة وتفاصيل المنتج.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {page.social_proof
                .filter(p => p.type !== 'audio' && p.url)
                .map((proof, i) => (
                  <div key={i} className="border border-[#EAE6E1] rounded-2xl p-3 bg-[var(--color-luxury-bg)] space-y-2">
                    {proof.type === 'image' && (
                      <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                        <img src={getOptimizedImageUrl(proof.url!, 600)} alt={proof.caption || ""} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    {proof.type === 'video' && (
                      <video controls src={proof.url} className="w-full rounded-xl aspect-video bg-black"></video>
                    )}
                    {proof.caption && <p className="text-xs text-center text-gray-500 font-medium">{proof.caption}</p>}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* SECTION 5: Social Proof (Stats) */}
        <section className="py-8 space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-[#1A1A1A]">شريك موثوق ومستدام</h2>
            <div className="w-12 h-0.5 mx-auto rounded-full bg-[var(--color-gold-accent)]"></div>
            <p className="text-sm text-gray-500">
              نحن نحرص على تقديم أفضل تجربة ممكنة بدءاً من جودة المنتج إلى سلاسة الشحن وسرعة استجابة الدعم الفني.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.id} className="bg-white/40 p-6 rounded-2xl border border-[#EAE6E1] flex flex-col justify-center text-center hover:bg-white transition-all duration-300 shadow-sm relative group overflow-hidden">
                <div className={`absolute top-0 inset-x-0 h-1 bg-[#EAE6E1] group-hover:bg-[var(--color-gold-accent)] transition-all ${stat.id === 1 ? 'bg-[var(--color-gold-accent)]' : ''}`}></div>

                <div className="mx-auto p-2.5 bg-[#F5F2EF] rounded-full mb-3 text-[var(--color-gold-accent)]">
                  {stat.icon}
                </div>

                <div className="text-2xl font-bold tracking-tight text-[var(--color-gold-accent)]">{stat.number}</div>
                <div className="text-xs md:text-sm text-[#1A1A1A] font-bold mt-1">{stat.label}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{stat.sublabel}</div>
              </div>
            ))}
          </div>

        </section>

        {/* Dynamic Features List */}
        <section className="py-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">مميزات حصرية تميز هذا المنتج ✨</h3>
            <div className="w-12 h-0.5 mx-auto rounded-full bg-[var(--color-gold-accent)]"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAE6E1] space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-[var(--color-gold-accent)]"></div>
                <div className="p-3 bg-[#F5F2EF] w-12 h-12 rounded-xl flex items-center justify-center text-[var(--color-gold-accent)]">
                  {getFeatureIcon(feat.iconName)}
                </div>
                <h3 className="font-extrabold text-gray-800 text-base">{feat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feat.description || feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: Order Form */}
        <section ref={orderFormRef} className="py-12 max-w-xl mx-auto">
          <PremiumOrderForm
            pageId={page.id}
            clientId={client.id}
            pageSlug={page.slug}
            productName={page.product_name}
            price={page.price}
            selectedColorName={activeColorName || ''}
            selectedSize={selectedSize}
            sizes={sizes}
            onSizeChange={setSelectedSize}
            primaryColor="var(--color-gold-accent)"
          />
        </section>

      </main>

      {/* Sticky Mobile CTA */}
      {showStickyCTA && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#EAE6E1] shadow-lg p-3 z-50 flex md:hidden items-center justify-between animate-slideUp">
          <div className="text-right">
            <div className="text-[10px] text-gray-400 font-bold">{page.product_name}</div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-[var(--color-gold-accent)]">{page.price.toLocaleString('ar-DZ')} دج</span>
              {hasDiscount && (
                <span className="text-[10px] text-gray-400 line-through">{page.original_price?.toLocaleString('ar-DZ')} دج</span>
              )}
            </div>
          </div>
          <button
            onClick={() => scrollToSection(orderFormRef)}
            className="text-white text-xs font-bold py-2.5 px-6 rounded-full cursor-pointer hover:bg-[var(--color-gold-dark)] transition-colors bg-[var(--color-gold-accent)]"
          >
            اطلب الآن
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#EAE6E1] py-12 px-4 text-[#1A1A1A]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#EAE6E1]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[var(--color-gold-accent)]"></div>
              <span className="font-bold text-lg">{client.business_name}</span>
            </div>
            <p className="text-[11px] text-gray-400">جميع الحقوق محفوظة © {new Date().getFullYear()} {client.business_name}</p>
          </div>
          <div className="flex justify-center gap-6 text-[11px] text-gray-500">
            <span className="hover:text-[var(--color-gold-accent)] cursor-pointer">من نحن</span>
            <span className="hover:text-[var(--color-gold-accent)] cursor-pointer">سياسة الخصوصية</span>
            <span className="hover:text-[var(--color-gold-accent)] cursor-pointer">سياسة الضمان والاسترجاع</span>
            <span className="hover:text-[var(--color-gold-accent)] cursor-pointer">الدعم الفني</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default PremiumTemplate;
