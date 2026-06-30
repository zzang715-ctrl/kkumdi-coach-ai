"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import type { DataCollectionPhoto, SavedProject } from "@/features/projects/projectStorage";
import { findLocalProject, formatProjectDate, updateLocalProject } from "@/features/projects/localProjectStorage";
import { getNextWorkflowStep } from "@/features/projects/projectProgress";
import { ProjectWorkflowNav } from "@/features/projects/ProjectWorkflowNav";
import { saveProjectEverywhere } from "@/features/projects/remoteProjectStorage";

type DataCollectionViewProps = {
  projectId: string;
};

type DataCollectionForm = NonNullable<SavedProject["dataCollection"]>;

type AiResponse = {
  text?: string;
  error?: string;
};

const maxPhotoCount = 6;
const maxPhotoSize = 1.5 * 1024 * 1024;

const emptyDataCollection: DataCollectionForm = {
  photoNotes: "",
  photos: [],
  fieldNotes: "",
  studentReactions: "",
  strengthPoints: "",
  keywords: "",
  summary: "",
};

export function DataCollectionView({ projectId }: DataCollectionViewProps) {
  const initialProject = useMemo(() => findLocalProject(projectId), [projectId]);
  const [project, setProject] = useState<SavedProject | null>(initialProject);
  const [form, setForm] = useState<DataCollectionForm>(initialProject?.dataCollection ?? emptyDataCollection);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [photoMessage, setPhotoMessage] = useState("");

  const collectedCount = useMemo(() => {
    const textCount = Object.entries(form).filter(([key, value]) => {
      return key !== "summary" && key !== "photos" && typeof value === "string" && value.trim().length > 0;
    }).length;
    return textCount + (form.photos?.length ? 1 : 0);
  }, [form]);
  const maybeProject = project;
  const hasUnsavedChanges = Boolean(
    maybeProject?.dataCollectionUpdatedAt && JSON.stringify(form) !== JSON.stringify(maybeProject.dataCollection ?? emptyDataCollection),
  );
  const saveStatus = getSaveStatus(maybeProject?.dataCollectionUpdatedAt, hasUnsavedChanges);

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
        <Link
          href="/projects"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-emerald-700 px-5 text-base font-semibold text-white"
        >
          저장된 프로젝트 보기
        </Link>
      </section>
    );
  }

  const currentProject = maybeProject;
  const nextStep = saved ? getNextWorkflowStep(currentProject) : null;

  function updateField(name: keyof DataCollectionForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setSaved(false);
    setAiError("");
    setSaveMessage("");
  }

  async function addPhotos(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    setPhotoMessage("");
    const currentPhotos = form.photos ?? [];
    const remainingSlots = maxPhotoCount - currentPhotos.length;

    if (remainingSlots <= 0) {
      setPhotoMessage(`사진은 최대 ${maxPhotoCount}장까지 올릴 수 있습니다.`);
      return;
    }

    const selectedFiles = Array.from(files).slice(0, remainingSlots);
    const validFiles = selectedFiles.filter((file) => file.type.startsWith("image/") && file.size <= maxPhotoSize);

    if (validFiles.length < selectedFiles.length) {
      setPhotoMessage("이미지 파일만 올릴 수 있고, 사진 한 장은 1.5MB 이하여야 합니다.");
    }

    if (validFiles.length === 0) {
      return;
    }

    const nextPhotos = await Promise.all(validFiles.map(toPhoto));
    setForm((current) => ({ ...current, photos: [...(current.photos ?? []), ...nextPhotos] }));
    setSaved(false);
    setAiError("");
    setSaveMessage("");
  }

  function updatePhotoNote(photoId: string, note: string) {
    setForm((current) => ({
      ...current,
      photos: (current.photos ?? []).map((photo) => (photo.id === photoId ? { ...photo, note } : photo)),
    }));
    setSaved(false);
    setAiError("");
    setSaveMessage("");
  }

  function removePhoto(photoId: string) {
    setForm((current) => ({ ...current, photos: (current.photos ?? []).filter((photo) => photo.id !== photoId) }));
    setSaved(false);
    setAiError("");
    setSaveMessage("");
    setPhotoMessage("사진을 목록에서 삭제했습니다. 저장을 눌러 반영해 주세요.");
  }

  function buildBasicSummary() {
    setForm((current) => ({ ...current, summary: createSummary(currentProject, current) }));
    setSaved(false);
    setSaveMessage("기본 요약을 만들었습니다. 내용을 확인한 뒤 저장해 주세요.");
  }

  async function organizeWithAI() {
    setIsGenerating(true);
    setAiError("");
    setSaved(false);
    setSaveMessage("");

    try {
      const response = await fetch("/api/ai/data-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: { ...currentProject, dataCollection: form } }),
      });
      const data = (await response.json()) as AiResponse;

      if (!response.ok || !data.text) {
        setAiError(data.error || "AI가 자료수집 내용을 정리하지 못했습니다. 결제 전에는 기본 요약 만들기를 사용해 주세요.");
        return;
      }

      setForm((current) => ({ ...current, summary: data.text || current.summary }));
    } catch {
      setAiError("AI 서버와 연결하지 못했습니다. 결제 전에는 기본 요약 만들기로 흐름을 테스트할 수 있습니다.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setSaveMessage("자료수집 내용을 저장하는 중입니다...");

    const nextData = { ...form, summary: form.summary || createSummary(currentProject, form) };
    const nextProject: SavedProject = {
      ...currentProject,
      dataCollection: nextData,
      dataCollectionUpdatedAt: new Date().toISOString(),
    };
    const nextProjects = updateLocalProject(nextProject);
    const saveResult = await saveProjectEverywhere(nextProject, nextProjects);

    await waitForSavingFeedback();
    setProject(nextProject);
    setForm(nextData);
    setSaved(true);
    setSaveMessage(saveResult.message);
    setIsSaving(false);
  }

  function handleSaveShortcut(event: KeyboardEvent<HTMLFormElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();

      if (!isSaving && !isGenerating) {
        event.currentTarget.requestSubmit();
      }
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold text-teal-700">선택한 프로젝트</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">{currentProject.title}</h2>
        <dl className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
          <ProjectInfo label="기관" value={currentProject.organization} />
          <ProjectInfo label="대상" value={currentProject.audience} />
          <ProjectInfo label="날짜" value={currentProject.date} />
          <ProjectInfo label="시간" value={currentProject.time} />
        </dl>
        {currentProject.dataCollectionUpdatedAt ? (
          <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            마지막 저장 {formatProjectDate(currentProject.dataCollectionUpdatedAt)}
          </div>
        ) : null}
        <Link
          href={`/projects/${projectId}/edit`}
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          기본 정보 수정
        </Link>
        <ProjectWorkflowNav projectId={projectId} activeStep="data-collection" project={currentProject} />
      </aside>

      <form onSubmit={handleSubmit} onKeyDown={handleSaveShortcut} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-bold text-teal-700">자료수집 AI</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">사진, 메모, 관찰 기록 정리</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              현장 기록을 모아 결과보고서와 블로그의 재료로 정리합니다.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${saveStatus.className}`}>
                {saveStatus.label}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {currentProject.dataCollectionUpdatedAt
                  ? `마지막 저장 ${formatProjectDate(currentProject.dataCollectionUpdatedAt)}`
                  : "아직 저장 기록 없음"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:justify-end">
            <button
              type="button"
              onClick={organizeWithAI}
              disabled={isGenerating || isSaving}
              className="h-11 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white disabled:bg-slate-400"
            >
              {isGenerating ? "AI 정리 중..." : "AI로 정리하기"}
            </button>
            <button
              type="button"
              onClick={buildBasicSummary}
              disabled={isGenerating || isSaving}
              className="h-11 rounded-md border border-teal-200 bg-white px-4 text-sm font-semibold text-teal-800"
            >
              기본 요약 만들기
            </button>
            <button
              type="submit"
              disabled={isSaving || isGenerating}
              className="h-11 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white disabled:bg-slate-400"
            >
              {isSaving ? "저장 중..." : "자료 저장"}
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-900">사진 업로드 안내</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            사진은 현재 프로젝트에 함께 저장됩니다. 브라우저와 서버 저장을 안정적으로 유지하기 위해 최대 {maxPhotoCount}장,
            사진 한 장은 1.5MB 이하로 올려 주세요. AI는 사진 자체를 읽기보다 사진 메모와 설명을 바탕으로 정리합니다.
          </p>
        </div>

        {aiError ? <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">{aiError}</div> : null}
        {saved || saveMessage ? (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-bold text-emerald-900">{saved ? "자료수집 내용이 저장되었습니다." : "안내"}</p>
            {saveMessage ? <p className="mt-1 text-sm font-semibold text-emerald-800">{saveMessage}</p> : null}
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

        <section className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">현장 사진</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                활동 장면, 결과물, 분위기 사진을 올리고 사진별 메모를 남겨 주세요.
              </p>
            </div>
            <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
              사진 올리기
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) => {
                  void addPhotos(event.target.files);
                  event.target.value = "";
                }}
              />
            </label>
          </div>

          {photoMessage ? <p className="mt-3 text-sm font-semibold text-amber-800">{photoMessage}</p> : null}

          {form.photos?.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {form.photos.map((photo) => (
                <article key={photo.id} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  <Image
                    src={photo.dataUrl}
                    alt={photo.name}
                    width={360}
                    height={176}
                    unoptimized
                    className="h-44 w-full object-cover"
                  />
                  <div className="grid gap-3 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 truncate text-sm font-bold text-slate-900">{photo.name}</p>
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="shrink-0 rounded-md border border-rose-200 bg-white px-2 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50"
                      >
                        삭제
                      </button>
                    </div>
                    <label className="grid gap-1 text-xs font-bold text-slate-600">
                      사진 메모
                      <textarea
                        value={photo.note}
                        onChange={(event) => updatePhotoNote(photo.id, event.target.value)}
                        rows={3}
                        placeholder="예: 모둠별 발표 장면, 활동지 결과물, 아이들이 서로 설명하는 모습"
                        className="resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal leading-6 text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                      />
                    </label>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
              아직 올린 사진이 없습니다. 현장 사진을 올리면 이곳에 미리보기가 표시됩니다.
            </div>
          )}
        </section>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Textarea label="사진 설명" value={form.photoNotes} onChange={(value) => updateField("photoNotes", value)} placeholder="예: 발표 장면, 활동지 작성 모습" />
          <Textarea label="현장 메모" value={form.fieldNotes} onChange={(value) => updateField("fieldNotes", value)} placeholder="예: 활동이 시작되자 질문이 많아짐" />
          <Textarea label="참여자 반응" value={form.studentReactions} onChange={(value) => updateField("studentReactions", value)} placeholder="예: 서로 격려하는 분위기" />
          <Textarea label="강점 포인트" value={form.strengthPoints} onChange={(value) => updateField("strengthPoints", value)} placeholder="예: 발표 자신감, 협력, 창의적 표현" />
          <Textarea label="키워드" value={form.keywords} onChange={(value) => updateField("keywords", value)} placeholder="예: 진로, 강점, 발표" rows={3} />
        </div>

        <Textarea
          label="자료수집 요약"
          value={form.summary}
          onChange={(value) => updateField("summary", value)}
          placeholder="AI로 정리하기 또는 기본 요약 만들기를 누르면 요약을 만들 수 있습니다."
          rows={9}
          wide
        />
        <p className="mt-2 text-xs font-bold text-slate-500">
          요약 {form.summary.trim().length.toLocaleString("ko-KR")}자 · 입력 중 Ctrl+S를 누르면 바로 저장됩니다.
        </p>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-600">수집한 항목: {collectedCount} / 6개</p>
          <Link href="/projects" className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold">
            프로젝트 목록으로
          </Link>
        </div>
      </form>
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  wide = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
  wide?: boolean;
}) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-slate-800 ${wide ? "mt-4" : ""}`}>
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-base leading-7 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
      />
    </label>
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

function createSummary(project: SavedProject, form: DataCollectionForm) {
  const photoList = formatPhotoList(form.photos);

  return `[자료수집 요약]

${project.title || "강의 프로젝트"} 현장 기록을 정리했습니다.

1. 사진 및 장면 기록
${form.photoNotes || "사진 설명은 아직 입력하지 않았습니다."}

업로드한 사진 메모
${photoList || "업로드한 사진은 아직 없습니다."}

2. 현장 메모
${form.fieldNotes || "현장 메모는 아직 입력하지 않았습니다."}

3. 참여자 반응
${form.studentReactions || "참여자 반응은 추가 기록이 필요합니다."}

4. 강점 포인트
${form.strengthPoints || "강점 포인트는 추가 기록이 필요합니다."}

5. 핵심 키워드
${form.keywords || "핵심 키워드는 추가 정리가 필요합니다."}`;
}

function toPhoto(file: File): Promise<DataCollectionPhoto> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve({
        id: createPhotoId(),
        name: file.name,
        dataUrl: String(reader.result),
        note: "",
        createdAt: new Date().toISOString(),
      });
    };

    reader.onerror = () => reject(new Error("사진을 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });
}

function createPhotoId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatPhotoList(photos: DataCollectionPhoto[] | undefined) {
  return (photos ?? [])
    .map((photo, index) => `${index + 1}. ${photo.name}${photo.note ? ` - ${photo.note}` : ""}`)
    .join("\n");
}

function getSaveStatus(updatedAt: string | undefined, hasUnsavedChanges: boolean) {
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
