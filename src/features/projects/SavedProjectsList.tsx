"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { createProjectId, type SavedProject } from "@/features/projects/projectStorage";
import { formatProjectDate, readLocalProjects, removeLocalProject, writeLocalProjects } from "@/features/projects/localProjectStorage";
import {
  completableStepCount,
  countCompletedSteps,
  getNextWorkflowStep,
  getProjectProgressPercent,
  isStepCompleted,
  workflowSteps,
} from "@/features/projects/projectProgress";
import { deleteRemoteProject, listRemoteProjects, saveProjectEverywhere, syncLocalProjectsToRemote } from "@/features/projects/remoteProjectStorage";

type ProjectStatusFilter = "all" | "in-progress" | "completed";
type ProjectSortMode = "newest" | "oldest" | "recent-work" | "progress-high" | "progress-low";

export function SavedProjectsList() {
  const [projects, setProjects] = useState<SavedProject[]>(() => readLocalProjects());
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("all");
  const [sortMode, setSortMode] = useState<ProjectSortMode>("newest");
  const [syncMessage, setSyncMessage] = useState("브라우저 저장소에서 프로젝트를 불러왔습니다.");
  const [isLoadingRemote, setIsLoadingRemote] = useState(false);
  const [isSyncingRemote, setIsSyncingRemote] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const filteredProjects = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    const matchedProjects = projects.filter((project) => {
      const progressPercent = getProjectProgressPercent(project);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && progressPercent === 100) ||
        (statusFilter === "in-progress" && progressPercent < 100);

      if (!matchesStatus) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return [project.title, project.organization, project.audience, project.date, project.purpose, project.notes]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });

    return [...matchedProjects].sort((a, b) => {
      if (sortMode === "oldest") {
        return a.createdAt.localeCompare(b.createdAt);
      }

      if (sortMode === "progress-high") {
        return getProjectProgressPercent(b) - getProjectProgressPercent(a);
      }

      if (sortMode === "progress-low") {
        return getProjectProgressPercent(a) - getProjectProgressPercent(b);
      }

      if (sortMode === "recent-work") {
        return getProjectLastUpdatedAt(b).localeCompare(getProjectLastUpdatedAt(a));
      }

      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [projects, searchKeyword, statusFilter, sortMode]);

  const summary = useMemo(() => {
    const total = projects.length;
    const completedProjects = projects.filter((project) => countCompletedSteps(project) === completableStepCount).length;
    const averageProgress = total
      ? Math.round(projects.reduce((sum, project) => sum + getProjectProgressPercent(project), 0) / total)
      : 0;

    return { total, completedProjects, averageProgress };
  }, [projects]);

  useEffect(() => {
    let isMounted = true;

    async function loadRemoteProjects() {
      setIsLoadingRemote(true);

      try {
        const remoteProjects = await listRemoteProjects();

        if (!isMounted) {
          return;
        }

        if (remoteProjects.length > 0) {
          setProjects(remoteProjects);
          writeLocalProjects(remoteProjects);
          setSyncMessage("Supabase에서 저장된 프로젝트를 불러왔습니다.");
        } else {
          setSyncMessage("Supabase에는 아직 저장된 프로젝트가 없습니다. 지금은 브라우저 저장소를 사용합니다.");
        }
      } catch {
        if (isMounted) {
          setSyncMessage("로그인 또는 Supabase 설정이 없어 브라우저 저장소를 사용 중입니다.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingRemote(false);
        }
      }
    }

    loadRemoteProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  async function syncToRemote() {
    setIsSyncingRemote(true);
    setSyncMessage("Supabase 서버에 프로젝트를 저장하는 중입니다...");

    try {
      const syncedCount = await syncLocalProjectsToRemote(projects);
      setSyncMessage(`Supabase 서버에 프로젝트 ${syncedCount}개를 저장했습니다.`);
    } catch {
      setSyncMessage("서버 저장에 실패했습니다. 로그인 상태 또는 Supabase 설정을 확인해 주세요.");
    } finally {
      setIsSyncingRemote(false);
    }
  }

  async function duplicateProject(project: SavedProject) {
    const copiedProject: SavedProject = {
      ...project,
      id: createProjectId(),
      title: `${project.title} 복사본`,
      createdAt: new Date().toISOString(),
    };
    const nextProjects = [copiedProject, ...projects];
    const saveResult = await saveProjectEverywhere(copiedProject, nextProjects);

    setProjects(nextProjects);
    setSyncMessage(`"${project.title}" 프로젝트를 복제했습니다. ${saveResult.message}`);
  }

  function exportProjects() {
    const content = JSON.stringify(
      {
        app: "꿈디코치 AI 강사비서",
        exportedAt: new Date().toISOString(),
        projects,
      },
      null,
      2,
    );
    const blob = new Blob([`\ufeff${content}`], { type: "application/json;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kkumdi-projects-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    setSyncMessage("프로젝트 백업 파일을 다운로드했습니다.");
  }

  function openImportPicker() {
    importInputRef.current?.click();
  }

  async function importProjects(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { projects?: unknown };
      const importedProjects = Array.isArray(parsed.projects) ? parsed.projects : Array.isArray(parsed) ? parsed : [];
      const validProjects = importedProjects.filter(isSavedProject);

      if (validProjects.length === 0) {
        setSyncMessage("가져올 수 있는 프로젝트가 없습니다. 백업 파일을 확인해 주세요.");
        return;
      }

      const mergedProjects = mergeProjects(validProjects, projects);
      writeLocalProjects(mergedProjects);
      setProjects(mergedProjects);
      setSyncMessage(`백업 파일에서 프로젝트 ${validProjects.length}개를 가져왔습니다.`);
    } catch {
      setSyncMessage("백업 파일을 읽지 못했습니다. JSON 파일인지 확인해 주세요.");
    }
  }

  async function deleteOneProject(project: SavedProject) {
    const confirmed = window.confirm(`"${project.title}" 프로젝트를 삭제할까요?`);

    if (!confirmed) {
      return;
    }

    const nextProjects = removeLocalProject(project.id);
    setProjects(nextProjects);
    setSyncMessage("브라우저에서 프로젝트를 삭제했습니다.");

    try {
      await deleteRemoteProject(project.id);
      setSyncMessage("브라우저와 Supabase에서 프로젝트를 삭제했습니다.");
    } catch {
      setSyncMessage("브라우저에서는 삭제했습니다. Supabase 삭제는 로그인 또는 설정이 필요합니다.");
    }
  }

  async function clearProjects() {
    const confirmed = window.confirm("모든 프로젝트를 삭제할까요?");

    if (!confirmed) {
      return;
    }

    const projectsToDelete = projects;
    writeLocalProjects([]);
    setProjects([]);
    setSearchKeyword("");
    setStatusFilter("all");
    setSortMode("newest");
    setSyncMessage("브라우저에 저장된 프로젝트를 모두 삭제했습니다.");

    try {
      await Promise.all(projectsToDelete.map((project) => deleteRemoteProject(project.id)));
      setSyncMessage("브라우저와 Supabase 프로젝트를 모두 삭제했습니다.");
    } catch {
      setSyncMessage("브라우저 프로젝트는 삭제했습니다. Supabase 삭제는 로그인 또는 설정이 필요합니다.");
    }
  }

  if (projects.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-500">저장된 프로젝트 0개</p>
        <h2 className="mt-3 text-2xl font-bold text-slate-950">아직 만든 프로젝트가 없습니다</h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-600">
          {isLoadingRemote ? "Supabase 프로젝트를 확인하는 중입니다..." : syncMessage}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            href="/projects/new"
            className="inline-flex h-12 items-center justify-center rounded-md bg-emerald-700 px-5 text-base font-semibold text-white hover:bg-emerald-800"
          >
            새 프로젝트 만들기
          </Link>
          <button
            type="button"
            onClick={openImportPicker}
            className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-base font-semibold text-slate-900 hover:border-slate-500"
          >
            백업 가져오기
          </button>
        </div>
        <input ref={importInputRef} type="file" accept="application/json,.json" onChange={importProjects} className="hidden" />
      </section>
    );
  }

  return (
    <section className="grid gap-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-700">저장된 프로젝트 {projects.length}개</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">내 강의 프로젝트</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isLoadingRemote ? "Supabase 프로젝트를 확인하는 중입니다..." : syncMessage}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
            <button
              type="button"
              onClick={syncToRemote}
              disabled={isSyncingRemote}
              className="inline-flex h-11 items-center justify-center rounded-md border border-emerald-200 bg-white px-4 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSyncingRemote ? "서버 저장 중..." : "브라우저 프로젝트 서버에 저장"}
            </button>
            <button
              type="button"
              onClick={exportProjects}
              className="inline-flex h-11 items-center justify-center rounded-md border border-sky-200 bg-white px-4 text-sm font-semibold text-sky-800 hover:bg-sky-50"
            >
              백업 내보내기
            </button>
            <button
              type="button"
              onClick={openImportPicker}
              className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              백업 가져오기
            </button>
            <button
              type="button"
              onClick={clearProjects}
              className="inline-flex h-11 items-center justify-center rounded-md border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 hover:bg-rose-50"
            >
              전체 삭제
            </button>
          </div>
        </div>

        <input ref={importInputRef} type="file" accept="application/json,.json" onChange={importProjects} className="hidden" />

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <SummaryCard label="전체 프로젝트" value={`${summary.total}개`} />
          <SummaryCard label="완료 프로젝트" value={`${summary.completedProjects}개`} />
          <SummaryCard label="평균 진행률" value={`${summary.averageProgress}%`} />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_180px_180px]">
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            프로젝트 검색
            <input
              type="search"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="프로젝트 이름, 기관명, 대상, 날짜로 검색"
              className="h-12 rounded-md border border-slate-300 bg-white px-3 text-base outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            상태 보기
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as ProjectStatusFilter)}
              className="h-12 rounded-md border border-slate-300 bg-white px-3 text-base outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="all">전체</option>
              <option value="in-progress">진행 중</option>
              <option value="completed">완료</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            정렬
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as ProjectSortMode)}
              className="h-12 rounded-md border border-slate-300 bg-white px-3 text-base outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="newest">최근 생성순</option>
              <option value="oldest">오래된순</option>
              <option value="recent-work">최근 작업순</option>
              <option value="progress-high">진행률 높은순</option>
              <option value="progress-low">진행률 낮은순</option>
            </select>
          </label>
        </div>

        <p className="mt-2 text-sm font-semibold text-slate-600">현재 표시: {filteredProjects.length}개</p>
      </div>

      {filteredProjects.length === 0 ? (
        <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-500">검색 결과 없음</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">조건과 일치하는 프로젝트가 없습니다</h2>
          <button
            type="button"
            onClick={() => {
              setSearchKeyword("");
              setStatusFilter("all");
              setSortMode("newest");
            }}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 hover:border-slate-500"
          >
            조건 초기화
          </button>
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDuplicate={() => duplicateProject(project)}
              onDelete={() => deleteOneProject(project)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function ProjectCard({
  project,
  onDuplicate,
  onDelete,
}: {
  project: SavedProject;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const completedCount = countCompletedSteps(project);
  const nextStep = getNextWorkflowStep(project);
  const progressPercent = getProjectProgressPercent(project);
  const isCompletedProject = completedCount === completableStepCount;
  const lastUpdatedAt = getProjectLastUpdatedAt(project);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-slate-500">생성일 {formatProjectDate(project.createdAt)}</p>
            <span
              className={`rounded-full px-2 py-1 text-xs font-bold ${
                isCompletedProject ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {isCompletedProject ? "완료" : "진행 중"}
            </span>
          </div>
          <h3 className="mt-2 text-xl font-bold text-slate-950">{project.title}</h3>
          <p className="mt-1 text-sm font-bold text-emerald-700">최근 작업 {formatProjectDate(lastUpdatedAt)}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {project.organization || "기관 미입력"} · {project.audience || "대상 미입력"} · {project.date || "날짜 미입력"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-slate-950 px-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            프로젝트 홈
          </Link>
          <Link
            href={`/projects/${project.id}/edit`}
            className="inline-flex h-10 w-fit items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            기본 정보 수정
          </Link>
          <button
            type="button"
            onClick={onDuplicate}
            className="inline-flex h-10 w-fit items-center justify-center rounded-md border border-sky-200 bg-white px-3 text-sm font-semibold text-sky-800 hover:bg-sky-50"
          >
            복제
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-10 w-fit items-center justify-center rounded-md border border-rose-200 bg-white px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          >
            이 프로젝트 삭제
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-emerald-100 bg-emerald-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-emerald-900">
            진행률 {completedCount} / {completableStepCount} 완료
          </p>
          <span className="text-sm font-bold text-emerald-800">{progressPercent}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-emerald-700" style={{ width: `${progressPercent}%` }} />
        </div>
        {nextStep ? (
          <Link
            href={`/projects/${project.id}/${nextStep.href}`}
            className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-md bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            다음 단계: {nextStep.label}
          </Link>
        ) : null}
      </div>

      <div className="mt-5 grid gap-2">
        {workflowSteps.map((step, index) => {
          const isCompleted = isStepCompleted(step.id, project);
          const isNext = nextStep?.id === step.id;
          const status = getStepStatus(isCompleted, isNext, step.id === "download");

          return (
            <Link
              key={step.href}
              href={`/projects/${project.id}/${step.href}`}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold hover:bg-emerald-50 ${
                isNext ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"
              }`}
            >
              <span
                className={`flex h-6 min-w-8 items-center justify-center rounded-md px-1 text-xs ${
                  isCompleted ? "bg-emerald-700 text-white" : isNext ? "bg-slate-900 text-white" : "bg-white text-slate-600"
                }`}
              >
                {isCompleted ? "완료" : index + 1}
              </span>
              <span className="flex-1">
                {index + 1}단계 {step.label}
              </span>
              <span className={status.className}>{status.label}</span>
            </Link>
          );
        })}
      </div>
    </article>
  );
}

