import Link from "next/link";
import { CopySqlButton } from "@/features/settings/CopySqlButton";

const tableRows = [
  ["id", "프로젝트 고유 번호"],
  ["user_id", "이 프로젝트를 만든 사용자"],
  ["title", "프로젝트 제목"],
  ["organization", "기관명"],
  ["audience", "대상"],
  ["date", "강의 날짜"],
  ["time", "강의 시간"],
  ["purpose", "강의 목적"],
  ["format", "강의 형식"],
  ["notes", "메모"],
  ["content", "제안서, 보고서, 블로그 같은 결과물 묶음"],
  ["created_at", "만든 시간"],
  ["updated_at", "마지막 수정 시간"],
];

const sqlText = `create table if not exists public.projects (
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
on public.projects (user_id, updated_at desc);`;

const nextSteps = [
  "Supabase 프로젝트를 만듭니다.",
  "SQL Editor에 아래 SQL을 붙여 넣고 실행합니다.",
  ".env.local 파일에 Supabase URL과 anon key를 넣습니다.",
  "로그인 후 프로젝트를 서버에 저장하는 코드를 연결합니다.",
  "내 프로젝트만 보이는지 RLS 규칙을 테스트합니다.",
];

const setupChecklist = [
  {
    label: "Supabase 프로젝트 생성",
    status: "직접 해야 함",
    description: "Supabase 사이트에서 새 프로젝트를 만든 뒤 Project URL과 anon key를 확인합니다.",
  },
  {
    label: "projects 테이블과 RLS 생성",
    status: "복사 가능",
    description: "이 화면의 SQL 복사 버튼을 누르고 Supabase SQL Editor에서 실행합니다.",
  },
  {
    label: ".env.local 값 입력",
    status: "직접 해야 함",
    description: "NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY 값을 넣고 서버를 다시 켭니다.",
  },
  {
    label: "Supabase 연결 테스트",
    status: "앱에서 확인",
    description: "설정 점검 화면에서 Supabase 테스트 버튼을 눌러 연결과 테이블을 확인합니다.",
  },
  {
    label: "로그인 후 서버 저장",
    status: "다음 개발",
    description: "로그인한 상태에서 프로젝트 저장과 서버 동기화를 최종 테스트합니다.",
  },
];

export default function SupabaseGuidePage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">서버 저장 준비</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">Supabase 테이블과 RLS 안내</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/settings"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                설정 점검
              </Link>
              <Link
                href="/roadmap"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-500"
              >
                완성도 확인
              </Link>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-500"
              >
                대시보드
              </Link>
            </div>
          </nav>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            Supabase는 앱의 온라인 저장소입니다. RLS는 로그인한 사람이 자기 프로젝트만 보게 막아주는
            보안 잠금장치입니다.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 lg:px-10">
        <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-emerald-800">서버 저장 준비 체크리스트</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">위에서 아래로 하나씩 진행하면 됩니다</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-950">
                지금은 결제나 배포 전에 서버 저장을 위한 준비물을 맞추는 단계입니다.
              </p>
            </div>
            <Link
              href="/settings"
              className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              설정 점검으로 이동
            </Link>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-5">
            {setupChecklist.map((item, index) => (
              <div key={item.label} className="rounded-md border border-emerald-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-700 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800">
                    {item.status}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-950">{item.label}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">초보자 설명</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">무엇을 만드는 건가요?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              `projects`라는 표를 하나 만들고, 프로젝트 한 개를 표의 한 줄로 저장합니다. 로그인한 사용자의
              고유 번호를 `user_id`에 넣어서 주인을 구분합니다.
            </p>
            <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-950">
              <p className="font-bold">RLS를 켜는 이유</p>
              <p className="mt-2">
                같은 앱을 여러 사람이 써도 내 프로젝트는 나만 보고, 다른 사람 프로젝트는 볼 수 없게 하기 위해서입니다.
              </p>
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">테이블 구조</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">projects 테이블</h2>
            <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
              {tableRows.map(([name, description]) => (
                <div key={name} className="grid grid-cols-[150px_1fr] border-b border-slate-200 last:border-b-0">
                  <code className="bg-slate-50 px-3 py-2 text-sm font-bold text-slate-950">{name}</code>
                  <p className="px-3 py-2 text-sm text-slate-700">{description}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-emerald-700">실행할 SQL</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Supabase SQL Editor에 붙여 넣기</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                아래 버튼을 누르면 SQL 전체가 복사됩니다. Supabase의 SQL Editor에 붙여 넣고 Run을 누르면 됩니다.
              </p>
            </div>
            <CopySqlButton sql={sqlText} />
          </div>
          <pre className="mt-4 max-h-[520px] overflow-auto rounded-md bg-slate-950 p-4 text-sm leading-6 text-slate-50">
            <code>{sqlText}</code>
          </pre>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">다음 개발 순서</p>
          <div className="mt-4 grid gap-2">
            {nextSteps.map((step, index) => (
              <div key={step} className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-950 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold leading-6 text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
