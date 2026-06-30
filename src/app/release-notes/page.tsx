import Link from "next/link";
import { ReleaseSummaryDownload } from "@/features/release/ReleaseSummaryDownload";

const readyFeatures = [
  "로그인 없이 브라우저 저장소로 프로젝트 테스트",
  "새 프로젝트 만들기와 기본 정보 수정",
  "저장된 프로젝트 검색, 정렬, 복제, 삭제",
  "제안서부터 다운로드까지 8단계 업무 흐름",
  "각 단계 샘플 초안 만들기, 복사, 저장",
  "저장 중, 저장됨, 저장 필요 상태 표시",
  "프로젝트 결과물 미리보기와 전체 복사",
  "Markdown, Word, PDF 다운로드 흐름",
  "OpenAI 연결 점검과 quota 안내",
  "Supabase 테이블, RLS, 연결 점검 안내",
  "Vercel 배포 준비 안내",
  "체크 가능한 QA와 QA 결과 내보내기",
];

const launchBlockers = [
  {
    title: "OpenAI 결제와 실제 생성 확인",
    description: "현재 계정은 quota 오류가 날 수 있으므로 결제와 사용량 한도 확인 후 실제 AI 생성 품질을 점검해야 합니다.",
  },
  {
    title: "Supabase 실제 프로젝트 연결",
    description: "Supabase 프로젝트 생성, SQL 실행, 환경변수 입력 후 로그인 사용자별 서버 저장을 확인해야 합니다.",
  },
  {
    title: "Vercel 실제 배포",
    description: "GitHub와 Vercel 연결, 환경변수 입력, 배포 주소 테스트가 필요합니다.",
  },
  {
    title: "사용자 테스트",
    description: "강사 1-2명이 실제 강의 프로젝트를 만들어 보며 문구와 흐름을 검증해야 합니다.",
  },
];

const recommendedOrder = [
  "QA 체크리스트를 한 번 끝까지 눌러 봅니다.",
  "Supabase 프로젝트를 만들고 SQL을 실행합니다.",
  ".env.local에 Supabase 값을 넣고 로그인/서버 저장을 확인합니다.",
  "OpenAI 결제와 API 사용량을 확인합니다.",
  "AI 생성 결과를 실제 강의 예시로 점검합니다.",
  "Vercel에 배포하고 배포 주소에서 다시 QA를 진행합니다.",
];

export default function ReleaseNotesPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">출시 요약</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">꿈디코치 AI 강사비서 현재 버전</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <ReleaseSummaryDownload
                readyFeatures={readyFeatures}
                launchBlockers={launchBlockers}
                recommendedOrder={recommendedOrder}
              />
              <Link
                href="/qa-guide"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                최종 QA
              </Link>
              <Link
                href="/deploy-guide"
                className="inline-flex h-11 items-center justify-center rounded-md border border-amber-300 bg-amber-50 px-4 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
              >
                배포 안내
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
            현재 버전은 강사가 혼자 프로젝트를 만들고, 8단계 결과물을 작성하고, 저장과 다운로드 흐름을 테스트할 수 있는 상태입니다.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 lg:px-10">
        <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-800">현재 판단</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">v1.0 기본 버전</h2>
          <p className="mt-3 text-sm leading-7 text-emerald-950">
            화면과 기본 업무 흐름은 갖춰졌습니다. 실제 공개 전에는 OpenAI 결제, Supabase 서버 저장, Vercel 배포 테스트가
            마지막으로 필요합니다.
          </p>
        </article>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">준비된 기능</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">지금 바로 확인할 수 있는 것</h2>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {readyFeatures.map((feature) => (
                <div key={feature} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold">
                  완료: {feature}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-rose-700">공개 전 남은 일</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">아직 확인해야 할 것</h2>
            <div className="mt-5 grid gap-3">
              {launchBlockers.map((item) => (
                <div key={item.title} className="rounded-md border border-rose-100 bg-rose-50 p-4">
                  <h3 className="text-sm font-bold text-rose-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">추천 순서</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">여기서부터 이렇게 진행하면 됩니다</h2>
          <div className="mt-4 grid gap-2">
            {recommendedOrder.map((step, index) => (
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
