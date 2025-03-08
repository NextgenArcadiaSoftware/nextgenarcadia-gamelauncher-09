
// This file contains the Supabase client configuration for database connectivity.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase project configuration
const SUPABASE_URL = "https://kucigyynsgjfymtzzwvs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y2lneXluc2dqZnltdHp6d3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1Mjc2MjgsImV4cCI6MjA1NTEwMzYyOH0.lcAlKNHWkj8uId-oFU2lHeCHQZcLwaZSSlc3H5erTrA";

// Initialize Supabase client with proper configuration
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-client-info': 'supabase-js-web/2.33.1',
      },
    },
  }
);

// Verify connection is established by logging
console.log("Supabase client initialized with URL:", SUPABASE_URL);

// Perform a simple test query to verify connectivity
(async () => {
  try {
    const { data, error } = await supabase.from('games').select('count');
    if (error) {
      console.error("Supabase connection test failed:", error.message);
    } else {
      console.log("Supabase connection test successful");
    }
  } catch (err) {
    console.error("Failed to test Supabase connection:", err);
  }
})();
