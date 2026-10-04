import "server-only";
import { getSupabaseServer } from "./supabase-server";

export async function findGuestByEmail(email) {
  const { data, error } = await getSupabaseServer()
    .from("guests")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (error) throw new Error("Guest account could not be loaded", { cause: error });
  return data;
}

export async function ensureGuest(user) {
  const existingGuest = await findGuestByEmail(user.email);
  if (existingGuest) return existingGuest;
  const { data, error } = await getSupabaseServer()
    .from("guests")
    .insert({ email: user.email, fullName: user.name || user.email })
    .select("*")
    .single();
  if (error) throw new Error("Guest account could not be created", { cause: error });
  return data;
}
