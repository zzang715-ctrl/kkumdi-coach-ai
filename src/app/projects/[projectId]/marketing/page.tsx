import Link from "next/link";
import { MarketingDraftView } from "@/features/marketing/MarketingDraftView";

type MarketingPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function MarketingPage({ params }: MarketingPageProps) {
  const { projectId } = await params;

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <WorkHeader
        label="마케팅 AI"
        title="마케팅 콘텐츠 만들기"
        description="블로그와 결과보고서를 바탕으로 SNS, 카드뉴스, 홍보 문구를 작성합니다."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <MarketingDraftView projectId={projectId} />
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
