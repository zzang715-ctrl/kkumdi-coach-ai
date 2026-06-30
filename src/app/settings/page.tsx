import Link from "next/link";
import { OpenAiConnectionTest } from "@/features/settings/OpenAiConnectionTest";
import { SupabaseConnectionTest } from "@/features/settings/SupabaseConnectionTest";

type SettingItem = {
  name: string;
  description: string;
  isReady: boolean;
  requiredFor: string;
  beginnerNote: string;
};

function hasValue(value: string | undefined, placeholder: string) {
  return Boolean(value && value.trim() && value.trim() !== placeholder);
}

const settings: SettingItem[] = [
  {
    name: "OPENAI_API_KEY",
    description: "AI 초안을 만들 때 사용하는 OpenAI 비밀 키입니다. 서버에서만 읽고 화면에는 값이 보이지 않습니다.",
    isReady: hasValue(process.env.OPENAI_API_KEY, "sk-your_openai_api_key_here"),
    requiredFor: "제안서, 기획서, 보고서, 인터뷰, 블로그, 마케팅 AI",
    beginnerNote: "결제를 아직 하지 않았다면 비워 두어도 됩니다. 기본 초안과 저장 기능은 계속 사용할 수 있습니다.",
  },
  {
    name: "OPENAI_MODEL",
    description: "AI가 사용할 모델 이름입니다. 비워 두면 앱에서 정한 기본 모델을 사용합니다.",
    isReady: Boolean(process.env.OPENAI_MODEL || "gpt-4.1-mini"),
    requiredFor: "AI 응답 품질 조정",
    beginnerNote: "처음에는 그대로 두어도 괜찮습니다.",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    description: "Supabase 프로젝트 주소입니다. 로그인과 서버 저장을 연결할 때 필요합니다.",
    isReady: hasValue(process.env.NEXT_PUBLIC_SUPABASE_URL, "https://your-project-id.supabase.co"),
    requiredFor: "로그인, 회원가입, 서버 프로젝트 저장",
    beginnerNote: "아직 설정하지 않아도 브라우저 안에 프로젝트를 임시 저장하며 테스트할 수 있습니다.",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    description: "Supabase 브라우저용 공개 키입니다. RLS 정책과 함께 사용합니다.",
    isReady: hasValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "your_supabase_anon_key_here"),
    requiredFor: "로그인, 회원가입, 서버 프로젝트 저장",
    beginnerNote: "Supabase URL과 anon key는 실제 서버 연결 단계에서 같이 넣으면 됩니다.",
  },
];

const readyCount = settings.filter((setting) => setting.isReady).length;
const missingSettings = settings.filter((setting) => !setting.isReady);

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">설정 점검</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">앱 실행 준비 상태</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
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
                href="/projects"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
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
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            이 화면은 중요한 설정이 준비됐는지 알려주는 점검표입니다. API 키 값은 화면에 보여주지 않고,
            준비됐는지 여부만 확인합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 lg:px-10">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">현재 상태</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            {readyCount} / {settings.length} 항목 준비됨
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            OpenAI 키가 없어도 기본 초안과 저장 기능은 사용할 수 있습니다. Supabase 설정이 없어도 브라우저
            저장소로 프로젝트를 임시 저장할 수 있습니다.
          </p>
          <Link
            href="/supabase-guide"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md border border-emerald-300 bg-emerald-50 px-3 text-sm font-bold text-emerald-900 transition hover:bg-emerald-100"
          >
            Supabase 서버 저장 준비 순서 보기
          </Link>
          <Link
            href="/security-guide"
            className="ml-0 mt-3 inline-flex h-10 items-center justify-center rounded-md border border-amber-300 bg-amber-50 px-3 text-sm font-bold text-amber-900 transition hover:bg-amber-100 sm:ml-2 sm:mt-4"
          >
            비밀키 보호 안내 보기
          </Link>
        </div>

        {missingSettings.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <p className="text-sm font-bold text-amber-800">지금 부족한 설정</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-amber-950">
              {missingSettings.map((setting) => (
                <li key={setting.name} className="rounded-md bg-white px-3 py-2">
                  <span className="font-mono font-bold">{setting.name}</span>
                  <span className="ml-2">{setting.beginnerNote}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-2">
          <OpenAiConnectionTest />
          <SupabaseConnectionTest />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {settings.map((setting) => (
            <article key={setting.name} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-sm font-bold text-slate-950">{setting.name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{setting.description}</p>
                </div>
                <span
                  className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-bold ${
                    setting.isReady ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {setting.isReady ? "설정됨" : "필요함"}
                </span>
              </div>
              <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                사용 위치: {setting.requiredFor}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{setting.beginnerNote}</p>
            </article>
          ))}
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-950">
          <p className="font-bold">초보자용 안내</p>
          <p className="mt-2">
            설정을 바꾼 뒤에는 터미널에서 실행 중인 서버를 <code className="rounded bg-white px-1.5 py-0.5">Ctrl + C</code>
            로 멈추고, 다시 <code className="rounded bg-white px-1.5 py-0.5">npm.cmd run dev</code>를 입력해야 반영됩니다.
          </p>
          <p className="mt-2">
            자세한 순서는 프로젝트 폴더의 <code className="rounded bg-white px-1.5 py-0.5">docs/environment-setup.md</code>
            문서와 사용 안내 화면에 정리되어 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
