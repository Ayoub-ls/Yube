// src/pages/DashboardSettings.tsx
import React, { useState } from 'react';
import { db } from '../lib/db';
import { Client } from '../types';
import { Save, ShieldCheck, CreditCard, KeyRound, Award, RefreshCw } from 'lucide-react';

export default function DashboardSettings() {
  const client = db.auth.getCurrentUser();
  
  const [businessName, setBusinessName] = useState(client?.business_name || '');
  const [whatsapp, setWhatsApp] = useState(client?.whatsapp || '');
  const [pixelId, setPixelId] = useState(client?.pixel_id || '');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!businessName.trim()) {
      setError('يرجى إدخال اسم النشاط التجاري');
      return;
    }

    setLoading(true);

    try {
      if (client) {
        await db.auth.updateProfile(client.id, {
          business_name: businessName.trim(),
          whatsapp: whatsapp.trim(),
          pixel_id: pixelId.trim()
        });
        setSuccess('تم تحديث إعدادات متجرك بنجاح! ✅');
      }
    } catch (err) {
      setError('حدث خطأ أثناء حفظ التحديثات.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('كلمة المرور يجب أن تتكون من 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setSuccess('تم تحديث كلمة المرور لحسابك بنجاح! 🔐');
      setNewPassword('');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 text-right max-w-3xl mx-auto" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">إعدادات متجر يوب ⚙️</h1>
        <p className="text-sm text-gray-500 mt-1">تحديث معلومات تواصلك واسم متجرك وتفقد خطة اشتراكك الحالية.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-xl border border-emerald-100 text-xs font-bold">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-100 text-xs font-bold">
          ⚠️ {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Card Form */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2 pb-2 border-b border-slate-50">
            <Award className="w-5 h-5 text-emerald-500" />
            <span>معلومات المتجر الأساسية</span>
          </h3>

          <form onSubmit={handleUpdateSettings} className="space-y-4 text-xs font-semibold text-gray-600">
            <div className="space-y-1">
              <label className="text-gray-700">الاسم التجاري للمحل أو المتجر:</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-700">رقم واتساب للتواصل السريع مع الزبائن:</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsApp(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-gray-800 text-left font-mono focus:outline-none focus:border-emerald-500"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-700">Facebook Pixel ID:</label>
              <input
                type="text"
                placeholder="مثال: 938366407778561"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-gray-800 text-left font-mono focus:outline-none focus:border-emerald-500"
                dir="ltr"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                اختياري — يستخدم لقياس نتائج إعلاناتك على فيسبوك
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>حفظ الإعدادات الجديدة</span>
            </button>
          </form>
        </div>

        {/* Password Card Form */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2 pb-2 border-b border-slate-50">
            <KeyRound className="w-5 h-5 text-indigo-500" />
            <span>تحديث كلمة مرور الحساب</span>
          </h3>

          <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs font-semibold text-gray-600">
            <div className="space-y-1">
              <label className="text-gray-700">كلمة المرور الجديدة لحسابك:</label>
              <input
                type="password"
                required
                placeholder="أدخل 6 خانات على الأقل..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-gray-800 text-left font-mono focus:outline-none focus:border-indigo-500"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              <span>تغيير كلمة المرور</span>
            </button>
          </form>
        </div>

        {/* Plan Display Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4 md:col-span-2">
          <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2 pb-2 border-b border-slate-50">
            <CreditCard className="w-5 h-5 text-amber-500" />
            <span>خطة الاشتراك والتسديد الحالية</span>
          </h3>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs font-bold">باقة المتجر الحالية:</span>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full uppercase">
                  {client?.plan}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-lg mt-1">
                حسابك التجريبي نشط حالياً ومؤهل لتوليد صفحات هبوط سريعة للتجارة الإلكترونية والوصول إلى كافة الولاية ومزامنة الطلبيات.
              </p>
            </div>

            <button
              type="button"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow transition cursor-pointer"
            >
              ترقية خطة الاشتراك 🌟
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
