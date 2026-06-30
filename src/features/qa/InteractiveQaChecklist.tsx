"use client";

import { useMemo, useState } from "react";

export type QaGroup = {
  title: string;
  items: string[];
};

type InteractiveQaChecklistProps = {
  groups: QaGroup[];
};

const QA_CHECK_KEY = "kkumdi-coach-ai-qa-checks";
const QA_NOTE_KEY = "kkumdi-coach-ai-qa-notes";

export function InteractiveQaChecklist({ groups }: InteractiveQaChecklistProps) {
  const allItemIds = useMemo(
    () => groups.flatMap((group) => group.items.map((item) => getItemId(group.title, item))),
    [groups],
  );
  const [checkedIds, setCheckedIds] = useState<string[]>(readSavedChecks);
  const [issueNotes, setIssueNotes] = useState(readSavedNotes);
  const completedCount = checkedIds.filter((id) => allItemIds.includes(id)).length;
  const totalCount = allItemIds.length;
  const progressPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  function updateCheckedIds(nextIds: string[]) {
    setCheckedIds(nextIds);
    window.localStorage.setItem(QA_CHECK_KEY, JSON.stringify(nextIds));
  }

  function toggleItem(id: string) {
    updateCheckedIds(checkedIds.includes(id) ? checkedIds.filter((checkedId) => checkedId !== id) : [...checkedIds, id]);
  }

  function checkAll() {
    updateCheckedIds(allItemIds);
  }

  function resetAll() {
    updateCheckedIds([]);
  }

  function updateIssueNotes(nextNotes: string) {
    setIssueNotes(nextNotes);
    window.localStorage.setItem(QA_NOTE_KEY, nextNotes);
  }

  function exportQaReport() {
    const report = buildQaReport(groups, checkedIds, completedCount, totalCount, progressPercent, issueNotes);
    const blob = new Blob([`\ufeff${report}`], { type: "text/markdown;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `qa-report-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-5">
      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-700">QA 진행률</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              {completedCount} / {totalCount}개 확인 완료
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              체크한 항목은 이 브라우저에 저장됩니다. 새로고침해도 체크 상태가 유지됩니다.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={exportQaReport}
              className="inline-flex h-11 items-center justify-center rounded-md border border-sky-200 bg-white px-4 text-sm font-bold text-sky-800 transition hover:bg-sky-50"
            >
              QA 결과 내보내기
            </button>
            <button
              type="button"
              onClick={checkAll}
              className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              모두 완료 표시
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
            >
              체크 초기화
            </button>
          </div>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-700" style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="mt-2 text-right text-sm font-bold text-emerald-800">{progressPercent}%</p>
      </article>

      <article className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <p className="text-sm font-bold text-amber-800">QA 문제 메모</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">고쳐야 할 내용을 적어두세요</h2>
        <p className="mt-2 text-sm leading-6 text-amber-950">
          예: 저장 버튼 문구가 헷갈림, 모바일에서 제목이 너무 큼, Supabase 테스트 설명이 어렵게 느껴짐
        </p>
        <textarea
          value={issueNotes}
          onChange={(event) => updateIssueNotes(event.target.value)}
          rows={6}
          placeholder="QA 중 발견한 문제를 적어두세요."
          className="mt-4 w-full resize-y rounded-md border border-amber-200 bg-white px-3 py-3 text-sm leading-7 text-slate-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
        />
        <p className="mt-2 text-xs font-bold text-amber-900">
          현재 {issueNotes.trim().length.toLocaleString("ko-KR")}자 작성됨. QA 결과 내보내기 파일에도 함께 들어갑니다.
        </p>
      </article>

      <div className="grid gap-5 lg:grid-cols-2">
        {groups.map((group) => (
          <article key={group.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">{group.title}</p>
            <div className="mt-4 grid gap-2">
              {group.items.map((item, index) => {
                const id = getItemId(group.title, item);
                const isChecked = checkedIds.includes(id);

                return (
                  <label
                    key={item}
                    className={`flex cursor-pointer gap-3 rounded-md border p-3 transition ${
                      isChecked ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(id)}
                      className="mt-1 h-5 w-5 rounded border-slate-300 accent-emerald-700"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-500">{index + 1}번 점검</p>
                      <p className={`mt-1 text-sm font-semibold leading-6 ${isChecked ? "text-emerald-900" : "text-slate-800"}`}>
                        {item}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
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
    const saved = window.localStorage.getItem(QA_CHECK_KEY);
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
}

function readSavedNotes() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(QA_NOTE_KEY) ?? "";
}

function buildQaReport(
  groups: QaGroup[],
  checkedIds: string[],
  completedCount: number,
  totalCount: number,
  progressPercent: number,
  issueNotes: string,
) {
  const lines = [
    "# 꿈디코치 AI 강사비서 QA 결과",
    "",
    `- 내보낸 시간: ${new Date().toLocaleString("ko-KR")}`,
    `- 완료 항목: ${completedCount} / ${totalCount}`,
    `- 진행률: ${progressPercent}%`,
    "",
    "## QA 문제 메모",
    "",
    issueNotes.trim() || "작성된 문제 메모가 없습니다.",
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
