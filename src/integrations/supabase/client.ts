
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kucigyynsgjfymtzzwvs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y2lneXluc2dqZnltdHp6d3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1Mjc2MjgsImV4cCI6MjA1NTEwMzYyOH0.lcAlKNHWkj8uId-oFU2lHeCHQZcLwaZSSlc3H5erTrA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public',
    },
    global: {
      fetch: fetch,
    },
  }
);

console.log("Supabase client initialized with URL:", SUPABASE_URL);
