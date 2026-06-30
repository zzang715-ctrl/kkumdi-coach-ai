export type SavedProject = {
  id: string;
  title: string;
  organization: string;
  audience: string;
  date: string;
  time: string;
  purpose: string;
  format: string;
  notes: string;
  createdAt: string;
  proposalDraft?: string;
  proposalUpdatedAt?: string;
  lecturePlanDraft?: string;
  lecturePlanUpdatedAt?: string;
  dataCollection?: {
    photoNotes: string;
    fieldNotes: string;
    studentReactions: string;
    strengthPoints: string;
    keywords: string;
    summary: string;
  };
  dataCollectionUpdatedAt?: string;
  resultReportDraft?: string;
  resultReportUpdatedAt?: string;
  interviewDraft?: string;
  interviewUpdatedAt?: string;
  blogDraft?: string;
  blogUpdatedAt?: string;
  marketingDraft?: string;
  marketingUpdatedAt?: string;
};

export type ProjectDraft = Omit<
  SavedProject,
  | "id"
  | "createdAt"
  | "proposalDraft"
  | "proposalUpdatedAt"
  | "lecturePlanDraft"
  | "lecturePlanUpdatedAt"
  | "dataCollection"
  | "dataCollectionUpdatedAt"
  | "resultReportDraft"
  | "resultReportUpdatedAt"
  | "interviewDraft"
  | "interviewUpdatedAt"
  | "blogDraft"
  | "blogUpdatedAt"
  | "marketingDraft"
  | "marketingUpdatedAt"
>;

export const PROJECT_STORAGE_KEY = "kkumdi-coach-ai-projects";

export function createProjectId() {
  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
