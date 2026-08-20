import { createClient } from '../../../lib/supabase/server';
import { Calendar, DollarSign, User, ExternalLink, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const supabase = createClient();

  // Fetch payments with client store details
  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      currency,
      status,
      created_at,
      provider,
      provider_payment_id,
      client:clients (
        business_name,
        email,
        whatsapp
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin payments:', error);
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'cancelled':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'paid':
        return 'مدفوع';
      case 'pending':
        return 'معلق';
      case 'failed':
        return 'فشل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const totalPaidCount = payments?.filter((p) => p.status === 'paid').length || 0;
  const totalPaidSum = payments
    ?.filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">سجلات عمليات الدفع</h1>
          <p className="text-xs text-slate-500 mt-1">تتبع عمليات دفع الاشتراكات عبر بوابة RedotPay Connect</p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">إجمالي المبيعات المدفوعة</span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">${totalPaidSum.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">الاشتراكات الناجحة</span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">{totalPaidCount} دفعة</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">إجمالي المعاملات</span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">{payments?.length || 0} معاملة</h3>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-100 font-bold">
              <tr>
                <th className="px-6 py-4">العميل / المتجر</th>
                <th className="px-6 py-4">مبلغ الدفعة</th>
                <th className="px-6 py-4">بوابة الدفع</th>
                <th className="px-6 py-4">رقم المعاملة (Provider ID)</th>
                <th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4 text-center">حالة الدفع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {!payments || payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                    لا توجد أي معاملات دفع مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const clientInfo: any = p.client;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-900">{clientInfo?.business_name || 'متجر غير معروف'}</span>
                          <span className="text-[10px] text-slate-400">{clientInfo?.email || 'بدون بريد'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ${Number(p.amount).toFixed(2)} {p.currency}
                      </td>
                      <td className="px-6 py-4 capitalize text-slate-500">
                        {p.provider}
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] text-slate-500">
                        {p.provider_payment_id || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(p.created_at).toLocaleString('ar-DZ', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${getStatusBadgeClass(p.status)}`}>
                          {translateStatus(p.status)}
                        </span>
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
