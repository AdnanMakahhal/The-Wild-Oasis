import "server-only";
import { createClient } from "@supabase/supabase-js";

let client;

export function getSupabaseServer() {
  if (!process.env.SUPABASE_SECRET_KEY) {
    throw new Error("Set SUPABASE_SECRET_KEY in .env.local for guest accounts and bookings");
  }
  client ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  return client;
}
