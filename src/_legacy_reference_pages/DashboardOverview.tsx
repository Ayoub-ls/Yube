// src/pages/DashboardOverview.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { LandingPage } from '../types';
import KPICards from '../components/dashboard/KPICards';
import { 
  Plus, FileText, ArrowLeft, ExternalLink, Calendar, 
  HelpCircle, Eye, AlertCircle
} from 'lucide-react';

export default function DashboardOverview() {
  const navigate = useNavigate();
  const client = db.auth.getCurrentUser();

  const [stats, setStats] = useState({
    totalOrders: 0,
    deliveredOrders: 0,
    confirmedOrders: 0,
    totalSales: 0,
    conversionRate: 0,
    pagesCount: 0
  });
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!client) return;
    try {
      const s = await db.clients.getStats(client.id);
      setStats(s);

      const pList = await db.pages.list(client.id);
      setPages(pList.slice(0, 5)); // show top 5 recent pages
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!client) {
      navigate('/auth/login');
      return;
    }
    fetchDashboardData();
  }, [client, navigate]);

  const getStatusBadge = (status: LandingPage['status']) => {
    switch (status) {
      case 'pending_review':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">⏳ قيد المراجعة</span>;
      case 'live':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">🟢 منشورة</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">❌ مرفوضة</span>;
      case 'draft':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full">📝 مسودة</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="border-4 border-emerald-500 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">أهلاً بك، {client?.business_name} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">تتبع أداء مبيعاتك وأحدث صفحات الهبوط المنتجة لمتجرك.</p>
        </div>
        
        <Link 
          to="/dashboard/pages/new" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>إنشاء صفحة جديدة</span>
        </Link>
      </div>

      {/* KPI Stats Panel */}
      <KPICards stats={stats} />

      {/* Recent Landing Pages Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-50">
          <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <span>آخر صفحات الهبوط المنشأة</span>
          </h3>
          <Link to="/dashboard/pages" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-0.5">
            <span>عرض كل الصفحات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="py-12 text-center text-gray-400 space-y-3">
            <AlertCircle className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm">لم تقم بإنشاء أي صفحة هبوط حتى الآن.</p>
            <Link to="/dashboard/pages/new" className="inline-block px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition">
              ابدأ في بناء صفحتك الأولى 🚀
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pages.map((page) => (
              <div key={page.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-black text-gray-900 text-base">{page.product_name}</h4>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
                    <span>قالب: <strong className="text-gray-600">{page.template_id === 'simple' ? 'صفحة بسيطة' : page.template_id === 'multivariant' ? 'خيارات متعددة' : 'النخبة الفاخرة'}</strong></span>
                    <span>سعر البيع: <strong className="text-gray-600">{page.price.toLocaleString()} دج</strong></span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(page.created_at).toLocaleDateString('ar-DZ')}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Status */}
                  {getStatusBadge(page.status)}
                  
                  {/* Public Link button if live */}
                  {page.status === 'live' ? (
                    <a 
                      href={`/${client?.slug}/${page.slug}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition"
                      title="معاينة الصفحة الحية"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <button 
                      onClick={() => navigate(`/dashboard/pages`)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 rounded-xl transition cursor-pointer"
                      title="إدارة الصفحة"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
