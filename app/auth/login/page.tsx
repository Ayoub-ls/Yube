'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from '../actions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '../../../lib/analytics';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';

const initialState = {
  error: '',
  success: false,
  destination: undefined as string | undefined,
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
          <span>جاري تسجيل الدخول...</span>
        </>
      ) : (
        <span>تسجيل الدخول</span>
      )}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login as any, initialState);
  const router = useRouter();

  useEffect(() => {
    if ((state as any)?.success && (state as any)?.destination) {
      trackEvent('login', { method: 'email' });
      router.push((state as any).destination);
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden" dir="rtl">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header/Logo */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-90 transition">
            <Image src="/logo-icon.png" alt="Yube" width={36} height={36} priority />
            <span className="text-2xl font-black text-white tracking-tight">Yube</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-200">مرحباً بك مجدداً في حسابك</h2>
          <p className="text-xs text-slate-400">أدخل بياناتك للوصول إلى لوحة التحكم الخاصة بك</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/40 border border-slate-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold text-center">
                ⚠️ {state.error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-3 pr-10 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition text-left font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">كلمة المرور</label>
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

          <div className="text-center pt-2 border-t border-slate-900/60">
            <p className="text-xs text-slate-400">
              ليس لديك حساب بعد؟{' '}
              <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300 font-bold transition">
                أنشئ حساباً مجانياً الآن
              </Link>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition">
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
