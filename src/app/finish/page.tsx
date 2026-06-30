import Link from "next/link";

const completedSummary = [
  "프로젝트 만들기와 저장",
  "8단계 강사 업무 흐름",
  "제안서, 기획서, 보고서, 인터뷰, 블로그, 마케팅 작성 화면",
  "샘플 초안과 저장 상태 표시",
  "Markdown, Word, PDF 다운로드 흐름",
  "OpenAI, Supabase, Vercel 준비 안내",
  "보안, QA, 배포 체크리스트",
  "출시 요약과 결과 내보내기",
];

const nextActions = [
  {
    title: "1. 샘플 프로젝트로 끝까지 테스트",
    description: "새 프로젝트를 만들고 제안서부터 다운로드까지 한 번 끝까지 눌러 봅니다.",
    href: "/projects/new",
    label: "새 프로젝트 만들기",
  },
  {
    title: "2. QA 체크리스트 완료",
    description: "화면, 저장, 다운로드, 설정을 하나씩 확인하고 QA 결과를 저장합니다.",
    href: "/qa-guide",
    label: "최종 QA 열기",
  },
  {
    title: "3. 실제 배포 준비",
    description: "Supabase, OpenAI, Vercel 환경변수를 준비하고 배포 체크를 진행합니다.",
    href: "/deploy-guide",
    label: "배포 안내 보기",
  },
];

export default function FinishPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">v1.0 기본 버전</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">꿈디코치 AI 강사비서 기본 완성</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/go-live"
                className="inline-flex h-11 items-center justify-center rounded-md border border-rose-300 bg-rose-50 px-4 text-sm font-semibold text-rose-900 transition hover:bg-rose-100"
              >
                공개 전 체크
              </Link>
              <Link
                href="/handoff"
                className="inline-flex h-11 items-center justify-center rounded-md border border-amber-300 bg-amber-50 px-4 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
              >
                인수인계
              </Link>
              <Link
                href="/release-notes"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                출시 요약
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
            기본 화면, 프로젝트 흐름, 저장, 다운로드, 설정 안내, QA와 배포 준비까지 갖춘 v1.0 기본 버전입니다.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 lg:px-10">
        <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-800">현재 상태</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-950">100% 기본 준비됨</h2>
          <p className="mt-3 text-sm leading-7 text-emerald-950">
            남은 핵심은 실제 OpenAI 결제 확인, Supabase 연결, Vercel 배포, 실제 사용자 테스트입니다.
          </p>
        </article>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">완성된 것</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">지금 앱에 들어 있는 기능</h2>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {completedSummary.map((item) => (
                <div key={item} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold">
                  완료: {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">바로 할 일</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">다음 순서</h2>
            <div className="mt-5 grid gap-3">
              {nextActions.map((action) => (
                <div key={action.title} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-bold text-slate-950">{action.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
                  <Link
                    href={action.href}
                    className="mt-3 inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    {action.label}
                  </Link>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
          <p className="font-bold">초보자용 한 줄 정리</p>
          <p className="mt-2">
            지금은 “앱 기본 기능은 완성, 실제 서비스 연결과 배포 테스트만 확인하면 되는 상태”입니다.
          </p>
        </article>
      </section>
    </main>
  );
}
