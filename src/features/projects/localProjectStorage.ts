import { PROJECT_STORAGE_KEY, type SavedProject } from "@/features/projects/projectStorage";

export function readLocalProjects() {
  if (typeof window === "undefined") {
    return [] as SavedProject[];
  }

  const rawProjects = window.localStorage.getItem(PROJECT_STORAGE_KEY);

  if (!rawProjects) {
    return [];
  }

  try {
    return JSON.parse(rawProjects) as SavedProject[];
  } catch {
    return [];
  }
}

export function writeLocalProjects(projects: SavedProject[]) {
  window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

export function findLocalProject(projectId: string) {
  return readLocalProjects().find((project) => project.id === projectId) ?? null;
}

export function updateLocalProject(nextProject: SavedProject) {
  const projects = readLocalProjects();
  const hasProject = projects.some((project) => project.id === nextProject.id);

  if (!hasProject) {
    return [nextProject, ...projects];
  }

  return projects.map((project) => (project.id === nextProject.id ? nextProject : project));
}

export function removeLocalProject(projectId: string) {
  const nextProjects = readLocalProjects().filter((project) => project.id !== projectId);
  writeLocalProjects(nextProjects);
  return nextProjects;
}

export function formatProjectDate(value: string) {
  if (!value) {
    return "날짜 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
