import Link from "next/link";

const projectStatus = [
  ["현재 단계", "내부 테스트용 v0.9"],
  ["앱 완성도", "97% 이상"],
  ["저장 방식", "브라우저 저장소 우선, Supabase 서버 저장 준비 완료"],
  ["AI 생성", "OpenAI API 연결 준비 완료, 결제/사용량 확인 필요"],
  ["배포", "Vercel 배포 안내와 체크리스트 준비 완료"],
];

const importantFiles = [
  ["README.md", "프로젝트 전체 설명과 실행 방법"],
  ["docs/README.md", "문서 목차"],
  ["docs/environment-setup.md", "환경변수 설정"],
  ["docs/supabase-rls.md", "Supabase 테이블과 RLS"],
  ["docs/deployment-guide.md", "Vercel 배포"],
  ["docs/qa-checklist.md", "최종 QA"],
  ["docs/security-checklist.md", "비밀키 보호"],
  ["docs/release-notes.md", "출시 요약"],
];

const nextDeveloperTasks = [
  "Supabase 프로젝트를 실제로 만들고 SQL을 실행합니다.",
  ".env.local에 Supabase URL과 anon key를 넣고 서버를 다시 켭니다.",
  "회원가입/로그인 후 프로젝트 서버 저장을 테스트합니다.",
  "OpenAI 결제와 사용량 한도를 확인합니다.",
  "실제 AI 생성 결과를 강의 예시로 점검합니다.",
  "GitHub에 올리고 Vercel에 배포합니다.",
  "배포 주소에서 QA 체크리스트를 다시 진행합니다.",
];

const appLinks = [
  ["완료 화면", "/finish"],
  ["공개 전 체크", "/go-live"],
  ["출시 요약", "/release-notes"],
  ["문서 지도", "/help"],
  ["설정 점검", "/settings"],
  ["Supabase 안내", "/supabase-guide"],
  ["비밀키 보호", "/security-guide"],
  ["배포 안내", "/deploy-guide"],
  ["최종 QA", "/qa-guide"],
];

export default function HandoffPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">인수인계</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">다음 작업자용 안내</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/finish"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                완료 화면
              </Link>
              <Link
                href="/release-notes"
                className="inline-flex h-11 items-center justify-center rounded-md border border-sky-300 bg-sky-50 px-4 text-sm font-semibold text-sky-900 transition hover:bg-sky-100"
              >
                출시 요약
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
            이 화면은 나중에 다시 개발을 이어가거나 다른 사람에게 넘길 때 필요한 핵심 정보를 모아둔 안내입니다.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 lg:px-10">
        <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-800">현재 상태</p>
          <div className="mt-4 overflow-hidden rounded-md border border-emerald-200 bg-white">
            {projectStatus.map(([label, value]) => (
              <div key={label} className="grid gap-1 border-b border-emerald-100 p-3 last:border-b-0 sm:grid-cols-[180px_1fr]">
                <p className="text-sm font-bold text-slate-950">{label}</p>
                <p className="text-sm leading-6 text-slate-700">{value}</p>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">중요 파일</p>
            <div className="mt-4 grid gap-2">
              {importantFiles.map(([file, description]) => (
                <div key={file} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <code className="text-sm font-bold text-slate-950">{file}</code>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">다음 개발 순서</p>
            <div className="mt-4 grid gap-2">
              {nextDeveloperTasks.map((task, index) => (
                <div key={task} className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-950 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold leading-6 text-slate-800">{task}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">앱 화면 바로가기</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {appLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 transition hover:bg-emerald-50"
              >
                {label}
              </Link>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
