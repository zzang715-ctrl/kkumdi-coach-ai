"use client";

import { useMemo, useState } from "react";

type DeploymentCheckGroup = {
  title: string;
  items: string[];
};

type DeploymentReadinessChecklistProps = {
  groups: DeploymentCheckGroup[];
};

const DEPLOY_CHECK_KEY = "kkumdi-coach-ai-deploy-checks";

export function DeploymentReadinessChecklist({ groups }: DeploymentReadinessChecklistProps) {
  const allItemIds = useMemo(
    () => groups.flatMap((group) => group.items.map((item) => getItemId(group.title, item))),
    [groups],
  );
  const [checkedIds, setCheckedIds] = useState<string[]>(readSavedChecks);
  const completedCount = checkedIds.filter((id) => allItemIds.includes(id)).length;
  const totalCount = allItemIds.length;
  const progressPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  function updateCheckedIds(nextIds: string[]) {
    setCheckedIds(nextIds);
    window.localStorage.setItem(DEPLOY_CHECK_KEY, JSON.stringify(nextIds));
  }

  function toggleItem(id: string) {
    updateCheckedIds(checkedIds.includes(id) ? checkedIds.filter((checkedId) => checkedId !== id) : [...checkedIds, id]);
  }

  function resetChecks() {
    updateCheckedIds([]);
  }

  function exportDeploymentReport() {
    const report = buildDeploymentReport(groups, checkedIds, completedCount, totalCount, progressPercent);
    const blob = new Blob([`\ufeff${report}`], { type: "text/markdown;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `deployment-readiness-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold text-emerald-800">배포 준비도</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            {completedCount} / {totalCount}개 준비됨
          </h2>
          <p className="mt-2 text-sm leading-6 text-emerald-950">
            Vercel 배포 전에 끝낸 항목을 체크하세요. 체크 상태는 이 브라우저에 저장됩니다.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={exportDeploymentReport}
            className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            배포 준비 결과 내보내기
          </button>
          <button
            type="button"
            onClick={resetChecks}
            className="inline-flex h-11 items-center justify-center rounded-md border border-emerald-300 bg-white px-4 text-sm font-bold text-emerald-900 transition hover:bg-emerald-100"
          >
            체크 초기화
          </button>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-emerald-700" style={{ width: `${progressPercent}%` }} />
      </div>
      <p className="mt-2 text-right text-sm font-bold text-emerald-800">{progressPercent}%</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {groups.map((group) => (
          <section key={group.title} className="rounded-md border border-emerald-200 bg-white p-4">
            <p className="text-sm font-bold text-slate-950">{group.title}</p>
            <div className="mt-3 grid gap-2">
              {group.items.map((item) => {
                const id = getItemId(group.title, item);
                const isChecked = checkedIds.includes(id);

                return (
                  <label key={id} className="flex cursor-pointer gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(id)}
                      className="mt-1 h-5 w-5 rounded border-slate-300 accent-emerald-700"
                    />
                    <span className={`text-sm font-semibold leading-6 ${isChecked ? "text-emerald-900" : "text-slate-700"}`}>
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

function getItemId(groupTitle: string, item: string) {
  return `${groupTitle}::${item}`;
}

function readSavedChecks() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(DEPLOY_CHECK_KEY);
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
}

function buildDeploymentReport(
  groups: DeploymentCheckGroup[],
  checkedIds: string[],
  completedCount: number,
  totalCount: number,
  progressPercent: number,
) {
  const lines = [
    "# 꿈디코치 AI 강사비서 배포 준비 결과",
    "",
    `- 내보낸 시간: ${new Date().toLocaleString("ko-KR")}`,
    `- 준비 완료: ${completedCount} / ${totalCount}`,
    `- 진행률: ${progressPercent}%`,
    "",
  ];

  groups.forEach((group) => {
    lines.push(`## ${group.title}`, "");

    group.items.forEach((item) => {
      const checked = checkedIds.includes(getItemId(group.title, item));
      lines.push(`- [${checked ? "x" : " "}] ${item}`);
    });

    lines.push("");
  });

  return lines.join("\n");
}
