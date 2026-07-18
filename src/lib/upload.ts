// src/lib/upload.ts - Supabase & Cloudinary Upload Utility
import { supabase } from './db';

interface UploadResult {
  supabaseUrl: string;
  cloudinaryUrl: string;
  publicId: string;
}

const getCloudinaryCloudName = () => {
  return (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME || 
         (import.meta as any).env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
         '';
};

const getCloudinaryUploadPreset = () => {
  return (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET || 
         (import.meta as any).env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 
         'yube_uploads';
};

export async function uploadImage(
  file: File,
  clientId: string,
  folder: 'products' | 'proofs'
): Promise<UploadResult> {
  // ── Step 1: Upload to Cloudinary only (delivery) ──
  const cloudName = getCloudinaryCloudName();
  const uploadPreset = getCloudinaryUploadPreset();

  if (!cloudName) {
    // If Cloudinary is not configured, fall back to object URL
    console.warn('Cloudinary not configured. Falling back to mock URL.');
    const localUrl = URL.createObjectURL(file);
    return {
      supabaseUrl: '',
      cloudinaryUrl: localUrl,
      publicId: 'mock-fallback',
    };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', `yube/${clientId}/${folder}`);
  formData.append('tags', `yube,${clientId},${folder}`);

  const cloudinaryRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!cloudinaryRes.ok) {
    const err = await cloudinaryRes.text();
    throw new Error(`Cloudinary upload failed: ${err}`);
  }

  const cloudinaryData = await cloudinaryRes.json();

  return {
    supabaseUrl: '',
    cloudinaryUrl: cloudinaryData.secure_url,
    publicId: cloudinaryData.public_id || '',
  };
}

export async function uploadAudio(
  file: File,
  clientId: string
): Promise<UploadResult> {
  // Audio goes to Supabase Storage only (Cloudinary charges for video/audio)
  if (!supabase) {
    console.warn('Supabase not configured, falling back for audio upload');
    const localUrl = URL.createObjectURL(file);
    return {
      supabaseUrl: localUrl,
      cloudinaryUrl: localUrl,
      publicId: 'mock-fallback-audio',
    };
  }

  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const storagePath = `proofs/${clientId}/audio/${filename}`;

  const { error } = await supabase.storage
    .from('yube-uploads')
    .upload(storagePath, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from('yube-uploads')
    .getPublicUrl(storagePath);

  return {
    supabaseUrl: data.publicUrl,
    cloudinaryUrl: data.publicUrl, // same URL for audio
    publicId: storagePath,
  };
}

export async function uploadVideo(
  file: File,
  clientId: string
): Promise<UploadResult> {
  // Video goes to Supabase Storage only
  if (!supabase) {
    console.warn('Supabase not configured, falling back for video upload');
    const localUrl = URL.createObjectURL(file);
    return {
      supabaseUrl: localUrl,
      cloudinaryUrl: localUrl,
      publicId: 'mock-fallback-video',
    };
  }

  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const storagePath = `proofs/${clientId}/video/${filename}`;

  const { error } = await supabase.storage
    .from('yube-uploads')
    .upload(storagePath, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from('yube-uploads')
    .getPublicUrl(storagePath);

  return {
    supabaseUrl: data.publicUrl,
    cloudinaryUrl: data.publicUrl,
    publicId: storagePath,
  };
}
