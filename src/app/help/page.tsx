import Link from "next/link";

const startSteps = [
  "첫 화면에서 새 프로젝트 만들기를 누릅니다.",
  "프로젝트 이름, 기관명, 대상, 날짜를 입력합니다.",
  "프로젝트를 저장합니다.",
  "저장된 프로젝트 또는 첫 화면의 최근 프로젝트에서 이어서 작업합니다.",
  "제안서부터 마케팅까지 필요한 단계의 초안을 만들고 저장합니다.",
  "마지막 다운로드 화면에서 Markdown, Word, PDF로 저장합니다.",
];

const featureItems = [
  ["저장 상태", "작성 화면에서 저장 전, 저장됨, 저장 필요 상태를 확인할 수 있습니다."],
  ["빠른 저장", "글을 쓰는 중 Ctrl+S를 누르면 바로 저장됩니다."],
  ["최근 작업순", "첫 화면과 저장된 프로젝트 목록에서 최근에 작업한 프로젝트를 먼저 볼 수 있습니다."],
  ["결과물 미리보기", "프로젝트 홈에서 저장된 결과물을 한 번에 보고 복사할 수 있습니다."],
  ["다운로드 점검", "다운로드 화면에서 저장된 결과물 개수, 전체 글자 수, 비어 있는 항목을 확인합니다."],
  ["비어 있는 항목 채우기", "다운로드 화면의 체크리스트에서 비어 있는 항목을 눌러 바로 작성 화면으로 이동합니다."],
  ["Supabase 준비", "서버 저장에 필요한 테이블과 RLS 보안 규칙을 안내 화면에서 확인할 수 있습니다."],
];

const commandItems = [
  ["앱 켜기", "npm.cmd run dev"],
  ["문제 검사", "npm.cmd run lint"],
  ["배포 전 검사", "npm.cmd run build"],
];

const guideLinks = [
  ["완성도 확인", "/roadmap", "전체 진행률과 남은 큰 작업을 봅니다."],
  ["설정 점검", "/settings", "OpenAI와 Supabase 준비 상태를 확인합니다."],
  ["Supabase 안내", "/supabase-guide", "서버 저장 테이블과 RLS SQL을 확인합니다."],
  ["비밀키 보호", "/security-guide", "API Key와 환경변수를 안전하게 관리하는 방법을 봅니다."],
  ["배포 안내", "/deploy-guide", "Vercel 배포 전후 체크리스트를 확인합니다."],
  ["최종 QA", "/qa-guide", "출시 전 점검 항목을 체크하고 결과를 내보냅니다."],
  ["출시 요약", "/release-notes", "현재 버전에서 되는 것과 남은 일을 한 장으로 봅니다."],
  ["완료 화면", "/finish", "지금 완성된 것과 바로 할 일을 가장 짧게 확인합니다."],
  ["인수인계", "/handoff", "다음 작업자가 이어서 볼 핵심 정보를 확인합니다."],
  ["공개 전 체크", "/go-live", "실제 사용자에게 공개하기 전 마지막 항목을 확인합니다."],
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">사용 도움말</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">꿈디코치 AI 강사비서 도움말</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/supabase-guide"
                className="inline-flex h-11 items-center justify-center rounded-md border border-emerald-300 bg-emerald-50 px-4 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
              >
                Supabase 안내
              </Link>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 hover:border-slate-500"
              >
                대시보드
              </Link>
              <Link
                href="/projects"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                저장된 프로젝트
              </Link>
            </div>
          </nav>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 lg:px-10">
        <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-800">전체 안내 지도</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">필요한 안내 화면으로 바로 이동</h2>
          <p className="mt-2 text-sm leading-6 text-emerald-950">
            앱 사용, 설정, 보안, 배포, QA 안내를 이곳에서 한 번에 찾을 수 있습니다.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {guideLinks.map(([label, href, description]) => (
              <Link
                key={href}
                href={href}
                className="rounded-md border border-emerald-200 bg-white p-4 transition hover:bg-emerald-100"
              >
                <p className="text-sm font-bold text-emerald-900">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">가장 쉬운 사용 순서</p>
          <div className="mt-4 grid gap-2">
            {startSteps.map((step, index) => (
              <div key={step} className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-950 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold leading-6 text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">알아두면 편한 기능</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {featureItems.map(([label, description]) => (
              <div key={label} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-950">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">결제 전에는 어떻게 쓰나요?</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">샘플 초안으로 흐름을 테스트합니다</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              OpenAI API 결제를 아직 하지 않아도 각 단계의 샘플 초안 만들기 또는 기본 요약 만들기를 사용할 수 있습니다.
              실제 AI 생성은 OpenAI 결제와 API 키 설정이 끝난 뒤 사용할 수 있습니다.
            </p>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">서버를 다시 켜는 방법</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">터미널에서 다시 시작</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              터미널에서 서버가 꺼져 있다면 프로젝트 폴더로 이동한 뒤{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5">npm.cmd run dev</code>를 입력합니다.
              설정 파일을 바꾼 뒤에도 서버를 껐다가 다시 켜야 반영됩니다.
            </p>
          </article>
        </div>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">자주 쓰는 명령어</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {commandItems.map(([label, command]) => (
              <div key={label} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-700">{label}</p>
                <code className="mt-2 block rounded bg-white px-3 py-2 text-sm font-bold text-slate-950">{command}</code>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
          <p className="font-bold">파일로 다시 보고 싶을 때</p>
          <p className="mt-2">
            파일 탐색기에서 <code className="rounded bg-white px-1.5 py-0.5">C:\Users\user\Documents\꿈디코치웹앱</code>{" "}
            폴더를 열고 <code className="rounded bg-white px-1.5 py-0.5">README.md</code> 파일을 열면 됩니다.
          </p>
        </article>

        <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-950">
          <p className="font-bold">서버 저장 준비를 보고 싶을 때</p>
          <p className="mt-2">
            앱에서 <Link href="/supabase-guide" className="font-bold underline">Supabase 안내</Link> 화면을 열면
            테이블 구조와 RLS 보안 규칙을 볼 수 있습니다. 같은 내용은{" "}
            <code className="rounded bg-white px-1.5 py-0.5">docs/supabase-rls.md</code> 파일에도 저장되어 있습니다.
          </p>
        </article>
      </section>
    </main>
  );
}
