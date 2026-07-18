import Link from 'next/link';
import Image from 'next/image';
import { Check, ArrowLeft } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-black" dir="rtl">
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-icon.png" alt="Yube" width={32} height={32} priority />
            <span className="text-xl font-black text-white tracking-tight">Yube</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-bold text-slate-300 hover:text-white transition">
              تسجيل الدخول
            </Link>
            <Link
              href="/auth/signup"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-sm font-black px-4.5 py-2.5 rounded-xl transition shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
            >
              <span>ابدأ مجاناً</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-white">خطط اشتراك مرنة تناسب حجم تجارتك 💳</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">ابدأ مجاناً بدون التزام، ورقّ حسابك عندما تكبر مبيعاتك!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-right">
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-5">
            <h3 className="font-bold text-gray-400 text-sm">التجربة المجانية (Trial)</h3>
            <div className="space-y-1">
              <span className="text-3xl font-black text-white">مجاني</span>
              <span className="text-slate-400 text-xs block">لمدة 14 يوم كاملة</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>إنشاء صفحة بيع واحدة</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>توصيل 58 ولاية مدمج</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>لوحة تحكم لإدارة الطلبيات</span></li>
            </ul>
            <Link href="/auth/signup" className="w-full text-center py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs block">ابدأ التجربة المجانية</Link>
          </div>

          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-5">
            <h3 className="font-bold text-gray-400 text-sm">الخطة الأساسية (Basic)</h3>
            <div className="space-y-1">
              <span className="text-3xl font-black text-white">3,000 DA</span>
              <span className="text-slate-400 text-xs block">شهرياً</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>إنشاء حتى 5 صفحات بيع</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>مساحة تخزين صور مجانية</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>تأكيدات سريعة وموثوقة</span></li>
            </ul>
            <Link href="/auth/signup" className="w-full text-center py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs block">اختر هذه الخطة</Link>
          </div>

          <div className="bg-slate-900/60 border-2 border-emerald-500 rounded-3xl p-6 space-y-5 relative">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-slate-950 font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider">الأكثر طلباً</span>
            <h3 className="font-bold text-emerald-400 text-sm">الخطة الاحترافية (Pro)</h3>
            <div className="space-y-1">
              <span className="text-3xl font-black text-white">5,000 DA</span>
              <span className="text-slate-400 text-xs block">شهرياً</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>صفحات بيع غير محدودة</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>إحصائيات تفصيلية كاملة</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>تكامل بكسل فيسبوك وتيك توك</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>دعم فني ذو أولوية 24/7</span></li>
            </ul>
            <Link href="/auth/signup" className="w-full text-center py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs block">ابدأ مع الخطة الاحترافية</Link>
          </div>

          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-5">
            <h3 className="font-bold text-gray-400 text-sm">الوكالات (Agency)</h3>
            <div className="space-y-1">
              <span className="text-3xl font-black text-white">15,000 DA</span>
              <span className="text-slate-400 text-xs block">شهرياً</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>ربط دومين مخصص (White Label)</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>إنشاء حسابات فرعية لموظفيك</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span>تخزين ملفات صوتية غير محدود</span></li>
            </ul>
            <Link href="/auth/signup" className="w-full text-center py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs block">تواصل مع الدعم</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-900 py-12 bg-slate-950 text-center text-sm text-slate-500 space-y-3">
        <div className="flex justify-center items-center gap-2">
          <Image src="/logo-icon.png" alt="Yube" width={24} height={24} />
          <span className="font-black text-white">Yube</span>
        </div>
        <p className="text-xs text-slate-600">جميع الحقوق محفوظة منصة Yube © 2026</p>
      </footer>
    </div>
  );
}
