# Supabase 서버 저장과 RLS 준비 안내

이 문서는 꿈디코치 AI 강사비서의 프로젝트를 브라우저 저장소가 아니라 Supabase 서버에 저장하기 위한 준비 문서입니다.

## 아주 쉽게 설명

- Supabase는 앱의 온라인 저장소입니다.
- 테이블은 엑셀 표처럼 데이터를 담는 곳입니다.
- RLS는 Row Level Security의 줄임말입니다.
- RLS는 로그인한 사람이 자기 프로젝트만 보게 막아주는 보안 규칙입니다.

## 만들 테이블

테이블 이름은 `projects`입니다.

프로젝트 한 개가 표의 한 줄이 됩니다.

| 컬럼 이름 | 뜻 |
| --- | --- |
| `id` | 프로젝트 고유 번호 |
| `user_id` | 이 프로젝트를 만든 사용자 |
| `title` | 프로젝트 제목 |
| `organization` | 기관명 |
| `audience` | 대상 |
| `date` | 강의 날짜 |
| `time` | 강의 시간 |
| `purpose` | 강의 목적 |
| `format` | 강의 형식 |
| `notes` | 메모 |
| `content` | 제안서, 보고서, 블로그 같은 결과물 묶음 |
| `created_at` | 만든 시간 |
| `updated_at` | 마지막 수정 시간 |

## Supabase SQL Editor에 넣을 SQL

Supabase 프로젝트를 만든 뒤 SQL Editor에 아래 내용을 붙여 넣고 실행합니다.

```sql
create table if not exists public.projects (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  organization text default '',
  audience text default '',
  date text default '',
  time text default '',
  purpose text default '',
  format text default '',
  notes text default '',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Users can read own projects"
on public.projects
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create own projects"
on public.projects
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own projects"
on public.projects
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own projects"
on public.projects
for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists projects_user_id_updated_at_idx
on public.projects (user_id, updated_at desc);
```

## 왜 `content`를 jsonb로 하나요?

꿈디코치 AI 강사비서는 한 프로젝트 안에 여러 결과물이 들어갑니다.

- 제안서
- 강의 기획서
- 자료수집
- 결과보고서
- 인터뷰
- 블로그
- 마케팅

처음에는 `content` 한 칸에 JSON 형태로 묶어 저장하면 구조 변경이 쉽습니다. 나중에 사용자가 많아지고 검색이 중요해지면 단계별 테이블로 나눌 수 있습니다.

## 다음 개발 순서

1. Supabase 프로젝트를 만듭니다.
2. 위 SQL을 실행합니다.
3. `.env.local`에 Supabase URL과 anon key를 넣습니다.
4. 로그인 후 프로젝트를 서버에 저장하는 코드를 연결합니다.
5. 브라우저 저장소와 서버 저장소가 충돌하지 않는지 테스트합니다.

## 주의

- `anon key`는 브라우저에서 쓰는 공개 키입니다.
- `service role key`는 절대 브라우저에 넣으면 안 됩니다.
- RLS를 켜지 않으면 다른 사람 데이터 보호가 약해질 수 있습니다.
