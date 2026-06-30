import Link from "next/link";

const goLiveChecks = [
  {
    title: "OpenAI 결제와 사용량",
    status: "공개 전 필수",
    description: "실제 AI 생성 버튼을 쓰려면 OpenAI 결제와 사용량 한도가 정상이어야 합니다.",
  },
  {
    title: "Supabase 서버 저장",
    status: "공개 전 필수",
    description: "회원가입, 로그인, 프로젝트 서버 저장이 실제 Supabase 프로젝트에서 동작해야 합니다.",
  },
  {
    title: "Vercel 환경변수",
    status: "공개 전 필수",
    description: "Vercel에 OpenAI와 Supabase 환경변수를 넣고 배포해야 합니다.",
  },
  {
    title: "실제 강의 프로젝트 테스트",
    status: "권장",
    description: "샘플이 아니라 실제 강의 1개를 넣어 제안서부터 다운로드까지 확인합니다.",
  },
  {
    title: "QA 결과 저장",
    status: "권장",
    description: "최종 QA 체크리스트를 완료하고 결과 파일을 저장합니다.",
  },
  {
    title: "비밀키 보호 확인",
    status: "공개 전 필수",
    description: ".env.local이 GitHub에 올라가지 않았고 service_role key가 노출되지 않았는지 확인합니다.",
  },
];

const finalOrder = [
  "npm.cmd run lint를 실행합니다.",
  "npm.cmd run build를 실행합니다.",
  "Supabase SQL과 RLS를 적용합니다.",
  "OpenAI 결제와 quota 상태를 확인합니다.",
  "Vercel 환경변수를 입력합니다.",
  "Vercel에 배포합니다.",
  "배포 주소에서 최종 QA를 다시 진행합니다.",
];

export default function GoLivePage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">실서비스 전 최종 확인</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">공개 직전 체크리스트</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/deploy-guide"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                배포 안내
              </Link>
              <Link
                href="/qa-guide"
                className="inline-flex h-11 items-center justify-center rounded-md border border-amber-300 bg-amber-50 px-4 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
              >
                최종 QA
              </Link>
              <Link
                href="/finish"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-500"
              >
                완료 화면
              </Link>
            </div>
          </nav>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            이 화면은 앱을 실제 사용자에게 공개하기 바로 전에 확인할 마지막 항목입니다.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 lg:px-10">
        <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-800">현재 결론</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">앱 기능은 준비됨, 실제 서비스 연결 확인이 남음</h2>
          <p className="mt-3 text-sm leading-7 text-emerald-950">
            코드와 화면 흐름은 배포 가능한 상태입니다. 다만 실제 공개 전에는 결제, 서버 저장, 배포 주소 테스트가 반드시 필요합니다.
          </p>
        </article>

        <div className="grid gap-4 lg:grid-cols-3">
          {goLiveChecks.map((item) => (
            <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-slate-950">{item.title}</h3>
                <span
                  className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${
                    item.status === "공개 전 필수" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">마지막 실행 순서</p>
          <div className="mt-4 grid gap-2">
            {finalOrder.map((step, index) => (
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
