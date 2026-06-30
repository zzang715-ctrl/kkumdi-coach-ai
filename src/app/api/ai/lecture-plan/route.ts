import type { SavedProject } from "@/features/projects/projectStorage";
import { createProjectAiRoute } from "@/lib/openaiServer";

export const POST = createProjectAiRoute({
  systemPrompt:
    "당신은 교육 강사와 코치를 돕는 한국어 AI 강사비서입니다. 실제 현장에서 바로 사용할 수 있는 강의 기획서를 명확하고 실용적인 문체로 작성합니다.",
  buildPrompt: buildLecturePlanPrompt,
});

function buildLecturePlanPrompt(project: SavedProject) {
  return `아래 프로젝트 정보를 바탕으로 강의 기획서 초안을 작성해 주세요.

조건:
- 한국어로 작성
- 교육 강사, 코치, 교회 교육 담당자, 워크숍 진행자가 바로 사용할 수 있게 작성
- 목적, 대상 이해, 운영 개요, 시간표, 활동 흐름, 준비물, 진행 메모, 강의 후 연결 작업 포함
- 너무 추상적인 말보다 실제 진행에 도움이 되는 문장 사용
- 저장된 제안서가 있으면 그 내용을 반영

프로젝트 정보:
- 프로젝트 이름: ${project.title || "미입력"}
- 기관명: ${project.organization || "미입력"}
- 강의 대상: ${project.audience || "미입력"}
- 강의 날짜: ${project.date || "미입력"}
- 강의 시간: ${project.time || "미입력"}
- 강의 형태: ${project.format || "미입력"}
- 강의 목적: ${project.purpose || "미입력"}
- 특이사항: ${project.notes || "미입력"}

저장된 제안서:
${project.proposalDraft || "아직 저장된 제안서가 없습니다."}`;
}
