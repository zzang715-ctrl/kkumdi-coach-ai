import Link from "next/link";
import { InteractiveQaChecklist } from "@/features/qa/InteractiveQaChecklist";

const qaGroups = [
  {
    title: "기본 화면",
    items: [
      "대시보드가 깨지지 않고 열리는지 확인합니다.",
      "완성도 확인, 설정 점검, 사용 안내 버튼이 이동되는지 확인합니다.",
      "모바일 크기에서도 글자가 한 글자씩 내려가지 않는지 확인합니다.",
    ],
  },
  {
    title: "프로젝트",
    items: [
      "새 프로젝트를 만들고 저장 메시지가 보이는지 확인합니다.",
      "저장된 프로젝트 목록에 방금 만든 프로젝트가 보이는지 확인합니다.",
      "프로젝트 복제와 이 프로젝트 삭제 버튼이 기대대로 동작하는지 확인합니다.",
    ],
  },
  {
    title: "8단계 작성 흐름",
    items: [
      "제안서부터 마케팅까지 각 단계 화면에 들어갈 수 있는지 확인합니다.",
      "샘플 초안 만들기, 복사, 저장 버튼이 동작하는지 확인합니다.",
      "저장 중, 저장됨, 저장 필요 상태가 잘 보이는지 확인합니다.",
    ],
  },
  {
    title: "다운로드",
    items: [
      "다운로드 화면에서 비어 있는 항목과 작성된 항목이 구분되는지 확인합니다.",
      "Markdown 저장 버튼이 동작하는지 확인합니다.",
      "Word와 PDF 저장 안내가 글자 깨짐 없이 보이는지 확인합니다.",
    ],
  },
  {
    title: "설정과 서버 저장",
    items: [
      "OpenAI 결제 전 quota 오류가 앱 문제처럼 보이지 않는지 확인합니다.",
      "Supabase 테스트 버튼이 연결 상태를 친절하게 알려주는지 확인합니다.",
      "Supabase SQL 복사 버튼이 동작하는지 확인합니다.",
    ],
  },
  {
    title: "배포 전",
    items: [
      "터미널에서 npm.cmd run lint를 실행합니다.",
      "터미널에서 npm.cmd run build를 실행합니다.",
      "Vercel에 넣을 환경변수를 다시 확인합니다.",
    ],
  },
];

const quickLinks = [
  ["대시보드", "/"],
  ["새 프로젝트", "/projects/new"],
  ["저장된 프로젝트", "/projects"],
  ["설정 점검", "/settings"],
  ["Supabase 안내", "/supabase-guide"],
  ["배포 안내", "/deploy-guide"],
];

export default function QaGuidePage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">출시 전 점검</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">최종 QA 체크리스트</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/release-notes"
                className="inline-flex h-11 items-center justify-center rounded-md border border-sky-300 bg-sky-50 px-4 text-sm font-semibold text-sky-900 transition hover:bg-sky-100"
              >
                출시 요약
              </Link>
              <Link
                href="/deploy-guide"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                배포 안내
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
            QA는 앱을 사람처럼 직접 눌러 보며 문제를 찾는 마지막 점검입니다. 아래 항목을 하나씩 확인하면 됩니다.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 lg:px-10">
        <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-800">빠른 이동</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">점검할 화면으로 바로 이동</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
            {quickLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="inline-flex h-11 items-center justify-center rounded-md border border-emerald-200 bg-white px-3 text-sm font-bold text-emerald-900 transition hover:bg-emerald-100"
              >
                {label}
              </Link>
            ))}
          </div>
        </article>

        <InteractiveQaChecklist groups={qaGroups} />

        <article className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
          <p className="font-bold">초보자용 기억할 점</p>
          <p className="mt-2">
            QA 중 문제가 보이면 바로 고치면 됩니다. 특히 한글 깨짐, 버튼 눌렀을 때 반응 없음, 저장 메시지 없음은
            사용자에게 크게 헷갈리는 문제라 먼저 확인합니다.
          </p>
        </article>
      </section>
    </main>
  );
}
