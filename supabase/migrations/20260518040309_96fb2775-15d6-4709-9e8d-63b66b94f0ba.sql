
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
drop policy if exists "media_storage_public_read" on storage.objects;
create policy "media_storage_public_read_files" on storage.objects for select using (
  bucket_id = 'media' and (storage.foldername(name))[1] is not null
);
