import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Check, Layout, Sparkles, Award,
  Users,
} from 'lucide-react';
import RevenueCalculator from './leadmagnet/RevenueCalculator';

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-black" dir="rtl">
      {/* Navbar Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1.5 xs:gap-2">
            <Image src="/logo-full.png" alt="Yube" width={100} height={54.5} className="" priority />
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition">المميزات</a>
            <a href="#templates" className="hover:text-white transition">القوالب</a>
            <a href="#crm" className="hover:text-white transition">CRM</a>
            <Link href="/pricing" className="hover:text-white transition">الأسعار</Link>
          </nav>

          <div className="flex items-center gap-1.5 xs:gap-3">
            <Link href="/auth/login" className="hidden xs:inline-block text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition">
              تسجيل الدخول
            </Link>
            <Link
              href="/auth/signup"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] xs:text-xs sm:text-sm font-black px-2.5 py-1.5 xs:px-4.5 xs:py-2.5 rounded-lg xs:rounded-xl transition shadow-md shadow-emerald-500/10 flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0"
            >
              <span>ابدأ الآن بـ 240 da</span>
              <ArrowLeft className="w-3 h-3 xs:w-4 xs:h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 xs:pt-20 pb-12 xs:pb-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-500/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 xs:space-y-6 relative z-10">
          <span className="inline-block bg-emerald-500/10 text-emerald-400 text-[10px] xs:text-xs font-bold px-2.5 py-1 xs:px-3 xs:py-1.5 rounded-full border border-emerald-500/20 max-w-full text-center leading-normal">
            👗 منصة صفحات البيع المتخصصة في تجارة الملابس والأزياء بالجزائر
          </span>
          <h1 className="text-2xl xs:text-4xl sm:text-6xl font-black text-white leading-tight">
            أنشئ صفحة بيع احترافية عالية التحويل في <span className="text-emerald-400">5 دقائق</span> 🇩🇿
          </h1>
          <p className="text-slate-400 text-xs xs:text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2">
            منصة <strong className="text-white">Yube</strong> مصممة خصيصاً لأصحاب متاجر الملابس والأزياء في الجزائر — قوالب جاهزة لكل الأنماط (رجالي، نسائي، أطفال، أحذية، عبايات) تحوّل زوار إعلاناتك إلى زبائن حقيقيين بالدفع عند الاستلام.
          </p>

          <div className="flex justify-center gap-4 pt-2 xs:pt-4">
            <Link
              href="/auth/signup"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[11px] xs:text-sm sm:text-base px-4 py-2.5 xs:px-8 xs:py-4 rounded-xl xs:rounded-2xl shadow-lg shadow-emerald-500/20 transition transform active:scale-95 cursor-pointer flex items-center gap-1.5 sm:gap-2"
            >
              <span>جرّب المنصة لمدة شهر كامل بـ 240 da فقط</span>
              <ArrowLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-t border-b border-slate-900 bg-slate-900/20 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
          <div className="space-y-1 pb-4 border-b border-slate-800/40 sm:border-b-0 sm:pb-0">
            <h3 className="text-2xl sm:text-4xl font-black text-emerald-400">+6%</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-bold">متوسط معدل تحويل المبيعات الحالي</p>
          </div>
          <div className="space-y-1 pt-4 sm:pt-0 border-r-0 sm:border-r border-slate-800/40">
            <h3 className="text-2xl sm:text-4xl font-black text-white">58 ولاية</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-bold">شحن وتوصيل كامل مدمج في الاستمارة</p>
          </div>
          <div className="space-y-1 pt-4 sm:pt-0 border-r-0 sm:border-r border-slate-800/40">
            <h3 className="text-2xl sm:text-4xl font-black text-emerald-400">CRM مجاني</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-bold">لإدارة المبيعات</p>
          </div>
        </div>
      </section>

      {/* Video Introduction Section */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Right Column: Text & Content (First in RTL layout) */}
          <div className="md:col-span-7 space-y-6 text-center md:text-right flex flex-col items-center md:items-start order-1">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] xs:text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/20">
              ⚡ فيديو تدريبي مجاني
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-white leading-tight">
              قبل ما تبدأ، خليني نوريلك كيفاش تخدم الـEcommerce Funnel تاعك
            </h2>
            <p className="text-slate-400 text-xs xs:text-sm sm:text-base leading-relaxed max-w-2xl">
              فيديو مجاني نشرح فيه وين تروح الميزانية تاعك، وكيفاش تقدر تحسن النتائج تاعك وتضاعف المبيعات باستخدام استراتيجيات مجربة في السوق الجزائري 🇩🇿
            </p>
            
            {/* Value Highlights */}
            <ul className="space-y-3 text-right text-slate-300 text-xs xs:text-sm max-w-md mx-auto md:mx-0 md:max-w-none">
              <li className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>تحليل الميزانية:</strong> تفادى الأخطاء الشائعة اللي تضيع دراهم الإعلانات.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>هيكلة المتجر:</strong> كيفاش تحول الزوار إلى زبائن حقيقيين بسهولة.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>الربط مع Yube:</strong> استغل السرعة والقوالب باه تضاعف النتائج تاعك.</span>
              </li>
            </ul>

            {/* Desktop CTA Button */}
            <div className="pt-4 hidden md:flex">
              <Link
                href="/auth/signup"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs xs:text-sm sm:text-base px-6 py-3 xs:px-8 xs:py-4 rounded-xl xs:rounded-2xl shadow-lg shadow-emerald-500/20 transition transform active:scale-95 cursor-pointer flex items-center gap-1.5 sm:gap-2 w-fit"
              >
                <span>جرب Yube بـ 240 da</span>
                <ArrowLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>

          {/* Left Column: Phone Mockup Video */}
          <div className="md:col-span-5 flex flex-col items-center gap-6 w-full order-2">
            <div className="relative w-full max-w-[280px] xs:max-w-[310px] md:max-w-none md:h-[520px] lg:h-[580px] aspect-[9/20] rounded-[2rem] xs:rounded-[2.5rem] border-[8px] sm:border-[10px] border-slate-900 bg-slate-950 shadow-2xl shadow-emerald-500/10 ring-1 ring-slate-800 flex flex-col justify-between overflow-hidden">
              
              {/* Dynamic Island / Notch */}
              <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-18 sm:w-20 h-3.5 sm:h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-6 sm:w-8 h-1 bg-slate-800 rounded-full"></div>
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-800 rounded-full ml-1 sm:ml-1.5"></div>
              </div>

              {/* Home Indicator (Apple Style) */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-1 bg-slate-800/80 rounded-full z-20"></div>

              {/* Video Element */}
              <div className="w-full h-full rounded-[1.4rem] xs:rounded-[1.9rem] overflow-hidden bg-slate-950 relative">
                <video
                  src="/app/CRMcrs.mp4"
                  controls
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Mobile CTA Button */}
            <div className="flex md:hidden w-full justify-center">
              <Link
                href="/auth/signup"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs xs:text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition transform active:scale-95 cursor-pointer flex items-center gap-1.5 w-fit"
              >
                <span>جرب Yube بـ 240 da</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-white">كيف تعمل منصة يوب؟ ⚙️</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">ثلاث خطوات بسيطة تفصلك عن بيع منتجاتك كالمحترفين</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
          {/* Step 1 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6.5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-lg">1</div>
            <h3 className="text-lg font-bold text-white">اختر القالب الأنسب</h3>
            <p className="text-slate-400 text-sm leading-relaxed">اختر من بين مجموعة قوالبنا المصممة لتناسب مختلف أنواع السلع (بسيطة، بخيارات ألوان ومقاسات، أو فاخرة).</p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6.5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-lg">2</div>
            <h3 className="text-lg font-bold text-white">عبّئ معلومات منتجك</h3>
            <p className="text-slate-400 text-sm leading-relaxed">املأ الاستمارة خطوة بخطوة بالاسم، السعر، الصور، والميزات الأساسية دون الحاجة لأي خبرة برمجية.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6.5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-lg">3</div>
            <h3 className="text-lg font-bold text-white">ابدأ استقبال الطلبيات</h3>
            <p className="text-slate-400 text-sm leading-relaxed">انشر رابط الصفحة وابدأ حملتك الإعلانية. ستتلقى معلومات الزبائن في لوحتك فوراً.</p>
          </div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section id="templates" className="py-16 bg-slate-900/10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-white">قوالب مصممة خصيصاً لكل نمط ملابس 👗👔</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">من الأزياء الفاخرة إلى الستريت وير — قالب مناسب لهوية متجرك</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Card 2 — Luxury Fashion */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 transition">
              <div className="aspect-video bg-amber-950/20 relative flex items-center justify-center overflow-hidden">
                <Image src="/temp/luxary.png" alt="قالب أزياء فاخرة" width={600} height={400} className="object-cover w-full h-full" />
              </div>
              <div className="p-5 space-y-2 text-right">
                <h3 className="font-extrabold text-white text-base">أزياء فاخرة</h3>
                <p className="text-slate-400 text-xs leading-relaxed">اختيار المقاس واللون بسهولة لكل قطعة.</p>
              </div>
            </div>
            {/* Card 2 — Luxury Fashion */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 transition">
              <div className="aspect-video bg-amber-950/20 relative flex items-center justify-center overflow-hidden">
                <Image src="/temp/men.png" alt="قالب رجال" width={600} height={400} className="object-cover w-full h-full" />
              </div>
              <div className="p-5 space-y-2 text-right">
                <h3 className="font-extrabold text-white text-base">أزياء رجال</h3>
                <p className="text-slate-400 text-xs leading-relaxed">تصميم راقٍ يعزز الثقة للمنتجات عالية القيمة.</p>
              </div>
            </div>

            {/* Card 3 — Kids Fashion */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 transition">
              <div className="aspect-video bg-rose-950/20 relative flex items-center justify-center overflow-hidden">
                <Image src="/temp/child.png" alt="قالب أزياء أطفال" width={600} height={400} className="object-cover w-full h-full" />
              </div>
              <div className="p-5 space-y-2 text-right">
                <h3 className="font-extrabold text-white text-base">أزياء الأطفال</h3>
                <p className="text-slate-400 text-xs leading-relaxed">ألوان دافئة ومقاسات مرنة، مثالي لملابس الأطفال.</p>
              </div>
            </div>

            {/* Card 4 — Footwear */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 transition">
              <div className="aspect-video bg-blue-950/20 relative flex items-center justify-center overflow-hidden">
                <Image src="/temp/bag.png" alt="قالب أحذية" width={600} height={400} className="object-cover w-full h-full" />
              </div>
              <div className="p-5 space-y-2 text-right">
                <h3 className="font-extrabold text-white text-base">حقائب نسائية</h3>
                <p className="text-slate-400 text-xs leading-relaxed">اختيار الموديل واللون بسهولة لكل قطعة.</p>
              </div>
            </div>
          </div>

          <p className="text-center text-slate-500 text-xs">
            + قوالب إضافية لملابس الرجال، النساء، العبايات، والأحذية الرياضية
          </p>
        </div>
      </section>

      {/* CRM Bonus Section */}
      <section id="crm" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-500/10 to-slate-900/40 border border-emerald-500/20 rounded-3xl p-6 xs:p-10 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-right">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 text-[10px] xs:text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/20">
                🎁 مُضمّن مجاناً مع اشتراكك
              </span>
              <h2 className="text-2xl xs:text-3xl font-black text-white">نظام CRM لإدارة زبائنك — بدون أي تكلفة إضافية</h2>
              <p className="text-slate-400 text-sm xs:text-base leading-relaxed">
                تتبّع طلبياتك، تواصل مع زبائنك، وراقب أداء مبيعاتك من مكان واحد — كل هذا مُدمج مباشرة في لوحة تحكمك دون الحاجة لأي أداة خارجية أو اشتراك منفصل.
              </p>
              <ul className="space-y-2 text-xs xs:text-sm text-slate-300 pt-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>متابعة حالة كل طلبية لحظة بلحظة</span></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>سجل كامل لكل زبون وطلبياته السابقة</span></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>لا حاجة لأي اشتراك أو أداة إضافية</span></li>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="w-20 h-20 xs:w-28 xs:h-28 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Users className="w-10 h-10 xs:w-14 xs:h-14 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <RevenueCalculator />

      {/* Support Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-white">جاهز للارتقاء بمبيعاتك؟ 🚀</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">انضم إلى التجار الجزائريين الذين يوسعون نطاق أعمالهم مع Yube</p>
        </div>

        <div className="flex justify-center gap-4 pt-2 xs:pt-4">
          <Link
            href="/auth/signup"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[11px] xs:text-sm sm:text-base px-4 py-2.5 xs:px-8 xs:py-4 rounded-xl xs:rounded-2xl shadow-lg shadow-emerald-500/20 transition transform active:scale-95 cursor-pointer flex items-center gap-1.5 sm:gap-2"
          >
            <span>ابدأ الآن - شهر كامل بـ 240 da فقط</span>
            <ArrowLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 xs:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 xs:space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl xs:text-3xl font-black text-white">خطط اشتراك مرنة تناسب حجم تجارتك 💳</h2>
          <p className="text-slate-400 text-xs xs:text-sm max-w-md mx-auto">ابدأ بـ 240 da فقط بدون التزام، ورقّ حسابك عندما تكبر مبيعاتك!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 text-right">
          {/* Plan 1 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-4.5 xs:p-6 space-y-4 xs:space-y-5">
            <h3 className="font-bold text-gray-400 text-xs xs:text-sm">فترة تجريبية (Trial)</h3>
            <div className="space-y-1">
              <span className="text-2xl xs:text-3xl font-black text-white">240 da</span>
              <span className="text-slate-400 text-[10px] xs:text-xs block">لمدة شهر كامل</span>
            </div>
            <ul className="space-y-2 xs:space-y-2.5 text-[11px] xs:text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>إنشاء صفحة بيع واحدة</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>توصيل 58 ولاية مدمج</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>لوحة تحكم لإدارة الطلبيات</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>نظام إدارة المبيعات</span></li>
            </ul>
            <Link href="/auth/signup" className="w-full text-center py-2 xs:py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs block cursor-pointer">ابدأ الآن بـ 240 da</Link>
          </div>

          {/* Plan 2 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-4.5 xs:p-6 space-y-4 xs:space-y-5">
            <h3 className="font-bold text-gray-400 text-xs xs:text-sm">الخطة الأساسية (Basic)</h3>
            <div className="space-y-1">
              <span className="text-2xl xs:text-3xl font-black text-white">5000 da</span>
              <span className="text-slate-400 text-[10px] xs:text-xs block">شهرياً</span>
            </div>
            <ul className="space-y-2 xs:space-y-2.5 text-[11px] xs:text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>إنشاء حتى 3 صفحات بيع</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>مساحة تخزين صور مجانية</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>تأكيدات سريعة وموثوقة</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>نظام إدارة الطلبيات (CRM)</span></li>
            </ul>
            <Link href="/auth/signup" className="w-full text-center py-2 xs:py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs block cursor-pointer">اختر هذه الخطة</Link>
          </div>

          {/* Plan 3 */}
          <div className="bg-slate-900/60 border-2 border-emerald-500 rounded-3xl p-4.5 xs:p-6 space-y-4 xs:space-y-5 relative">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-slate-950 font-black text-[8px] xs:text-[9px] px-2.5 py-0.5 xs:px-3 xs:py-1 rounded-full uppercase tracking-wider">الأكثر طلباً</span>
            <h3 className="font-bold text-emerald-400 text-xs xs:text-sm">الخطة الاحترافية (Pro)</h3>
            <div className="space-y-1">
              <span className="text-2xl xs:text-3xl font-black text-white">7200 da</span>
              <span className="text-slate-400 text-[10px] xs:text-xs block">شهرياً</span>
            </div>
            <ul className="space-y-2 xs:space-y-2.5 text-[11px] xs:text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>صفحات بيع غير محدودة</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>إحصائيات تفصيلية كاملة</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>تكامل بكسل فيسبوك</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>دعم فني ذو أولوية 24/7</span></li>
            </ul>
            <Link href="/auth/signup" className="w-full text-center py-2 xs:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs block cursor-pointer">ابدأ مع الخطة الاحترافية</Link>
          </div>

          {/* Plan 4 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-4.5 xs:p-6 space-y-4 xs:space-y-5">
            <h3 className="font-bold text-gray-400 text-xs xs:text-sm">coming soon</h3>
            <div className="space-y-1">
              <span className="text-2xl xs:text-3xl font-black text-white">200$</span>
              <span className="text-slate-400 text-[10px] xs:text-xs block">شهرياً</span>
            </div>
            <ul className="space-y-2 xs:space-y-2.5 text-[11px] xs:text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>ربط دومين مخصص (White Label)</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>إنشاء حسابات فرعية لموظفيك</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>تخزين ملفات صوتية غير محدود</span></li>
            </ul>
            <Link href="/auth/signup" className="w-full text-center py-2 xs:py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs block cursor-pointer">تواصل مع الدعم</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 bg-slate-950 text-center text-sm text-slate-500 space-y-3">
        <div className="flex justify-center items-center gap-2">
          <Image src="/logo-icon.png" alt="Yube" width={24} height={24} />
          <span className="font-black text-white">Yube</span>
        </div>
        <p>المنصة الرائدة لتمكين التجارة الإلكترونية والدفع عند الاستلام في الجزائر 🇩🇿</p>
        <p className="text-xs text-slate-600">جميع الحقوق محفوظة منصة Yube © 2026</p>
      </footer>
    </div>
  );
}
