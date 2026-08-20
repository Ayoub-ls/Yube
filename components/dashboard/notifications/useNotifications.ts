'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { markNotificationRead, markAllNotificationsRead } from '@/app/dashboard/actions';
import type { NotificationRow } from '@/lib/notifications';

export type { NotificationRow };

interface UseNotificationsOptions {
  clientId: string;
  /** Called for every new order notification the moment it arrives over Realtime. */
  onNewNotification?: (n: NotificationRow) => void;
  limit?: number;
}

export function useNotifications({ clientId, onNewNotification, limit = 30 }: UseNotificationsOptions) {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const supabaseRef = useRef(createClient());
  const channelRef = useRef<RealtimeChannel | null>(null);
  // Kept in a ref so the realtime callback (registered once per
  // subscription) always calls the latest handler without needing to
  // tear down and recreate the channel every render.
  const onNewRef = useRef(onNewNotification);
  onNewRef.current = onNewNotification;

  const fetchNotifications = useCallback(async () => {
    const supabase = supabaseRef.current;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (data) {
      setNotifications(data as NotificationRow[]);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    }
    setLoading(false);
  }, [clientId, limit]);

  useEffect(() => {
    if (!clientId) return;
    const supabase = supabaseRef.current;
    let cancelled = false;

    // Defensive: if a previous channel for this client somehow still
    // exists (e.g. fast re-render), tear it down first so we never end
    // up with two live subscriptions for the same client.
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel(`notifications:${clientId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          // Defense in depth only — RLS on the notifications table is
          // the actual security boundary that stops a client's socket
          // from ever receiving another client's row in the first
          // place, regardless of what filter is set here.
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          const row = payload.new as NotificationRow;
          setNotifications((prev) => (prev.some((n) => n.id === row.id) ? prev : [row, ...prev].slice(0, limit)));
          setUnreadCount((prev) => prev + 1);
          onNewRef.current?.(row);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `client_id=eq.${clientId}` },
        (payload) => {
          const row = payload.new as NotificationRow;
          setNotifications((prev) => prev.map((n) => (n.id === row.id ? row : n)));
        }
      )
      .subscribe((status) => {
        // Subscribe first, fetch second: this closes the gap where an
        // order created between "fetch" and "subscribe" would be
        // missed entirely. Any notification created in that window now
        // either arrives as a live INSERT event or is already present
        // in this fetch — never both, thanks to the id dedupe above.
        if (status === 'SUBSCRIBED' && !cancelled) {
          fetchNotifications();
        }
      });

    channelRef.current = channel;

    // The realtime socket can silently drop while a tab is backgrounded.
    // Resync from the database (source of truth) whenever the tab
    // becomes visible again, rather than trying to detect/repair the
    // socket state directly.
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchNotifications();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [clientId, limit, fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    let wasUnread = false;
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id && !n.is_read) wasUnread = true;
        return n.id === id ? { ...n, is_read: true } : n;
      })
    );
    if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
    await markNotificationRead(id);
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    await markAllNotificationsRead();
  }, []);

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, refetch: fetchNotifications };
}
