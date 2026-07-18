// src/components/templates/PremiumTemplate.tsx
import { LandingPage, Client } from '../../types';
import { COLOR_PRESETS } from '../../lib/colors';
import OrderForm from './OrderForm';
import { ShieldCheck, Truck, RefreshCw, Star, Heart, Volume2, ShoppingBag, Gift, Award, CheckCircle } from 'lucide-react';

interface PremiumTemplateProps {
  page: LandingPage;
  client: Client;
}

const getCloudinaryUrl = (url: string, width = 800) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
};

export default function PremiumTemplate({ page, client }: PremiumTemplateProps) {
  const theme = COLOR_PRESETS[page.color_theme] || COLOR_PRESETS.green;

  // Retrieve features configuration
  const featuresConfig = page.page_config?.features || [
    { icon: 'Award', title: 'صناعة فاخرة ممتازة', desc: 'تم اختباره واختياره بعناية لتقديم أرقى تجربة استخدام تليق بكم.' },
    { icon: 'Shield', title: 'ضمان كامل لمدة سنة', desc: 'نحن نثق بمنتجاتنا، لذلك نقدم لك ضماناً كاملاً للاستبدال أو التصليح.' },
    { icon: 'Gift', title: 'تغليف راقٍ وهدية مثالية', desc: 'يأتي المنتج في علبة كرتونية فاخرة ممتازة لتقديمه كهدية للأحباء.' }
  ];

  const handleScrollToForm = () => {
    const el = document.getElementById('checkout-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const savedAmount = page.original_price ? page.original_price - page.price : 0;
  const savingsPct = page.original_price ? Math.round((savedAmount / page.original_price) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans pb-24" dir="rtl">
      {/* Top Premium Header banner */}
      <div className="text-white text-center py-2.5 px-4 font-bold text-xs sm:text-sm animate-pulse sticky top-0 z-40 shadow-md flex items-center justify-center gap-2" style={{ backgroundColor: theme.primary }}>
        <Award className="w-4 h-4 text-amber-300 animate-spin" />
        <span>المنتج الأكثر طلباً في الجزائر لعام 2026 - أصلي ومضمون 🌟</span>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-10">
        {/* Premium Hero section */}
        <section className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-[24px] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm relative">
                <img
                  src={getCloudinaryUrl(page.product_images[0] || 'https://images.unsplash.com/photo-1519704961756-de6fda49f943?auto=format&fit=crop&q=80&w=600', 800)}
                  alt={page.product_name}
                  className="w-full h-full object-cover animate-fade-in"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 right-4 bg-amber-500 text-white font-bold text-xs py-1 px-3 rounded-full flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-white" />
                  <span>بريميوم فاخر</span>
                </span>
              </div>
              {page.product_images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {page.product_images.slice(0, 4).map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-xs">
                      <img src={getCloudinaryUrl(img, 200)} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product description */}
            <div className="space-y-5 text-right">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
                <span className="text-xs text-gray-400 mr-2">(148 تقييم حقيقي)</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {page.product_name}
              </h1>

              {/* Price Tag */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-2xl p-5 flex items-center justify-between border border-amber-100/30">
                <div>
                  <span className="block text-xs text-amber-800 font-semibold mb-0.5">سعر العرض الخاص الحالي</span>
                  <span className="text-3xl font-extrabold text-amber-700">
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

              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {page.description}
              </p>

              {/* Quick checklist */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>المنتج الأصلي 100%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>تفقد السلعة قبل الدفع</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>توصيل سريع للباب</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>خدمة ما بعد البيع راقية</span>
                </div>
              </div>

              <button
                onClick={handleScrollToForm}
                className="w-full py-4 rounded-xl text-lg font-bold text-white transition-all shadow-lg transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer hover:shadow-xl"
                style={{ backgroundColor: theme.primary }}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>احجز نسختك الآن بسعر التخفيض</span>
              </button>
            </div>
          </div>
        </section>

        {/* Premium Features Checklist */}
        <section className="space-y-4 text-right">
          <h2 className="text-2xl font-bold text-gray-900 mr-2 text-center md:text-right">مميزات حصرية تميز هذا المنتج ✨</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuresConfig.map((feat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3 relative overflow-hidden hover:shadow-md transition duration-250">
                <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: theme.primary }}></div>
                <div className="p-3 bg-amber-50 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center">
                  {feat.icon === 'Award' && <Award className="w-6 h-6" />}
                  {feat.icon === 'Shield' && <ShieldCheck className="w-6 h-6" />}
                  {feat.icon === 'Gift' && <Gift className="w-6 h-6" />}
                  {feat.icon !== 'Award' && feat.icon !== 'Shield' && feat.icon !== 'Gift' && <Award className="w-6 h-6" />}
                </div>
                <h3 className="font-extrabold text-gray-800 text-base">{feat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Perfect Gift Section */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[32px] p-8 text-center md:text-right flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-3 relative z-10 flex-1">
            <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-2 justify-center md:justify-start">
              <Gift className="w-6 h-6 text-amber-400" />
              <span>هل تبحث عن هدية راقية ومميزة؟ 🎁</span>
            </h3>
            <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
              هذا المنتج هو الاختيار الأنسب لإهدائه لمن تحب بمناسبة الأعياد والنجاحات والمناسبات السعيدة. يأتي بتغليف فاخر وأنيق جداً يبيض وجهك أمام أحبابك وأصدقائك!
            </p>
          </div>
          <button
            onClick={handleScrollToForm}
            className="py-4 px-8 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl shadow-lg transition transform active:scale-95 whitespace-nowrap cursor-pointer z-10"
          >
            اطلبه كهدية الآن
          </button>
        </section>

        {/* Social Proof uploads */}
        {page.social_proof && page.social_proof.length > 0 && (
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-right space-y-4">
            <h2 className="text-xl font-bold text-gray-900">زبائن ممتنون يتحدثون عنا 🗣️</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {page.social_proof.map((proof, i) => (
                <div key={i} className="border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-3">
                  {proof.type === 'audio' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                        <Volume2 className="w-5 h-5 text-green-600" />
                        <span>تسجيل صوتي لأحد الزبائن:</span>
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

        {/* Reassurance Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 text-center space-y-2">
            <div className="p-3 bg-amber-50 text-amber-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">ضمان الجودة والتبديل</h3>
            <p className="text-xs text-gray-500">نحن نتكفل بأي عيوب تصنيعية في ثوانٍ معدودة وبدون مماطلة.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 text-center space-y-2">
            <div className="p-3 bg-amber-50 text-amber-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">شحن آمن مع المعاينة</h3>
            <p className="text-xs text-gray-500">افتح علبتك، تأكد من السلعة بنفسك، ثم ادفع ثمنها لمندوب التوصيل.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 text-center space-y-2">
            <div className="p-3 bg-amber-50 text-amber-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">دعم فني 7/24</h3>
            <p className="text-xs text-gray-500">فريق الدعم والرد الفني متوفر على مدار الساعة لمساعدتك في أي استفسار.</p>
          </div>
        </section>

        {/* Integrated Order Form */}
        <section className="scroll-mt-20">
          <OrderForm page={page} client={client} />
        </section>

        {/* Reviews */}
        {page.reviews && page.reviews.length > 0 && (
          <section className="space-y-4 text-right">
            <h2 className="text-xl font-bold text-gray-900 mr-2">تقييمات متميزة من عملائنا النخبة ⭐</h2>
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
          <span className="block text-[10px] text-gray-400">السعر المميز</span>
          <span className="text-lg font-bold" style={{ color: theme.primary }}>
            {page.price.toLocaleString()} دج
          </span>
        </div>
        <button
          onClick={handleScrollToForm}
          className="py-3 px-6 rounded-xl font-bold text-white transition-all shadow-md transform active:scale-95 text-sm cursor-pointer"
          style={{ backgroundColor: theme.primary }}
        >
          اطلب الآن (الدفع عند معاينة السلعة)
        </button>
      </div>
    </div>
  );
}
