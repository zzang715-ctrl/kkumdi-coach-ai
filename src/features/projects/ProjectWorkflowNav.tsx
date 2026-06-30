import Link from "next/link";
import type { SavedProject } from "@/features/projects/projectStorage";
import { completableStepCount, countCompletedSteps, isStepCompleted, workflowSteps } from "@/features/projects/projectProgress";

type ProjectWorkflowNavProps = {
  projectId: string;
  activeStep: string;
  project?: SavedProject;
};

export function ProjectWorkflowNav({ projectId, activeStep, project }: ProjectWorkflowNavProps) {
  return (
    <nav className="mt-5 grid gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-500">프로젝트 작업 흐름</p>
        <span className="text-xs font-semibold text-emerald-700">
          {countCompletedSteps(project)} / {completableStepCount} 완료
        </span>
      </div>

      <Link
        href={`/projects/${projectId}`}
        className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-900 transition hover:bg-amber-100"
      >
        <span className="flex h-6 min-w-8 items-center justify-center rounded-md bg-amber-200 px-1 text-xs text-amber-950">
          홈
        </span>
        <span className="flex-1">프로젝트 홈</span>
      </Link>

      {workflowSteps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isCompleted = isStepCompleted(step.id, project);

        return (
          <Link
            key={step.id}
            href={`/projects/${projectId}/${step.href}`}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span
              className={`flex h-6 min-w-8 items-center justify-center rounded-md px-1 text-xs ${
                isCompleted
                  ? "bg-emerald-700 text-white"
                  : isActive
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              {isCompleted ? "완료" : index + 1}
            </span>
            <span className="flex-1">{step.label}</span>
            {isActive ? <span className="text-xs text-emerald-700">현재</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
