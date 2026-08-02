import React from 'react';
import { Order, OrderStatus } from '@/src/types/crm';
import CRMOrderCard from './CRMOrderCard';
import {
  Clock,
  PhoneCall,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Truck,
  Plus
} from 'lucide-react';

interface CRMStatusColumnProps {
  status: OrderStatus;
  title: string;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onQuickStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onOpenReminder: (order: Order) => void;
  onDropOrder?: (orderId: string, targetStatus: OrderStatus) => void;
}

const CRMStatusColumn: React.FC<CRMStatusColumnProps> = ({
  status,
  title,
  orders,
  onSelectOrder,
  onQuickStatusChange,
  onOpenReminder,
  onDropOrder
}) => {
  // Column Styling Configuration
  const getColumnConfig = (colStatus: OrderStatus) => {
    switch (colStatus) {
      case 'pending':
        return {
          headerBg: 'bg-amber-50/80 border-amber-200/80',
          titleColor: 'text-amber-900',
          badgeBg: 'bg-amber-200/60 text-amber-900',
          icon: Clock,
          iconColor: 'text-amber-600',
          accentBorder: 'border-t-4 border-t-amber-500'
        };
      case 'calling':
        return {
          headerBg: 'bg-orange-50/80 border-orange-200/80',
          titleColor: 'text-orange-900',
          badgeBg: 'bg-orange-200/60 text-orange-900',
          icon: PhoneCall,
          iconColor: 'text-orange-600',
          accentBorder: 'border-t-4 border-t-orange-500'
        };
      case 'call_later':
        return {
          headerBg: 'bg-indigo-50/80 border-indigo-200/80',
          titleColor: 'text-indigo-900',
          badgeBg: 'bg-indigo-200/60 text-indigo-900',
          icon: CalendarClock,
          iconColor: 'text-indigo-600',
          accentBorder: 'border-t-4 border-t-indigo-500'
        };
      case 'confirmed':
        return {
          headerBg: 'bg-emerald-50/80 border-emerald-200/80',
          titleColor: 'text-emerald-900',
          badgeBg: 'bg-emerald-200/60 text-emerald-900',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
          accentBorder: 'border-t-4 border-t-emerald-500'
        };
      case 'cancelled':
        return {
          headerBg: 'bg-rose-50/80 border-rose-200/80',
          titleColor: 'text-rose-900',
          badgeBg: 'bg-rose-200/60 text-rose-900',
          icon: XCircle,
          iconColor: 'text-rose-600',
          accentBorder: 'border-t-4 border-t-rose-500'
        };
      case 'delivered':
        return {
          headerBg: 'bg-blue-50/80 border-blue-200/80',
          titleColor: 'text-blue-900',
          badgeBg: 'bg-blue-200/60 text-blue-900',
          icon: Truck,
          iconColor: 'text-blue-600',
          accentBorder: 'border-t-4 border-t-blue-500'
        };
      default:
        return {
          headerBg: 'bg-amber-50/80 border-amber-200/80',
          titleColor: 'text-amber-900',
          badgeBg: 'bg-amber-200/60 text-amber-900',
          icon: Clock,
          iconColor: 'text-amber-600',
          accentBorder: 'border-t-4 border-t-amber-500'
        };
    }
  };

  const config = getColumnConfig(status);
  const Icon = config.icon;

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ar-DZ').format(val) + ' د.ج';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('orderId');
    if (orderId && onDropOrder) {
      onDropOrder(orderId, status);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`flex flex-col w-80 min-w-[320px] max-w-[340px] bg-slate-100/70 rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs ${config.accentBorder}`}
    >
      {/* Column Header */}
      <div className={`p-3.5 border-b flex items-center justify-between ${config.headerBg}`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
          <h3 className={`text-sm font-bold ${config.titleColor}`}>{title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${config.badgeBg}`}>
            {orders.length}
          </span>
        </div>

        <div className="text-left">
          <span className="text-[11px] font-semibold text-slate-500 block">
            {formatCurrency(totalRevenue)}
          </span>
        </div>
      </div>

      {/* Column Content / Cards List */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[400px]">
        {orders.length === 0 ? (
          <div className="h-40 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs text-slate-400 font-medium">لا توجد طلبات في هذه الحالة</p>
            <p className="text-[10px] text-slate-400 mt-1">اسحب وأسقط أي طلب هنا لتغيير حالته</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('orderId', order.id);
              }}
            >
              <CRMOrderCard
                order={order}
                onSelectOrder={onSelectOrder}
                onQuickStatusChange={onQuickStatusChange}
                onOpenReminder={onOpenReminder}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CRMStatusColumn;
