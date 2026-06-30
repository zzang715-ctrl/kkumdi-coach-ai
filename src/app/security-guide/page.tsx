import Link from "next/link";

const safeItems = [
  {
    title: ".env.local에 실제 키 넣기",
    description: "내 컴퓨터에서만 쓰는 실제 OpenAI API Key와 Supabase 값을 넣습니다.",
  },
  {
    title: ".env.example에는 예시만 넣기",
    description: "다른 사람이 봐도 되는 가짜 값과 설명만 적습니다.",
  },
  {
    title: "Vercel Environment Variables 사용",
    description: "배포할 때는 Vercel 설정 화면에 환경변수를 따로 넣습니다.",
  },
  {
    title: "Supabase RLS 켜기",
    description: "로그인한 사용자가 자기 프로젝트만 보도록 보안 규칙을 켭니다.",
  },
];

const dangerItems = [
  "OpenAI API Key를 화면 코드에 직접 쓰기",
  "Supabase service_role key를 브라우저 코드에 넣기",
  ".env.local 파일을 GitHub에 올리기",
  "카카오톡, 이메일, 블로그에 실제 API Key 공유하기",
];

const gitignoreItems = [
  [".env*", "실제 환경변수 파일 전체 차단"],
  ["!.env.example", "예시 파일만 공유 허용"],
  [".vercel", "Vercel 로컬 설정 차단"],
  ["node_modules", "설치된 패키지 폴더 차단"],
  [".next", "Next.js 빌드 결과 차단"],
];

export default function SecurityGuidePage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">보안 점검</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">비밀키 보호 안내</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/settings"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                설정 점검
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
            API Key는 집 열쇠처럼 조심해야 합니다. 실제 키는 내 컴퓨터와 배포 설정 안에만 두고, 화면 코드나 GitHub에는
            올리지 않습니다.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-800">안전한 방법</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">이렇게 하면 됩니다</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {safeItems.map((item) => (
                <div key={item.title} className="rounded-md border border-emerald-200 bg-white p-4">
                  <h3 className="text-sm font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-rose-200 bg-rose-50 p-5 shadow-sm">
            <p className="text-sm font-bold text-rose-700">절대 하지 않기</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">이건 위험합니다</h2>
            <div className="mt-5 grid gap-2">
              {dangerItems.map((item) => (
                <div key={item} className="rounded-md border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-900">
                  위험: {item}
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">현재 보호 장치</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">.gitignore가 막아주는 파일</h2>
          <div className="mt-5 overflow-hidden rounded-md border border-slate-200">
            {gitignoreItems.map(([pattern, description]) => (
              <div key={pattern} className="grid gap-1 border-b border-slate-200 p-3 last:border-b-0 sm:grid-cols-[180px_1fr]">
                <code className="text-sm font-bold text-slate-950">{pattern}</code>
                <p className="text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
          <p className="font-bold">초보자용 한 줄 기억</p>
          <p className="mt-2">
            실제 키는 <code className="rounded bg-white px-1.5 py-0.5">.env.local</code>과 Vercel 환경변수에만 넣고,
            <code className="ml-1 rounded bg-white px-1.5 py-0.5">.env.example</code>에는 가짜 예시만 넣습니다.
          </p>
        </article>
      </section>
    </main>
  );
}
