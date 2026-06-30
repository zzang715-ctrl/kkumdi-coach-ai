"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import type { SavedProject } from "@/features/projects/projectStorage";
import { findLocalProject, formatProjectDate, updateLocalProject } from "@/features/projects/localProjectStorage";
import { getNextWorkflowStep } from "@/features/projects/projectProgress";
import { ProjectWorkflowNav } from "@/features/projects/ProjectWorkflowNav";
import { saveProjectEverywhere } from "@/features/projects/remoteProjectStorage";

type AiResponse = {
  text?: string;
  error?: string;
};

type ProjectDraftEditorProps = {
  projectId: string;
  activeStep: string;
  theme: "amber" | "sky" | "rose" | "violet" | "slate" | "indigo";
  eyebrow: string;
  title: string;
  description: string;
  fieldLabel: string;
  copyLabel: string;
  saveLabel: string;
  resetLabel: string;
  savedTitle: string;
  aiEndpoint: string;
  getDraft: (project: SavedProject) => string | undefined;
  getUpdatedAt: (project: SavedProject) => string | undefined;
  buildDefaultDraft: (project: SavedProject) => string;
  applyDraft: (project: SavedProject, draft: string) => SavedProject;
};

const themeClasses = {
  amber: "text-amber-700 focus:border-amber-600 focus:ring-amber-100",
  sky: "text-sky-700 focus:border-sky-600 focus:ring-sky-100",
  rose: "text-rose-700 focus:border-rose-600 focus:ring-rose-100",
  violet: "text-violet-700 focus:border-violet-600 focus:ring-violet-100",
  slate: "text-slate-700 focus:border-slate-700 focus:ring-slate-100",
  indigo: "text-indigo-700 focus:border-indigo-600 focus:ring-indigo-100",
};

