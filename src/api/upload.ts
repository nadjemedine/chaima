import { supabase } from '../lib/supabase';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  file: File,
  folder: string = ''
): Promise<string> {
  const fileName = `${folder}${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Upload multiple images and return their public URLs
 */
export async function uploadImages(
  bucket: string,
  files: FileList | File[],
  folder: string = ''
): Promise<string[]> {
  const urls: string[] = [];
  for (const file of Array.from(files)) {
    const url = await uploadFile(bucket, file, folder);
    urls.push(url);
  }
  return urls;
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
}
