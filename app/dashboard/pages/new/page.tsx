import { createClient } from '../../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { NewLandingPageWizard } from './Wizard';
import { checkPlanAllowsNewPage } from '../../../../lib/plans';

export default async function NewLandingPagePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: client } = await supabase
    .from('clients')
    .select('id, plan, plan_expires_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!client) redirect('/auth/login');

  // Same check the server action re-runs on submit — checked here too
  // so someone blocked by their plan doesn't spend 10 steps in the
  // wizard only to be rejected at the very end.
  const { count: currentPageCount } = await supabase
    .from('landing_pages')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', client.id);

  const blockReason = checkPlanAllowsNewPage(client, currentPageCount || 0);
  if (blockReason) {
    redirect('/dashboard/pages');
  }

  return <NewLandingPageWizard clientId={client.id} />;
}
