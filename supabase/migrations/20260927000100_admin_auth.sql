begin;

-- Membership is managed only through trusted database administration.
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on table public.admin_users from public, anon, authenticated;
grant select on table public.admin_users to authenticated;
create policy admin_membership_read on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

-- Use the signed-in user's JWT, never a service-role client, for FAQ writes.
grant insert (category, question, answer), update (category, question, answer), delete
  on public.faqs to authenticated;
grant usage on sequence public.faqs_sort_order_seq to authenticated;

create policy faqs_admin_insert on public.faqs for insert to authenticated
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy faqs_admin_update on public.faqs for update to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy faqs_admin_delete on public.faqs for delete to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

commit;
