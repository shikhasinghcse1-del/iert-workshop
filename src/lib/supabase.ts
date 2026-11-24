import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "FAKE_SUPABASE_ANON_KEY_DO_NOT_USE_112233";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
