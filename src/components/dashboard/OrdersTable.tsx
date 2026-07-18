// src/components/dashboard/OrdersTable.tsx
import React, { useState } from 'react';
import { Order, LandingPage } from '../../types';
import { db } from '../../lib/db';
import { 
  Search, Eye, Phone, MapPin, Tag, ShoppingCart, 
  CheckCircle2, XCircle, Truck, RefreshCw, Layers
} from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

interface OrdersTableProps {
  orders: Order[];
  pages: LandingPage[];
  onRefresh: () => void;
}

export default function OrdersTable({ orders, pages, onRefresh }: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Status badge colors styling map
  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusTextAr = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'قيد المراجعة';
      case 'confirmed': return 'مؤكدة';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم الاستلام';
      case 'cancelled': return 'ملغاة';
      default: return status;
    }
  };

  // Filter orders based on state
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      (order.city && order.city.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate prices summary metrics
  const totalOrdersAmount = filteredOrders.reduce((acc, o) => {
    const page = pages.find(p => p.id === o.landing_page_id);
    const price = page ? page.price : 3000;
    return acc + (price * o.quantity);
  }, 0);

  const deliveredOrdersAmount = filteredOrders
    .filter(o => o.status === 'delivered')
    .reduce((acc, o) => {
      const page = pages.find(p => p.id === o.landing_page_id);
      const price = page ? page.price : 3000;
      return acc + (price * o.quantity);
    }, 0);

  const pendingOrdersAmount = filteredOrders
    .filter(o => o.status === 'pending')
    .reduce((acc, o) => {
      const page = pages.find(p => p.id === o.landing_page_id);
      const price = page ? page.price : 3000;
      return acc + (price * o.quantity);
    }, 0);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingId(orderId);
    try {
      await db.orders.updateStatus(orderId, newStatus);

      if (newStatus === 'delivered') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          const page = pages.find(p => p.id === order.landing_page_id);
          const price = page ? page.price : 3000;
          const orderValue = price * order.quantity;

          // GA4 order_delivered
          trackEvent('order_delivered', {
            client_id: order.client_id,
            value: orderValue,
            currency: 'DZD',
            source: order.source || '',
          });

          // FB Pixel Purchase
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Purchase', {
              value: orderValue,
              currency: 'DZD',
              content_ids: [orderId],
              content_type: 'product',
            });
          }
        }
      }

      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* Prices Panel (Summary Analytics for CRM) */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm border border-slate-800">
        <div className="space-y-1">
          <span className="text-slate-400 text-xs font-bold block">إجمالي مبيعات التصفية الحالية</span>
          <h4 className="text-2xl font-black">{totalOrdersAmount.toLocaleString()} دج</h4>
          <span className="text-[10px] text-slate-500 block">تشمل جميع الحالات باستثناء الملغاة</span>
        </div>
        <div className="space-y-1 border-r border-slate-800 pr-6">
          <span className="text-emerald-400 text-xs font-bold block">مجموع المداخيل المحصلة (المستلمة)</span>
          <h4 className="text-2xl font-black text-emerald-400">{deliveredOrdersAmount.toLocaleString()} دج</h4>
          <span className="text-[10px] text-slate-500 block">الأموال النقدية التي تم تسليمها للزبائن فعلياً</span>
        </div>
        <div className="space-y-1 border-r border-slate-800 pr-6">
          <span className="text-amber-400 text-xs font-bold block">حجم الأموال قيد الانتظار (جديدة)</span>
          <h4 className="text-2xl font-black text-amber-400">{pendingOrdersAmount.toLocaleString()} دج</h4>
          <span className="text-[10px] text-slate-500 block">قيمة الطلبات المعلقة التي تتطلب مراجعة وتأكيداً</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث بالاسم، الهاتف، أو الولاية..."
            className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto justify-end">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {st === 'all' && 'الكل'}
              {st === 'pending' && 'قيد المراجعة ⏳'}
              {st === 'confirmed' && 'مؤكدة 📞'}
              {st === 'shipped' && 'تم الشحن 🚚'}
              {st === 'delivered' && 'تم الاستلام ✅'}
              {st === 'cancelled' && 'ملغاة ❌'}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-xs font-bold">
              <th className="py-4 px-6">اسم الزبون</th>
              <th className="py-4 px-6">رقم الهاتف</th>
              <th className="py-4 px-6">الولاية والمكان</th>
              <th className="py-4 px-6">المنتج والخيارات</th>
              <th className="py-4 px-6">المبلغ الإجمالي</th>
              <th className="py-4 px-6">الحالة</th>
              <th className="py-4 px-6 text-left">تعديل الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  <div className="space-y-2">
                    <ShoppingCart className="w-8 h-8 mx-auto text-slate-300" />
                    <p>لا توجد أي طلبيات مطابقة للبحث حالياً.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const page = pages.find(p => p.id === order.landing_page_id);
                const price = page ? page.price : 3000;
                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-bold text-gray-900">{order.name}</td>
                    <td className="py-4 px-6 font-mono text-xs text-gray-600">
                      <a href={`tel:${order.phone}`} className="hover:underline flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.phone}</span>
                      </a>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.city}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <span className="font-semibold block text-gray-800 text-xs">{order.product_name || 'طقم أطفال الربيع'}</span>
                        <div className="flex gap-2 text-[10px] text-gray-400">
                          {order.size && <span>المقاس: {order.size}</span>}
                          <span>الكمية: {order.quantity}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">{(price * order.quantity).toLocaleString()} دج</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                        {getStatusTextAr(order.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                      >
                        <option value="pending">⏳ قيد المراجعة</option>
                        <option value="confirmed">📞 مؤكدة</option>
                        <option value="shipped">🚚 تم الشحن</option>
                        <option value="delivered">✅ تم الاستلام</option>
                        <option value="cancelled">❌ ملغاة</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View (Collapsible Deck) */}
      <div className="lg:hidden space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-gray-400 text-sm">
            <ShoppingCart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p>لا توجد طلبيات مطابقة للبحث حالياً.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const page = pages.find(p => p.id === order.landing_page_id);
            const price = page ? page.price : 3000;
            return (
              <div key={order.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3 text-right">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-gray-900 text-sm">{order.name}</h4>
                    <span className="text-[10px] text-gray-400 block mt-0.5">طلب من صفحة: {order.source || 'العرض العام'}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusStyle(order.status)}`}>
                    {getStatusTextAr(order.status)}
                  </span>
                </div>

                <div className="border-t border-b border-slate-50 py-2.5 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-semibold">رقم الهاتف:</span>
                    <a href={`tel:${order.phone}`} className="font-mono text-gray-800 font-bold underline flex items-center gap-1">
                      <span>{order.phone}</span>
                      <Phone className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">الولاية والمكان:</span>
                    <span className="font-bold text-gray-800">{order.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">السلعة المطلوبة:</span>
                    <span className="font-bold text-gray-800">
                      {order.product_name} {order.size ? `(مقاس: ${order.size})` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">الكمية:</span>
                    <span className="font-bold text-gray-800">{order.quantity} قطع</span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm border-t border-slate-50 font-black text-gray-900">
                    <span>السعر المطلوب:</span>
                    <span>{(price * order.quantity).toLocaleString()} دج</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-between">
                  <span className="text-xs text-slate-400">تغيير حالة الطلب:</span>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  >
                    <option value="pending">⏳ قيد المراجعة</option>
                    <option value="confirmed">📞 مؤكدة</option>
                    <option value="shipped">🚚 تم الشحن</option>
                    <option value="delivered">✅ تم الاستلام</option>
                    <option value="cancelled">❌ ملغاة</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
