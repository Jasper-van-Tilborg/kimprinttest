/**
 * Helper function to check if an image URL is from Supabase
 * and return unoptimized flag if needed
 */
export function isSupabaseImage(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('supabase.co') || url.includes('supabase.storage');
}

/**
 * Get image props for Next.js Image component
 * Handles Supabase images that might not be configured yet
 */
export function getImageProps(src: string | null | undefined) {
  if (!src) return { src: '', unoptimized: false };
  
  const isSupabase = isSupabaseImage(src);
  
  return {
    src,
    unoptimized: isSupabase, // Use unoptimized for Supabase images if config doesn't work
  };
}









