import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NotificationCenter } from '@/components/dashboard/notifications/NotificationCenter';

export default async function DashboardNotificationsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!client) redirect('/auth/login');

  return <NotificationCenter clientId={client.id} />;
}
