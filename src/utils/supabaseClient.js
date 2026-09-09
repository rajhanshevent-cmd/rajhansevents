import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[Supabase] Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. Using fallback client for build/dev."
    );
  }
}

// Fallback prevents module evaluation crash during static analysis or local runs without .env
const effectiveUrl = supabaseUrl || "https://uvoapeploerjdonrrbtp.supabase.co";
const effectiveKey = supabaseAnonKey || "placeholder-anon-key";

export const supabase = createClient(effectiveUrl, effectiveKey);
