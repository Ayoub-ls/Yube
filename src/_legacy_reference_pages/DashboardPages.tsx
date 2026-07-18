// src/pages/DashboardPages.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { LandingPage, Order } from '../types';
import { 
  Plus, FileText, ExternalLink, Copy, Trash, Edit, 
  CheckCircle, AlertTriangle, FileSpreadsheet, Eye, ClipboardCheck
} from 'lucide-react';

export default function DashboardPages() {
  const navigate = useNavigate();
  const client = db.auth.getCurrentUser();

  const [pages, setPages] = useState<LandingPage[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchData = async () => {
    if (!client) return;
    try {
      const pList = await db.pages.list(client.id);
      const oList = await db.orders.list(client.id);
      setPages(pList);
      setOrders(oList);
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
    fetchData();
  }, [client, navigate]);

  const handleCopyLink = (page: LandingPage) => {
    if (!client) return;
    const fullUrl = `${window.location.origin}/${client.slug}/${page.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(page.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeletePage = async (pageId: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف صفحة الهبوط هذه نهائياً؟')) return;
    try {
      await db.pages.delete(pageId);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: LandingPage['status']) => {
    switch (status) {
      case 'pending_review':
        return <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">⏳ قيد المراجعة</span>;
      case 'live':
        return <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">🟢 منشورة (حية)</span>;
      case 'rejected':
        return <span className="inline-block px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">❌ مرفوضة</span>;
      case 'draft':
        return <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full">📝 مسودة</span>;
    }
  };

  const getTemplateName = (id: LandingPage['template_id']) => {
    switch (id) {
      case 'simple': return 'صفحة بسيطة';
      case 'multivariant': return 'خيارات متعددة';
      case 'premium': return 'بريميوم النخبة';
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">إدارة صفحات الهبوط 📄</h1>
          <p className="text-sm text-gray-500 mt-1">تتبع حالة مراجعة وتفعيل صفحات البيع، وانسخ روابطها لتبدأ حملاتك التسويقية.</p>
        </div>

        <Link 
          to="/dashboard/pages/new" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>إنشاء صفحة جديدة</span>
        </Link>
      </div>

      {/* Pages Lists */}
      <div className="grid grid-cols-1 gap-4">
        {pages.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-4">
            <FileText className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-bold text-gray-800 text-lg">لم تقم بإنشاء أي صفحات هبوط بعد</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">ابدأ بإنشاء أول صفحة هبوط لمنتجك لتتمكن من مشاركتها واستقبال مبيعاتك.</p>
            <Link 
              to="/dashboard/pages/new" 
              className="inline-block bg-slate-950 text-white font-bold px-6 py-3 rounded-xl text-xs hover:bg-slate-800 transition"
            >
              + ابدأ البناء الآن خطوة بخطوة
            </Link>
          </div>
        ) : (
          pages.map((page) => {
            const pageOrders = orders.filter(o => o.landing_page_id === page.id);
            return (
              <div key={page.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-200 transition duration-150">
                
                {/* Meta details */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-gray-900 text-lg">{page.product_name}</h3>
                    {getStatusBadge(page.status)}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
                    <span>قالب العرض: <strong className="text-gray-600 font-bold">{getTemplateName(page.template_id)}</strong></span>
                    <span>سعر البيع: <strong className="text-gray-600 font-bold">{page.price.toLocaleString()} دج</strong></span>
                    <span className="flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                      <span>عدد المبيعات: <strong className="text-emerald-600 font-extrabold">{pageOrders.length} طلبية</strong></span>
                    </span>
                  </div>

                  {page.status === 'rejected' && page.rejection_reason && (
                    <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-100 mt-2 font-medium">
                      ⚠️ سبب رفض النشر من الإدارة: <strong className="underline">{page.rejection_reason}</strong>
                    </div>
                  )}
                </div>

                {/* Direct Page Link Preview */}
                <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
                  {/* Public link copy button (only enabled if live) */}
                  {page.status === 'live' && (
                    <>
                      <button
                        onClick={() => handleCopyLink(page)}
                        className="px-3 py-2 text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        {copiedId === page.id ? (
                          <>
                            <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                            <span>تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>نسخ رابط الصفحة</span>
                          </>
                        )}
                      </button>
                      
                      <a 
                        href={`/${client?.slug}/${page.slug}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-3 py-2 text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>فتح الرابط</span>
                      </a>
                    </>
                  )}

                  {/* Edit button */}
                  <button
                    onClick={() => navigate(`/dashboard/pages/new`)} // Re-opening builder or standard mock edit
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                    title="تعديل الصفحة"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete button (only if draft or rejected as requested) */}
                  {(page.status === 'draft' || page.status === 'rejected' || page.status === 'pending_review') ? (
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition cursor-pointer"
                      title="حذف الصفحة"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>

              </div>
            )
          })
        )}
      </div>

    </div>
  );
}
