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
  const dataCollectionReady = isStepCompleted("data-collection", project);
  const rawNextStep = getNextWorkflowStep(project);
  const nextStep = dataCollectionReady ? rawNextStep : workflowSteps.find((step) => step.id === "data-collection") ?? rawNextStep;
  const previewSections = getPreviewSections(project);
  const outputChoices = getOutputChoices(projectId, dataCollectionReady);
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
            <Link
              href={dataCollectionReady ? `#output-choice` : `/projects/${projectId}/data-collection`}
              className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              {dataCollectionReady ? "결과물 선택하기" : "다음 단계: 자료수집"}
            </Link>
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

      <section id="output-choice" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-700">작업 시작 순서</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">기본정보와 자료수집 후 필요한 결과물만 골라요</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              어떤 결과물을 만들든 먼저 기본정보와 현장 자료를 모아 두면 AI 초안의 품질이 좋아집니다.
            </p>
          </div>
          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
              dataCollectionReady ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}
          >
            {dataCollectionReady ? "결과물 작성 준비됨" : "자료수집 먼저 필요"}
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <PreparationCard
            step="1"
            title="기본정보"
            description="강의명, 기관, 대상, 날짜, 목적을 담는 공통 재료입니다."
            href={`/projects/${projectId}/edit`}
            actionLabel="수정하기"
            ready
          />
          <PreparationCard
            step="2"
            title="자료수집"
            description="사진, 현장 메모, 반응, 강점 포인트를 모으는 핵심 준비 단계입니다."
            href={`/projects/${projectId}/data-collection`}
            actionLabel={dataCollectionReady ? "다시 보기" : "자료수집 하기"}
            ready={dataCollectionReady}
          />
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <p className="text-sm font-bold text-slate-900">무엇을 만들까요?</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {outputChoices.map((choice) => (
              <Link
                key={choice.href}
                href={choice.href}
                className={`rounded-lg border p-4 transition ${
                  dataCollectionReady
                    ? "border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <span className="text-xs font-bold text-emerald-700">{choice.eyebrow}</span>
                <h4 className="mt-2 text-lg font-bold text-slate-950">{choice.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">{choice.description}</p>
                <span className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-slate-950 px-3 text-sm font-semibold text-white">
                  {dataCollectionReady ? choice.actionLabel : "먼저 자료수집"}
                </span>
              </Link>
            ))}
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

function getOutputChoices(projectId: string, dataCollectionReady: boolean) {
  const baseHref = dataCollectionReady ? `/projects/${projectId}` : `/projects/${projectId}/data-collection`;

  return [
    {
      eyebrow: "기관 제출",
      title: "결과보고서만 작성",
      description: "기본정보와 현장 기록을 바탕으로 기관에 제출할 보고서를 만듭니다.",
      href: dataCollectionReady ? `${baseHref}/result-report` : baseHref,
      actionLabel: "보고서 만들기",
    },
    {
      eyebrow: "후기 글",
      title: "블로그만 작성",
      description: "수업 장면과 강점 포인트를 교육 후기 글로 정리합니다.",
      href: dataCollectionReady ? `${baseHref}/blog` : baseHref,
      actionLabel: "블로그 만들기",
    },
    {
      eyebrow: "홍보 콘텐츠",
      title: "마케팅 문구만 작성",
      description: "SNS, 카드뉴스, 홍보 문구에 쓸 짧은 콘텐츠를 만듭니다.",
      href: dataCollectionReady ? `${baseHref}/marketing` : baseHref,
      actionLabel: "마케팅 만들기",
    },
    {
      eyebrow: "회고 질문",
      title: "인터뷰 질문만 작성",
      description: "강사 회고와 후기 작성을 위한 질문을 준비합니다.",
      href: dataCollectionReady ? `${baseHref}/interview` : baseHref,
      actionLabel: "인터뷰 만들기",
    },
    {
      eyebrow: "전체 진행",
      title: "전체 프로젝트 계속 진행",
      description: "제안서부터 다운로드까지 모든 단계를 이어서 진행합니다.",
      href: dataCollectionReady ? `${baseHref}/${getNextWorkflowHrefAfterDataCollection()}` : baseHref,
      actionLabel: "전체 흐름 보기",
    },
  ];
}

function getNextWorkflowHrefAfterDataCollection() {
  return "result-report";
}

function PreparationCard({
  step,
  title,
  description,
  href,
  actionLabel,
  ready,
}: {
  step: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  ready: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg border p-4 transition ${
        ready ? "border-emerald-200 bg-emerald-50 hover:bg-emerald-100" : "border-amber-200 bg-amber-50 hover:bg-amber-100"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-8 min-w-8 items-center justify-center rounded-md text-sm font-bold ${ready ? "bg-emerald-700 text-white" : "bg-amber-200 text-amber-950"}`}>
          {step}
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-lg font-bold text-slate-950">{title}</h4>
            <span className={`rounded-full px-2 py-1 text-xs font-bold ${ready ? "bg-white text-emerald-800" : "bg-white text-amber-800"}`}>
              {ready ? "준비됨" : "필요"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          <span className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900">
            {actionLabel}
          </span>
        </div>
      </div>
    </Link>
  );
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
