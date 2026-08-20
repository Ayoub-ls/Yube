'use server';

import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { checkIsAdmin } from '../../../lib/data';
import { revalidatePath } from 'next/cache';
import { LeadType, MessageTemplate, OutreachLead } from '../../types';

/**
 * Every action here re-checks admin status itself, server-side, rather than
 * trusting the caller already passed through the admin layout's own check —
 * same defense-in-depth pattern used in app/admin/actions.ts. RLS on
 * outreach_leads / outreach_message_templates enforces this again at the
 * database layer.
 */
async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const isAdmin = await checkIsAdmin(supabase, user.id);
  if (!isAdmin) redirect('/dashboard');

  return supabase;
}

export async function addLeadAction(
  lead: Omit<OutreachLead, 'id' | 'created_at'>
): Promise<{ data?: OutreachLead; error?: string }> {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from('outreach_leads')
    .insert({
      business_name: lead.business_name,
      whatsapp_number: lead.whatsapp_number,
      lead_type: lead.lead_type,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding outreach lead:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/outreach');
  return { data: data as OutreachLead };
}

export async function deleteLeadAction(id: string): Promise<{ error?: string }> {
  const supabase = await requireAdmin();

  const { error } = await supabase.from('outreach_leads').delete().eq('id', id);

  if (error) {
    console.error('Error deleting outreach lead:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/outreach');
  return {};
}

export async function addTemplateAction(
  template: Omit<MessageTemplate, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data?: MessageTemplate; error?: string }> {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from('outreach_message_templates')
    .insert({
      name: template.name,
      lead_type: template.lead_type,
      message: template.message,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding outreach template:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/outreach');
  return { data: data as MessageTemplate };
}

export async function updateTemplateAction(
  id: string,
  updates: Partial<Pick<MessageTemplate, 'name' | 'lead_type' | 'message'>>
): Promise<{ data?: MessageTemplate; error?: string }> {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from('outreach_message_templates')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating outreach template:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/outreach');
  return { data: data as MessageTemplate };
}

export async function deleteTemplateAction(id: string): Promise<{ error?: string }> {
  const supabase = await requireAdmin();

  const { error } = await supabase.from('outreach_message_templates').delete().eq('id', id);

  if (error) {
    console.error('Error deleting outreach template:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/outreach');
  return {};
}
