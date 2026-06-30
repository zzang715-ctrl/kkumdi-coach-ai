import type { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabaseClient";
import { writeLocalProjects } from "@/features/projects/localProjectStorage";
import type { SavedProject } from "@/features/projects/projectStorage";

type ProjectContent = Pick<
  SavedProject,
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

type ProjectRow = {
  id: string;
  user_id: string;
  title: string;
  organization: string;
  audience: string;
  date: string;
  time: string;
  purpose: string;
  format: string;
  notes: string;
  content: ProjectContent | null;
  created_at: string;
  updated_at: string;
};

export async function listRemoteProjects() {
  const supabase = createBrowserSupabaseClient();
  const userId = await getCurrentUserId(supabase);

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ProjectRow[]).map(fromProjectRow);
}

export async function upsertRemoteProject(project: SavedProject) {
  const supabase = createBrowserSupabaseClient();
  const userId = await getCurrentUserId(supabase);

  if (!userId) {
    throw new Error("로그인한 사용자만 프로젝트를 서버에 저장할 수 있습니다.");
  }

  const { error } = await supabase.from("projects").upsert(toProjectRow(project, userId), { onConflict: "id" });

  if (error) {
    throw new Error(error.message);
  }
}

export async function syncLocalProjectsToRemote(projects: SavedProject[]) {
  const supabase = createBrowserSupabaseClient();
  const userId = await getCurrentUserId(supabase);

  if (!userId) {
    throw new Error("로그인한 사용자만 프로젝트를 서버에 저장할 수 있습니다.");
  }

  if (projects.length === 0) {
    return 0;
  }

  const rows = projects.map((project) => toProjectRow(project, userId));
  const { error } = await supabase.from("projects").upsert(rows, { onConflict: "id" });

  if (error) {
    throw new Error(error.message);
  }

  return projects.length;
}

export async function deleteRemoteProject(projectId: string) {
  const supabase = createBrowserSupabaseClient();
  const userId = await getCurrentUserId(supabase);

  if (!userId) {
    throw new Error("로그인한 사용자만 프로젝트를 삭제할 수 있습니다.");
  }

  const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function saveProjectEverywhere(project: SavedProject, nextProjects: SavedProject[]) {
  writeLocalProjects(nextProjects);

  try {
    await upsertRemoteProject(project);
    return {
      remoteSaved: true,
      message: "브라우저와 Supabase 서버에 함께 저장되었습니다.",
    };
  } catch {
    return {
      remoteSaved: false,
      message: "브라우저에는 저장되었습니다. 서버 저장은 로그인 또는 Supabase 설정이 필요합니다.",
    };
  }
}

async function getCurrentUserId(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return user?.id ?? null;
}

function toProjectRow(project: SavedProject, userId: string): ProjectRow {
  const updatedAt = getProjectLastUpdatedAt(project);

  return {
    id: project.id,
    user_id: userId,
    title: project.title,
    organization: project.organization,
    audience: project.audience,
    date: project.date,
    time: project.time,
    purpose: project.purpose,
    format: project.format,
    notes: project.notes,
    content: toProjectContent(project),
    created_at: project.createdAt,
    updated_at: updatedAt,
  };
}

function fromProjectRow(row: ProjectRow): SavedProject {
  const content = row.content ?? {};

  return {
    id: row.id,
    title: row.title,
    organization: row.organization,
    audience: row.audience,
    date: row.date,
    time: row.time,
    purpose: row.purpose,
    format: row.format,
    notes: row.notes,
    createdAt: row.created_at,
    proposalDraft: content.proposalDraft,
    proposalUpdatedAt: content.proposalUpdatedAt,
    lecturePlanDraft: content.lecturePlanDraft,
    lecturePlanUpdatedAt: content.lecturePlanUpdatedAt,
    dataCollection: content.dataCollection,
    dataCollectionUpdatedAt: content.dataCollectionUpdatedAt,
    resultReportDraft: content.resultReportDraft,
    resultReportUpdatedAt: content.resultReportUpdatedAt,
    interviewDraft: content.interviewDraft,
    interviewUpdatedAt: content.interviewUpdatedAt,
    blogDraft: content.blogDraft,
    blogUpdatedAt: content.blogUpdatedAt,
    marketingDraft: content.marketingDraft,
    marketingUpdatedAt: content.marketingUpdatedAt,
  };
}

function toProjectContent(project: SavedProject): ProjectContent {
  return {
    proposalDraft: project.proposalDraft,
    proposalUpdatedAt: project.proposalUpdatedAt,
    lecturePlanDraft: project.lecturePlanDraft,
    lecturePlanUpdatedAt: project.lecturePlanUpdatedAt,
    dataCollection: project.dataCollection,
    dataCollectionUpdatedAt: project.dataCollectionUpdatedAt,
    resultReportDraft: project.resultReportDraft,
    resultReportUpdatedAt: project.resultReportUpdatedAt,
    interviewDraft: project.interviewDraft,
    interviewUpdatedAt: project.interviewUpdatedAt,
    blogDraft: project.blogDraft,
    blogUpdatedAt: project.blogUpdatedAt,
    marketingDraft: project.marketingDraft,
    marketingUpdatedAt: project.marketingUpdatedAt,
  };
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
