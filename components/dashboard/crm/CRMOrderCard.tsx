import React, { useState } from 'react';
import { Order } from '@/src/types/crm';
import {
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronLeft,
  ShoppingBag,
  Bell
} from 'lucide-react';

interface CRMOrderCardProps {
  order: Order;
  onSelectOrder: (order: Order) => void;
  onQuickStatusChange?: (orderId: string, newStatus: Order['status']) => void;
  onOpenReminder?: (order: Order) => void;
  isDragging?: boolean;
}

const CRMOrderCard: React.FC<CRMOrderCardProps> = ({
  order,
  onSelectOrder,
  onQuickStatusChange,
  onOpenReminder
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(order.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Algerian format: Replace 0 with +213
    const formattedPhone = order.phone.startsWith('0')
      ? '213' + order.phone.substring(1)
      : order.phone;
    const text = encodeURIComponent(
      `مرحباً ${order.customerName}، مع حضرتك فريق خدمة العملاء بخصوص طلبيتك لـ (${order.productName}). هل يمكنك تأكيد العنوان واستلام الطلب؟`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${order.phone}`;
  };

  // Status Styling
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'قيد الانتظار',
          classes: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500'
        };
      case 'calling':
        return {
          label: 'جاري الاتصال',
          classes: 'bg-orange-50 text-orange-700 border-orange-200/80',
          dot: 'bg-orange-500'
        };
      case 'call_later':
        return {
          label: 'الاتصال لاحقاً',
          classes: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
          dot: 'bg-indigo-500'
        };
      case 'confirmed':
        return {
          label: 'مؤكد',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500'
        };
      case 'cancelled':
        return {
          label: 'ملغى',
          classes: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500'
        };
      case 'delivered':
        return {
          label: 'تم التوصيل',
          classes: 'bg-blue-50 text-blue-700 border-blue-200/80',
          dot: 'bg-blue-500'
        };
      default:
        return {
          label: 'قيد الانتظار',
          classes: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500'
        };
    }
  };

  // Priority Styling
  const getPriorityBadge = (priority: Order['priority']) => {
    switch (priority) {
      case 'urgent':
        return {
          label: 'عاجل جداً',
          classes: 'bg-rose-100 text-rose-800 border-rose-200 font-bold animate-pulse'
        };
      case 'high':
        return {
          label: 'أولوية مرتفعة',
          classes: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      case 'normal':
      default:
        return {
          label: 'أولوية عادية',
          classes: 'bg-slate-100 text-slate-600 border-slate-200'
        };
    }
  };

  const statusBadge = getStatusBadge(order.status);
  const priorityBadge = getPriorityBadge(order.priority);

  // Format Relative Time
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ar-DZ').format(val) + ' د.ج';
  };

  return (
    <div
      onClick={() => onSelectOrder(order)}
      className="group bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer relative overflow-hidden"
    >
      {/* Top Bar: Order ID, Status & Priority */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
            {order.orderNumber}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadge.classes}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
            {statusBadge.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {order.priority !== 'normal' && (
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] border ${priorityBadge.classes}`}
            >
              {priorityBadge.label}
            </span>
          )}
          {order.reminder && !order.reminder.completed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenReminder) onOpenReminder(order);
              }}
              title={`تذكير: ${order.reminder.reason}`}
              className="p-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Customer Name & Phone */}
      <div className="mb-3">
        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
          <span>{order.customerName}</span>
          <span className="text-xs font-bold text-emerald-700">
            {formatCurrency(order.totalAmount)}
          </span>
        </h4>

        <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
          <div className="flex items-center gap-1 font-mono tracking-wider">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <a
              href={`tel:${order.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:underline hover:text-blue-600 transition-colors"
            >
              {order.phone}
            </a>
            <button
              onClick={handleCopyPhone}
              className="p-1 hover:text-slate-900 transition-colors rounded"
              title="نسخ رقم الهاتف"
            >
              {copiedPhone ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400 hover:text-slate-600" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-1 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-[11px]">{order.city}</span>
          </div>
        </div>
      </div>

      {/* Product Information Box */}
      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {order.productImage ? (
              <img
                src={order.productImage}
                alt={order.productName}
                className="w-9 h-9 object-cover rounded-lg border border-slate-200 flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-slate-500" />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                {order.productName}
              </p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <span>الكمية: {order.quantity}</span>
                <span>•</span>
                <span>المقاس: {order.size}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span>اللون:</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-800 font-medium">
              {order.colorHex && (
                <span
                  className="w-2 h-2 rounded-full border border-slate-300"
                  style={{ backgroundColor: order.colorHex }}
                />
              )}
              {order.color}
            </span>
          </div>

          <span className="text-slate-400 text-[10px] truncate max-w-[80px]" title={order.landingPage}>
            {order.landingPage}
          </span>
        </div>
      </div>

      {/* Footer: Date & Quick Actions */}
      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{formatTime(order.creationDate)}</span>
          {order.callAttempts > 0 && (
            <span className="mr-1 text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
              {order.callAttempts} محاولات
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-1">
          <button
            onClick={handleCall}
            className="p-2 sm:p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            title="اتصال سريع بالعميل"
          >
            <Phone className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>
          <button
            onClick={handleWhatsApp}
            className="p-2 sm:p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors"
            title="إرسال رسالة WhatsApp"
          >
            <MessageSquare className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>

          {order.status !== 'confirmed' && order.status !== 'delivered' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onQuickStatusChange) onQuickStatusChange(order.id, 'confirmed');
              }}
              className="px-3 py-2 sm:px-2 sm:py-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs sm:text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
              title="تأكيد الطلب فوراً"
            >
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-emerald-400" />
              <span>تأكيد</span>
            </button>
          )}

          <button
            onClick={() => onSelectOrder(order)}
            className="p-2 sm:p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CRMOrderCard;