export function ProjectDraftEditor({
  projectId,
  activeStep,
  theme,
  eyebrow,
  title,
  description,
  fieldLabel,
  copyLabel,
  saveLabel,
  resetLabel,
  savedTitle,
  aiEndpoint,
  getDraft,
  getUpdatedAt,
  buildDefaultDraft,
  applyDraft,
}: ProjectDraftEditorProps) {
  const initialProject = useMemo(() => findLocalProject(projectId), [projectId]);
  const [project, setProject] = useState<SavedProject | null>(initialProject);
  const [draft, setDraft] = useState(() => (initialProject ? getDraft(initialProject) || buildDefaultDraft(initialProject) : ""));
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const maybeProject = project;
  const updatedAt = maybeProject ? getUpdatedAt(maybeProject) : undefined;
  const savedDraft = maybeProject ? getDraft(maybeProject) || "" : "";
  const hasUnsavedChanges = Boolean(updatedAt && draft !== savedDraft);
  const draftStatus = getDraftStatus(updatedAt, hasUnsavedChanges);

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    function warnBeforeLeave(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warnBeforeLeave);

    return () => {
      window.removeEventListener("beforeunload", warnBeforeLeave);
    };
  }, [hasUnsavedChanges]);

  if (!maybeProject) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold text-rose-700">프로젝트를 찾을 수 없습니다</p>
        <h2 className="mt-3 text-2xl font-bold text-slate-950">저장된 프로젝트 목록으로 돌아가 주세요</h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-600">
          이 브라우저 저장소에서 해당 프로젝트를 찾지 못했습니다.
        </p>
        <Link
          href="/projects"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-emerald-700 px-5 text-base font-semibold text-white transition hover:bg-emerald-800"
        >
          저장된 프로젝트 보기
        </Link>
      </section>
    );
  }

  const currentProject = maybeProject;
  const nextStep = saved ? getNextWorkflowStep(currentProject) : null;

  async function copyDraft() {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
  }

  async function generateWithAI() {
    setIsGenerating(true);
    setAiError("");
    setSaved(false);
    setSaveMessage("");
    setCopied(false);

    try {
      const response = await fetch(aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: currentProject }),
      });
      const data = (await response.json()) as AiResponse;

      if (!response.ok || !data.text) {
        setAiError(
          data.error ||
            "AI가 초안을 만들지 못했습니다. OpenAI 결제 전에는 샘플 초안 만들기 버튼으로 흐름을 확인해 주세요.",
        );
        return;
      }

      setDraft(data.text);
    } catch {
      setAiError("AI 서버와 연결하지 못했습니다. 결제 전에는 샘플 초안 만들기 버튼으로 흐름을 테스트할 수 있습니다.");
    } finally {
      setIsGenerating(false);
    }
  }

  function makeSampleDraft() {
    setDraft(buildDefaultDraft(currentProject));
    setSaved(false);
    setCopied(false);
    setAiError("");
    setSaveMessage("샘플 초안을 만들었습니다. 내용을 수정한 뒤 저장해 주세요.");
  }

  async function saveDraft() {
    setIsSaving(true);
    setSaveMessage("저장하는 중입니다...");

    const nextProject = applyDraft(currentProject, draft);
    const nextProjects = updateLocalProject(nextProject);
    const saveResult = await saveProjectEverywhere(nextProject, nextProjects);

    await waitForSavingFeedback();
    setProject(nextProject);
    setSaved(true);
    setSaveMessage(saveResult.message);
    setCopied(false);
    setIsSaving(false);
  }

  function resetDraft() {
    setDraft(buildDefaultDraft(currentProject));
    setSaved(false);
    setCopied(false);
    setAiError("");
    setSaveMessage("");
  }

  function handleSaveShortcut(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();

      if (!isSaving && !isGenerating) {
        void saveDraft();
      }
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className={`text-sm font-bold ${themeClasses[theme].split(" ")[0]}`}>선택한 프로젝트</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">{currentProject.title}</h2>
        <dl className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
          <ProjectInfo label="기관" value={currentProject.organization} />
          <ProjectInfo label="대상" value={currentProject.audience} />
          <ProjectInfo label="날짜" value={currentProject.date} />
          <ProjectInfo label="시간" value={currentProject.time} />
          <ProjectInfo label="형태" value={currentProject.format} />
        </dl>
        {updatedAt ? (
          <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-sm font-bold text-emerald-900">저장된 내용 있음</p>
            <p className="mt-1 text-sm leading-6 text-emerald-800">마지막 저장 {formatProjectDate(updatedAt)}</p>
          </div>
        ) : null}
        <Link
          href={`/projects/${projectId}/edit`}
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          기본 정보 수정
        </Link>
        <ProjectWorkflowNav projectId={projectId} activeStep={activeStep} project={currentProject} />
      </aside>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className={`text-sm font-bold ${themeClasses[theme].split(" ")[0]}`}>{eyebrow}</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${draftStatus.className}`}>
                {draftStatus.label}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {updatedAt ? `마지막 저장 ${formatProjectDate(updatedAt)}` : "아직 저장 기록 없음"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:justify-end">
            <button
              type="button"
              onClick={generateWithAI}
              disabled={isGenerating || isSaving}
              className="inline-flex h-11 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isGenerating ? "AI 작성 중..." : "AI로 생성"}
            </button>
            <button
              type="button"
              onClick={makeSampleDraft}
              disabled={isGenerating || isSaving}
              className="inline-flex h-11 items-center justify-center rounded-md border border-amber-300 bg-amber-50 px-4 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              샘플 초안 만들기
            </button>
            <button
              type="button"
              onClick={copyDraft}
              className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-500"
            >
              {copied ? "복사 완료" : copyLabel}
            </button>
            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              {resetLabel}
            </button>
            <button
              type="button"
              onClick={saveDraft}
              disabled={isSaving || isGenerating}
              className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSaving ? "저장 중..." : saveLabel}
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-900">결제 전 테스트 방법</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            OpenAI 결제 전에는 AI 생성 대신 샘플 초안을 만들어서 저장, 복사, 다음 단계 이동 흐름을 확인할 수 있습니다.
          </p>
        </div>

        {aiError ? (
          <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4">
            <p className="font-bold text-rose-900">AI 생성 안내</p>
            <p className="mt-1 text-sm leading-6 text-rose-800">{aiError}</p>
          </div>
        ) : null}

        {saved || saveMessage ? (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-bold text-emerald-900">{saved ? savedTitle : "안내"}</p>
            {saveMessage ? <p className="mt-1 text-sm font-semibold leading-6 text-emerald-800">{saveMessage}</p> : null}
            {nextStep ? (
              <Link
                href={`/projects/${projectId}/${nextStep.href}`}
                className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                다음 단계로 이동: {nextStep.label}
              </Link>
            ) : null}
          </div>
        ) : null}

        <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-800">
          {fieldLabel}
          <span className="text-xs font-bold text-slate-500">
            현재 {draft.trim().length.toLocaleString("ko-KR")}자 · 입력 중 Ctrl+S를 누르면 바로 저장됩니다.
          </span>
          <textarea
            value={draft}
            onKeyDown={handleSaveShortcut}
            onChange={(event) => {
              setDraft(event.target.value);
              setSaved(false);
              setCopied(false);
              setAiError("");
              setSaveMessage("");
            }}
            rows={30}
            className={`min-h-[760px] resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-4 font-mono text-sm font-normal leading-7 text-slate-900 outline-none transition focus:ring-4 ${themeClasses[theme]}`}
          />
        </label>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/projects"
            className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-500"
          >
            프로젝트 목록으로
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProjectInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-slate-900">{value || "아직 입력하지 않음"}</dd>
    </div>
  );
}

function getDraftStatus(updatedAt: string | undefined, hasUnsavedChanges: boolean) {
  if (hasUnsavedChanges) {
    return { label: "저장 필요", className: "bg-amber-100 text-amber-800" };
  }

  if (updatedAt) {
    return { label: "저장됨", className: "bg-emerald-100 text-emerald-800" };
  }

  return { label: "저장 전", className: "bg-slate-200 text-slate-700" };
}

function waitForSavingFeedback() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 600);
  });
}
