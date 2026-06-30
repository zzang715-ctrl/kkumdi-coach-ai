import Link from "next/link";
import { ProjectOverview } from "@/features/projects/ProjectOverview";

type ProjectHomePageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectHomePage({ params }: ProjectHomePageProps) {
  const { projectId } = await params;

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">프로젝트 홈</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">프로젝트 전체 상태 보기</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
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
            이 프로젝트의 기본 정보, 전체 진행률, 다음 단계와 완료 상태를 한 화면에서 확인합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <ProjectOverview projectId={projectId} />
      </section>
    </main>
  );
}
