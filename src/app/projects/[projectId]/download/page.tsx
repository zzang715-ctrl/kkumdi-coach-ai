import Link from "next/link";
import { ProjectDownloadView } from "@/features/downloads/ProjectDownloadView";

type DownloadPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { projectId } = await params;

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <WorkHeader
        label="다운로드"
        title="전체 결과물 저장하기"
        description="프로젝트 안에서 만든 모든 결과물을 Markdown, Word, PDF 인쇄용 화면으로 저장합니다."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <ProjectDownloadView projectId={projectId} />
      </section>
    </main>
  );
}

function WorkHeader({ label, title, description }: { label: string; title: string; description: string }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">{label}</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">{title}</h1>
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
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">{description}</p>
      </div>
    </section>
  );
}