function getStepStatus(completed: boolean, isNext: boolean, isDownload: boolean) {
  if (completed) {
    return { label: "작성됨", className: "text-emerald-700" };
  }

  if (isNext) {
    return { label: "다음", className: "text-emerald-700" };
  }

  if (isDownload) {
    return { label: "마지막", className: "text-slate-500" };
  }

  return { label: "대기", className: "text-slate-500" };
}

function isSavedProject(value: unknown): value is SavedProject {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const project = value as Partial<SavedProject>;
  return typeof project.id === "string" && typeof project.title === "string" && typeof project.createdAt === "string";
}

function mergeProjects(importedProjects: SavedProject[], currentProjects: SavedProject[]) {
  const projectMap = new Map<string, SavedProject>();

  [...currentProjects, ...importedProjects].forEach((project) => {
    projectMap.set(project.id, project);
  });

  return Array.from(projectMap.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function getProjectLastUpdatedAt(project: SavedProject) {
  const dates = [
    project.createdAt,
    project.proposalUpdatedAt,
    project.lecturePlanUpdatedAt,
    project.dataCollectionUpdatedAt,
    project.resultReportUpdatedAt,
    project.interviewUpdatedAt,
    project.blogUpdatedAt,
    project.marketingUpdatedAt,
  ].filter((value): value is string => Boolean(value));

  return dates.sort((a, b) => b.localeCompare(a))[0] ?? project.createdAt;
}
