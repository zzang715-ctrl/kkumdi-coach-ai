import type { SavedProject } from "@/features/projects/projectStorage";

export const workflowSteps = [
  { id: "proposal", label: "제안서", href: "proposal" },
  { id: "lecture-plan", label: "강의 기획서", href: "lecture-plan" },
  { id: "data-collection", label: "자료수집", href: "data-collection" },
  { id: "result-report", label: "결과보고서", href: "result-report" },
  { id: "interview", label: "인터뷰", href: "interview" },
  { id: "blog", label: "블로그", href: "blog" },
  { id: "marketing", label: "마케팅", href: "marketing" },
  { id: "download", label: "다운로드", href: "download" },
];

export const completableStepCount = workflowSteps.filter((step) => step.id !== "download").length;

export function countCompletedSteps(project?: SavedProject) {
  return workflowSteps.filter((step) => step.id !== "download" && isStepCompleted(step.id, project)).length;
}

export function getNextWorkflowStep(project: SavedProject) {
  return workflowSteps.find((step) => step.id !== "download" && !isStepCompleted(step.id, project)) ?? workflowSteps.at(-1);
}

export function getProjectProgressPercent(project?: SavedProject) {
  return Math.round((countCompletedSteps(project) / completableStepCount) * 100);
}

export function isStepCompleted(stepId: string, project?: SavedProject) {
  if (!project) {
    return false;
  }

  switch (stepId) {
    case "proposal":
      return Boolean(project.proposalDraft?.trim());
    case "lecture-plan":
      return Boolean(project.lecturePlanDraft?.trim());
    case "data-collection":
      return Boolean(project.dataCollection?.summary?.trim());
    case "result-report":
      return Boolean(project.resultReportDraft?.trim());
    case "interview":
      return Boolean(project.interviewDraft?.trim());
    case "blog":
      return Boolean(project.blogDraft?.trim());
    case "marketing":
      return Boolean(project.marketingDraft?.trim());
    default:
      return false;
  }
}
