import Link from "next/link";
import { ProposalDraftView } from "@/features/proposals/ProposalDraftView";

type ProposalPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { projectId } = await params;

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <WorkHeader
        label="제안서 AI"
        title="제안서 초안 만들기"
        description="저장된 프로젝트 정보를 불러와 기관 제출용 제안서 초안을 만듭니다."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <ProposalDraftView projectId={projectId} />
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
            <Link href="/projects" className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800">
              저장된 프로젝트
            </Link>
            <Link href="/" className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-500">
              대시보드
            </Link>
          </div>
        </nav>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">{description}</p>
      </div>
    </section>
  );
}
