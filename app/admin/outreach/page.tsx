import { createClient } from '../../../lib/supabase/server';
import { OutreachDashboard } from './OutreachDashboard';
import { OutreachLead, MessageTemplate } from '../../types';

export default async function AdminOutreachPage() {
  const supabase = createClient();

  const [{ data: leads, error: leadsError }, { data: templates, error: templatesError }] =
    await Promise.all([
      supabase
        .from('outreach_leads')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('outreach_message_templates')
        .select('*')
        .order('created_at', { ascending: false }),
    ]);

  if (leadsError) console.error('Error loading outreach leads:', leadsError);
  if (templatesError) console.error('Error loading outreach templates:', templatesError);

  return (
    <OutreachDashboard
      initialLeads={(leads ?? []) as OutreachLead[]}
      initialTemplates={(templates ?? []) as MessageTemplate[]}
    />
  );
}
