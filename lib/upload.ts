/**
 * Uploads an image directly to Cloudinary from the browser using an
 * unsigned upload preset. Product images go to Cloudinary only — the
 * earlier Supabase Storage "backup" leg was deliberately removed since
 * nothing ever read from it and it doubled upload time/cost for no
 * benefit. Audio/video social-proof files (not yet built) would still
 * use Supabase Storage, since Cloudinary charges extra for those.
 */
export interface UploadedImage {
  url: string;
  publicId: string;
}

export async function uploadImageToCloudinary(
  file: File,
  folder: string
): Promise<UploadedImage> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary غير مُهيأ بعد — يرجى إعداد متغيرات البيئة أولاً');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Cloudinary upload failed:', errText);
    throw new Error('فشل رفع الصورة، حاول مرة أخرى');
  }

  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}

/**
 * Returns a Cloudinary URL with on-the-fly transformations applied
 * (auto format, auto quality, width-limited resize). Falls back to the
 * original URL untouched if it isn't a Cloudinary URL (e.g. legacy data).
 */
export function getOptimizedImageUrl(url: string, width = 800): string {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
}

/**
 * Uploads an audio or video file to Supabase Storage (not Cloudinary —
 * Cloudinary charges extra for audio/video delivery, so these stay on
 * Supabase's own storage, same as the original AI-Studio-era decision).
 * Requires an authenticated session, since the "authenticated upload"
 * storage policy only allows the `authenticated` role to write — this
 * is safe to call from dashboard pages, which are already auth-gated.
 */
export async function uploadMediaToSupabase(
  file: File,
  clientId: string,
  kind: 'audio' | 'video'
): Promise<string> {
  // Local import to avoid pulling the browser Supabase client into
  // server-rendered code paths that also import this module.
  const { createClient } = await import('./supabase/client');
  const supabase = createClient();

  const ext = file.name.split('.').pop() || (kind === 'audio' ? 'mp3' : 'mp4');
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `proofs/${clientId}/${kind}/${filename}`;

  const { error } = await supabase.storage
    .from('yube-uploads')
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error(`Error uploading ${kind}:`, error);
    throw new Error(kind === 'audio' ? 'فشل رفع الملف الصوتي' : 'فشل رفع الفيديو');
  }

  const { data } = supabase.storage.from('yube-uploads').getPublicUrl(path);
  return data.publicUrl;
}
