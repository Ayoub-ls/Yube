import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Phone, ShieldCheck, Sparkles, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { logout } from '../auth/actions';

export const revalidate = 0;

export default async function PaymentPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch client details
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!client) {
    redirect('/auth/login');
  }

  // Fetch latest subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // If active and not expired, redirect to dashboard
  if (subscription && subscription.status === 'active') {
    const isExpired = subscription.expires_at
      ? new Date(subscription.expires_at).getTime() < Date.now()
      : false;
    if (!isExpired) {
      redirect('/dashboard');
    }
  }

  const isExpiredState = subscription?.status === 'expired' || 
    (subscription?.status === 'active' && subscription.expires_at && new Date(subscription.expires_at).getTime() < Date.now());
  const isPendingState = !subscription || subscription.status === 'pending_payment';

  // Configurable WhatsApp support number
  const supportWhatsapp = process.env.YUBE_SUPPORT_WHATSAPP || '213555555555';
  
  // Messages and links
  let whatsappMsg = '';
  if (isPendingState) {
    whatsappMsg = 'سلام، سجلت في Yube وحاب نكمل الدفع تاع الشهر الأول بـ $1.';
  } else {
    whatsappMsg = 'سلام، حاب نجدد اشتراكي في Yube بـ 100$ للشهر.';
  }

  const encodedMsg = encodeURIComponent(whatsappMsg);
  const whatsappUrl = `https://wa.me/${supportWhatsapp}?text=${encodedMsg}`;

  // Customer phone number to display
  const customerPhone = client.whatsapp || '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden" dir="rtl">
      {/* Background neon glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-4 relative z-10">
        <div className="flex items-center gap-2">
          <Image src="/logo-icon.png" alt="Yube" width={32} height={32} priority />
          <span className="text-xl font-black text-white tracking-tight">Yube</span>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-slate-900/50 px-3 py-2 rounded-xl transition border border-slate-900 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </form>
      </header>

      {/* Main Content */}
      <main className="max-w-md w-full mx-auto my-auto py-8 relative z-10">
        <div className="w-full bg-slate-900/60 border border-slate-900 backdrop-blur-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
          
          {isPendingState ? (
            // PENDING PAYMENT STATE
            <>
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 text-xs font-bold w-fit">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>باقي خطوة وحدة 🚀</span>
                </div>
                
                <h1 className="text-2xl font-black text-white leading-tight">
                  سجلنا حسابك بنجاح.
                </h1>
                
                <p className="text-xs text-slate-400 leading-relaxed px-2">
                  باش نفعّلو حسابك لمدة شهر كامل بـ $1، راح نتواصلو معاك على WhatsApp باش نكملو الدفع.
                </p>
              </div>

              {/* Price Details */}
              <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-900">
                  <span className="text-xs font-bold text-slate-400">العرض الترحيبي</span>
                  <div className="text-left">
                    <span className="text-2xl font-black text-emerald-400">$1</span>
                    <span className="text-[10px] text-slate-500 block">الشهر الأول</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">السعر العادي بعد الشهر الأول</span>
                  <span className="font-bold text-slate-300">$100 / شهرياً</span>
                </div>
              </div>
            </>
          ) : (
            // EXPIRED STATE
            <>
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 px-3 py-1.5 rounded-full border border-red-500/20 text-xs font-bold w-fit">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>انتهت الفترة التجريبية تاعك ⚠️</span>
                </div>
                
                <h1 className="text-2xl font-black text-white leading-tight">
                  اشتراكك غير نشط حالياً
                </h1>
                
                <p className="text-xs text-slate-400 leading-relaxed px-2">
                  إذا حبيت تكمل مع Yube، تواصل معانا على WhatsApp لتجديد الاشتراك بـ $100/month.
                </p>
              </div>

              {/* Price Details */}
              <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-900">
                  <span className="text-xs font-bold text-slate-400">خطة التجديد</span>
                  <div className="text-left">
                    <span className="text-2xl font-black text-red-400">$100</span>
                    <span className="text-[10px] text-slate-500 block">شهرياً (يدوي)</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Customer Number display if available */}
          {customerPhone && (
            <div className="bg-slate-950/40 border border-slate-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <span>رقم هاتفك المسجل:</span>
              <span className="font-bold text-slate-200 font-mono" dir="ltr">{customerPhone}</span>
            </div>
          )}

          {/* Info Card */}
          <div className="bg-blue-500/5 border border-blue-500/10 text-[10px] text-blue-400 p-3.5 rounded-xl flex items-start gap-2 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              {isPendingState
                ? "الدفع والتفعيل يتم يدوياً وبشكل آمن تماماً. لن نقوم باقتطاع أي مبالغ إضافية بشكل تلقائي."
                : "بعد إرسال تأكيد الدفع عبر الواتساب، سيقوم فريقنا بتمديد حسابك وتفعيله في غضون دقائق معدودة."}
            </span>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 text-center text-sm"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            <span>تواصل معنا عبر WhatsApp لتفعيل الحساب</span>
          </a>

          {/* Refresh Check (Manual Poll) */}
          <a
            href="/payment"
            className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-300 font-bold py-3 px-6 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer text-center text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            <span>تحديث حالة الاشتراك بعد الدفع</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center py-6 border-t border-slate-900/50 text-[10px] text-slate-500 relative z-10">
        &copy; {new Date().getFullYear()} Yube. جميع الحقوق محفوظة. مخصص للتجارة الإلكترونية بالجزائر.
      </footer>
    </div>
  );
}
