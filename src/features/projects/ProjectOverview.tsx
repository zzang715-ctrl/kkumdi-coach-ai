"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { findLocalProject, formatProjectDate } from "@/features/projects/localProjectStorage";
import {
  completableStepCount,
  countCompletedSteps,
  getNextWorkflowStep,
  getProjectProgressPercent,
  isStepCompleted,
  workflowSteps,
} from "@/features/projects/projectProgress";
import type { SavedProject } from "@/features/projects/projectStorage";

type ProjectOverviewProps = {
  projectId: string;
};

export function ProjectOverview({ projectId }: ProjectOverviewProps) {
  const [copiedLabel, setCopiedLabel] = useState("");
  const [expandedLabel, setExpandedLabel] = useState("");
  const project = useMemo(() => findLocalProject(projectId), [projectId]);

  async function copyText(label: string, content: string) {
    if (!content.trim()) {
      return;
    }

    await navigator.clipboard.writeText(content);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1500);
  }

  if (!project) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold text-rose-700">프로젝트를 찾을 수 없습니다</p>
        <h2 className="mt-3 text-2xl font-bold text-slate-950">저장된 프로젝트 목록으로 돌아가 주세요</h2>
        <Link
          href="/projects"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-emerald-700 px-5 text-base font-semibold text-white hover:bg-emerald-800"
        >
          저장된 프로젝트 보기
        </Link>
      </section>
    );
  }

  const completedCount = countCompletedSteps(project);
  const progressPercent = getProjectProgressPercent(project);
  const nextStep = getNextWorkflowStep(project);
  const previewSections = getPreviewSections(project);
  const savedSections = previewSections.filter((section) => section.content.trim());
  const savedPreviewCount = savedSections.length;
  const totalPreviewCharacters = savedSections.reduce((total, section) => total + section.content.trim().length, 0);
  const allPreviewText = savedSections
    .map((section) => `## ${section.label}\n\n${section.content.trim()}`)
    .join("\n\n---\n\n");

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-700">프로젝트 홈</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{project.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {project.organization || "기관 미입력"} · {project.audience || "대상 미입력"} · {project.date || "날짜 미입력"}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/projects/${projectId}/edit`}
              className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 hover:border-slate-500"
            >
              기본 정보 수정
            </Link>
            {nextStep ? (
              <Link
                href={`/projects/${projectId}/${nextStep.href}`}
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                다음 단계: {nextStep.label}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-5 rounded-md border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-emerald-900">
              진행률 {completedCount} / {completableStepCount} 완료
            </p>
            <span className="text-sm font-bold text-emerald-800">{progressPercent}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-emerald-700" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">전체 단계</p>
          <div className="mt-4 grid gap-2">
            {workflowSteps.map((step, index) => {
              const completed = isStepCompleted(step.id, project);
              const isNext = nextStep?.id === step.id;
              const status = getStepStatus(completed, isNext, step.id === "download");

              return (
                <Link
                  key={step.id}
                  href={`/projects/${projectId}/${step.href}`}
                  className={`flex items-center gap-3 rounded-md border px-3 py-3 text-sm font-semibold hover:bg-emerald-50 ${
                    isNext ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-7 min-w-9 items-center justify-center rounded-md px-2 text-xs ${
                      completed ? "bg-emerald-700 text-white" : isNext ? "bg-slate-900 text-white" : "bg-white text-slate-600"
                    }`}
                  >
                    {completed ? "완료" : index + 1}
                  </span>
                  <span className="flex-1 text-slate-950">{step.label}</span>
                  <span className={status.className}>{status.label}</span>
                </Link>
              );
            })}
          </div>
        </article>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">기본 정보</p>
          <dl className="mt-4 grid gap-3 text-sm leading-6">
            <InfoRow label="기관" value={project.organization} />
            <InfoRow label="대상" value={project.audience} />
            <InfoRow label="날짜" value={project.date} />
            <InfoRow label="시간" value={project.time} />
            <InfoRow label="형태" value={project.format} />
            <InfoRow label="생성일" value={formatProjectDate(project.createdAt)} />
          </dl>
          <div className="mt-5 rounded-md bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-500">강의 목적</p>
            <p className="mt-1 text-sm leading-6 text-slate-800">{project.purpose || "아직 입력하지 않음"}</p>
          </div>
          <div className="mt-3 rounded-md bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-500">특이사항</p>
            <p className="mt-1 text-sm leading-6 text-slate-800">{project.notes || "아직 입력하지 않음"}</p>
          </div>
        </aside>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-700">저장 결과물 미리보기</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">저장된 결과물 {savedPreviewCount}개</h3>
            <p className="mt-1 text-sm font-bold text-slate-500">
              전체 {totalPreviewCharacters.toLocaleString("ko-KR")}자
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => copyText("전체 결과물", allPreviewText)}
              disabled={!allPreviewText}
              className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
            >
              {copiedLabel === "전체 결과물" ? "전체 복사됨" : "전체 복사"}
            </button>
            <Link
              href={`/projects/${projectId}/download`}
              className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 hover:border-slate-500"
            >
              전체 다운로드 화면으로
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {previewSections.map((section) => {
            const hasContent = Boolean(section.content.trim());
            const isCopied = copiedLabel === section.label;
            const isExpanded = expandedLabel === section.label;

            return (
              <article key={section.href} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-950">{section.label}</p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                      hasContent ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {hasContent ? "저장됨" : "비어 있음"}
                  </span>
                </div>
                <p className="mt-2 text-xs font-bold text-slate-500">
                  {section.content.trim().length.toLocaleString("ko-KR")}자 ·{" "}
                  {section.updatedAt ? `마지막 저장 ${formatProjectDate(section.updatedAt)}` : "아직 저장 기록 없음"}
                </p>
                <p className={`mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700 ${isExpanded ? "" : "line-clamp-3"}`}>
                  {section.content.trim() || "아직 저장된 내용이 없습니다. 각 단계를 열어 초안을 만들거나 직접 입력해 주세요."}
                </p>
                {hasContent ? (
                  <button
                    type="button"
                    onClick={() => setExpandedLabel(isExpanded ? "" : section.label)}
                    className="mt-2 text-sm font-bold text-emerald-700 hover:text-emerald-900"
                  >
                    {isExpanded ? "접기" : "전체 보기"}
                  </button>
                ) : null}
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Link
                    href={`/projects/${projectId}/${section.href}`}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:border-slate-500"
                  >
                    열기
                  </Link>
                  <button
                    type="button"
                    onClick={() => copyText(section.label, section.content)}
                    disabled={!hasContent}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                  >
                    {isCopied ? "복사됨" : "복사"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function getPreviewSections(project: SavedProject) {
  return [
    { label: "제안서", href: "proposal", content: project.proposalDraft || "", updatedAt: project.proposalUpdatedAt },
    { label: "강의 기획서", href: "lecture-plan", content: project.lecturePlanDraft || "", updatedAt: project.lecturePlanUpdatedAt },
    { label: "자료수집 요약", href: "data-collection", content: project.dataCollection?.summary || "", updatedAt: project.dataCollectionUpdatedAt },
    { label: "결과보고서", href: "result-report", content: project.resultReportDraft || "", updatedAt: project.resultReportUpdatedAt },
    { label: "인터뷰", href: "interview", content: project.interviewDraft || "", updatedAt: project.interviewUpdatedAt },
    { label: "블로그", href: "blog", content: project.blogDraft || "", updatedAt: project.blogUpdatedAt },
    { label: "마케팅", href: "marketing", content: project.marketingDraft || "", updatedAt: project.marketingUpdatedAt },
  ];
}

function getStepStatus(completed: boolean, isNext: boolean, isDownload: boolean) {
  if (completed) {
    return { label: "작성됨", className: "text-emerald-700" };
  }

  if (isNext) {
    return { label: "다음 작업", className: "text-emerald-700" };
  }

  if (isDownload) {
    return { label: "마지막 단계", className: "text-slate-500" };
  }

  return { label: "작성 전", className: "text-slate-500" };
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-900">{value || "아직 입력하지 않음"}</dd>
    </div>
  );
}
