import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Check, Layout, Sparkles, Award,
} from 'lucide-react';

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-black" dir="rtl">
      {/* Navbar Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1.5 xs:gap-2">
            <Image src="/logo-icon.png" alt="Yube" width={28} height={28} className="xs:w-8 xs:h-8" priority />
            <span className="text-base xs:text-lg sm:text-xl font-black text-white tracking-tight">Yube</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition">المميزات</a>
            <a href="#templates" className="hover:text-white transition">القوالب</a>
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
              <span>ابدأ مجاناً</span>
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
            🚀 منصة إنشاء صفحات الهبوط مخصصة للتجارة الإلكترونية في الجزائر
          </span>
          <h1 className="text-2xl xs:text-4xl sm:text-6xl font-black text-white leading-tight">
            أنشئ صفحة بيع احترافية عالية التحويل في <span className="text-emerald-400">5 دقائق</span> 🇩🇿
          </h1>
          <p className="text-slate-400 text-xs xs:text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2">
            منصة <strong className="text-white">Yube</strong> تحوّل زوار إعلاناتك (فيسبوك، تيك توك، انستغرام) إلى زبائن حقيقيين عن طريق تبسيط عملية ملء استمارات الشراء والدفع عند الاستلام.
          </p>

          <div className="flex justify-center gap-4 pt-2 xs:pt-4">
            <Link
              href="/auth/signup"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[11px] xs:text-sm sm:text-base px-4 py-2.5 xs:px-8 xs:py-4 rounded-xl xs:rounded-2xl shadow-lg shadow-emerald-500/20 transition transform active:scale-95 cursor-pointer flex items-center gap-1.5 sm:gap-2"
            >
              <span>جرّب المنصة مجاناً لمدة 14 يوم</span>
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
          <div className="space-y-1 py-4 border-b border-slate-800/40 sm:border-b-0 sm:py-0 border-r-0 sm:border-r border-slate-800/40">
            <h3 className="text-2xl sm:text-4xl font-black text-white">+500,000</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-bold">طلبية تم توليدها وتأكيدها عبر صفحاتنا</p>
          </div>
          <div className="space-y-1 pt-4 sm:pt-0 border-r-0 sm:border-r border-slate-800/40">
            <h3 className="text-2xl sm:text-4xl font-black text-white">58 ولاية</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-bold">شحن وتوصيل كامل مدمج في الاستمارة</p>
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
            <p className="text-slate-400 text-sm leading-relaxed">بمجرد موافقة المشرف، انشر رابط الصفحة وابدأ حملتك الإعلانية. ستتلقى معلومات الزبائن في لوحتك فوراً.</p>
          </div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section id="templates" className="py-16 bg-slate-900/10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-white">قوالب فائقة السرعة وعالية الإقناع 📱</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">مصممة خصيصاً لتناسب سرعة تصفح الهواتف وشبكات الجيل الرابع في الجزائر</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 transition">
              <div className="aspect-video bg-emerald-950/20 relative flex items-center justify-center overflow-hidden">
                <img src="../public/chelqa_preview.png" width={600} height={400} />
              </div>
              <div className="p-5 space-y-2 text-right">
                <h3 className="font-extrabold text-white text-base">قالب صفحة "صفحة بسيطة"</h3>
                <p className="text-slate-400 text-xs leading-relaxed">مصمم لمنتج واحد لضمان تسريع ملء البيانات بأقل نقرات ممكنة.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 transition">
              <div className="aspect-video bg-blue-950/20 relative flex items-center justify-center overflow-hidden">
                <Sparkles className="w-12 h-12 text-blue-500" />
                <span className="absolute bottom-2 right-2 bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full">الخيارات المتقدمة</span>
              </div>
              <div className="p-5 space-y-2 text-right">
                <h3 className="font-extrabold text-white text-base">قالب "منتج بخيارات"</h3>
                <p className="text-slate-400 text-xs leading-relaxed">يمنح الزبائن إمكانية اختيار المقاسات، الألوان أو الأحجام المتوفرة بلمسة سريعة.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 transition">
              <div className="aspect-video bg-amber-950/20 relative flex items-center justify-center overflow-hidden">
                <Award className="w-12 h-12 text-amber-500" />
                <span className="absolute bottom-2 right-2 bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">بريميوم راقٍ</span>
              </div>
              <div className="p-5 space-y-2 text-right">
                <h3 className="font-extrabold text-white text-base">قالب "صفحة متميزة"</h3>
                <p className="text-slate-400 text-xs leading-relaxed">يتضمن ميزات للمنتجات الراقية، الهدايا ليعزز الثقة ويزيد رغبة الشراء.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 xs:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 xs:space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl xs:text-3xl font-black text-white">خطط اشتراك مرنة تناسب حجم تجارتك 💳</h2>
          <p className="text-slate-400 text-xs xs:text-sm max-w-md mx-auto">ابدأ مجاناً بدون التزام، ورقّ حسابك عندما تكبر مبيعاتك!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 text-right">
          {/* Plan 1 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-4.5 xs:p-6 space-y-4 xs:space-y-5">
            <h3 className="font-bold text-gray-400 text-xs xs:text-sm">التجربة المجانية (Trial)</h3>
            <div className="space-y-1">
              <span className="text-2xl xs:text-3xl font-black text-white">مجاني</span>
              <span className="text-slate-400 text-[10px] xs:text-xs block">لمدة 14 يوم كاملة</span>
            </div>
            <ul className="space-y-2 xs:space-y-2.5 text-[11px] xs:text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>إنشاء صفحة بيع واحدة</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>توصيل 58 ولاية مدمج</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>لوحة تحكم لإدارة الطلبيات</span></li>
            </ul>
            <Link href="/auth/signup" className="w-full text-center py-2 xs:py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs block cursor-pointer">ابدأ التجربة المجانية</Link>
          </div>

          {/* Plan 2 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-4.5 xs:p-6 space-y-4 xs:space-y-5">
            <h3 className="font-bold text-gray-400 text-xs xs:text-sm">الخطة الأساسية (Basic)</h3>
            <div className="space-y-1">
              <span className="text-2xl xs:text-3xl font-black text-white">3,000 DA</span>
              <span className="text-slate-400 text-[10px] xs:text-xs block">شهرياً</span>
            </div>
            <ul className="space-y-2 xs:space-y-2.5 text-[11px] xs:text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>إنشاء حتى 5 صفحات بيع</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>مساحة تخزين صور مجانية</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>تأكيدات سريعة وموثوقة</span></li>
            </ul>
            <Link href="/auth/signup" className="w-full text-center py-2 xs:py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs block cursor-pointer">اختر هذه الخطة</Link>
          </div>

          {/* Plan 3 */}
          <div className="bg-slate-900/60 border-2 border-emerald-500 rounded-3xl p-4.5 xs:p-6 space-y-4 xs:space-y-5 relative">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-slate-950 font-black text-[8px] xs:text-[9px] px-2.5 py-0.5 xs:px-3 xs:py-1 rounded-full uppercase tracking-wider">الأكثر طلباً</span>
            <h3 className="font-bold text-emerald-400 text-xs xs:text-sm">الخطة الاحترافية (Pro)</h3>
            <div className="space-y-1">
              <span className="text-2xl xs:text-3xl font-black text-white">5,000 DA</span>
              <span className="text-slate-400 text-[10px] xs:text-xs block">شهرياً</span>
            </div>
            <ul className="space-y-2 xs:space-y-2.5 text-[11px] xs:text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>صفحات بيع غير محدودة</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>إحصائيات تفصيلية كاملة</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>تكامل بكسل فيسبوك وتيك توك</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>دعم فني ذو أولوية 24/7</span></li>
            </ul>
            <Link href="/auth/signup" className="w-full text-center py-2 xs:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs block cursor-pointer">ابدأ مع الخطة الاحترافية</Link>
          </div>

          {/* Plan 4 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-4.5 xs:p-6 space-y-4 xs:space-y-5">
            <h3 className="font-bold text-gray-400 text-xs xs:text-sm">الوكالات (Agency)</h3>
            <div className="space-y-1">
              <span className="text-2xl xs:text-3xl font-black text-white">15,000 DA</span>
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
