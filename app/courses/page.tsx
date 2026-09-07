import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, PlayCircle } from 'lucide-react';

const courses = [
  {
    title: 'دورة إعلانات Facebook',
    description: 'تعلّم كيف تؤثر مؤشرات CTR وCVR وCR وCAC على ربحية إعلاناتك.',
    src: '/app/CRMcrs.mp4',
  },
  {
    title: 'دورة صفحات الهبوط',
    description: 'تعلّم لماذا قد تكون صفحات الهبوط أفضل لتحويل زيارات الإعلانات وكيف تعمل.',
    src: '/app/CRMcrs2.mp4',
  },
];

const introduction = {
  title: 'مقدمة الدورات',
  description: 'شاهد هذه المقدمة أولاً لتتعرف على ما ستتعلمه وكيف تستفيد من الدروس القادمة.',
  src: '/app/introcrs.mp4',
};

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans" dir="rtl">
      <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <Image src="/logo-full.png" alt="Yube" width={100} height={55} priority />
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/" className="hidden text-sm font-bold text-slate-400 transition hover:text-white sm:inline-flex">
              الرئيسية
            </Link>
            <Link href="/auth/signup" className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-emerald-600">
              ابدأ الآن
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
            <BookOpen className="h-3.5 w-3.5" />
            دورات مجانية
          </span>
          <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-5xl">تعلّم قبل ما تبدأ</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            دروس قصيرة وعملية تساعدك على تحسين إعلاناتك وصفحات الهبوط وزيادة مبيعاتك.
          </p>
        </div>

        <article className="relative mx-auto mt-12 max-w-md overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-900/60 p-5 shadow-2xl shadow-emerald-500/10 sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
              <PlayCircle className="h-5 w-5" />
            </span>
            <div>
              <span className="text-xs font-bold text-emerald-400">ابدأ من هنا</span>
              <h2 className="mt-0.5 text-lg font-black text-white">{introduction.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">{introduction.description}</p>
            </div>
          </div>

          <div className="relative mx-auto aspect-[9/16] w-full max-w-[290px] overflow-hidden rounded-[2rem] border-[8px] border-slate-950 bg-black ring-1 ring-slate-700">
            <div className="pointer-events-none absolute left-1/2 top-2 z-10 h-3 w-16 -translate-x-1/2 rounded-full bg-slate-950" />
            <video src={introduction.src} controls preload="metadata" className="h-full w-full object-cover" />
          </div>
        </article>

        <div className="relative mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {courses.map((course) => (
            <article key={course.src} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-5 shadow-2xl shadow-emerald-500/5 sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <PlayCircle className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-white">{course.title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">{course.description}</p>
                </div>
              </div>

              <div className="relative mx-auto aspect-[9/16] w-full max-w-[290px] overflow-hidden rounded-[2rem] border-[8px] border-slate-950 bg-black ring-1 ring-slate-700">
                <div className="pointer-events-none absolute left-1/2 top-2 z-10 h-3 w-16 -translate-x-1/2 rounded-full bg-slate-950" />
                <video src={course.src} controls preload="metadata" className="h-full w-full object-cover" />
              </div>
            </article>
          ))}
        </div>

        <div className="relative mt-12 text-center">
          <Link href="/auth/signup" className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 active:scale-[0.98]">
            أنشئ حسابك وابدأ مجاناً
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="mt-5">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-slate-300">
              <ArrowRight className="h-3.5 w-3.5" />
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
