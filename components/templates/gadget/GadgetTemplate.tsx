'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Truck, ShieldCheck, RefreshCw, X, Star, MessageSquare } from 'lucide-react';
import { getOptimizedImageUrl } from '../../../lib/upload';
import { VoiceNotePlayer } from '../shared/VoiceNotePlayer';
import { GadgetOrderForm } from './GadgetOrderForm';
import './gadget.css';
import type { TemplateProps } from '../types';

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL'];

export function GadgetTemplate({ page, client, theme }: TemplateProps) {
  const colors = page.page_config?.colors || [];
  const sizes = page.page_config?.sizes || DEFAULT_SIZES;
  const audioProofs = page.social_proof.filter((p) => p.type === 'audio' && p.url);
  const imageProofs = page.social_proof.filter((p) => p.type === 'image' && p.url);
  const fallbackImage = page.product_images[0] || '';

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[Math.floor(sizes.length / 2)] || '');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const images = page.product_images.length > 0 ? page.product_images : [fallbackImage];
  const activeImage = colors.length > 0 ? colors[selectedColorIdx]?.url : images[activeImageIdx];
  const activeColorName = colors.length > 0 ? colors[selectedColorIdx]?.name : '';
  const hasDiscount = !!(page.original_price && page.original_price > page.price);

  const headline = page.page_config?.headline || `اكتشف الصوت الفائق مع ${page.product_name}`;
  const subheadline = page.page_config?.subheadline || page.description;

  const handleThumbnailClick = (idx: number) => {
    setActiveImageIdx(idx);
    if (colors.length > 0) {
      // Clear selected color so thumbnail takes precedence, or match color if possible
    }
  };

  const handleCheckoutScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' });
    setIsCartOpen(false);
  };

  // Scroll reveal helper
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="gadget-theme min-h-screen bg-[#faf8fe] text-[#1a1b1f] pb-24 relative overflow-x-hidden antialiased">
      
      {/* 1. Announcement Bar */}
      <div className="bg-[#d8e2ff] text-[#001a41] py-2 px-4 text-center text-xs font-bold flex justify-center items-center gap-4 border-b border-[#c1c6d7]">
        <span className="inline-flex items-center gap-1">⚡ شحن سريع لجميع الولايات</span>
        <span className="hidden sm:inline opacity-30">|</span>
        <span className="inline-flex items-center gap-1">🛡️ ضمان الجودة والدفع عند الاستلام</span>
      </div>

      {/* 2. Header */}
      <header className="sticky top-0 bg-[#faf8fe]/80 backdrop-blur-md border-b border-[#eeedf3] py-4 px-6 z-40 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center">
          {/* Utility Icons (Left) */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-[#eeedf3] rounded-full transition relative cursor-pointer"
              aria-label="حقيبة التسوق"
            >
              <ShoppingBag className="w-5 h-5 text-[#1a1b1f]" />
              <span className="absolute -top-0.5 -right-0.5 bg-[#0058bc] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                1
              </span>
            </button>
            <button className="p-2 hover:bg-[#eeedf3] rounded-full transition cursor-pointer" aria-label="بحث">
              <Search className="w-5 h-5 text-[#1a1b1f]" />
            </button>
          </div>

          {/* Centered Business Name */}
          <a href="#" className="text-xl font-bold tracking-tight text-[#1a1b1f] hover:text-[#0058bc] transition">
            {client.business_name}
          </a>

          {/* Navigation Links (Right) */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#product-details" className="text-sm font-semibold hover:text-[#0058bc] transition">تفاصيل المنتج</a>
            <a href="#reviews" className="text-sm font-semibold hover:text-[#0058bc] transition">آراء العملاء</a>
            <a href="#checkout-form" className="text-sm font-semibold hover:text-[#0058bc] transition">طلب سريع</a>
          </nav>
        </div>
      </header>

      {/* 3. Left Sliding Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-start">
          {/* Overlay */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          ></div>
          
          {/* Content */}
          <div className="relative w-full max-w-sm bg-white h-full shadow-[10px_0_35px_rgba(0,0,0,0.1)] flex flex-col z-10 animate-[slideIn_0.3s_ease-out] text-right">
            <style jsx global>{`
              @keyframes slideIn {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
              }
            `}</style>
            
            <div className="p-5 border-b border-[#eeedf3] flex justify-between items-center bg-[#faf8fe]">
              <h3 className="text-base font-bold text-[#1a1b1f]">حقيبة التسوق</h3>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="p-1.5 hover:bg-[#eeedf3] rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5 text-[#1a1b1f]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex gap-4 border-b border-[#eeedf3] pb-4">
                {activeImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={getOptimizedImageUrl(activeImage, 200)} 
                    alt={page.product_name} 
                    className="w-20 h-20 rounded-xl object-cover border border-[#eeedf3]"
                  />
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400">صورة</div>
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#1a1b1f]">{page.product_name}</h4>
                    {activeColorName && <p className="text-xs text-[#414755] mt-1">اللون: {activeColorName}</p>}
                    {selectedSize && <p className="text-xs text-[#414755]">المقاس: {selectedSize}</p>}
                  </div>
                  <div className="text-sm font-bold text-[#0058bc]">
                    {page.price.toLocaleString('ar-DZ')} دج
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#eeedf3] bg-[#faf8fe] space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#414755]">السعر الكلي:</span>
                <span className="font-bold text-[#0058bc] text-lg">{page.price.toLocaleString('ar-DZ')} دج</span>
              </div>
              <a 
                href="#checkout-form"
                onClick={handleCheckoutScroll}
                className="w-full btn-electric-gradient font-bold text-center py-3.5 px-4 rounded-xl block text-sm cursor-pointer shadow-ambient"
              >
                الذهاب إلى الدفع
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 4. Hero Section */}
      <main className="max-w-[1280px] mx-auto px-6 mt-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pb-12 border-b border-[#eeedf3]">
          {/* Right/Hero Text Content */}
          <div className="space-y-6 text-center lg:text-right">
            <div className="inline-flex items-center gap-1.5 bg-[#d8e2ff] text-[#001a41] px-3 py-1 rounded-full text-xs font-bold">
              <span>✦</span>
              <span>الجيل الأحدث متوفر الآن</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-[#1a1b1f] leading-tight font-sans">
              {headline}
            </h2>
            {subheadline && (
              <p className="text-[#414755] text-sm lg:text-base leading-relaxed">
                {subheadline}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="#checkout-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-electric-gradient px-8 py-3.5 rounded-xl font-bold text-sm text-center shadow-ambient hover:scale-[1.02] cursor-pointer"
              >
                اطلب الآن
              </a>
              <a 
                href="#product-details"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('product-details')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#eeedf3] hover:bg-[#e3e2e7] text-[#1a1b1f] px-8 py-3.5 rounded-xl font-bold text-sm text-center transition cursor-pointer"
              >
                تفاصيل التكنولوجيا
              </a>
            </div>
          </div>

          {/* Left/Hero Main Visual */}
          <div className="relative rounded-[24px] overflow-hidden bg-white border border-[#eeedf3] p-4 shadow-ambient aspect-[4/3] flex items-center justify-center">
            {activeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={getOptimizedImageUrl(activeImage, 800)} 
                alt={page.product_name} 
                className="max-h-[350px] w-full max-w-full object-contain transition-all duration-500 hover:scale-[1.03]"
              />
            ) : (
              <div className="text-slate-400 text-sm">لا توجد صورة للمنتج</div>
            )}
          </div>
        </section>

        {/* 5. Product Image Gallery Selector */}
        {images.length > 1 && (
          <section className="py-8 border-b border-[#eeedf3]">
            <h3 className="text-xs font-bold text-[#414755] mb-4 text-center lg:text-right">معرض صور المنتج:</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`gallery-thumbnail w-20 h-20 rounded-xl overflow-hidden bg-white border shrink-0 relative cursor-pointer ${
                    activeImageIdx === idx && colors.length === 0 ? 'active border-[#0058bc] ring-2 ring-[#0058bc]/10' : 'border-[#c1c6d7] hover:border-[#717786]'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={getOptimizedImageUrl(img, 200)} 
                    alt={`عرض ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 6. Product Details & Key Information */}
        <section id="product-details" className="py-12 border-b border-[#eeedf3] grid grid-cols-1 lg:grid-cols-2 gap-12 items-start reveal-on-scroll transition-all duration-700 opacity-0 translate-y-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#1a1b1f]">{page.product_name}</h3>
            
            {/* Price Badge */}
            <div className="flex items-center gap-4">
              <span className="bg-[#d8e2ff] text-[#001a41] px-4.5 py-1.5 rounded-full text-base font-extrabold shadow-[0_2px_8px_rgba(0,88,188,0.05)]">
                {page.price.toLocaleString('ar-DZ')} دج
              </span>
              {hasDiscount && (
                <span className="text-[#414755] line-through text-sm">
                  {page.original_price?.toLocaleString('ar-DZ')} دج
                </span>
              )}
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5" dir="ltr">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#1a1b1f]">4.9</span>
              <span className="text-xs text-[#414755]">({page.reviews.length || 145} تقييم زبون)</span>
            </div>

            {page.description && (
              <div className="text-sm text-[#414755] leading-relaxed space-y-3">
                <p>{page.description}</p>
              </div>
            )}

            {/* Color selection layout matching DESIGN.md */}
            {colors.length > 0 && (
              <div className="space-y-3 pt-3">
                <span className="text-xs font-bold text-[#414755] block">الألوان المتوفرة:</span>
                <div className="flex gap-3">
                  {colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColorIdx(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        selectedColorIdx === idx ? 'border-[#0058bc] bg-[#d8e2ff] text-[#001a41]' : 'border-[#c1c6d7] bg-[#f4f3f8] text-[#1a1b1f] hover:border-[#717786]'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Secondary Details Highlight Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-[#eeedf3] rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex gap-4 items-start">
              <span className="w-10 h-10 rounded-xl bg-[#d8e2ff] text-[#0058bc] flex items-center justify-center shrink-0">⚡</span>
              <div>
                <h4 className="text-sm font-bold text-[#1a1b1f] mb-1">أداء بلا انقطاع</h4>
                <p className="text-xs text-[#414755] leading-normal">تمنحك البطارية القوية تجربة تدوم طويلاً مع ميزة الشحن فائق السرعة.</p>
              </div>
            </div>
            <div className="p-5 bg-white border border-[#eeedf3] rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex gap-4 items-start">
              <span className="w-10 h-10 rounded-xl bg-[#d8e2ff] text-[#0058bc] flex items-center justify-center shrink-0">🎨</span>
              <div>
                <h4 className="text-sm font-bold text-[#1a1b1f] mb-1">تصميم مريح وأنيق</h4>
                <p className="text-xs text-[#414755] leading-normal">شكل هندسي مدروس ليناسب الاستخدام الطويل بكل ثبات وراحة.</p>
              </div>
            </div>
            <div className="p-5 bg-white border border-[#eeedf3] rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex gap-4 items-start">
              <span className="w-10 h-10 rounded-xl bg-[#d8e2ff] text-[#0058bc] flex items-center justify-center shrink-0">🎙️</span>
              <div>
                <h4 className="text-sm font-bold text-[#1a1b1f] mb-1">نقاء فائق للصوت</h4>
                <p className="text-xs text-[#414755] leading-normal">عزل ضوضاء ذكي ومايكروفون عالي الحساسية لمكالمات فائقة النقاء.</p>
              </div>
            </div>
            <div className="p-5 bg-white border border-[#eeedf3] rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex gap-4 items-start">
              <span className="w-10 h-10 rounded-xl bg-[#d8e2ff] text-[#0058bc] flex items-center justify-center shrink-0">🛡️</span>
              <div>
                <h4 className="text-sm font-bold text-[#1a1b1f] mb-1">ضمان الاستبدال المجاني</h4>
                <p className="text-xs text-[#414755] leading-normal">ثقتك هي هدفنا، نوفر ضماناً حقيقياً مع دعم فني متجاوب وسريع.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Elegant Customer Reviews (Testimonials) */}
        {(page.reviews.length > 0 || audioProofs.length > 0 || imageProofs.length > 0) && (
          <section id="reviews" className="py-12 border-b border-[#eeedf3] reveal-on-scroll transition-all duration-700 opacity-0 translate-y-8">
            <div className="text-center lg:text-right mb-8">
              <h3 className="text-2xl font-bold text-[#1a1b1f]">ماذا يقول عملاؤنا</h3>
              <p className="text-xs text-[#414755] mt-1">تجارب حقيقية من عملائنا بعد تجربة المنتج</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Render reviews */}
              {page.reviews.slice(0, 6).map((review, idx) => (
                <div key={idx} className="bg-white border border-[#eeedf3] rounded-[24px] p-5 shadow-ambient flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          idx % 3 === 0 ? 'bg-[#0058bc]' : 'bg-[#5a5c5e]'
                        }`}>
                          {review.name.trim().charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#1a1b1f]">{review.name}</h4>
                          {review.location && <span className="text-[10px] text-[#414755]">{review.location}</span>}
                        </div>
                      </div>
                      <span className="bg-[#d2f4e8] text-[#006b54] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#a3e9d1]">
                        شراء مؤكد
                      </span>
                    </div>
                    <p className="text-xs text-[#414755] leading-relaxed italic">
                      &quot;{review.text}&quot;
                    </p>
                  </div>
                  
                  <div className="flex gap-0.5 mt-4" dir="ltr">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                    ))}
                  </div>
                </div>
              ))}

              {/* Render audio proofs */}
              {audioProofs.map((proof, idx) => (
                <div key={`audio-${idx}`} className="bg-white border border-[#eeedf3] rounded-[24px] p-5 shadow-ambient space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#1a1b1f] flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-[#0058bc]" />
                      <span>رأي صوتي من عميل</span>
                    </span>
                    <span className="bg-[#d2f4e8] text-[#006b54] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#a3e9d1]">
                      زبون موكد
                    </span>
                  </div>
                  {proof.caption && <p className="text-xs text-[#414755] italic">&quot;{proof.caption}&quot;</p>}
                  <VoiceNotePlayer 
                    src={proof.url!} 
                    playingAudioSrc={null}
                    onPlay={() => {}}
                    onPause={() => {}}
                  />
                </div>
              ))}

              {/* Render image proofs */}
              {imageProofs.map((proof, idx) => (
                <div key={`image-${idx}`} className="bg-white border border-[#eeedf3] rounded-[24px] p-5 shadow-ambient space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#1a1b1f]">صورة التجربة</span>
                    <span className="bg-[#d2f4e8] text-[#006b54] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#a3e9d1]">
                      شراء مؤكد
                    </span>
                  </div>
                  {proof.caption && <p className="text-xs text-[#414755] italic mb-1">&quot;{proof.caption}&quot;</p>}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={getOptimizedImageUrl(proof.url!, 500)} 
                    alt="صورة تعليق العميل" 
                    className="w-full h-auto rounded-xl border border-[#eeedf3]"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Trust Badges Grid */}
        <section className="py-12 border-b border-[#eeedf3] reveal-on-scroll transition-all duration-700 opacity-0 translate-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center p-5 bg-white border border-[#eeedf3] rounded-[24px] shadow-ambient">
              <div className="w-12 h-12 rounded-full bg-[#d8e2ff] flex items-center justify-center mb-3">
                <Truck className="w-6 h-6 text-[#0058bc]" />
              </div>
              <h4 className="text-sm font-bold text-[#1a1b1f] mb-1">شحن سريع وآمن</h4>
              <p className="text-xs text-[#414755]">توصيل موثوق ومحمي لكافة الولايات الجزائرية خلال 2-4 أيام عمل.</p>
            </div>
            <div className="flex flex-col items-center p-5 bg-white border border-[#eeedf3] rounded-[24px] shadow-ambient">
              <div className="w-12 h-12 rounded-full bg-[#d8e2ff] flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 text-[#0058bc]" />
              </div>
              <h4 className="text-sm font-bold text-[#1a1b1f] mb-1">الدفع عند الاستلام</h4>
              <p className="text-xs text-[#414755]">اطمئن تماماً، افتح طردك وافحصه بعناية ثم ادفع قيمته للموزع.</p>
            </div>
            <div className="flex flex-col items-center p-5 bg-white border border-[#eeedf3] rounded-[24px] shadow-ambient">
              <div className="w-12 h-12 rounded-full bg-[#d8e2ff] flex items-center justify-center mb-3">
                <RefreshCw className="w-6 h-6 text-[#0058bc]" />
              </div>
              <h4 className="text-sm font-bold text-[#1a1b1f] mb-1">ضمان حقيقي ورضا تام</h4>
              <p className="text-xs text-[#414755]">نحن ملتزمون بخدمتكم وتوفير تجربة استبدال سريعة لأي عيوب مصنعية.</p>
            </div>
          </div>
        </section>

        {/* 9. Checkout / Order Form Section */}
        <section className="py-12 max-w-xl mx-auto reveal-on-scroll transition-all duration-700 opacity-0 translate-y-8">
          <GadgetOrderForm 
            pageId={page.id}
            clientId={client.id}
            pageSlug={page.slug}
            productName={page.product_name}
            price={page.price}
            selectedColorName={activeColorName || ''}
            selectedSize={selectedSize}
            sizes={sizes}
            onSizeChange={setSelectedSize}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#faf8fe] border-t border-[#eeedf3] py-8 text-center text-[#414755] mt-12">
        <div className="max-w-[1280px] mx-auto px-6 space-y-2">
          <p className="text-sm font-bold text-[#1a1b1f]">{client.business_name}</p>
          <p className="text-xs opacity-70">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
        </div>
      </footer>

      {/* 10. Sticky Footer CTA (Mobile & Desktop) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-[#eeedf3] py-2.5 px-3 shadow-[0_-5px_25px_rgba(0,0,0,0.03)]">
        <div className="max-w-[480px] mx-auto flex items-center justify-between gap-3">
          <a 
            href="#checkout-form"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 btn-electric-gradient text-white text-center font-bold py-3 px-3 rounded-xl text-xs xs:text-sm cursor-pointer shadow-ambient"
          >
            اطلب الآن
          </a>
          <div className="text-left shrink-0">
            <div className="text-[9px] xs:text-[10px] text-[#414755] font-semibold text-right">السعر الكلي</div>
            <div className="text-sm xs:text-base font-extrabold text-[#0058bc] whitespace-nowrap">
              {page.price.toLocaleString('ar-DZ')} دج
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
