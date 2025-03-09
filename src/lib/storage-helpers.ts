
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a file to Supabase storage
 * @param file File to upload
 * @param bucket Bucket name
 * @param path Path within the bucket
 * @returns URL of the uploaded file
 */
export const uploadFile = async (file: File, bucket: string, path: string): Promise<string> => {
  console.log(`Uploading file to ${bucket}/${path}`, file);

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        cacheControl: "3600"
      });

    if (error) {
      console.error("Error uploading file:", error.message, error);
      throw error;
    }

    console.log("Upload successful:", data);

    // Get public URL for the file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    console.log("Public URL generated:", urlData.publicUrl);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Exception during upload:", error);
    throw error;
  }
};
