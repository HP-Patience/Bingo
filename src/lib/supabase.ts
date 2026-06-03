import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const PROJECT_REF = new URL(supabaseUrl).hostname.split('.')[0];

const customFetch: typeof fetch = async (input, init) => {
  const headers = new Headers(init?.headers);
  if (!headers.has('apikey')) {
    headers.set('apikey', supabaseAnonKey);
  }
  const response = await fetch(input, { ...init, headers });
  if (!response.ok) {
    const cloned = response.clone();
    cloned.text().then(body => {
      console.error(`🔴 [Supabase ${response.status}] ${init?.method || 'GET'} ${String(input).split('/rest/v1/')[1]?.split('?')[0] || String(input).split('?')[0]}`, body.slice(0, 500));
    });
  }
  return response;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: customFetch },
});

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const path = `${userId}/avatar.jpeg`;
  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: 'image/jpeg' });
  if (error) throw error;
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(path);
  return urlData.publicUrl;
}

function compressImage(base64: string, maxWidth: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const width = Math.min(img.width, maxWidth);
      const height = Math.round(img.height * (width / img.width));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')), 'image/jpeg', quality);
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = base64;
  });
}

export async function migrateBase64Avatar(userId: string, base64: string): Promise<string> {
  const match = base64.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return base64;
  const blob = await compressImage(base64, 400, 0.8);
  const file = new File([blob], 'avatar.jpeg', { type: 'image/jpeg' });
  return uploadAvatar(userId, file);
}
