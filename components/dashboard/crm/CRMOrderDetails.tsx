import React, { useState } from 'react';
import { Order, OrderStatus, NoteItem, ActivityItem, ReminderItem } from '@/src/types/crm';
import CRMNotes from './CRMNotes';
import CRMActivityTimeline from './CRMActivityTimeline';
import {
  X,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Bell,
  User,
  Copy,
  Check,
  Building,
  Home,
  AlertCircle
} from 'lucide-react';

interface CRMOrderDetailsProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onAddNote: (orderId: string, noteText: string, tag?: string) => void;
  onOpenReminderModal: (order: Order) => void;
}

const CRMOrderDetails: React.FC<CRMOrderDetailsProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onAddNote,
  onOpenReminderModal
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(order.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCall = () => {
    window.location.href = `tel:${order.phone}`;
  };

  const handleWhatsApp = () => {
    const formattedPhone = order.phone.startsWith('0')
      ? '213' + order.phone.substring(1)
      : order.phone;
    const text = encodeURIComponent(
      `مرحباً ${order.customerName}، يتواصل معك فريق خدمة العملاء بخصوص طلبيتك رقم (${order.orderNumber}) لمنتج "${order.productName}". يرجى تأكيد استلام الشحنة.`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-DZ').format(amount) + ' د.ج';
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('ar-DZ')} - ${d.toLocaleTimeString('ar-DZ', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'قيد الانتظار', classes: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'calling':
        return { label: 'جاري الاتصال', classes: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'call_later':
        return { label: 'الاتصال لاحقاً', classes: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'confirmed':
        return { label: 'مؤكد', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'cancelled':
        return { label: 'ملغى', classes: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'delivered':
        return { label: 'تم التوصيل', classes: 'bg-blue-50 text-blue-700 border-blue-200' };
      default:
        return { label: 'قيد الانتظار', classes: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  const statusBadge = getStatusBadge(order.status);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col border-r border-slate-200 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-slate-900">
                  {order.orderNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge.classes}`}
                >
                  {statusBadge.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                تاريخ الطلب: {formatDate(order.creationDate)} • المصدر: {order.landingPage}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons Bar */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCall}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>اتصال بالمشتري</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>واتساب</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {order.status !== 'confirmed' && (
              <button
                onClick={() => onUpdateStatus(order.id, 'confirmed')}
                className="px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تأكيد الطلب</span>
              </button>
            )}

            {order.status !== 'cancelled' && (
              <button
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                className="px-3 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" />
                <span>إلغاء</span>
              </button>
            )}

            {order.status !== 'delivered' && (
              <button
                onClick={() => onUpdateStatus(order.id, 'delivered')}
                className="px-3 py-2 rounded-xl bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/40 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Truck className="w-4 h-4" />
                <span>تم التوصيل</span>
              </button>
            )}

            <button
              onClick={() => onOpenReminderModal(order)}
              className="p-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/40 transition-colors"
              title="جدولة تذكير"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 p-4 sm:p-6 space-y-6">
          {/* Active Reminder Banner */}
          {order.reminder && !order.reminder.completed && (
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Bell className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-purple-900">
                    تذكير مجدول: {order.reminder.date} الساعة {order.reminder.time}
                  </h4>
                  <p className="text-xs text-purple-700 mt-0.5">{order.reminder.reason}</p>
                </div>
              </div>
              <button
                onClick={() => onOpenReminderModal(order)}
                className="text-xs font-bold text-purple-800 underline hover:text-purple-900"
              >
                تعديل
              </button>
            </div>
          )}

          {/* Customer & Delivery Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>معلومات الزبون</span>
                </h3>
                <span className="text-[10px] font-semibold text-slate-500">
                  {order.callAttempts} محاولات اتصال
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
                <div className="flex items-center justify-between font-mono text-slate-700 pt-1">
                  <span>الهاتف الأساسي: {order.phone}</span>
                  <button
                    onClick={handleCopyPhone}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500"
                  >
                    {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {order.altPhone && (
                  <div className="font-mono text-slate-500">هاتف ثاني: {order.altPhone}</div>
                )}
              </div>
            </div>

            {/* Shipping Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>عنوان الشحن والتوصيل</span>
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                  {order.deliveryType === 'home' ? (
                    <>
                      <Home className="w-3 h-3 text-slate-500" />
                      <span>للمنزل</span>
                    </>
                  ) : (
                    <>
                      <Building className="w-3 h-3 text-slate-500" />
                      <span>المكتب (Stop Desk)</span>
                    </>
                  )}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-900">{order.city}</div>
                <div className="text-slate-600">{order.address}</div>
                <div className="text-[11px] text-slate-500 pt-1">
                  رسوم الشحن: <span className="font-bold text-slate-800">{formatCurrency(order.shippingFee)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <ShoppingBag className="w-4 h-4 text-slate-500" />
              <span>تفاصيل المنتج والطلب</span>
            </h3>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{order.productName}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                    <span>اللون: <strong className="text-slate-800">{order.color}</strong></span>
                    <span>•</span>
                    <span>المقاس: <strong className="text-slate-800">{order.size}</strong></span>
                    <span>•</span>
                    <span>الكمية: <strong className="text-slate-800">{order.quantity}</strong></span>
                  </div>
                </div>
              </div>

              <div className="text-left">
                <div className="text-xs text-slate-400">سعر القطعة</div>
                <div className="text-xs font-semibold text-slate-700">{formatCurrency(order.price)}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">المبلغ الإجمالي المنسق (شامل الشحن):</span>
              <span className="text-base font-extrabold text-emerald-700">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Current Status Control Selector */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">تغيير حالة الطلب الحالية:</span>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer shadow-2xs"
            >
              <option value="pending">قيد الانتظار (Pending)</option>
              <option value="calling">جاري الاتصال (Calling)</option>
              <option value="call_later">الاتصال لاحقاً (Call Later)</option>
              <option value="confirmed">مؤكد (Confirmed)</option>
              <option value="cancelled">ملغى (Cancelled)</option>
              <option value="delivered">تم التوصيل (Delivered)</option>
            </select>
          </div>

          {/* Internal Notes Component */}
          <div className="pt-2">
            <CRMNotes
              notes={order.notes}
              onAddNote={(text, tag) => onAddNote(order.id, text, tag)}
            />
          </div>

          {/* Activity Timeline Component */}
          <div className="pt-2 border-t border-slate-200">
            <CRMActivityTimeline activities={order.activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMOrderDetails;
