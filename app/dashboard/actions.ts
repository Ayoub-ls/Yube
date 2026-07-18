'use server';

import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { generateUniquePageSlug } from '../../lib/data';
import { checkPlanAllowsNewPage } from '../../lib/plans';
import { revalidatePath } from 'next/cache';

export async function createLandingPage(prevState: any, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: client } = await supabase
    .from('clients')
    .select('id, plan, plan_expires_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!client) {
    return { error: 'لم يتم العثور على متجرك، يرجى تسجيل الدخول من جديد' };
  }

  // Plan enforcement: trial expiry + page-count limit. Checked here,
  // server-side, right before insert — not just in the UI — since the
  // UI check alone wouldn't stop someone from calling this action
  // directly.
  const { count: currentPageCount } = await supabase
    .from('landing_pages')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', client.id);

  const planError = checkPlanAllowsNewPage(client, currentPageCount || 0);
  if (planError) {
    return { error: planError };
  }

  const templateId = formData.get('template_id') as string;
  const productName = (formData.get('product_name') as string || '').trim();
  const priceRaw = formData.get('price') as string;
  const originalPriceRaw = formData.get('original_price') as string;
  const description = (formData.get('description') as string || '').trim();
  const whatsapp = (formData.get('whatsapp') as string || '').trim();
  const colorTheme = (formData.get('color_theme') as string) || 'green';
  const imagesRaw = (formData.get('product_images') as string) || '[]';

  let productImages: string[] = [];
  try {
    const parsed = JSON.parse(imagesRaw);
    if (Array.isArray(parsed)) {
      productImages = parsed.filter((u) => typeof u === 'string').slice(0, 8);
    }
  } catch {
    // Malformed JSON from the client just means no images were attached —
    // fail soft rather than blocking page creation over it.
    productImages = [];
  }

  const reviewsRaw = (formData.get('reviews') as string) || '[]';
  let reviews: any[] = [];
  try {
    const parsed = JSON.parse(reviewsRaw);
    if (Array.isArray(parsed)) {
      reviews = parsed
        .filter((r) => r && typeof r.name === 'string' && typeof r.text === 'string')
        .slice(0, 10)
        .map((r) => ({
          name: String(r.name).slice(0, 60),
          location: String(r.location || '').slice(0, 60),
          rating: Math.min(5, Math.max(1, parseInt(r.rating, 10) || 5)),
          text: String(r.text).slice(0, 500),
        }));
    }
  } catch {
    reviews = [];
  }

  const socialProofRaw = (formData.get('social_proof') as string) || '[]';
  let socialProof: any[] = [];
  try {
    const parsed = JSON.parse(socialProofRaw);
    if (Array.isArray(parsed)) {
      socialProof = parsed
        .filter((p) => p && typeof p.url === 'string' && ['image', 'audio', 'video'].includes(p.type))
        .slice(0, 10)
        .map((p) => ({
          type: p.type,
          url: p.url,
          caption: String(p.caption || '').slice(0, 200),
        }));
    }
  } catch {
    socialProof = [];
  }

  const pageConfigRaw = (formData.get('page_config') as string) || '{}';
  let pageConfig: Record<string, any> = {};
  try {
    const parsed = JSON.parse(pageConfigRaw);
    if (parsed && typeof parsed === 'object') {
      if (typeof parsed.headline === 'string' && parsed.headline.trim()) {
        pageConfig.headline = parsed.headline.trim().slice(0, 80);
      }
      if (typeof parsed.subheadline === 'string' && parsed.subheadline.trim()) {
        pageConfig.subheadline = parsed.subheadline.trim().slice(0, 160);
      }
      if (Array.isArray(parsed.sizes)) {
        const cleanSizes = parsed.sizes
          .filter((s: any) => typeof s === 'string' && s.trim())
          .map((s: string) => s.trim().slice(0, 20))
          .slice(0, 15);
        if (cleanSizes.length > 0) pageConfig.sizes = cleanSizes;
      }
      if (Array.isArray(parsed.colors)) {
        const cleanColors = parsed.colors
          .filter((c: any) => c && typeof c.name === 'string' && typeof c.url === 'string')
          .map((c: any) => ({ name: String(c.name).trim().slice(0, 30), url: c.url }))
          .slice(0, 8);
        if (cleanColors.length > 0) pageConfig.colors = cleanColors;
      }
    }
  } catch {
    pageConfig = {};
  }

  if (!templateId || !productName || !priceRaw) {
    return { error: 'يرجى ملء اسم المنتج والسعر واختيار القالب' };
  }

  const price = parseInt(priceRaw, 10);
  if (isNaN(price) || price <= 0) {
    return { error: 'يرجى إدخال سعر صحيح' };
  }

  const originalPrice = originalPriceRaw ? parseInt(originalPriceRaw, 10) : null;

  const slug = await generateUniquePageSlug(supabase, client.id, productName);

  const { error: insertError } = await supabase.from('landing_pages').insert({
    client_id: client.id,
    slug,
    template_id: templateId,
    status: 'live',
    published_at: new Date().toISOString(),
    product_name: productName,
    price,
    original_price: originalPrice || null,
    description: description || null,
    whatsapp: whatsapp || null,
    color_theme: colorTheme,
    product_images: productImages,
    social_proof: socialProof,
    reviews: reviews,
    page_config: Object.keys(pageConfig).length > 0 ? pageConfig : null,
  });

  if (insertError) {
    console.error('Error creating landing page:', insertError);
    return { error: 'فشل إنشاء الصفحة: ' + insertError.message };
  }

  revalidatePath('/dashboard/pages');
  redirect('/dashboard/pages?created=1');
}

export async function deleteLandingPage(pageId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!client) return;

  // Only allow deleting draft/rejected pages, and only the owner's own
  // page (RLS also enforces this, but checking here gives a clean no-op
  // instead of relying solely on the database to silently reject it).
  await supabase
    .from('landing_pages')
    .delete()
    .eq('id', pageId)
    .eq('client_id', client.id)
    .in('status', ['draft', 'rejected']);

  revalidatePath('/dashboard/pages');
}

const VALID_ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export async function updateOrderStatus(orderId: string, newStatus: string) {
  if (!VALID_ORDER_STATUSES.includes(newStatus)) return;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!client) return;

  // Scoped to this client's own orders — RLS also enforces this via the
  // "client update own orders" policy, but checking here avoids a wasted
  // round-trip that RLS would reject anyway.
  await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)
    .eq('client_id', client.id);

  revalidatePath('/dashboard/orders');
}

export async function updateClientSettings(prevState: any, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const businessName = (formData.get('business_name') as string || '').trim();
  const whatsapp = (formData.get('whatsapp') as string || '').trim();
  const pixelId = (formData.get('pixel_id') as string || '').trim();

  if (!businessName) {
    return { error: 'يرجى إدخال اسم المتجر' };
  }

  const { error } = await supabase
    .from('clients')
    .update({
      business_name: businessName,
      whatsapp: whatsapp || null,
      pixel_id: pixelId || null,
    })
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating settings:', error);
    return { error: 'فشل حفظ الإعدادات: ' + error.message };
  }

  revalidatePath('/dashboard/settings');
  return { success: true };
}

export async function changePassword(prevState: any, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const newPassword = formData.get('new_password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  if (!newPassword || newPassword.length < 6) {
    return { error: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'كلمتا المرور غير متطابقتين' };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.error('Error updating password:', error);
    return { error: 'فشل تحديث كلمة المرور: ' + error.message };
  }

  return { success: true };
}
