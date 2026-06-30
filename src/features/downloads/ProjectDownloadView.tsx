"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SavedProject } from "@/features/projects/projectStorage";
import { findLocalProject } from "@/features/projects/localProjectStorage";
import { countCompletedSteps } from "@/features/projects/projectProgress";
import { ProjectWorkflowNav } from "@/features/projects/ProjectWorkflowNav";

type ProjectDownloadViewProps = {
  projectId: string;
};

const downloadSections = [
  { label: "제안서", href: "proposal", getContent: (project: SavedProject) => project.proposalDraft || "" },
  { label: "강의 기획서", href: "lecture-plan", getContent: (project: SavedProject) => project.lecturePlanDraft || "" },
  { label: "자료수집", href: "data-collection", getContent: (project: SavedProject) => project.dataCollection?.summary || "" },
  { label: "결과보고서", href: "result-report", getContent: (project: SavedProject) => project.resultReportDraft || "" },
  { label: "인터뷰", href: "interview", getContent: (project: SavedProject) => project.interviewDraft || "" },
  { label: "블로그", href: "blog", getContent: (project: SavedProject) => project.blogDraft || "" },
  { label: "마케팅", href: "marketing", getContent: (project: SavedProject) => project.marketingDraft || "" },
];

export function ProjectDownloadView({ projectId }: ProjectDownloadViewProps) {
  const project = useMemo(() => findLocalProject(projectId), [projectId]);
  const [status, setStatus] = useState("");

  if (!project) {
    return <MissingProject />;
  }

  const currentProject = project;
  const markdown = buildProjectMarkdown(currentProject);
  const safeFileName = toSafeFileName(currentProject.title || "kkumdi-project");
  const markdownFileName = `${safeFileName}.md`;
  const wordFileName = `${safeFileName}.doc`;
  const checklistSections = getDownloadChecklistSections(currentProject);
  const missingSections = checklistSections.filter((section) => !section.content.trim());
  const savedSections = checklistSections.filter((section) => section.content.trim());
  const completedCount = countCompletedSteps(currentProject);
  const totalCharacters = savedSections.reduce((total, section) => total + section.content.trim().length, 0);

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setStatus("전체 내용이 복사되었습니다.");
  }

  function downloadMarkdown() {
    downloadFile(markdown, markdownFileName, "text/markdown;charset=utf-8");
    setStatus(`${markdownFileName} 다운로드를 시작했습니다.`);
  }

  function downloadWord() {
    const html = buildProjectHtml(currentProject);
    downloadFile(html, wordFileName, "application/msword;charset=utf-8");
    setStatus(`${wordFileName} 다운로드를 시작했습니다. Word에서 열 수 있습니다.`);
  }

  function printPdf() {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      setStatus("팝업이 차단되어 PDF 인쇄창을 열지 못했습니다. 브라우저 팝업 허용을 확인해 주세요.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildProjectHtml(currentProject));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setStatus("인쇄창이 열렸습니다. 프린터 선택에서 'PDF로 저장'을 선택하면 됩니다.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold text-emerald-700">선택한 프로젝트</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">{currentProject.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">파일명: {safeFileName}</p>
        <p className="mt-2 text-sm font-semibold text-emerald-800">완료된 단계: {completedCount}개</p>
        <Link
          href={`/projects/${projectId}/edit`}
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          기본 정보 수정
        </Link>
        <ProjectWorkflowNav projectId={projectId} activeStep="download" project={currentProject} />
      </aside>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-700">다운로드</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">프로젝트 전체 결과물 저장</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              저장된 결과물을 하나로 모아 Markdown, Word, PDF 인쇄 화면으로 저장할 수 있습니다.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <button type="button" onClick={copyMarkdown} className="h-11 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold hover:bg-slate-50">
              전체 복사
            </button>
            <button type="button" onClick={downloadMarkdown} className="h-11 rounded-md bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800">
              Markdown 저장
            </button>
            <button type="button" onClick={downloadWord} className="h-11 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800">
              Word 저장
            </button>
            <button type="button" onClick={printPdf} className="h-11 rounded-md border border-emerald-200 bg-white px-4 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
              PDF 인쇄
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
            <p className="font-bold">다운로드 준비 상태</p>
            <p className="mt-1">저장된 결과물: {savedSections.length}개</p>
            <p>전체 글자 수: {totalCharacters.toLocaleString("ko-KR")}자</p>
            <p>비어 있는 항목: {missingSections.length}개</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <p className="font-bold">PDF 저장 방법</p>
            <p className="mt-1">PDF 인쇄 버튼을 누른 뒤 인쇄창에서 프린터를 “PDF로 저장”으로 선택하면 됩니다.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 lg:col-span-2">
            <p className="font-bold text-slate-900">결과물 상태</p>
            {missingSections.length > 0 ? (
              <div className="mt-2 grid gap-2">
                <p>아직 비어 있는 항목을 채우면 다운로드 결과물이 더 완성됩니다.</p>
                <div className="flex flex-wrap gap-2">
                  {missingSections.map((section) => (
                    <Link
                      key={section.href}
                      href={`/projects/${projectId}/${section.href}`}
                      className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-xs font-bold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      {section.label} 채우기
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-1 text-emerald-800">모든 주요 결과물이 준비되었습니다.</p>
            )}
          </div>
        </div>

        {status ? <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">{status}</div> : null}

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-900">결과물 체크리스트</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {checklistSections.map((section) => {
              const hasContent = Boolean(section.content.trim());

              return (
                <Link
                  key={section.href}
                  href={`/projects/${projectId}/${section.href}`}
                  className="grid gap-2 rounded-md border border-slate-200 bg-white px-3 py-3 text-sm font-semibold hover:border-emerald-300 hover:bg-emerald-50 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <span className="text-slate-950">{section.label}</span>
                  <span
                    className={`w-fit rounded-full px-2 py-1 text-xs font-bold ${
                      hasContent ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {hasContent ? `${section.content.trim().length.toLocaleString("ko-KR")}자` : "비어 있음"}
                  </span>
                  <span className={hasContent ? "text-emerald-700" : "text-rose-700"}>
                    {hasContent ? "수정하기" : "채우기"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-bold text-slate-700">미리보기</p>
          <pre className="max-h-[720px] overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-800">
            {markdown}
          </pre>
        </div>

        <Link href="/projects" className="mt-5 inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold">
          프로젝트 목록으로
        </Link>
      </section>
    </div>
  );
}

function MissingProject() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-bold text-rose-700">프로젝트를 찾을 수 없습니다</p>
      <Link href="/projects" className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-emerald-700 px-5 text-base font-semibold text-white">
        저장된 프로젝트 보기
      </Link>
    </section>
  );
}

function getDownloadChecklistSections(project: SavedProject) {
  return downloadSections.map((section) => ({
    label: section.label,
    href: section.href,
    content: section.getContent(project),
  }));
}

function buildProjectMarkdown(project: SavedProject) {
  return `# ${project.title || "꿈디코치 AI 프로젝트"}

## 프로젝트 기본 정보
- 기관명: ${project.organization || "미입력"}
- 대상: ${project.audience || "미입력"}
- 날짜: ${project.date || "미입력"}
- 시간: ${project.time || "미입력"}
- 형태: ${project.format || "미입력"}
- 목적: ${project.purpose || "미입력"}
- 특이사항: ${project.notes || "미입력"}

${downloadSections
  .map((section) => {
    const content = section.getContent(project) || `아직 저장된 ${section.label} 내용이 없습니다.`;
    return `## ${section.label}\n${content}`;
  })
  .join("\n\n")}`;
}

function buildProjectHtml(project: SavedProject) {
  const sections = downloadSections.map((section) => [
    section.label,
    section.getContent(project) || `아직 저장된 ${section.label} 내용이 없습니다.`,
  ]);

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(project.title || "꿈디코치 AI 프로젝트")}</title>
  <style>
    body { font-family: Arial, "Malgun Gothic", sans-serif; line-height: 1.7; color: #0f172a; padding: 40px; }
    h1 { font-size: 28px; margin: 0 0 16px; }
    h2 { font-size: 20px; margin: 32px 0 12px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0 28px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { width: 120px; background: #f8fafc; }
    pre { white-space: pre-wrap; font-family: Arial, "Malgun Gothic", sans-serif; background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; }
    @media print { body { padding: 20px; } button { display: none; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(project.title || "꿈디코치 AI 프로젝트")}</h1>
  <table>
    <tr><th>기관명</th><td>${escapeHtml(project.organization || "미입력")}</td></tr>
    <tr><th>대상</th><td>${escapeHtml(project.audience || "미입력")}</td></tr>
    <tr><th>날짜</th><td>${escapeHtml(project.date || "미입력")}</td></tr>
    <tr><th>시간</th><td>${escapeHtml(project.time || "미입력")}</td></tr>
    <tr><th>형태</th><td>${escapeHtml(project.format || "미입력")}</td></tr>
    <tr><th>목적</th><td>${escapeHtml(project.purpose || "미입력")}</td></tr>
    <tr><th>특이사항</th><td>${escapeHtml(project.notes || "미입력")}</td></tr>
  </table>
  ${sections.map(([title, content]) => `<h2>${escapeHtml(title)}</h2><pre>${escapeHtml(content)}</pre>`).join("")}
</body>
</html>`;
}

function downloadFile(content: string, fileName: string, type: string) {
  const contentWithBom = content.startsWith("\ufeff") ? content : `\ufeff${content}`;
  const blob = new Blob([contentWithBom], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toSafeFileName(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, "-").slice(0, 80) || "kkumdi-project";
}
