import React, { useState } from 'react';
import { Order, ReminderItem } from '@/src/types/crm';
import { Bell, Calendar, Clock, AlertCircle, X, Check } from 'lucide-react';

interface CRMReminderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSaveReminder: (reminder: ReminderItem) => void;
}

const REASON_PRESETS = [
  'لم يرد على الهاتف (إعادة المحاولة)',
  'الزبون مشغول الآن (طلب الاتصال لاحقاً)',
  'طلب وقت للتفكير والإستشارة',
  'تأجيل التوصيل لتاريخ قادم',
  'التأكد من المقاس أو اللون مع العائلة',
  'طلب التواصل عبر WhatsApp أولاً'
];

const CRMReminderModal: React.FC<CRMReminderModalProps> = ({
  order,
  isOpen,
  onClose,
  onSaveReminder
}) => {
  // Preset Default Date (Tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(order.reminder?.date || defaultDateStr);
  const [time, setTime] = useState(order.reminder?.time || '14:30');
  const [reason, setReason] = useState(order.reminder?.reason || REASON_PRESETS[0]);
  const [customReason, setCustomReason] = useState('');

  if (!isOpen) return null;

  const handleQuickPreset = (type: '2hours' | 'tomorrow' | '3days') => {
    const now = new Date();
    if (type === '2hours') {
      now.setHours(now.getHours() + 2);
      setDate(now.toISOString().split('T')[0]);
      setTime(now.toTimeString().substring(0, 5));
    } else if (type === 'tomorrow') {
      now.setDate(now.getDate() + 1);
      setDate(now.toISOString().split('T')[0]);
      setTime('10:00');
    } else if (type === '3days') {
      now.setDate(now.getDate() + 3);
      setDate(now.toISOString().split('T')[0]);
      setTime('14:00');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customReason.trim() ? customReason.trim() : reason;

    const newReminder: ReminderItem = {
      id: order.reminder?.id || `rem-${Date.now()}`,
      orderId: order.id,
      date,
      time,
      reason: finalReason,
      createdAt: new Date().toISOString(),
      completed: false
    };

    onSaveReminder(newReminder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-150 space-y-4 sm:space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">جدولة تذكير بالاتصال</h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                للطلب <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span> - {order.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-3 sm:space-y-4">
          {/* Quick Preset Buttons */}
          <div>
            <label className="text-[11px] sm:text-xs font-bold text-slate-700 block mb-1.5">اختيار سريع للوقت:</label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset('2hours')}
                className="py-1.5 px-1 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200 rounded-xl text-[10px] sm:text-xs font-semibold text-slate-700 transition-colors text-center truncate"
              >
                بعد ساعتين
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('tomorrow')}
                className="py-1.5 px-1 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200 rounded-xl text-[10px] sm:text-xs font-semibold text-slate-700 transition-colors text-center truncate"
              >
                غداً 10:00 ص
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('3days')}
                className="py-1.5 px-1 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200 rounded-xl text-[10px] sm:text-xs font-semibold text-slate-700 transition-colors text-center truncate"
              >
                بعد 3 أيام
              </button>
            </div>
          </div>

          {/* Custom Date & Time Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                تاريخ الاتصال
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                وقت الاتصال
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* Reason Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              سبب إعادة الاتصال
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer"
            >
              {REASON_PRESETS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              تفاصيل إضافية (اختياري)
            </label>
            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="مثال: اتصل بعد خروجه من العمل على الساعة 16:00"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التذكير</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CRMReminderModal;
