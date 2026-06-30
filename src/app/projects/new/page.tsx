import Link from "next/link";
import { AuthStatus } from "@/features/auth/AuthStatus";
import { NewProjectForm } from "@/features/projects/NewProjectForm";

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">새 프로젝트 만들기</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">강의 프로젝트 등록</h1>
            </div>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
              <AuthStatus />
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

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            프로젝트는 꿈디코치 AI 강사비서의 기본 작업 상자입니다. 먼저 강의 정보를 입력해 두면 제안서,
            기획서, 결과보고서, 블로그, 마케팅 콘텐츠가 같은 흐름 안에서 이어집니다.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <NewProjectForm />
      </section>
    </main>
  );
}
