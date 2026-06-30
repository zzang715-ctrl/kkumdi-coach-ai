"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectDraft, SavedProject } from "@/features/projects/projectStorage";
import { findLocalProject, updateLocalProject } from "@/features/projects/localProjectStorage";
import { saveProjectEverywhere } from "@/features/projects/remoteProjectStorage";

type EditProjectFormProps = {
  projectId: string;
};

export function EditProjectForm({ projectId }: EditProjectFormProps) {
  const router = useRouter();
  const initialProject = useMemo(() => findLocalProject(projectId), [projectId]);
  const [project, setProject] = useState<SavedProject | null>(initialProject);
  const [form, setForm] = useState<ProjectDraft>(() => toProjectDraft(initialProject));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

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

  const currentProject = project;

  function updateField(name: keyof ProjectDraft, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("프로젝트 기본 정보를 저장하는 중입니다...");

    const nextProject: SavedProject = {
      ...currentProject,
      ...form,
      title: form.title.trim() || "이름 없는 프로젝트",
    };
    const nextProjects = updateLocalProject(nextProject);
    const saveResult = await saveProjectEverywhere(nextProject, nextProjects);

    await waitForSavingFeedback();
    setProject(nextProject);
    setMessage(saveResult.message);
    setIsSaving(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="border-b border-slate-200 pb-5">
          <p className="text-sm font-bold text-emerald-700">프로젝트 기본 정보</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{currentProject.title}</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            제목, 기관, 대상, 날짜처럼 모든 AI 작업에 함께 쓰이는 기본 정보를 수정합니다.
          </p>
        </div>

        {message ? (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-bold text-emerald-900">{isSaving ? "저장 중입니다" : "저장 결과"}</p>
            <p className="mt-2 text-sm font-semibold text-emerald-800">{message}</p>
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextInput
            label="프로젝트 이름"
            value={form.title}
            onChange={(value) => updateField("title", value)}
            placeholder="예: 초등 고학년 진로 워크숍"
          />
          <TextInput
            label="기관명"
            value={form.organization}
            onChange={(value) => updateField("organization", value)}
            placeholder="예: 꿈디초등학교"
          />
          <TextInput
            label="강의 대상"
            value={form.audience}
            onChange={(value) => updateField("audience", value)}
            placeholder="예: 초등 5-6학년 30명"
          />
          <TextInput label="강의 날짜" type="date" value={form.date} onChange={(value) => updateField("date", value)} />
          <TextInput
            label="강의 시간"
            value={form.time}
            onChange={(value) => updateField("time", value)}
            placeholder="예: 90분"
          />
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            강의 형태
            <select
              value={form.format}
              onChange={(event) => updateField("format", event.target.value)}
              className="h-12 rounded-md border border-slate-300 bg-white px-3 text-base"
            >
              <option>오프라인 강의</option>
              <option>온라인 강의</option>
              <option>워크숍</option>
              <option>캠프</option>
              <option>교회 교육</option>
            </select>
          </label>
        </div>

        <Textarea
          label="강의 목적"
          value={form.purpose}
          onChange={(value) => updateField("purpose", value)}
          placeholder="예: 아이들이 자신의 강점을 발견하도록 돕는다."
        />
        <Textarea
          label="특이사항"
          value={form.notes}
          onChange={(value) => updateField("notes", value)}
          placeholder="예: 사진 촬영 가능, 활동지 35부 필요"
        />

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-base font-semibold text-slate-900 hover:border-slate-500"
          >
            이전 화면으로
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-12 items-center justify-center rounded-md bg-emerald-700 px-5 text-base font-semibold text-white hover:bg-emerald-800 disabled:bg-slate-400"
          >
            {isSaving ? "저장 중..." : "기본 정보 저장"}
          </button>
        </div>
      </form>

      <aside className="h-fit rounded-lg border border-slate-200 bg-[#fffaf0] p-5 shadow-sm">
        <p className="text-sm font-bold text-amber-800">수정 후 영향</p>
        <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
          <p>기본 정보를 바꾸면 앞으로 새로 만드는 샘플 초안과 AI 초안에 수정된 정보가 반영됩니다.</p>
          <p>이미 저장한 제안서, 블로그, 보고서 내용은 자동으로 지워지지 않습니다.</p>
        </div>
        <Link
          href={`/projects/${projectId}/proposal`}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
        >
          제안서 화면으로
        </Link>
      </aside>
    </div>
  );
}

function toProjectDraft(project: SavedProject | null): ProjectDraft {
  return {
    title: project?.title ?? "",
    organization: project?.organization ?? "",
    audience: project?.audience ?? "",
    date: project?.date ?? "",
    time: project?.time ?? "",
    purpose: project?.purpose ?? "",
    format: project?.format ?? "오프라인 강의",
    notes: project?.notes ?? "",
  };
}

function TextInput({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-800">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-md border border-slate-300 bg-white px-3 text-base outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-800">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="resize-none rounded-md border border-slate-300 bg-white px-3 py-3 text-base leading-7 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function waitForSavingFeedback() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 600);
  });
}
