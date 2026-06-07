create type public.tenancy_verification_source as enum ('manual', 'payment', 'admin');
create type public.review_status as enum ('pending', 'published', 'hidden');

create table public.property_tenancies (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  tenant_id uuid not null references public.profiles(id) on delete cascade,
  landlord_id uuid not null references public.profiles(id) on delete cascade,
  is_verified boolean not null default false,
  verified_at timestamptz,
  verification_source public.tenancy_verification_source,
  starts_on date,
  ends_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint property_tenancies_tenant_landlord_distinct check (tenant_id <> landlord_id),
  constraint property_tenancies_verified_at_required check (
    is_verified = false or verified_at is not null
  ),
  constraint property_tenancies_property_tenant_unique unique (property_id, tenant_id),
  constraint property_tenancies_review_reference_unique unique (id, property_id, tenant_id)
);

create table public.property_reviews (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  tenancy_id uuid not null,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint property_reviews_verified_tenancy_reference foreign key (
    tenancy_id,
    property_id,
    reviewer_id
  ) references public.property_tenancies(id, property_id, tenant_id) on delete cascade,
  constraint property_reviews_property_reviewer_unique unique (property_id, reviewer_id)
);

create index property_tenancies_property_id_idx on public.property_tenancies(property_id);
create index property_tenancies_tenant_id_idx on public.property_tenancies(tenant_id);
create index property_tenancies_landlord_id_idx on public.property_tenancies(landlord_id);
create index property_tenancies_verified_idx on public.property_tenancies(property_id, tenant_id)
where is_verified = true;

create index property_reviews_property_status_idx on public.property_reviews(property_id, status);
create index property_reviews_reviewer_id_idx on public.property_reviews(reviewer_id);

create trigger property_tenancies_set_updated_at
before update on public.property_tenancies
for each row execute function public.set_updated_at();

create trigger property_reviews_set_updated_at
before update on public.property_reviews
for each row execute function public.set_updated_at();

alter table public.property_tenancies enable row level security;
alter table public.property_reviews enable row level security;

create policy "Tenancy participants can read own tenancies"
on public.property_tenancies for select
to authenticated
using (
  tenant_id = auth.uid()
  or landlord_id = auth.uid()
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);

create policy "Admins can manage property tenancies"
on public.property_tenancies for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);

create policy "Published property reviews are public"
on public.property_reviews for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.properties
    where properties.id = property_reviews.property_id
      and properties.status = 'published'
  )
);

create policy "Tenants can read own reviews"
on public.property_reviews for select
to authenticated
using (reviewer_id = auth.uid());

create policy "Verified tenants can create pending reviews"
on public.property_reviews for insert
to authenticated
with check (
  reviewer_id = auth.uid()
  and status = 'pending'
  and public.profile_has_active_role(auth.uid(), 'tenant')
  and exists (
    select 1
    from public.property_tenancies
    where property_tenancies.id = property_reviews.tenancy_id
      and property_tenancies.property_id = property_reviews.property_id
      and property_tenancies.tenant_id = auth.uid()
      and property_tenancies.is_verified = true
  )
);

create policy "Verified tenants can update own pending reviews"
on public.property_reviews for update
to authenticated
using (
  reviewer_id = auth.uid()
  and status = 'pending'
)
with check (
  reviewer_id = auth.uid()
  and status = 'pending'
);

create policy "Admins can moderate property reviews"
on public.property_reviews for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);
