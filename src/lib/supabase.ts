import { createClient } from '@supabase/supabase-js';

// const metaEnv = (import.meta as any).env || {};
const supabaseUrl = "https://zdpkrcvdtrcvvwqmtuwm.supabase.co";
const supabaseAnonKey = "sb_publishable_PtMOUbmMadi7w2nkcX6WXw_bIbOswaV";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
