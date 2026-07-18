import { getAllClientsForAdmin } from '../../../lib/data';
import { PlanBadge } from './PlanBadge';
import { StatusToggle } from './StatusToggle';
import { PlanEditor } from './PlanEditor';

export default async function AdminClientsPage() {
  const clients = await getAllClientsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900">العملاء</h1>
        <p className="text-xs text-slate-400 mt-1">{clients.length} عميل مسجل على المنصة</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold">
              <tr>
                <th className="px-4 py-3">المتجر</th>
                <th className="px-4 py-3">البريد الإلكتروني</th>
                <th className="px-4 py-3">الخطة</th>
                <th className="px-4 py-3">تنتهي في</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">خيارات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client: any) => (
                <tr key={client.id}>
                  <td className="px-4 py-3 font-bold text-slate-800">{client.business_name}</td>
                  <td className="px-4 py-3 text-slate-500" dir="ltr">{client.email}</td>
                  <td className="px-4 py-3">
                    <PlanBadge plan={client.plan} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    <ExpiryLabel expiresAt={client.plan_expires_at} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        client.status === 'active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {client.status === 'active' ? 'نشط' : 'موقوف'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <PlanEditor clientId={client.id} currentPlan={client.plan} />
                      <StatusToggle clientId={client.id} currentStatus={client.status} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {clients.length === 0 && (
          <p className="text-center text-xs text-slate-400 py-10">لا يوجد عملاء بعد</p>
        )}
      </div>
    </div>
  );
}

function ExpiryLabel({ expiresAt }: { expiresAt: string | null }) {
  if (!expiresAt) {
    return <span className="text-slate-300">—</span>;
  }

  const expiry = new Date(expiresAt);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const formatted = expiry.toLocaleDateString('ar-DZ', { year: 'numeric', month: 'short', day: 'numeric' });

  if (diffDays < 0) {
    return (
      <span className="text-red-500 font-bold">
        منتهي ({formatted})
      </span>
    );
  }
  if (diffDays <= 3) {
    return (
      <span className="text-amber-600 font-bold">
        {formatted} (باقي {diffDays} يوم)
      </span>
    );
  }
  return <span>{formatted}</span>;
}
