begin;

-- This migration intentionally fails if faqs already exists: inspect the existing
-- table instead of silently replacing its schema, contents, grants or policies.
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('learning', 'internship', 'future', 'admission')),
  question text not null check (char_length(btrim(question)) between 1 and 240),
  answer text not null check (char_length(btrim(answer)) between 1 and 4000),
  sort_order bigint generated always as identity,
  created_at timestamptz not null default now()
);

comment on table public.faqs is 'Published FAQ content only. No draft/private entries in this table.';
comment on column public.faqs.sort_order is 'Insertion order; new FAQs append after existing content.';

alter table public.faqs enable row level security;
revoke all on table public.faqs from public, anon, authenticated;
revoke all on sequence public.faqs_sort_order_seq from public, anon, authenticated;
grant select on table public.faqs to anon, authenticated;

create policy faqs_public_read on public.faqs
  for select to anon, authenticated using (true);

-- No write grants or write policies until verified admin authorization exists.
commit;
