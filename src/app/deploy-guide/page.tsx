import Link from "next/link";
import { DeploymentReadinessChecklist } from "@/features/deploy/DeploymentReadinessChecklist";

const beforeDeployItems = [
  {
    title: "빌드 검사",
    description: "터미널에서 npm.cmd run build를 실행해 배포 전에 오류가 없는지 확인합니다.",
  },
  {
    title: "환경변수 정리",
    description: "OpenAI, Supabase 값은 Vercel의 Environment Variables에 넣습니다. .env.local 파일은 올리지 않습니다.",
  },
  {
    title: "Supabase RLS 확인",
    description: "projects 테이블과 RLS 정책을 만든 뒤, 로그인한 사용자만 자기 프로젝트를 보게 합니다.",
  },
  {
    title: "결제 상태 확인",
    description: "OpenAI 실제 생성 기능을 쓰려면 OpenAI 결제와 사용량 한도가 준비되어야 합니다.",
  },
];

const deploySteps = [
  "GitHub에 프로젝트 코드를 올립니다.",
  "Vercel에 로그인합니다.",
  "New Project를 누릅니다.",
  "GitHub 저장소를 선택합니다.",
  "Environment Variables에 필요한 값을 넣습니다.",
  "Deploy를 누릅니다.",
  "배포 주소에서 로그인, 프로젝트 저장, 다운로드를 다시 테스트합니다.",
];

const envItems = [
  ["OPENAI_API_KEY", "AI 초안 생성을 위한 OpenAI 비밀 키"],
  ["OPENAI_MODEL", "사용할 OpenAI 모델 이름"],
  ["NEXT_PUBLIC_SUPABASE_URL", "Supabase 프로젝트 주소"],
  ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "Supabase 브라우저용 공개 키"],
];

const afterDeployItems = [
  "첫 화면이 열리는지 확인합니다.",
  "회원가입과 로그인이 되는지 확인합니다.",
  "새 프로젝트를 만들고 저장합니다.",
  "저장된 프로젝트 목록에 다시 보이는지 확인합니다.",
  "AI 생성 버튼은 결제 상태에 따라 정상 또는 quota 오류가 날 수 있습니다.",
  "다운로드 화면에서 Markdown, Word, PDF 저장 흐름을 확인합니다.",
];

const deploymentCheckGroups = [
  {
    title: "배포 전",
    items: beforeDeployItems.map((item) => item.title),
  },
  {
    title: "Vercel 작업",
    items: deploySteps,
  },
  {
    title: "배포 후",
    items: afterDeployItems,
  },
];

export default function DeployGuidePage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">배포 준비</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">Vercel 배포 안내</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/security-guide"
                className="inline-flex h-11 items-center justify-center rounded-md border border-rose-300 bg-rose-50 px-4 text-sm font-semibold text-rose-900 transition hover:bg-rose-100"
              >
                비밀키 보호
              </Link>
              <Link
                href="/qa-guide"
                className="inline-flex h-11 items-center justify-center rounded-md border border-amber-300 bg-amber-50 px-4 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
              >
                최종 QA
              </Link>
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
            배포는 내 컴퓨터에서만 보이던 앱을 인터넷 주소로 여는 단계입니다. 실제 배포 전에 아래 순서대로 준비하면 됩니다.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 lg:px-10">
        <DeploymentReadinessChecklist groups={deploymentCheckGroups} />

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">배포 전 확인</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">먼저 이것부터 확인합니다</h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-4">
            {beforeDeployItems.map((item) => (
              <div key={item.title} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">배포 순서</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Vercel에서 하는 일</h2>
            <div className="mt-4 grid gap-2">
              {deploySteps.map((step, index) => (
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
            <p className="text-sm font-bold text-emerald-700">Vercel에 넣을 환경변수</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">비밀 값은 화면에 노출하지 않습니다</h2>
            <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
              {envItems.map(([name, description]) => (
                <div key={name} className="grid gap-1 border-b border-slate-200 p-3 last:border-b-0 sm:grid-cols-[260px_1fr]">
                  <code className="text-sm font-bold text-slate-950">{name}</code>
                  <p className="text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm font-semibold leading-6 text-rose-800">
              service_role key는 Vercel 공개 환경변수나 브라우저 코드에 넣으면 안 됩니다.
            </p>
          </article>
        </div>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">배포 후 테스트</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">인터넷 주소에서 다시 확인할 것</h2>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {afterDeployItems.map((item) => (
              <div key={item} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold">
                확인: {item}
              </div>
            ))}
          </div>
          <Link
            href="/qa-guide"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            최종 QA 체크리스트 보기
          </Link>
        </article>
      </section>
    </main>
  );
}
