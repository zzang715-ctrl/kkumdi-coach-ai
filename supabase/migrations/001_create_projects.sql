create table if not exists public.projects (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  organization text not null default '',
  audience text not null default '',
  date text not null default '',
  time text not null default '',
  purpose text not null default '',
  format text not null default '',
  notes text not null default '',
  proposal_draft text,
  proposal_updated_at timestamptz,
  lecture_plan_draft text,
  lecture_plan_updated_at timestamptz,
  data_collection jsonb,
  data_collection_updated_at timestamptz,
  result_report_draft text,
  result_report_updated_at timestamptz,
  interview_draft text,
  interview_updated_at timestamptz,
  blog_draft text,
  blog_updated_at timestamptz,
  marketing_draft text,
  marketing_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Users can read their own projects"
on public.projects
for select
using (auth.uid() = user_id);

create policy "Users can create their own projects"
on public.projects
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own projects"
on public.projects
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own projects"
on public.projects
for delete
using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;

create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();
