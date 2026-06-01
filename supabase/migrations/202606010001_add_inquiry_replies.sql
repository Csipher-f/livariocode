-- Add inquiry_replies table and update inquiries RLS policies

create table public.inquiry_replies (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.inquiry_replies enable row level security;

-- Policies for inquiry_replies
create policy "Users can view replies for their inquiries"
on public.inquiry_replies for select
to authenticated
using (
  exists (
    select 1
    from public.inquiries
    where inquiries.id = inquiry_replies.inquiry_id
      and (inquiries.sender_id = auth.uid() or inquiries.recipient_id = auth.uid())
  )
);

create policy "Users can insert replies for their inquiries"
on public.inquiry_replies for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1
    from public.inquiries
    where inquiries.id = inquiry_replies.inquiry_id
      and inquiries.status <> 'closed'
      and (inquiries.sender_id = auth.uid() or inquiries.recipient_id = auth.uid())
  )
);

-- Update inquiries RLS policy to allow both parties to update status
drop policy if exists "Landlords can update inquiries addressed to them" on public.inquiries;

create policy "Users can update inquiries they are part of"
on public.inquiries for update
to authenticated
using (
  (sender_id = auth.uid() and public.profile_has_active_role(auth.uid(), 'tenant'))
  or (recipient_id = auth.uid() and public.profile_has_active_role(auth.uid(), 'landlord'))
)
with check (
  (sender_id = auth.uid() and public.profile_has_active_role(auth.uid(), 'tenant'))
  or (recipient_id = auth.uid() and public.profile_has_active_role(auth.uid(), 'landlord'))
);

-- Create indexes
create index inquiry_replies_inquiry_id_idx on public.inquiry_replies(inquiry_id);
create index inquiry_replies_sender_id_idx on public.inquiry_replies(sender_id);

-- Permissions
grant select, insert on public.inquiry_replies to authenticated;
