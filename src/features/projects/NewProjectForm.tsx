"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { createProjectId, type ProjectDraft, type SavedProject } from "@/features/projects/projectStorage";
import { readLocalProjects } from "@/features/projects/localProjectStorage";
import { saveProjectEverywhere } from "@/features/projects/remoteProjectStorage";

const initialForm: ProjectDraft = {
  title: "",
  organization: "",
  audience: "",
  date: "",
  time: "",
  purpose: "",
  format: "오프라인 강의",
  notes: "",
};

const sampleForm: ProjectDraft = {
  title: "초등 고학년 강점발견 워크숍",
  organization: "꿈디초등학교",
  audience: "초등 5-6학년 30명",
  date: "2026-07-10",
  time: "90분",
  purpose: "아이들이 자신의 강점과 가능성을 발견하고 친구들 앞에서 표현하도록 돕는다.",
  format: "워크숍",
  notes: "사진 촬영 가능, 활동지 35부와 포스트잇, 필기구가 필요함",
};

const projectFlow = ["제안서", "강의 기획서", "자료수집", "결과보고서", "인터뷰", "블로그", "마케팅", "다운로드"];

export function NewProjectForm() {
  const [form, setForm] = useState<ProjectDraft>(initialForm);
  const [preview, setPreview] = useState<SavedProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const filledCount = useMemo(() => Object.values(form).filter((value) => value.trim()).length, [form]);

  function updateField(name: keyof ProjectDraft, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setSaveMessage("");
  }

  function fillSampleProject() {
    setForm(sampleForm);
    setPreview(null);
    setSaveMessage("예시 프로젝트를 입력했습니다. 필요한 부분을 고친 뒤 저장해 보세요.");
  }

  function clearForm() {
    setForm(initialForm);
    setPreview(null);
    setSaveMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setSaveMessage("프로젝트를 저장하는 중입니다...");

    const project: SavedProject = {
      ...form,
      title: form.title.trim() || "이름 없는 프로젝트",
      id: createProjectId(),
      createdAt: new Date().toISOString(),
    };
    const nextProjects = [project, ...readLocalProjects()];
    const saveResult = await saveProjectEverywhere(project, nextProjects);

    await waitForSavingFeedback();
    setPreview(project);
    setSaveMessage(saveResult.message);
    setForm(initialForm);
    setIsSaving(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="border-b border-slate-200 pb-5">
          <p className="text-sm font-bold text-emerald-700">프로젝트 기본 정보</p>
          <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">강의 프로젝트를 먼저 등록해요</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                브라우저에 먼저 저장하고, 로그인과 Supabase 설정이 있으면 서버에도 함께 저장합니다.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={fillSampleProject}
                className="inline-flex h-11 items-center justify-center rounded-md border border-amber-300 bg-amber-50 px-4 text-sm font-bold text-amber-900 hover:bg-amber-100"
              >
                예시로 채우기
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                비우기
              </button>
            </div>
          </div>
        </div>

        {saveMessage ? (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-bold text-emerald-900">
              {isSaving ? "저장 중입니다" : preview ? "프로젝트 저장 결과" : "안내"}
            </p>
            <p className="mt-2 text-sm font-semibold text-emerald-800">{saveMessage}</p>
            {preview ? (
              <Link
                href="/projects"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                저장된 프로젝트 보기
              </Link>
            ) : null}
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
          <p className="text-sm font-medium text-slate-600">입력한 항목: {filledCount} / 8개</p>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-12 items-center justify-center rounded-md bg-emerald-700 px-5 text-base font-semibold text-white hover:bg-emerald-800 disabled:bg-slate-400"
          >
            {isSaving ? "저장 중..." : "프로젝트 저장하기"}
          </button>
        </div>
      </form>

      <aside className="grid gap-5">
        <section className="rounded-lg border border-slate-200 bg-[#fffaf0] p-5 shadow-sm">
          <p className="text-sm font-bold text-amber-800">다음에 이어질 작업</p>
          <div className="mt-4 grid gap-2">
            {projectFlow.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-md border border-amber-200 bg-white p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-200 text-xs font-bold text-amber-950">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-slate-700">{step}</span>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
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
