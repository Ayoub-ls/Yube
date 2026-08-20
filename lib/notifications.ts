export interface NotificationRow {
  id: string;
  client_id: string;
  order_id: string | null;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

/** Arabic relative time for notification timestamps ("منذ 5 دقائق"). */
export function timeAgoAr(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const sec = Math.floor(diffMs / 1000);

  if (sec < 60) return 'الآن';

  const min = Math.floor(sec / 60);
  if (min < 60) return min === 1 ? 'منذ دقيقة' : `منذ ${min} دقائق`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return hr === 1 ? 'منذ ساعة' : `منذ ${hr} ساعات`;

  const day = Math.floor(hr / 24);
  if (day < 30) return day === 1 ? 'منذ يوم' : `منذ ${day} أيام`;

  return new Date(dateStr).toLocaleDateString('ar-DZ');
}
