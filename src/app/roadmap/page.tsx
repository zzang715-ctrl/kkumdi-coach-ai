import Link from "next/link";

const completedItems = [
  "기본 대시보드",
  "프로젝트 만들기",
  "저장된 프로젝트 보기",
  "프로젝트 삭제와 복사",
  "8단계 업무 흐름",
  "제안서 AI 초안 화면",
  "강의 기획서 AI 초안 화면",
  "자료수집 화면",
  "결과보고서 화면",
  "인터뷰 질문 화면",
  "블로그 글쓰기 화면",
  "마케팅 콘텐츠 화면",
  "Markdown, Word, PDF 다운로드",
  "백업 내보내기와 가져오기",
  "설정 점검 화면",
  "Supabase 테이블과 RLS 안내",
  "Supabase 서버 저장 코드 구조 정리",
  "Supabase projects 테이블 연결 점검",
  "Supabase SQL 복사 버튼",
  "Supabase 서버 저장 준비 체크리스트",
  "Vercel 배포 준비 안내",
  "최종 QA 체크리스트",
  "체크 가능한 QA 진행률 저장",
  "QA 결과 Markdown 내보내기",
  "QA 문제 메모 저장",
  "출시 요약 화면",
  "출시 요약 Markdown 내보내기",
  "배포 준비도 체크 저장",
  "배포 준비 결과 Markdown 내보내기",
  "비밀키 보호 안내와 보안 체크 문서",
  "전체 안내 지도",
  "최종 완료 화면",
  "문서 목차 정리",
  "인수인계 화면과 문서",
  "공개 직전 체크리스트",
  "v1.0 준비 완료 표시",
];

const usableNowItems = [
  "로그인 없이 브라우저에 프로젝트를 저장하며 테스트할 수 있습니다.",
  "OpenAI 결제 전에도 기본 초안을 만들고 수정할 수 있습니다.",
  "각 단계에서 저장 상태와 마지막 저장 시간을 확인할 수 있습니다.",
  "프로젝트별 결과물을 한 번에 모아서 다운로드할 수 있습니다.",
];

const remainingItems = [
  {
    title: "OpenAI 실제 생성 안정화",
    description: "결제와 사용량 설정이 끝나면 실제 AI 생성 결과를 더 자세히 점검합니다.",
  },
  {
    title: "Supabase 서버 저장",
    description: "로그인한 사용자의 프로젝트를 서버에 저장하고 여러 기기에서 이어서 작업하게 만듭니다.",
  },
  {
    title: "RLS 보안 정책",
    description: "사용자가 자기 프로젝트만 읽고 수정하도록 Supabase 보안 규칙을 적용합니다.",
  },
  {
    title: "배포 준비",
    description: "Vercel에 올리고 실제 주소에서 테스트합니다.",
  },
];

const percent = 100;

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">전체 완성도</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">꿈디코치 AI 강사비서 진행표</h1>
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
                href="/finish"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                완료 화면
              </Link>
              <Link
                href="/security-guide"
                className="inline-flex h-11 items-center justify-center rounded-md border border-rose-300 bg-rose-50 px-4 text-sm font-semibold text-rose-900 transition hover:bg-rose-100"
              >
                비밀키 보호
              </Link>
              <Link
                href="/release-notes"
                className="inline-flex h-11 items-center justify-center rounded-md border border-sky-300 bg-sky-50 px-4 text-sm font-semibold text-sky-900 transition hover:bg-sky-100"
              >
                출시 요약
              </Link>
              <Link
                href="/qa-guide"
                className="inline-flex h-11 items-center justify-center rounded-md border border-rose-300 bg-rose-50 px-4 text-sm font-semibold text-rose-900 transition hover:bg-rose-100"
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
                href="/supabase-guide"
                className="inline-flex h-11 items-center justify-center rounded-md border border-emerald-300 bg-emerald-50 px-4 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
              >
                Supabase 안내
              </Link>
              <Link
                href="/projects/new"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                새 프로젝트
              </Link>
              <Link
                href="/projects"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-500"
              >
                저장된 프로젝트
              </Link>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-500"
              >
                대시보드
              </Link>
            </div>
          </nav>

          <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-bold text-emerald-800">현재 기준</p>
            <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-4xl font-bold text-slate-950">v1.0 기본 버전 {percent}% 준비됨</h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  코드와 기본 앱 흐름은 완성 상태입니다. 실제 공개 전에는 OpenAI, Supabase, Vercel 설정을 확인하면 됩니다.
                </p>
              </div>
              <Link
                href="/settings"
                className="inline-flex h-11 items-center justify-center rounded-md border border-emerald-300 bg-white px-4 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
              >
                설정 점검하기
              </Link>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-emerald-700" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">완료된 기능</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">지금 앱에서 이미 되는 것</h2>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {completedItems.map((item) => (
                <div key={item} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold">
                  완료: {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">바로 사용 가능</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">지금 해볼 수 있는 일</h2>
            <div className="mt-5 grid gap-3">
              {usableNowItems.map((item, index) => (
                <div key={item} className="rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6">
                  <span className="font-bold text-emerald-900">{index + 1}. </span>
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-amber-700">실제 공개 전 확인</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">서비스로 열기 전에 확인할 것</h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-4">
            {remainingItems.map((item, index) => (
              <article key={item.title} className="rounded-md border border-slate-200 bg-[#fffaf0] p-4">
                <p className="text-xs font-bold text-amber-800">다음 {index + 1}</p>
                <h3 className="mt-2 text-lg font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">추천 다음 순서</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">이제 실제 서비스 연결을 확인하면 됩니다</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            지금까지는 브라우저 안에 저장하는 방식이라 같은 컴퓨터에서 테스트하기 좋습니다. 다음에는 Supabase 테이블과
            RLS 보안 정책을 준비해서 로그인한 사용자별로 프로젝트를 안전하게 저장하는 단계로 넘어가면 됩니다.
          </p>
          <Link
            href="/supabase-guide"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Supabase 준비 안내 보기
          </Link>
        </section>
      </section>
    </main>
  );
}
