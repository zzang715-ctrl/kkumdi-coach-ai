import Link from "next/link";
import { AuthStatus } from "@/features/auth/AuthStatus";
import { HomeRecentProjects } from "@/features/projects/HomeRecentProjects";

const workflowSteps = [
  "제안서",
  "강의 기획서",
  "자료수집",
  "결과보고서",
  "인터뷰",
  "블로그",
  "마케팅",
  "다운로드",
];

const dashboardMenus = [
  ["새 프로젝트 만들기", "/projects/new"],
  ["저장된 프로젝트 보기", "/projects"],
  ["완성도 확인", "/roadmap"],
  ["설정 점검", "/settings"],
  ["배포 준비", "/deploy-guide"],
  ["최종 QA", "/qa-guide"],
  ["출시 요약", "/release-notes"],
  ["비밀키 보호", "/security-guide"],
  ["완료 화면", "/finish"],
  ["인수인계", "/handoff"],
  ["공개 전 체크", "/go-live"],
  ["사용 안내", "/help"],
  ["자료수집 AI", "/projects"],
  ["블로그 AI", "/projects"],
  ["마케팅 AI", "/projects"],
];

const assistantGroups = [
  {
    label: "강의 전",
    description: "기관 제안부터 강의 설계와 준비까지 미리 정리합니다.",
    items: ["제안서 AI", "강의 기획서 AI", "커리큘럼 AI", "준비물 AI"],
  },
  {
    label: "강의 중/직후",
    description: "현장에서 남긴 사진 설명, 메모, 참여자 반응을 기록합니다.",
    items: ["자료수집 AI", "현장기록 AI"],
  },
  {
    label: "강의 후",
    description: "보고서, 인터뷰, 블로그, 마케팅 콘텐츠까지 이어서 완성합니다.",
    items: ["결과보고서 AI", "인터뷰 AI", "블로그 AI", "마케팅 AI", "다운로드"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">v2.1 완성도 안내 추가</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">꿈디코치 AI 강사비서</h1>
            </div>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
              <AuthStatus />
              <Link
                href="/roadmap"
                className="inline-flex h-11 items-center justify-center rounded-md border border-emerald-300 bg-emerald-50 px-4 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
              >
                완성도 확인
              </Link>
              <Link
                href="/help"
                className="inline-flex h-11 items-center justify-center rounded-md border border-amber-300 bg-amber-50 px-4 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
              >
                사용 안내
              </Link>
              <Link
                href="/settings"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-500"
              >
                설정 점검
              </Link>
              <Link
                href="/projects"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-500"
              >
                저장된 프로젝트
              </Link>
              <Link
                href="/projects/new"
                className="inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                새 프로젝트
              </Link>
            </div>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold text-rose-700">교육 강사와 코치를 위한 AI 업무 파트너</p>
              <h2 className="mt-4 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                아이들의 가능성을 기록하고, 인터뷰하고, 글로 완성하는 AI 강사 비서
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
                강의 전 제안서와 기획서부터 현장 기록, 결과보고서, 블로그, 마케팅 콘텐츠까지 하나의
                프로젝트 흐름으로 연결합니다.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/projects/new"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-emerald-700 px-5 text-base font-semibold text-white transition hover:bg-emerald-800"
                >
                  새 프로젝트 만들기
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-base font-semibold text-slate-900 transition hover:border-slate-500"
                >
                  저장된 프로젝트 보기
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#fffaf0] p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p className="font-semibold text-slate-950">전체 업무 흐름</p>
                <span className="rounded-md bg-amber-200 px-2.5 py-1 text-xs font-bold text-amber-900">
                  프로젝트 기반
                </span>
              </div>
              <div className="mt-4 grid gap-2">
                {workflowSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold">
                    <span className="flex size-7 items-center justify-center rounded-md bg-slate-950 text-xs text-white">
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="dashboard" className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:px-10">
        <HomeRecentProjects />

        <div>
          <p className="text-sm font-bold text-emerald-700">대시보드 메뉴</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">바로 시작하기</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardMenus.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="rounded-lg border border-slate-200 bg-white p-5 font-bold text-slate-950 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {assistantGroups.map((group) => (
            <section key={group.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-emerald-700">{group.label}</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">{group.description}</h3>
              <div className="mt-4 grid gap-2">
                {group.items.map((item) => (
                  <div key={item} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
