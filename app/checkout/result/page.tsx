'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertTriangle, Loader2, LayoutGrid, RefreshCw, ArrowLeft } from 'lucide-react';
import { createClient } from '../../../lib/supabase/client';

export default function CheckoutResultPage() {
  const [status, setStatus] = useState<'checking' | 'success' | 'pending' | 'failed'>('checking');
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  const checkStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: client, error } = await supabase
        .from('clients')
        .select('plan, plan_expires_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !client) {
        console.error('Error fetching client status:', error);
        setStatus('failed');
        return;
      }

      const isActive = client.plan === 'introductory' && client.plan_expires_at && 
        new Date(client.plan_expires_at).getTime() > Date.now();

      if (isActive) {
        setStatus('success');
        setPlanExpiresAt(client.plan_expires_at);
      } else {
        if (attempts < 5) {
          // Keep checking
          setStatus('checking');
        } else {
          setStatus('pending');
        }
      }
    } catch (err) {
      console.error('Unexpected error checking status:', err);
      setStatus('failed');
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    if (status === 'checking' && attempts < 5) {
      const timer = setTimeout(() => {
        setAttempts((prev) => prev + 1);
        checkStatus();
      }, 2500); // Check every 2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [status, attempts]);

  const formattedDate = planExpiresAt
    ? new Date(planExpiresAt).toLocaleDateString('ar-DZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden" dir="rtl">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 relative z-10 text-center">
        {/* Logo */}
        <div className="inline-flex items-center gap-2">
          <Image src="/logo-icon.png" alt="Yube" width={36} height={36} priority />
          <span className="text-2xl font-black text-white tracking-tight">Yube</span>
        </div>

        {/* Card */}
        <div className="bg-slate-900/40 border border-slate-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          {status === 'checking' && (
            <div className="space-y-4 py-4">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
              <h2 className="text-lg font-bold text-slate-200">جاري التحقق من عملية الدفع...</h2>
              <p className="text-xs text-slate-400">يرجى الانتظار بضع ثوانٍ بينما نؤكد إتمام الدفع مع RedotPay.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-200">تم تفعيل حسابك بنجاح!</h2>
                <p className="text-xs text-slate-400">شكراً لك، تم استلام الدفعة بقيمة 1$ وتنشيط وصولك بالكامل.</p>
              </div>

              <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4 text-xs space-y-2 text-right">
                <div className="flex justify-between">
                  <span className="text-slate-500">خطة الاشتراك:</span>
                  <span className="font-bold text-slate-300">العرض التعريفي ($1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">تاريخ انتهاء الصلاحية:</span>
                  <span className="font-bold text-emerald-400">{formattedDate}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>الدخول إلى لوحة التحكم</span>
              </button>
            </div>
          )}

          {status === 'pending' && (
            <div className="space-y-6 py-2">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-slate-200">لم يتم تأكيد الدفع بعد</h2>
                <p className="text-xs text-slate-400">قد تستغرق معالجة الدفعة من الشبكة دقيقة أو دقيقتين إضافيتين.</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setAttempts(0);
                    setStatus('checking');
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>تحديث الحالة يدوياً</span>
                </button>

                <Link
                  href="/checkout"
                  className="w-full border border-slate-800 hover:bg-slate-900/50 text-slate-400 font-bold py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>العودة لصفحة الدفع</span>
                </Link>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="space-y-6 py-2">
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-slate-200">فشلت عملية التحقق</h2>
                <p className="text-xs text-slate-400">حدث خطأ أثناء تحميل بيانات اشتراكك. يرجى تسجيل الدخول مجدداً أو المحاولة لاحقاً.</p>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 block"
              >
                <span>العودة والمحاولة مرة أخرى</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
