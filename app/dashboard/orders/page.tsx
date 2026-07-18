import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { OrderRow } from './OrderRow';
import { ShoppingCart } from 'lucide-react';

export default async function DashboardOrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!client) redirect('/auth/login');

  const { data: orders } = await supabase
    .from('orders')
    .select('*, landing_pages(price)')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false });

  const orderList = orders || [];
  const totalRevenue = orderList
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.quantity || 1), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900">الطلبيات</h1>
        <p className="text-xs text-slate-400 mt-1">{orderList.length} طلبية إجمالية</p>
      </div>

      {orderList.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-2">
          <ShoppingCart className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm text-slate-400">لا توجد طلبيات بعد</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold">
                <tr>
                  <th className="px-4 py-3">الزبون</th>
                  <th className="px-4 py-3">الهاتف</th>
                  <th className="px-4 py-3">المنتج</th>
                  <th className="px-4 py-3">الولاية</th>
                  <th className="px-4 py-3">الكمية</th>
                  <th className="px-4 py-3">التاريخ</th>
                  <th className="px-4 py-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orderList.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
