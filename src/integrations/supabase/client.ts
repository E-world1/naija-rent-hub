// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mxtifswjkzirobfemuef.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dGlmc3dqa3ppcm9iZmVtdWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NzMzMDksImV4cCI6MjA2MjI0OTMwOX0.5XAzCTVMAbNGfjbCcIL6hRBhAw7xC4hm2vb1dNKuCNY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);