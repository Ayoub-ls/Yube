import React from 'react';
import { Order, OrderStatus } from '@/src/types/crm';
import CRMStatusColumn from './CRMStatusColumn';
import CRMOrderCard from './CRMOrderCard';

interface CRMKanbanProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onQuickStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onOpenReminder: (order: Order) => void;
  viewMode?: 'kanban' | 'list';
}

const KANBAN_COLUMNS: { id: OrderStatus; title: string }[] = [
  { id: 'pending', title: 'قيد الانتظار' },
  { id: 'calling', title: 'جاري الاتصال' },
  { id: 'call_later', title: 'الاتصال لاحقاً' },
  { id: 'confirmed', title: 'مؤكد' },
  { id: 'cancelled', title: 'ملغى' },
  { id: 'delivered', title: 'تم التوصيل' }
];

const CRMKanban: React.FC<CRMKanbanProps> = ({
  orders,
  onSelectOrder,
  onQuickStatusChange,
  onOpenReminder,
  viewMode = 'kanban'
}) => {
  const handleDropOrder = (orderId: string, targetStatus: OrderStatus) => {
    onQuickStatusChange(orderId, targetStatus);
  };

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ar-DZ').format(val) + ' د.ج';
  };

  if (viewMode === 'list') {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-3.5">رقم الطلب</th>
                <th className="p-3.5">الزبون والهاتف</th>
                <th className="p-3.5">المنتج والتفاصيل</th>
                <th className="p-3.5">الولاية / المدينة</th>
                <th className="p-3.5">المبلغ الإجمالي</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-slate-400">
                    لا توجد طلبات متطابقة مع البحث أو الفلاتر المختارة.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{order.phone}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-900">{order.productName}</div>
                      <div className="text-slate-500 text-[11px]">
                        اللون: {order.color} • المقاس: {order.size} • الكمية: {order.quantity}
                      </div>
                    </td>
                    <td className="p-3.5 font-medium">{order.city}</td>
                    <td className="p-3.5 font-bold text-emerald-700">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          onQuickStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="calling">جاري الاتصال</option>
                        <option value="call_later">الاتصال لاحقاً</option>
                        <option value="confirmed">مؤكد</option>
                        <option value="cancelled">ملغى</option>
                        <option value="delivered">تم التوصيل</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-[11px] hover:bg-slate-800 transition-colors"
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto pb-4 pt-1">
      <div className="flex gap-4 min-w-max">
        {KANBAN_COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.id);
          return (
            <CRMStatusColumn
              key={col.id}
              status={col.id}
              title={col.title}
              orders={colOrders}
              onSelectOrder={onSelectOrder}
              onQuickStatusChange={onQuickStatusChange}
              onOpenReminder={onOpenReminder}
              onDropOrder={handleDropOrder}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CRMKanban;
