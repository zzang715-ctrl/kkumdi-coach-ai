import Link from "next/link";
import { AuthStatus } from "@/features/auth/AuthStatus";
import { SavedProjectsList } from "@/features/projects/SavedProjectsList";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">프로젝트 저장소</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">저장된 프로젝트 보기</h1>
            </div>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
              <AuthStatus />
              <Link
                href="/help"
                className="inline-flex h-11 items-center justify-center rounded-md border border-amber-300 bg-amber-50 px-4 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
              >
                도움말
              </Link>
              <Link
                href="/settings"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-500"
              >
                설정 점검
              </Link>
              <Link
                href="/projects/new"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                새 프로젝트 만들기
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
            로그인과 Supabase 설정이 되어 있으면 서버에 저장된 프로젝트를 불러옵니다. 아직 설정하지 않았거나
            로그아웃 상태라면 이 브라우저에 저장된 프로젝트를 보여줍니다.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <SavedProjectsList />
      </section>
    </main>
  );
}
