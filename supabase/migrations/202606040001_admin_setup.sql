alter table public.profiles
add column if not exists is_admin boolean not null default false;

comment on column public.profiles.is_admin is
'Platform administration flag. Keep separate from tenant/landlord active_role.';

-- Albert: replace this email with your own admin email before applying.
-- update public.profiles
-- set is_admin = true
-- where email = 'admin@example.com';

create or replace function public.profile_is_admin(profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = profile_id
      and is_admin = true
  );
$$;

create policy "Admins can read all profiles"
on public.profiles for select
to authenticated
using (public.profile_is_admin(auth.uid()));

create policy "Admins can read all property locations"
on public.property_locations for select
to authenticated
using (public.profile_is_admin(auth.uid()));

create policy "Admins can read all properties"
on public.properties for select
to authenticated
using (public.profile_is_admin(auth.uid()));

create policy "Admins can moderate all properties"
on public.properties for update
to authenticated
using (public.profile_is_admin(auth.uid()))
with check (public.profile_is_admin(auth.uid()));

create policy "Admins can delete all properties"
on public.properties for delete
to authenticated
using (public.profile_is_admin(auth.uid()));

create policy "Admins can read all inquiries"
on public.inquiries for select
to authenticated
using (public.profile_is_admin(auth.uid()));
