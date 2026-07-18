// src/components/templates/MultivariantTemplate.tsx
import React, { useState } from 'react';
import { LandingPage, Client } from '../../types';
import { COLOR_PRESETS } from '../../lib/colors';
import OrderForm from './OrderForm';
import { ShieldCheck, Truck, RefreshCw, Star, Heart, Volume2, ShoppingBag } from 'lucide-react';

interface MultivariantTemplateProps {
  page: LandingPage;
  client: Client;
}

const getCloudinaryUrl = (url: string, width = 800) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
};

export default function MultivariantTemplate({ page, client }: MultivariantTemplateProps) {
  const theme = COLOR_PRESETS[page.color_theme] || COLOR_PRESETS.green;

  // Retrieve variants and sizes configuration
  const variantsConfig = page.page_config?.variants || [
    { name: 'اللون / الخيار', options: ['الأحمر الملكي', 'الأزرق السماوي', 'الأسود الكلاسيكي'] }
  ];
  const sizesConfig = page.page_config?.sizes || ['M', 'L', 'XL', 'XXL'];

  const [selectedVariant, setSelectedVariant] = useState(variantsConfig[0]?.options[0] || '');
  const [selectedSize, setSelectedSize] = useState(sizesConfig[0] || '');

  const handleScrollToForm = () => {
    const el = document.getElementById('checkout-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const savedAmount = page.original_price ? page.original_price - page.price : 0;
  const savingsPct = page.original_price ? Math.round((savedAmount / page.original_price) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans pb-24" dir="rtl">
      {/* Top Banner */}
      <div className="text-white text-center py-2.5 px-4 font-bold text-xs sm:text-sm animate-pulse sticky top-0 z-40 shadow-sm" style={{ backgroundColor: theme.primary }}>
        ⚡ تخفيض مميز! اختر المقاس واللون المفضل واطلب الآن والتوصيل لباب دارك
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-10">
        {/* Hero Section */}
        <section className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Gallery / Image Slider */}
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={getCloudinaryUrl(page.product_images[0] || 'https://images.unsplash.com/photo-1519704961756-de6fda49f943?auto=format&fit=crop&q=80&w=600', 800)}
                  alt={page.product_name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {page.product_images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {page.product_images.slice(0, 4).map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-200">
                      <img src={getCloudinaryUrl(img, 200)} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta */}
            <div className="space-y-4 text-right">
              <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                🔥 عرض محدود: وفر {savingsPct}% اليوم!
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                {page.product_name}
              </h1>

              {/* Price Panel */}
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                <div>
                  <span className="block text-xs text-gray-400">السعر الحالي</span>
                  <span className="text-3xl font-extrabold" style={{ color: theme.primary }}>
                    {page.price.toLocaleString()} دج
                  </span>
                </div>
                {page.original_price && (
                  <div className="text-left">
                    <span className="block text-xs text-gray-400">السعر الأصلي</span>
                    <span className="text-lg text-gray-400 line-through">
                      {page.original_price.toLocaleString()} دج
                    </span>
                  </div>
                )}
              </div>

              {/* Variant Selections */}
              <div className="space-y-3 pt-2">
                {variantsConfig.map((vGroup, groupIdx) => (
                  <div key={groupIdx} className="space-y-1.5">
                    <span className="text-sm font-bold text-gray-700 block">{vGroup.name}:</span>
                    <div className="flex flex-wrap gap-2">
                      {vGroup.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => setSelectedVariant(opt)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
                            selectedVariant === opt
                              ? 'border-transparent text-white'
                              : 'border-slate-200 text-gray-600 bg-white hover:border-slate-300'
                          }`}
                          style={{
                            backgroundColor: selectedVariant === opt ? theme.primary : undefined,
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {sizesConfig && sizesConfig.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-sm font-bold text-gray-700 block">المقاس المتوفر:</span>
                    <div className="grid grid-cols-4 gap-2">
                      {sizesConfig.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 text-xs font-bold rounded-xl border-2 text-center transition-all cursor-pointer ${
                            selectedSize === size
                              ? 'border-transparent text-white'
                              : 'border-slate-200 text-gray-600 bg-white hover:border-slate-300'
                          }`}
                          style={{
                            backgroundColor: selectedSize === size ? theme.primary : undefined,
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed pt-2">
                {page.description}
              </p>

              <button
                onClick={handleScrollToForm}
                className="w-full py-4 rounded-xl text-lg font-bold text-white transition-all shadow-md transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer hover:opacity-90"
                style={{ backgroundColor: theme.primary }}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>اخترت طلبي، أريد الشراء</span>
              </button>
            </div>
          </div>
        </section>

        {/* Benefits Panel */}
        <section className="space-y-4 text-right">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mr-2">لماذا تشتري من متجرنا؟ 🌟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center space-y-2">
              <div className="p-3 bg-emerald-50 text-emerald-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">أصلي وبجودة عالية</h3>
              <p className="text-xs text-gray-500">نهتم بأدق التفاصيل لتقديم أفضل جودة لزبائننا الأوفياء.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center space-y-2">
              <div className="p-3 bg-blue-50 text-blue-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">توصيل لكل الولايات</h3>
              <p className="text-xs text-gray-500">نصلك أينما كنت في الجزائر والدفع عند استلام الطرد.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center space-y-2">
              <div className="p-3 bg-amber-50 text-amber-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">معاينة قبل الدفع</h3>
              <p className="text-xs text-gray-500">يمكنك تفقد طلبيتك والتأكد منها قبل تسليم المبلغ للموزع.</p>
            </div>
          </div>
        </section>

        {/* Media / Social Proof */}
        {page.social_proof && page.social_proof.length > 0 && (
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-right space-y-4">
            <h2 className="text-xl font-bold text-gray-900">آراء زبائننا المسموعة والمرئية 🗣️</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {page.social_proof.map((proof, i) => (
                <div key={i} className="border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-3">
                  {proof.type === 'audio' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                        <Volume2 className="w-5 h-5 text-green-600" />
                        <span>تسجيل صوتي من زبون:</span>
                      </div>
                      <audio controls src={proof.url} className="w-full h-10"></audio>
                    </div>
                  )}
                  {proof.type === 'image' && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                      <img src={proof.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  {proof.type === 'video' && (
                    <video controls src={proof.url} className="w-full rounded-xl aspect-video bg-black"></video>
                  )}
                  {proof.caption && <p className="text-xs text-gray-500">{proof.caption}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Order Form Checkout */}
        <section className="scroll-mt-20">
          <OrderForm
            page={page}
            client={client}
            selectedVariant={selectedVariant}
            selectedSize={selectedSize}
          />
        </section>

        {/* Customer Reviews */}
        {page.reviews && page.reviews.length > 0 && (
          <section className="space-y-4 text-right">
            <h2 className="text-xl font-bold text-gray-900 mr-2">تقييمات زبائننا الكرام ⭐</h2>
            <div className="space-y-3">
              {page.reviews.map((rev, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex gap-4 items-start">
                  <div className="bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-900 text-sm">{rev.name}</h4>
                      <span className="text-[11px] text-gray-400 bg-slate-50 px-2 py-0.5 rounded-full">{rev.location}</span>
                    </div>
                    <div className="flex gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star key={starIdx} className={`w-3.5 h-3.5 ${starIdx < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{rev.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 space-y-2 pt-6 border-t border-slate-200">
          <p className="flex justify-center items-center gap-1">
            <span>صنع بكل </span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>بواسطة المتجر عبر منصة Yube</span>
          </p>
          <p>حقوق النشر محفوظة © {new Date().getFullYear()}</p>
        </footer>
      </main>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 flex justify-between items-center z-40 md:hidden shadow-2xl">
        <div className="text-right pr-2">
          <span className="block text-[10px] text-gray-400">سعر الطقم</span>
          <span className="text-lg font-bold" style={{ color: theme.primary }}>
            {page.price.toLocaleString()} دج
          </span>
        </div>
        <button
          onClick={handleScrollToForm}
          className="py-3 px-6 rounded-xl font-bold text-white transition-all shadow-md transform active:scale-95 text-sm cursor-pointer"
          style={{ backgroundColor: theme.primary }}
        >
          اختر خياراتك واطلب الآن
        </button>
      </div>
    </div>
  );
}
