'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '../actions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '../../../lib/analytics';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Lock, Mail, StoreIcon, Phone, Loader2, MailCheck } from 'lucide-react';

const initialState = {
  error: '',
  success: false,
  needsEmailConfirmation: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/10 transition transform active:scale-[0.98] cursor-pointer text-sm"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>جاري إنشاء الحساب...</span>
        </>
      ) : (
        <span>إنشاء الحساب والبدء مجاناً</span>
      )}
    </button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useFormState(signup as any, initialState);
  const router = useRouter();

  useEffect(() => {
    const s = state as any;
    if (s?.success) {
      trackEvent('sign_up', { method: 'phone' });
      if (!s.needsEmailConfirmation && s.destination) {
        router.push(s.destination);
      }
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden" dir="rtl">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md md:max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center relative z-10 py-6">

        {/* Right Column: Signup form and logo/header */}
        <div className="md:col-span-6 w-full space-y-6">
          {/* Header/Logo */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 hover:opacity-90 transition">
              <Image src="/logo-icon.png" alt="Yube" width={36} height={36} priority />
              <span className="text-2xl font-black text-white tracking-tight">Yube</span>
            </Link>
            <h2 className="text-xl font-bold text-slate-200">ابدأ رحلتك الإعلانية وزد مبيعاتك</h2>
            <p className="text-xs text-slate-400">سجل حسابك مجاناً اليوم وجرب جميع المميزات لمدة شهر واحد</p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/40 border border-slate-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            {(state as any)?.needsEmailConfirmation ? (
              <div className="text-center space-y-4 py-4">
                <div className="flex justify-center">
                  <div className="bg-emerald-500/10 p-4 rounded-full">
                    <MailCheck className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white">تم إنشاء حسابك بنجاح! تحقق من بريدك الإلكتروني 📩</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  أرسلنا رابط تأكيد إلى بريدك الإلكتروني. يرجى فتح الرابط لتفعيل حسابك، ثم تسجيل الدخول.
                </p>
                <Link
                  href="/auth/login"
                  className="inline-block bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm px-6 py-3 rounded-xl transition"
                >
                  الذهاب لتسجيل الدخول
                </Link>
              </div>
            ) : (
              <form action={formAction} className="space-y-4">
                {state?.error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold text-center">
                    ⚠️ {state.error}
                  </div>
                )}

                {/* Business Name Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">اسم متجرك / علامتك التجارية *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                      <StoreIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="businessName"
                      required
                      placeholder="مثال: أنصار ستور - Ansar Store"
                      className="w-full pl-3 pr-10 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                {/* WhatsApp Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">رقم الواتساب (اختياري)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="whatsapp"
                      placeholder="مثال: +213555123456"
                      className="w-full pl-3 pr-10 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition text-left font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">رقم الهاتف *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="مثال: 0555123456"
                      className="w-full pl-3 pr-10 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition text-left font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">كلمة المرور *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-3 pr-10 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition text-left font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <SubmitButton />
                </div>
              </form>
            )}

            {!(state as any)?.needsEmailConfirmation && (
              <div className="text-center pt-2 border-t border-slate-900/60">
                <p className="text-xs text-slate-400">
                  لديك حساب بالفعل؟{' '}
                  <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition">
                    سجل الدخول هنا
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للرئيسية</span>
            </Link>
          </div>
        </div>

        {/* Left Column: Educational video (Desktop side-by-side, Mobile stacked at bottom) */}
        <div className="md:col-span-6 w-full flex flex-col items-center text-center space-y-5 bg-slate-900/20 border border-slate-900/60 rounded-3xl p-6 sm:p-8 mt-4 md:mt-0">
          <div className="space-y-2 max-w-sm">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
              💡 تعلم التجارة الإلكترونية الصحيحة
            </span>
            <h3 className="text-sm sm:text-base font-black text-white leading-tight">
              قبل ما تبدأ، خليني نوريلك كيفاش يخدم الـEcommerce Funnel
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
              فيديو مجاني باش تفهم وين تروح الميزانية تاعك وكيفاش Yube تقدر تعاونك.
            </p>
          </div>

          {/* Smartphone mockup containing the vertical video */}
          <div className="relative w-full max-w-[210px] xs:max-w-[230px] md:h-[400px] lg:h-[440px] aspect-[9/20] rounded-[2rem] border-[8px] border-slate-900 bg-slate-950 shadow-2xl shadow-emerald-500/10 ring-1 ring-slate-800 flex flex-col justify-between overflow-hidden">

            {/* Dynamic Island / Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-900 rounded-full z-20 flex items-center justify-center">
              <div className="w-6 h-0.5 bg-slate-800 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-slate-800 rounded-full ml-1"></div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-18 h-0.5 bg-slate-800/80 rounded-full z-20"></div>

            {/* Video Element */}
            <div className="w-full h-full rounded-[1.4rem] overflow-hidden bg-slate-950 relative">
              <video
                src="/app/CRMcrs.mp4"
                controls
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
