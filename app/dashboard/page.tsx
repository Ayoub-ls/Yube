import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getClientPages } from '../../lib/data';
import { Layout, ShoppingCart, Settings, ArrowLeft } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const pages = client ? await getClientPages(client.id) : [];
  const liveCount = pages.filter((p: any) => p.status === 'live').length;
  const pendingCount = pages.filter((p: any) => p.status === 'pending_review').length;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">أهلاً بك في لوحة تحكم متجرك!</h1>

        {client ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">اسم المتجر:</span>
              <span className="text-xs font-bold text-slate-800">{client.business_name}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">الخطة الحالية:</span>
              <span className="text-xs font-bold text-slate-800">{client.plan}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 leading-relaxed">جاري تحميل بيانات متجرك...</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Layout className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold block">صفحات منشورة</span>
            <span className="text-xl font-black text-slate-800">{liveCount}</span>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold block">قيد المراجعة</span>
            <span className="text-xl font-black text-slate-800">{pendingCount}</span>
          </div>
        </div>
      </div>

      <Link
        href="/dashboard/pages"
        className="flex items-center justify-between bg-slate-900 text-white rounded-2xl p-6 hover:bg-slate-800 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold">إدارة صفحاتي</p>
            <p className="text-[11px] text-slate-400">عرض، إنشاء، ونسخ روابط صفحات البيع</p>
          </div>
        </div>
        <ArrowLeft className="w-4 h-4" />
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/orders"
          className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between h-32 hover:border-emerald-200 transition"
        >
          <div className="space-y-1.5">
            <div className="bg-emerald-50 w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-xs">إدارة الطلبيات والمبيعات</h3>
          </div>
          <span className="text-[9px] text-slate-400 font-bold self-start">عرض كل الطلبيات ←</span>
        </Link>

        <Link
          href="/dashboard/settings"
          className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between h-32 hover:border-emerald-200 transition"
        >
          <div className="space-y-1.5">
            <div className="bg-emerald-50 w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-xs">إعدادات البكسل والحساب</h3>
          </div>
          <span className="text-[9px] text-slate-400 font-bold self-start">تعديل الإعدادات ←</span>
        </Link>
      </div>
    </div>
  );
}
