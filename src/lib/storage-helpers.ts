
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a file to Supabase storage
 * @param file File to upload
 * @param bucket Bucket name
 * @param path Path within the bucket
 * @returns URL of the uploaded file
 */
export const uploadFile = async (file: File, bucket: string, path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
      cacheControl: "3600"
    });

  if (error) {
    console.error("Error uploading file:", error);
    throw error;
  }

  // Get public URL for the file
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
};
