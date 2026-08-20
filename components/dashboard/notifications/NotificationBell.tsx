'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, BellRing, ShoppingBag, Volume2, VolumeX } from 'lucide-react';
import { useNotifications, type NotificationRow } from './useNotifications';
import { timeAgoAr } from '@/lib/notifications';

const SOUND_PREF_KEY = 'yube_notif_sound';

/**
 * Two short sine-wave beeps synthesized with the Web Audio API — no
 * audio file to ship or fail to load. Wrapped so any autoplay/audio
 * restriction just fails silently rather than throwing, per spec.
 */
function playChime() {
  try {
    const AudioCtxCtor = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxCtor) return;
    const ctx = new AudioCtxCtor();
    const now = ctx.currentTime;

    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = now + i * 0.09;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });

    setTimeout(() => ctx.close(), 700);
  } catch {
    // Autoplay/audio restrictions — fail silently, never block the UI.
  }
}

export function NotificationBell({ clientId }: { clientId: string }) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<NotificationRow[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

  // Sound preference + current browser-notification permission are read
  // once on mount, client-side only (SSR has no window/localStorage).
  useEffect(() => {
    const stored = localStorage.getItem(SOUND_PREF_KEY);
    if (stored !== null) setSoundEnabled(stored === '1');
    setPermission('Notification' in window ? Notification.permission : 'unsupported');
  }, []);

  const handleNewNotification = (n: NotificationRow) => {
    setToasts((prev) => [n, ...prev].slice(0, 3));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== n.id)), 7000);

    if (soundEnabled) playChime();

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const browserNotif = new Notification('Yube — طلبية جديدة', {
          body: n.message,
          icon: '/icon.png',
        });
        browserNotif.onclick = () => {
          window.focus();
          handleOpenNotification(n);
        };
      } catch {
        // In-dashboard toast/bell already cover this — no need to surface an error.
      }
    }
  };

  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications({
    clientId,
    onNewNotification: handleNewNotification,
  });

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(SOUND_PREF_KEY, next ? '1' : '0');
      return next;
    });
  };

  const requestBrowserPermission = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const handleOpenNotification = (n: NotificationRow) => {
    if (!n.is_read) markAsRead(n.id);
    setOpen(false);
    setToasts((prev) => prev.filter((t) => t.id !== n.id));
    router.push(n.order_id ? `/dashboard/orders?order=${n.order_id}` : '/dashboard/orders');
  };

  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <>
      <div className="relative" ref={panelRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="الإشعارات"
          aria-expanded={open}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 left-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div
            // Positioning/width/z-index are set inline rather than via
            // Tailwind's `fixed`/`sm:`/`w-96` utilities. If those classes
            // aren't in the compiled CSS for any reason (stale build,
            // JIT not having picked up this file yet, etc), the panel
            // still renders correctly instead of collapsing to whatever
            // sliver of space its flex parent leaves it.
            style={{
              position: 'fixed',
              top: '4.25rem',
              insetInlineEnd: '0.75rem',
              width: 'min(24rem, calc(100vw - 1.5rem))',
              maxHeight: '75vh',
              zIndex: 50,
            }}
            className="bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="text-sm font-black text-slate-900">الإشعارات</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead()}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                >
                  تحديد الكل كمقروء
                </button>
              )}
            </div>

            {permission === 'default' && (
              <button
                type="button"
                onClick={requestBrowserPermission}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold text-blue-700 bg-blue-50/70 hover:bg-blue-50 border-b border-slate-100 transition"
              >
                <BellRing className="w-3.5 h-3.5 shrink-0" />
                تفعيل إشعارات الطلبات
              </button>
            )}

            <div className="overflow-y-auto flex-1" style={{ maxHeight: '60vh' }}>
              {loading ? (
                <div className="px-4 py-8 text-center text-xs text-slate-400">جارِ التحميل...</div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-10 text-center space-y-2">
                  <ShoppingBag className="w-6 h-6 mx-auto text-slate-300" />
                  <p className="text-xs text-slate-400">لا توجد إشعارات بعد</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleOpenNotification(n)}
                    className={`w-full text-right px-4 py-3 border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition flex gap-2.5 items-start ${
                      !n.is_read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <span
                      className="mt-1.5 shrink-0 w-2 h-2 rounded-full"
                      style={{ backgroundColor: n.is_read ? 'transparent' : '#3b82f6' }}
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs font-bold text-slate-800 truncate">{n.title}</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</span>
                      <span className="block text-[10px] text-slate-400 mt-1">{timeAgoAr(n.created_at)}</span>
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={toggleSound}
                aria-label={soundEnabled ? 'كتم صوت الإشعارات' : 'تفعيل صوت الإشعارات'}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <a
                href="/dashboard/notifications"
                onClick={() => setOpen(false)}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 transition"
              >
                عرض كل الإشعارات
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Toast stack — fixed, mobile-friendly, never causes horizontal scroll. */}
      <div
        style={{
          position: 'fixed',
          zIndex: 60,
          insetBlockEnd: '1rem',
          insetInlineEnd: '1rem',
          width: 'min(24rem, calc(100vw - 2rem))',
        }}
        className="space-y-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-white border border-slate-100 shadow-xl rounded-2xl p-3.5 flex items-start gap-3"
            style={{ animation: 'yube-toast-in 0.25s ease-out' }}
          >
            <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-base leading-none">
              🔔
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900">{t.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{t.message}</p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => handleOpenNotification(t)}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                >
                  عرض الطلب
                </button>
                <button
                  type="button"
                  onClick={() => dismissToast(t.id)}
                  className="text-[11px] font-bold text-slate-400 hover:text-slate-600"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
