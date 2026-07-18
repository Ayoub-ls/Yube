// src/pages/Signup.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { Store, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export default function Signup() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsApp] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!businessName.trim()) {
      setError('يرجى إدخال اسم المتجر أو النشاط التجاري');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن لا تقل عن 6 أحرف');
      return;
    }

    setLoading(true);

    try {
      const { client, error: authErr } = await db.auth.signUp(
        businessName.trim(),
        email.trim().toLowerCase(),
        password,
        whatsapp.trim()
      );

      if (authErr) {
        setError(authErr);
      } else if (client) {
        // Successful signup, redirect to dashboard
        trackEvent('sign_up', {
          method: 'email',
        });
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError('حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xl space-y-6 text-right relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl w-fit mx-auto">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">أنشئ حسابك على Yube 🚀</h2>
          <p className="text-xs text-gray-500">ابدأ تجربة مجانية لمدة 14 يوم - لا تطلب بطاقة ائتمان</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-100 text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4 text-sm text-gray-700">
          <div className="space-y-1">
            <label className="font-bold text-gray-800">اسم متجرك (Business Name):</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="مثال: الفاخر ستور - El Fakher Store"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-800">البريد الإلكتروني:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@store.com"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-left"
              dir="ltr"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-800">كلمة المرور:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-left"
              dir="ltr"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-800">رقم الواتساب الخاص بك (تلقي طلباتك):</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsApp(e.target.value)}
              placeholder="+2135XXXXXXXX"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-left"
              dir="ltr"
            />
          </div>

          <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>بالتسجيل، أنت توافق على شروط وسياسات الخصوصية لمنصة يوب.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition shadow-md shadow-emerald-500/10 cursor-pointer text-sm flex items-center justify-center gap-1.5 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>تسجيل وتفعيل المتجر مجاناً</span>
              </>
            )}
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center text-xs text-gray-500">
          <span>لديك حساب بالفعل؟ </span>
          <Link to="/auth/login" className="text-emerald-600 font-bold hover:underline flex items-center gap-1 justify-center mt-1">
            <span>سجل الدخول من هنا</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
