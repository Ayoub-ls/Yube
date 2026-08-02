import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CRMDashboard from "@/components/dashboard/crm/CRMDashboard";

export default async function Page() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!client) redirect('/auth/login');

  // Fetch initial orders
  const { data: dbOrders } = await supabase
    .from('orders')
    .select('*, landing_pages(price, product_images)')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false });

  // Fetch landing pages for this client
  const { data: landingPages } = await supabase
    .from('landing_pages')
    .select('id, product_name, price, product_images')
    .eq('client_id', client.id);

  return (
    <CRMDashboard
      initialOrders={dbOrders || []}
      clientId={client.id}
      landingPages={landingPages || []}
    />
  );
}