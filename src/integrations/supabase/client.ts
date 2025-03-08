
// This file contains the Supabase client configuration for database connectivity.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kucigyynsgjfymtzzwvs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y2lneXluc2dqZnltdHp6d3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1Mjc2MjgsImV4cCI6MjA1NTEwMzYyOH0.lcAlKNHWkj8uId-oFU2lHeCHQZcLwaZSSlc3H5erTrA";

// Create and export the Supabase client with proper configurations
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

console.log("Supabase client initialized with URL:", SUPABASE_URL);
