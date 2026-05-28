create extension if not exists "pgcrypto";

create type public.active_role as enum ('tenant', 'landlord');
create type public.property_status as enum ('draft', 'published', 'archived', 'rented');
create type public.inquiry_status as enum ('pending', 'read', 'responded', 'closed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  is_tenant boolean not null default true,
  is_landlord boolean not null default false,
  active_role public.active_role not null default 'tenant',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_active_role_enabled check (
    (active_role = 'tenant' and is_tenant = true)
    or (active_role = 'landlord' and is_landlord = true)
  )
);

create table public.property_locations (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  address text,
  city text not null,
  state text not null,
  country text not null default 'Nigeria',
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  location_id uuid references public.property_locations(id) on delete set null,
  title text not null,
  description text,
  price numeric(12, 2) not null check (price >= 0),
  property_type text not null,
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  bathrooms integer check (bathrooms is null or bathrooms >= 0),
  status public.property_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  image_url text not null,
  storage_path text not null,
  is_primary boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favorites_user_property_unique unique (user_id, property_id)
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  status public.inquiry_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inquiries_sender_recipient_distinct check (sender_id <> recipient_id)
);

create index profiles_active_role_idx on public.profiles(active_role);
create index property_locations_created_by_idx on public.property_locations(created_by);
create index property_locations_city_idx on public.property_locations(city);
create index properties_owner_id_idx on public.properties(owner_id);
create index properties_status_idx on public.properties(status);
create index properties_location_id_idx on public.properties(location_id);
create index property_images_property_id_idx on public.property_images(property_id);
create index favorites_user_id_idx on public.favorites(user_id);
create index favorites_property_id_idx on public.favorites(property_id);
create index inquiries_sender_id_idx on public.inquiries(sender_id);
create index inquiries_recipient_id_idx on public.inquiries(recipient_id);
create index inquiries_property_id_idx on public.inquiries(property_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger property_locations_set_updated_at
before update on public.property_locations
for each row execute function public.set_updated_at();

create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

create trigger inquiries_set_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    is_tenant,
    is_landlord,
    active_role
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    true,
    false,
    'tenant'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.profile_has_active_role(
  profile_id uuid,
  expected_role public.active_role
)
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
      and active_role = expected_role
      and (
        (expected_role = 'tenant' and is_tenant = true)
        or (expected_role = 'landlord' and is_landlord = true)
      )
  );
$$;

alter table public.profiles enable row level security;
alter table public.property_locations enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.favorites enable row level security;
alter table public.inquiries enable row level security;

create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Users can insert own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Published property locations are public"
on public.property_locations for select
to anon, authenticated
using (
  exists (
    select 1
    from public.properties
    where properties.location_id = property_locations.id
      and properties.status = 'published'
  )
  or created_by = auth.uid()
);

create policy "Active landlords can create own locations"
on public.property_locations for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.profile_has_active_role(auth.uid(), 'landlord')
);

create policy "Active landlords can update own locations"
on public.property_locations for update
to authenticated
using (
  created_by = auth.uid()
  and public.profile_has_active_role(auth.uid(), 'landlord')
)
with check (
  created_by = auth.uid()
  and public.profile_has_active_role(auth.uid(), 'landlord')
);

create policy "Published properties are public"
on public.properties for select
to anon, authenticated
using (status = 'published' or owner_id = auth.uid());

create policy "Active landlords can create own properties"
on public.properties for insert
to authenticated
with check (
  owner_id = auth.uid()
  and public.profile_has_active_role(auth.uid(), 'landlord')
);

create policy "Active landlords can update own properties"
on public.properties for update
to authenticated
using (
  owner_id = auth.uid()
  and public.profile_has_active_role(auth.uid(), 'landlord')
)
with check (
  owner_id = auth.uid()
  and public.profile_has_active_role(auth.uid(), 'landlord')
);

create policy "Active landlords can delete own properties"
on public.properties for delete
to authenticated
using (
  owner_id = auth.uid()
  and public.profile_has_active_role(auth.uid(), 'landlord')
);

create policy "Published property images are public"
on public.property_images for select
to anon, authenticated
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_images.property_id
      and (properties.status = 'published' or properties.owner_id = auth.uid())
  )
);

create policy "Active landlords can manage own property images"
on public.property_images for all
to authenticated
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_images.property_id
      and properties.owner_id = auth.uid()
      and public.profile_has_active_role(auth.uid(), 'landlord')
  )
)
with check (
  exists (
    select 1
    from public.properties
    where properties.id = property_images.property_id
      and properties.owner_id = auth.uid()
      and public.profile_has_active_role(auth.uid(), 'landlord')
  )
);

create policy "Users can manage own favorites"
on public.favorites for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can view own inquiries"
on public.inquiries for select
to authenticated
using (sender_id = auth.uid() or recipient_id = auth.uid());

create policy "Active tenants can create inquiries"
on public.inquiries for insert
to authenticated
with check (
  sender_id = auth.uid()
  and public.profile_has_active_role(auth.uid(), 'tenant')
  and exists (
    select 1
    from public.properties
    where properties.id = inquiries.property_id
      and properties.owner_id = inquiries.recipient_id
      and properties.status = 'published'
  )
);

create policy "Landlords can update inquiries addressed to them"
on public.inquiries for update
to authenticated
using (
  recipient_id = auth.uid()
  and public.profile_has_active_role(auth.uid(), 'landlord')
)
with check (
  recipient_id = auth.uid()
  and public.profile_has_active_role(auth.uid(), 'landlord')
);

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

create policy "Property images are publicly readable"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'property-images');

create policy "Active landlords can upload property images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'property-images'
  and public.profile_has_active_role(auth.uid(), 'landlord')
  and (storage.foldername(name))[1] = 'properties'
);

create policy "Active landlords can update own property image objects"
on storage.objects for update
to authenticated
using (
  bucket_id = 'property-images'
  and owner = auth.uid()
  and public.profile_has_active_role(auth.uid(), 'landlord')
)
with check (
  bucket_id = 'property-images'
  and owner = auth.uid()
  and public.profile_has_active_role(auth.uid(), 'landlord')
);

create policy "Active landlords can delete own property image objects"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'property-images'
  and owner = auth.uid()
  and public.profile_has_active_role(auth.uid(), 'landlord')
);
