alter table public.favorites enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists "Users can manage own favorites" on public.favorites;
drop policy if exists "Users can view own favorites" on public.favorites;
drop policy if exists "Users can add own favorites" on public.favorites;
drop policy if exists "Users can delete own favorites" on public.favorites;

create policy "Users can view own favorites"
on public.favorites for select
to authenticated
using (user_id = auth.uid());

create policy "Users can add own favorites"
on public.favorites for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can delete own favorites"
on public.favorites for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "Active tenants can create inquiries" on public.inquiries;

create policy "Active tenants can create inquiries"
on public.inquiries for insert
to authenticated
with check (
  sender_id = auth.uid()
  and recipient_id <> auth.uid()
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_tenant = true
      and profiles.active_role = 'tenant'
  )
  and exists (
    select 1
    from public.properties
    where properties.id = inquiries.property_id
      and properties.owner_id = inquiries.recipient_id
      and properties.status = 'published'
  )
);

grant select, insert, delete on public.favorites to authenticated;
grant select, insert, update on public.inquiries to authenticated;
