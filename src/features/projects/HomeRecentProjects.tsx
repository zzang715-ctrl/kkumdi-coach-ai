"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatProjectDate, readLocalProjects } from "@/features/projects/localProjectStorage";
import { getNextWorkflowStep, getProjectProgressPercent } from "@/features/projects/projectProgress";
import type { SavedProject } from "@/features/projects/projectStorage";

export function HomeRecentProjects() {
  const [projects] = useState<SavedProject[]>(() => readLocalProjects());

  const recentProjects = useMemo(
    () => [...projects].sort((a, b) => getProjectLastUpdatedAt(b).localeCompare(getProjectLastUpdatedAt(a))).slice(0, 3),
    [projects],
  );

  if (recentProjects.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold text-emerald-700">최근 프로젝트</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">아직 이어서 할 프로젝트가 없습니다</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          새 프로젝트를 하나 만들면 다음부터 첫 화면에서 바로 이어서 작업할 수 있습니다.
        </p>
        <Link
          href="/projects/new"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          새 프로젝트 만들기
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-emerald-700">최근 프로젝트</p>
          <h3 className="mt-2 text-xl font-bold text-slate-950">바로 이어서 작업하기</h3>
        </div>
        <Link href="/projects" className="text-sm font-bold text-emerald-700 hover:text-emerald-900">
          전체 보기
        </Link>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {recentProjects.map((project) => {
          const progressPercent = getProjectProgressPercent(project);
          const nextStep = getNextWorkflowStep(project);
          const lastUpdatedAt = getProjectLastUpdatedAt(project);

          return (
            <article key={project.id} className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-500">최근 작업 {formatProjectDate(lastUpdatedAt)}</p>
              <h4 className="mt-2 text-base font-bold text-slate-950">{project.title}</h4>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {project.organization || "기관 미입력"} · {project.audience || "대상 미입력"}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-500">생성일 {formatProjectDate(project.createdAt)}</p>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span>진행률</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-emerald-700" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:border-slate-500"
                >
                  프로젝트 홈
                </Link>
                {nextStep ? (
                  <Link
                    href={`/projects/${project.id}/${nextStep.href}`}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    다음 단계: {nextStep.label}
                  </Link>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
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
