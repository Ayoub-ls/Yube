// src/pages/AdminPanel.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { LandingPage, Client } from '../types';
import { 
  Users, CheckCircle, XCircle, FileText, Calendar, 
  ExternalLink, Ban, Check, ShieldAlert, AlertCircle, ShoppingCart
} from 'lucide-react';

import SimpleTemplate from '../components/templates/SimpleTemplate';
import MultivariantTemplate from '../components/templates/MultivariantTemplate';
import PremiumTemplate from '../components/templates/PremiumTemplate';

export default function AdminPanel() {
  const navigate = useNavigate();
  const currentUser = db.auth.getCurrentUser();
  const adminEmail = (import.meta as any).env.VITE_ADMIN_EMAIL || 'ayoublamara52@gmail.com';

  const [activeTab, setActiveTab] = useState<'review' | 'clients'>('review');
  const [pendingPages, setPendingPages] = useState<(LandingPage & { client_business_name: string })[]>([]);
  const [clientsList, setClientsList] = useState<(Client & { pages_count: number; orders_count: number })[]>([]);
  const [loading, setLoading] = useState(true);

  // Rejection modal state
  const [rejectingPageId, setRejectingPageId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Preview modal state
  const [previewPage, setPreviewPage] = useState<LandingPage | null>(null);
  const [previewClient, setPreviewClient] = useState<Client | null>(null);

  const fetchAdminData = async () => {
    try {
      const pages = await db.pages.listPendingReview();
      const clients = await db.clients.list();
      setPendingPages(pages);
      setClientsList(clients);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if authenticated AND is the designated admin email
    if (!currentUser) {
      navigate('/auth/login');
      return;
    }
    if (currentUser.email.toLowerCase() !== adminEmail.toLowerCase()) {
      // If regular user, redirect out of admin
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, [currentUser, navigate]);

  const handleApprove = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من الموافقة على نشر صفحة الهبوط هذه وجعلها حية الآن؟')) return;
    try {
      await db.pages.approve(id);
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenReject = (id: string) => {
    setRejectingPageId(id);
    setRejectionReason('');
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPageId || !rejectionReason.trim()) return;

    try {
      await db.pages.reject(rejectingPageId, rejectionReason.trim());
      setRejectingPageId(null);
      setRejectionReason('');
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSuspend = async (clientItem: Client) => {
    const newStatus = clientItem.status === 'active' ? 'suspended' as const : 'active' as const;
    const confirmMsg = clientItem.status === 'active' 
      ? `هل تريد تجميد حساب العميل ${clientItem.business_name}؟ لن يتمكن من تسجيل الدخول.` 
      : `هل تريد إلغاء تجميد حساب العميل ${clientItem.business_name}؟`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      await db.clients.updateStatus(clientItem.id, newStatus);
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenPreview = async (page: LandingPage) => {
    // Get full client object
    const clientItem = clientsList.find(c => c.id === page.client_id) || null;
    setPreviewClient(clientItem);
    setPreviewPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900" dir="rtl">
        <div className="border-4 border-amber-500 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col" dir="rtl">
      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-2xl shadow">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">لوحة تحكم المشرف الرئيسي</h1>
            <span className="text-[10px] text-slate-400 block mt-0.5">مراجعة وتفعيل صفحات بيع التجار والعملاء في الجزائر</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="px-4.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
        >
          الذهاب للوحة متجري
        </button>
      </header>

      {/* Main body wrapper */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-1 text-sm font-bold">
          <button
            onClick={() => setActiveTab('review')}
            className={`px-6 py-3 border-b-2 transition ${
              activeTab === 'review'
                ? 'border-amber-500 text-amber-500 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            صفحات قيد المراجعة ({pendingPages.length})
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-6 py-3 border-b-2 transition ${
              activeTab === 'clients'
                ? 'border-amber-500 text-amber-500 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            إدارة المشتركين والعملاء ({clientsList.length})
          </button>
        </div>

        {/* Tab content 1 - Pages Review */}
        {activeTab === 'review' && (
          <div className="space-y-4">
            {pendingPages.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-16 text-center text-slate-400 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="font-extrabold text-white text-lg">كل شيء ممتاز!</h3>
                <p className="text-sm">لا توجد أي صفحات هبوط جديدة قيد المراجعة حالياً.</p>
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-400 text-xs font-bold border-b border-slate-800">
                      <th className="py-4 px-6">العميل والمحل</th>
                      <th className="py-4 px-6">اسم السلعة المعروضة</th>
                      <th className="py-4 px-6">نوع قالب العرض</th>
                      <th className="py-4 px-6">السعر</th>
                      <th className="py-4 px-6">تاريخ الإرسال</th>
                      <th className="py-4 px-6 text-left">خيارات المراجعة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-xs text-slate-300">
                    {pendingPages.map((page) => (
                      <tr key={page.id} className="hover:bg-slate-900/20 transition">
                        <td className="py-4 px-6 font-bold text-white">{page.client_business_name}</td>
                        <td className="py-4 px-6 font-semibold">{page.product_name}</td>
                        <td className="py-4 px-6 capitalize">
                          {page.template_id === 'simple' && 'صفحة بسيطة'}
                          {page.template_id === 'multivariant' && 'منتج بخيارات'}
                          {page.template_id === 'premium' && 'بريميوم متميزة'}
                        </td>
                        <td className="py-4 px-6 font-bold text-white">{page.price.toLocaleString()} دج</td>
                        <td className="py-4 px-6 font-mono text-[10px] text-slate-400">
                          {new Date(page.created_at).toLocaleString('ar-DZ')}
                        </td>
                        <td className="py-4 px-6 text-left space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleOpenPreview(page)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition cursor-pointer"
                          >
                            معاينة الصفحة
                          </button>
                          <button
                            onClick={() => handleApprove(page.id)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
                          >
                            نشر وتفعيل
                          </button>
                          <button
                            onClick={() => handleOpenReject(page.id)}
                            className="px-2.5 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-bold rounded-lg border border-red-500/20 transition cursor-pointer"
                          >
                            رفض الطلب
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab content 2 - Clients Dashboard Register */}
        {activeTab === 'clients' && (
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 font-bold border-b border-slate-800">
                  <th className="py-4 px-6">المتجر / العميل</th>
                  <th className="py-4 px-6">البريد الإلكتروني</th>
                  <th className="py-4 px-6">رقم الواتساب</th>
                  <th className="py-4 px-6 text-center">الصفحات</th>
                  <th className="py-4 px-6 text-center">الطلبيات</th>
                  <th className="py-4 px-6">الاشتراك</th>
                  <th className="py-4 px-6">حالة الحساب</th>
                  <th className="py-4 px-6 text-left">التحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {clientsList.map((cl) => (
                  <tr key={cl.id} className="hover:bg-slate-900/20 transition">
                    <td className="py-4 px-6 font-bold text-white">
                      <div className="space-y-0.5">
                        <span className="block">{cl.business_name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">slug: yube.dz/{cl.slug}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400">{cl.email}</td>
                    <td className="py-4 px-6 font-mono">{cl.whatsapp || '-'}</td>
                    <td className="py-4 px-6 text-center font-bold text-white">{cl.pages_count}</td>
                    <td className="py-4 px-6 text-center font-bold text-emerald-400">{cl.orders_count}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-bold rounded-full text-[10px] uppercase">
                        {cl.plan}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {cl.status === 'active' ? (
                        <span className="text-emerald-500 font-bold">🟢 نشط</span>
                      ) : (
                        <span className="text-red-500 font-bold">🔴 مجمد</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-left">
                      <button
                        onClick={() => handleToggleSuspend(cl)}
                        className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer text-[10px] ${
                          cl.status === 'active'
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {cl.status === 'active' ? 'تجميد الحساب' : 'إلغاء التجميد'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal - Reject Reason input form */}
      {rejectingPageId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-right space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span>إدخال سبب الرفض للعميل</span>
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">يرجى توضيح سبب الرفض باختصار ليتمكن التاجر من تعديل الملاحظات وإعادة إرسال الصفحة للتدقيق.</p>
            
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                required
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="مثال: يرجى تحسين جودة الصور المعروضة وتعديل السعر ليكون متناسباً مع دقة السلعة."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-red-500 text-right"
              ></textarea>

              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setRejectingPageId(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition"
                >
                  تأكيد رفض النشر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-Screen Live Template Preview Overlay */}
      {previewPage && previewClient && (
        <div className="fixed inset-0 bg-slate-950 flex flex-col z-50 overflow-hidden" dir="rtl">
          {/* Top header bar */}
          <div className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">معاينة تدقيق الصفحة للعميل: {previewClient.business_name}</span>
              <h2 className="text-sm font-black text-white">{previewPage.product_name} ({previewPage.price.toLocaleString()} دج)</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleApprove(previewPage.id);
                  setPreviewPage(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                الموافقة والنشر الفوري ✅
              </button>
              <button
                onClick={() => {
                  handleOpenReject(previewPage.id);
                  setPreviewPage(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                رفض وإبداء ملاحظة ❌
              </button>
              <button
                onClick={() => setPreviewPage(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>

          {/* Interactive preview render frame */}
          <div className="flex-1 overflow-y-auto bg-slate-50">
            {previewPage.template_id === 'simple' && <SimpleTemplate page={previewPage} client={previewClient} />}
            {previewPage.template_id === 'multivariant' && <MultivariantTemplate page={previewPage} client={previewClient} />}
            {previewPage.template_id === 'premium' && <PremiumTemplate page={previewPage} client={previewClient} />}
          </div>
        </div>
      )}

    </div>
  );
}
