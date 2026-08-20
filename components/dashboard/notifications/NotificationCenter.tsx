'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useNotifications, type NotificationRow } from './useNotifications';
import { timeAgoAr } from '@/lib/notifications';

export function NotificationCenter({ clientId }: { clientId: string }) {
  const router = useRouter();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications({
    clientId,
    limit: 200,
  });

  const handleClick = (n: NotificationRow) => {
    if (!n.is_read) markAsRead(n.id);
    router.push(n.order_id ? `/dashboard/orders?order=${n.order_id}` : '/dashboard/orders');
  };

  return (
    <div className="space-y-6 md:w-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900">الإشعارات</h1>
          <p className="text-xs text-slate-400 mt-1">
            {notifications.length} إشعار{unreadCount > 0 ? ` — ${unreadCount} غير مقروء` : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllAsRead()}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-xl transition shrink-0"
          >
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-xs text-slate-400">
          جارِ التحميل...
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-2">
          <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm text-slate-400">لا توجد إشعارات بعد</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => handleClick(n)}
              className={`w-full text-right px-4 py-4 hover:bg-slate-50 transition flex items-start gap-3 ${!n.is_read ? 'bg-blue-50/40' : ''
                }`}
            >
              <span
                className="mt-1.5 shrink-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: n.is_read ? 'transparent' : '#3b82f6' }}
              />
              <span className="flex-1 min-w-0">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-800">{n.title}</span>
                  <span className="text-[11px] text-slate-400 shrink-0">{timeAgoAr(n.created_at)}</span>
                </span>
                <span className="block text-xs text-slate-500 mt-1">{n.message}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
