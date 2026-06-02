-- Create the avatars storage bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Enable RLS on storage.objects if it is not already enabled (Supabase enables it by default)
-- But we can safely write policies for bucket 'avatars'

-- Policy for reading avatars (public access)
create policy "Avatars are publicly readable"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'avatars');

-- Policy for users uploading their own avatar
create policy "Users can upload their own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for users updating their own avatar object
create policy "Users can update their own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and owner = auth.uid()
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and owner = auth.uid()
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for users deleting their own avatar object
create policy "Users can delete their own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and owner = auth.uid()
  and (storage.foldername(name))[1] = auth.uid()::text
);
