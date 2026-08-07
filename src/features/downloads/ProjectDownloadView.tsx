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
  const reportFileName = `${safeFileName}-결과보고서.docx`;
  const checklistSections = getDownloadChecklistSections(currentProject);
  const missingSections = checklistSections.filter((section) => !section.content.trim());
  const savedSections = checklistSections.filter((section) => section.content.trim());
  const completedCount = countCompletedSteps(currentProject);
  const totalCharacters = savedSections.reduce((total, section) => total + section.content.trim().length, 0);
  const reportPhotoCount = currentProject.dataCollection?.photos?.length ?? 0;

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

  async function downloadInstitutionReportWord() {
    setStatus("사진을 Word 문서에 넣는 중입니다. 잠시만 기다려 주세요...");
    const documentBlob = await buildInstitutionReportDocx(currentProject);
    downloadBlob(documentBlob, reportFileName);
    setStatus(`${reportFileName} 다운로드를 시작했습니다. Word에서 사진과 내용을 확인해 주세요.`);
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

  function printInstitutionReportPdf() {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      setStatus("팝업이 차단되어 PDF 인쇄창을 열지 못했습니다. 브라우저 팝업 허용을 확인해 주세요.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildInstitutionReportHtml(currentProject, "print"));
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => {
      printWindow.print();
    }, 800);
    setStatus("결과보고서 인쇄창이 열렸습니다. 프린터 선택에서 'PDF로 저장'을 선택하면 됩니다.");
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
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950 lg:col-span-2">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="font-bold">결과보고서 완성본</p>
                <p className="mt-1">
                  기본 정보, 결과보고서 본문, 자료수집 사진 {reportPhotoCount}장을 일정한 양식에 넣어 저장합니다.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={downloadInstitutionReportWord}
                  className="h-11 rounded-md bg-rose-700 px-4 text-sm font-semibold text-white hover:bg-rose-800"
                >
                  보고서 Word 저장
                </button>
                <button
                  type="button"
                  onClick={printInstitutionReportPdf}
                  className="h-11 rounded-md border border-rose-300 bg-white px-4 text-sm font-semibold text-rose-800 hover:bg-rose-100"
                >
                  보고서 PDF 인쇄
                </button>
              </div>
            </div>
            {!currentProject.resultReportDraft?.trim() ? (
              <p className="mt-3 font-semibold text-rose-800">먼저 결과보고서 단계에서 본문을 만들고 저장하면 완성본 품질이 좋아집니다.</p>
            ) : null}
          </div>

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
  </table>
  ${sections.map(([title, content]) => `<h2>${escapeHtml(title)}</h2><pre>${escapeHtml(content)}</pre>`).join("")}
</body>
</html>`;
}

function buildInstitutionReportHtml(project: SavedProject, photoMode: "print" | "word") {
  const reportContent =
    cleanReportContent(project.resultReportDraft || project.dataCollection?.summary || "") ||
    "아직 저장된 결과보고서가 없습니다. 결과보고서 단계에서 본문을 만든 뒤 다시 다운로드해 주세요.";
  const photos = project.dataCollection?.photos ?? [];

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(project.title || "강의 결과보고서")}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Arial, "Malgun Gothic", sans-serif; line-height: 1.7; color: #111827; padding: 36px; }
    .cover { border-bottom: 3px solid #111827; margin-bottom: 24px; padding-bottom: 16px; }
    h1 { font-size: 30px; margin: 0; }
    h2 { font-size: 20px; margin: 30px 0 12px; border-bottom: 1px solid #d1d5db; padding-bottom: 8px; }
    .photo-section-title { page-break-before: always; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0 26px; }
    th, td { border: 1px solid #d1d5db; padding: 10px 12px; text-align: left; vertical-align: top; }
    th { width: 140px; background: #f9fafb; }
    pre { white-space: pre-wrap; font-family: Arial, "Malgun Gothic", sans-serif; margin: 0; }
    .report-body { border: 1px solid #d1d5db; padding: 18px; min-height: 360px; }
    .photo-page { border-collapse: collapse; table-layout: fixed; width: 100%; page-break-inside: avoid; }
    .photo-page + .photo-page { page-break-before: always; }
    .photo-cell { width: 50%; height: 72mm; border: 1px solid #d1d5db; padding: 4mm; text-align: center; vertical-align: middle; }
    .photo-cell img { width: 78mm; height: 64mm; object-fit: contain; }
    .empty { border: 1px dashed #d1d5db; color: #6b7280; padding: 16px; }
    .sign { margin-top: 34px; text-align: right; }
    @page { size: A4; margin: 15mm; }
    @media print {
      body { padding: 0; }
      .photo-cell { height: 72mm; }
    }
  </style>
</head>
<body>
  <section class="cover">
    <h1>강의 결과보고서</h1>
  </section>

  <h2>1. 프로젝트 기본 정보</h2>
  <table>
    <tr><th>강의명</th><td>${escapeHtml(project.title || "미입력")}</td></tr>
    <tr><th>기관명</th><td>${escapeHtml(project.organization || "미입력")}</td></tr>
    <tr><th>대상</th><td>${escapeHtml(project.audience || "미입력")}</td></tr>
    <tr><th>일정</th><td>${escapeHtml(project.date || "미입력")}</td></tr>
    <tr><th>시간</th><td>${escapeHtml(project.time || "미입력")}</td></tr>
    <tr><th>형태</th><td>${escapeHtml(project.format || "미입력")}</td></tr>
    <tr><th>목적</th><td>${escapeHtml(project.purpose || "미입력")}</td></tr>
  </table>

  <h2>2. 결과보고서 본문</h2>
  <div class="report-body"><pre>${escapeHtml(reportContent)}</pre></div>

  <h2 class="photo-section-title">3. 현장 사진 자료</h2>
  ${buildReportPhotosHtml(photos, photoMode)}

  <div class="sign">작성일: ${escapeHtml(new Date().toLocaleDateString("ko-KR"))}</div>
</body>
</html>`;
}

async function buildInstitutionReportDocx(project: SavedProject) {
  const photos = project.dataCollection?.photos ?? [];
  const images = await Promise.all(
    photos.map(async (photo, index) => {
      const image = parseDataUrlImage(photo.dataUrl);

      if (!image) {
        return null;
      }

      const size = await readImageSize(photo.dataUrl);
      const fit = fitImageToBox(size.width, size.height, 2500000, 1750000);

      return {
        relationshipId: `rId${index + 1}`,
        fileName: `photo-${index + 1}.${image.extension}`,
        contentType: image.mimeType,
        bytes: base64ToUint8Array(image.base64),
        widthEmu: fit.widthEmu,
        heightEmu: fit.heightEmu,
      };
    })
  );
  const validImages = images.filter((image): image is NonNullable<typeof image> => Boolean(image));
  const files: ZipFile[] = [
    {
      path: "[Content_Types].xml",
      content: textToUint8Array(buildDocxContentTypes(validImages)),
    },
    {
      path: "_rels/.rels",
      content: textToUint8Array(buildDocxRootRelationships()),
    },
    {
      path: "word/document.xml",
      content: textToUint8Array(buildDocxDocument(project, validImages)),
    },
    {
      path: "word/_rels/document.xml.rels",
      content: textToUint8Array(buildDocxDocumentRelationships(validImages)),
    },
  ];

  validImages.forEach((image) => {
    files.push({
      path: `word/media/${image.fileName}`,
      content: image.bytes,
    });
  });

  return new Blob([createZip(files)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

function buildReportPhotosHtml(photos: NonNullable<SavedProject["dataCollection"]>["photos"], photoMode: "print" | "word") {
  if (!photos?.length) {
    return `<div class="empty">자료수집 단계에 첨부된 사진이 없습니다.</div>`;
  }

  return chunkItems(photos, 6)
    .map((photoPage, pageIndex) => {
      const sixSlots = Array.from({ length: 6 }, (_, slotIndex) => photoPage[slotIndex] ?? null);
      const rows = chunkItems(sixSlots, 2)
        .map(
          (row, rowIndex) => `<tr>${row
            .map((photo, slotIndex) => {
              if (!photo) {
                return `<td class="photo-cell"></td>`;
              }

              const index = pageIndex * 6 + rowIndex * 2 + slotIndex;
              const image = parseDataUrlImage(photo.dataUrl);
              const photoSource = photoMode === "word" && image ? `photo-${index + 1}.${image.extension}` : photo.dataUrl;

              return `<td class="photo-cell"><img src="${photoSource}" alt="현장 사진 ${index + 1}" width="295" height="242" /></td>`;
            })
            .join("")}</tr>`,
        )
        .join("");

      return `<table class="photo-page">${rows}</table>`;
    })
    .join("");
}

function cleanReportContent(content: string) {
  return content
    .split("\n")
    .filter((line) => !/AI\s*강사비서\s*드림|꿈디코치\s*AI\s*강사비서\s*드림|강사비서\s*드림/i.test(line))
    .map((line) => line.replace(/기관\s*제출용\s*/g, ""))
    .join("\n")
    .trim();
}

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function parseDataUrlImage(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  const mimeType = match[1];
  const extension = mimeType.split("/")[1]?.replace("jpeg", "jpg") || "jpg";

  return {
    mimeType,
    extension,
    base64: match[2],
  };
}

type DocxImage = {
  relationshipId: string;
  fileName: string;
  contentType: string;
  bytes: Uint8Array;
  widthEmu: number;
  heightEmu: number;
};

type ZipFile = {
  path: string;
  content: Uint8Array;
};

function buildDocxDocument(project: SavedProject, images: DocxImage[]) {
  const reportContent =
    cleanReportContent(project.resultReportDraft || project.dataCollection?.summary || "") ||
    "아직 저장된 결과보고서가 없습니다. 결과보고서 단계에서 본문을 만든 뒤 다시 다운로드해 주세요.";
  const infoRows = [
    ["강의명", project.title || "미입력"],
    ["기관명", project.organization || "미입력"],
    ["대상", project.audience || "미입력"],
    ["일정", project.date || "미입력"],
    ["시간", project.time || "미입력"],
    ["형태", project.format || "미입력"],
    ["목적", project.purpose || "미입력"],
  ];

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" mc:Ignorable="w14 wp14">
  <w:body>
    ${docxHeading("강의 결과보고서", 1)}
    ${docxHeading("1. 프로젝트 기본 정보", 2)}
    ${docxInfoTable(infoRows)}
    ${docxHeading("2. 결과보고서 본문", 2)}
    ${textToDocxParagraphs(reportContent)}
    ${docxPageBreak()}
    ${docxHeading("3. 현장 사진 자료", 2)}
    ${images.length ? docxPhotoTables(images) : docxParagraph("자료수집 단계에 첨부된 사진이 없습니다.")}
    ${docxParagraph(`작성일: ${new Date().toLocaleDateString("ko-KR")}`, "right")}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

function docxInfoTable(rows: string[][]) {
  return `<w:tbl>
    <w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders>${docxBorders()}</w:tblBorders></w:tblPr>
    ${rows
      .map(
        ([label, value]) => `<w:tr>
          <w:tc><w:tcPr><w:tcW w:w="1800" w:type="dxa"/><w:shd w:fill="F8FAFC"/></w:tcPr>${docxParagraph(label, undefined, true)}</w:tc>
          <w:tc><w:tcPr><w:tcW w:w="7600" w:type="dxa"/></w:tcPr>${docxParagraph(value)}</w:tc>
        </w:tr>`,
      )
      .join("")}
  </w:tbl>`;
}

function docxPhotoTables(images: DocxImage[]) {
  return chunkItems(images, 6)
    .map((pageImages, pageIndex) => {
      const cells = Array.from({ length: 6 }, (_, index) => pageImages[index] ?? null);
      const rows = chunkItems(cells, 2)
        .map(
          (row) => `<w:tr>
            <w:trPr><w:trHeight w:val="3300" w:hRule="exact"/></w:trPr>
            ${row.map((image) => docxPhotoCell(image)).join("")}
          </w:tr>`,
        )
        .join("");
      const pageBreak = pageIndex === 0 ? "" : docxPageBreak();

      return `${pageBreak}<w:tbl>
        <w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblLayout w:type="fixed"/><w:tblBorders>${docxBorders()}</w:tblBorders></w:tblPr>
        <w:tblGrid><w:gridCol w:w="4700"/><w:gridCol w:w="4700"/></w:tblGrid>
        ${rows}
      </w:tbl>`;
    })
    .join("");
}

function docxPhotoCell(image: DocxImage | null) {
  return `<w:tc>
    <w:tcPr><w:tcW w:w="4700" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>
    ${image ? docxImageParagraph(image) : docxParagraph("")}
  </w:tc>`;
}

function docxImageParagraph(image: DocxImage) {
  return `<w:p>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r>
      <w:drawing>
        <wp:inline distT="0" distB="0" distL="0" distR="0">
          <wp:extent cx="${image.widthEmu}" cy="${image.heightEmu}"/>
          <wp:docPr id="${image.relationshipId.replace("rId", "")}" name="${escapeXml(image.fileName)}"/>
          <a:graphic>
            <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
              <pic:pic>
                <pic:nvPicPr><pic:cNvPr id="0" name="${escapeXml(image.fileName)}"/><pic:cNvPicPr/></pic:nvPicPr>
                <pic:blipFill><a:blip r:embed="${image.relationshipId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
                <pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${image.widthEmu}" cy="${image.heightEmu}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
              </pic:pic>
            </a:graphicData>
          </a:graphic>
        </wp:inline>
      </w:drawing>
    </w:r>
  </w:p>`;
}

function textToDocxParagraphs(content: string) {
  return content
    .split("\n")
    .map((line) => docxParagraph(line || " "))
    .join("");
}

function docxHeading(text: string, level: 1 | 2) {
  const size = level === 1 ? "40" : "28";
  return `<w:p><w:pPr><w:spacing w:before="180" w:after="160"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="${size}"/></w:rPr><w:t>${escapeXml(text)}</w:t></w:r></w:p>`;
}

function docxParagraph(text: string, align?: "right", bold = false) {
  return `<w:p>
    <w:pPr>${align ? `<w:jc w:val="${align}"/>` : ""}<w:spacing w:after="80"/></w:pPr>
    <w:r>${bold ? "<w:rPr><w:b/></w:rPr>" : ""}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>
  </w:p>`;
}

function docxPageBreak() {
  return `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
}

function docxBorders() {
  return `<w:top w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/><w:left w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/><w:right w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>`;
}

function buildDocxContentTypes(images: DocxImage[]) {
  const imageDefaults = Array.from(new Map(images.map((image) => [image.fileName.split(".").pop() || "jpg", image.contentType])))
    .map(([extension, contentType]) => `<Default Extension="${escapeXml(extension)}" ContentType="${escapeXml(contentType)}"/>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  ${imageDefaults}
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
}

function buildDocxRootRelationships() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
}

function buildDocxDocumentRelationships(images: DocxImage[]) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${images
    .map(
      (image) =>
        `<Relationship Id="${image.relationshipId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${escapeXml(image.fileName)}"/>`,
    )
    .join("")}
</Relationships>`;
}

function readImageSize(dataUrl: string) {
  return new Promise<{ width: number; height: number }>((resolve) => {
    const image = new window.Image();

    image.onload = () => resolve({ width: image.naturalWidth || image.width || 1, height: image.naturalHeight || image.height || 1 });
    image.onerror = () => resolve({ width: 4, height: 3 });
    image.src = dataUrl;
  });
}

function fitImageToBox(width: number, height: number, maxWidthEmu: number, maxHeightEmu: number) {
  const ratio = Math.min(maxWidthEmu / Math.max(width, 1), maxHeightEmu / Math.max(height, 1));
  return {
    widthEmu: Math.max(1, Math.round(width * ratio)),
    heightEmu: Math.max(1, Math.round(height * ratio)),
  };
}

function createZip(files: ZipFile[]) {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  files.forEach((file) => {
    const name = textToUint8Array(file.path);
    const crc = crc32(file.content);
    const localHeader = concatUint8Arrays([
      uint32(0x04034b50),
      uint16(20),
      uint16(0),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(crc),
      uint32(file.content.length),
      uint32(file.content.length),
      uint16(name.length),
      uint16(0),
      name,
    ]);
    localParts.push(localHeader, file.content);

    const centralHeader = concatUint8Arrays([
      uint32(0x02014b50),
      uint16(20),
      uint16(20),
      uint16(0),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(crc),
      uint32(file.content.length),
      uint32(file.content.length),
      uint16(name.length),
      uint16(0),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(0),
      uint32(offset),
      name,
    ]);
    centralParts.push(centralHeader);
    offset += localHeader.length + file.content.length;
  });

  const centralDirectory = concatUint8Arrays(centralParts);
  const localFiles = concatUint8Arrays(localParts);
  const end = concatUint8Arrays([
    uint32(0x06054b50),
    uint16(0),
    uint16(0),
    uint16(files.length),
    uint16(files.length),
    uint32(centralDirectory.length),
    uint32(localFiles.length),
    uint16(0),
  ]);

  return concatUint8Arrays([localFiles, centralDirectory, end]);
}

function textToUint8Array(text: string) {
  return new TextEncoder().encode(text);
}

function base64ToUint8Array(base64: string) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc ^= byte;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function uint16(value: number) {
  const bytes = new Uint8Array(2);
  const view = new DataView(bytes.buffer);
  view.setUint16(0, value, true);
  return bytes;
}

function uint32(value: number) {
  const bytes = new Uint8Array(4);
  const view = new DataView(bytes.buffer);
  view.setUint32(0, value, true);
  return bytes;
}

function concatUint8Arrays(parts: Uint8Array[]) {
  const totalLength = parts.reduce((total, part) => total + part.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  parts.forEach((part) => {
    result.set(part, offset);
    offset += part.length;
  });

  return result;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function downloadFile(content: string, fileName: string, type: string) {
  const contentWithBom = content.startsWith("\ufeff") ? content : `\ufeff${content}`;
  downloadRawFile(contentWithBom, fileName, type);
}

function downloadRawFile(content: string, fileName: string, type: string) {
  const blob = new Blob([content], { type });
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

function escapeXml(value: string) {
  return escapeHtml(value);
}

function toSafeFileName(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, "-").slice(0, 80) || "kkumdi-project";
}
