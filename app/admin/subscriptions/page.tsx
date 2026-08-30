import { createClient } from '../../../lib/supabase/server';
import { ActivateButton } from './ActivateButton';
import { Calendar, DollarSign, Users, ShieldAlert, CheckCircle2, AlertTriangle, PhoneCall, ExternalLink } from 'lucide-react';

export const revalidate = 0;

export default async function AdminSubscriptionsPage() {
  const supabase = createClient();

  // Fetch clients along with all subscriptions associated
  const { data: clients, error } = await supabase
    .from('clients')
    .select(`
      id,
      business_name,
      slug,
      email,
      whatsapp,
      plan,
      plan_expires_at,
      status,
      created_at,
      subscriptions (
        id,
        plan,
        amount,
        currency,
        status,
        started_at,
        expires_at,
        created_at
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin subscriptions:', error);
  }

  // Map clients to get their latest subscription status
  const clientRows = (clients || []).map((c) => {
    // Sort subscriptions descending by created_at to get the latest one
    const sortedSubs = [...(c.subscriptions || [])].sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const latestSub = sortedSubs[0] || null;

    let subStatus = 'no_subscription';
    let expiresAt = c.plan_expires_at ? new Date(c.plan_expires_at) : null;
    let isExpired = expiresAt ? expiresAt.getTime() < Date.now() : false;

    if (latestSub) {
      subStatus = latestSub.status;
      if (latestSub.expires_at) {
        expiresAt = new Date(latestSub.expires_at);
        isExpired = expiresAt.getTime() < Date.now();
      }
    }

    // Force expired if active but date is past
    if (subStatus === 'active' && isExpired) {
      subStatus = 'expired';
    }

    return {
      ...c,
      latestSub,
      subStatus,
      expiresAt,
      isExpired,
    };
  });

  // Calculate counts
  const totalCount = clientRows.length;
  const pendingCount = clientRows.filter((r) => r.subStatus === 'pending_payment').length;
  const activeCount = clientRows.filter((r) => r.subStatus === 'active').length;
  const expiredCount = clientRows.filter((r) => r.subStatus === 'expired').length;

  const translateStatus = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'pending_payment':
        return 'بانتظار الدفع';
      case 'expired':
        return 'منتهي';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'لا يوجد اشتراك';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'pending_payment':
        return 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse';
      case 'expired':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900">إدارة اشتراكات العملاء</h1>
        <p className="text-xs text-slate-500 mt-1">تفعيل الاشتراكات يدوياً للعملاء ومتابعة حالة الدفع والانتهاء</p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">إجمالي العملاء</span>
            <h3 className="text-base font-black text-slate-900 mt-0.5">{totalCount} عميل</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">بانتظار الدفع</span>
            <h3 className="text-base font-black text-slate-950 mt-0.5">{pendingCount} طلب</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">الاشتراكات النشطة</span>
            <h3 className="text-base font-black text-slate-900 mt-0.5">{activeCount} نشط</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">الاشتراكات المنتهية</span>
            <h3 className="text-base font-black text-slate-900 mt-0.5">{expiredCount} منتهي</h3>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xs font-bold text-slate-700">قائمة المشتركين وتأكيدات الدفع</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-100 font-bold">
              <tr>
                <th className="px-6 py-4">العميل / المتجر</th>
                <th className="px-6 py-4">معلومات الاتصال</th>
                <th className="px-6 py-4">الخطة الحالية</th>
                <th className="px-6 py-4">المبلغ</th>
                <th className="px-6 py-4">تاريخ الانتهاء</th>
                <th className="px-6 py-4 text-center">الحالة</th>
                <th className="px-6 py-4 text-center">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {clientRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                    لا يوجد أي عملاء مسجلين حالياً.
                  </td>
                </tr>
              ) : (
                clientRows.map((r) => {
                  const hasPendingOrExpired = r.subStatus === 'pending_payment' || r.subStatus === 'expired';
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-900">{r.business_name}</span>
                          <span className="text-[10px] text-slate-400 font-mono" dir="ltr">@{r.slug}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-slate-800">{r.email}</span>
                          {r.whatsapp && (
                            <a
                              href={`https://wa.me/${r.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:underline w-fit"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span dir="ltr">{r.whatsapp}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 capitalize">
                          {r.latestSub?.plan === 'intro' ? 'العرض الأول (240 da)' : r.plan || 'بدون خطة'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {r.latestSub ? (r.latestSub.currency === 'USD' ? `$${Number(r.latestSub.amount)}` : `${Number(r.latestSub.amount)} ${r.latestSub.currency || 'DA'}`) : '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {r.expiresAt ? (
                          new Date(r.expiresAt).toLocaleDateString('ar-DZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        ) : (
                          <span className="text-slate-400">لم يحدد بعد</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${getStatusBadgeClass(r.subStatus)}`}>
                          {translateStatus(r.subStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {hasPendingOrExpired ? (
                          <ActivateButton clientId={r.id} businessName={r.business_name} />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">مفعّل بالكامل</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
