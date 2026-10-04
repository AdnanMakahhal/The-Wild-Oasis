-- Applied Supabase migration: allow_public_cabin_reads.
-- Public visitors need to read the cabin catalogue without signing in.
-- Row Level Security remains enabled; existing write policies are unchanged.
create policy "Public website can read cabins"
  on public.cabins
  for select
  to anon
  using (true);
