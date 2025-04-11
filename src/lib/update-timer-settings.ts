
import { supabase } from "@/integrations/supabase/client";

// Function to update timer duration in settings
export async function updateTimerDuration(minutes: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('settings')
      .update({ timer_duration: minutes, updated_at: new Date().toISOString() })
      .eq('id', 'global');
    
    if (error) {
      console.error('Error updating timer duration:', error);
      return false;
    }
    
    console.log(`Successfully updated timer duration to ${minutes} minutes`);
    return true;
  } catch (error) {
    console.error('Exception updating timer duration:', error);
    return false;
  }
}

// Run this function once to update timer duration to 8 minutes
export async function initializeTimerTo8Minutes() {
  const result = await updateTimerDuration(8);
  return result;
}
