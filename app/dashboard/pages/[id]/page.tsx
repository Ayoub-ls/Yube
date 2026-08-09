import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { EditPageForm } from './EditPageForm';

export default async function EditLandingPagePage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

    if (!client) redirect('/auth/login');

    // Scoped to client_id so someone can't edit a page by guessing another
    // store's page id in the URL — RLS also enforces this at the database
    // layer, but this gives a clean 404 instead of relying on that alone.
    const { data: page } = await supabase
        .from('landing_pages')
        .select('id, product_name, price, original_price, description, whatsapp')
        .eq('id', params.id)
        .eq('client_id', client.id)
        .maybeSingle();

    if (!page) notFound();

    return <EditPageForm page={page} />;
}