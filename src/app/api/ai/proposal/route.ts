import type { SavedProject } from "@/features/projects/projectStorage";
import { createProjectAiRoute } from "@/lib/openaiServer";

export const POST = createProjectAiRoute({
  systemPrompt:
    "당신은 교육 강사와 코치를 돕는 한국어 AI 강사비서입니다. 기관 제출용 강의 제안서를 명확하고 정중한 문체로 작성합니다.",
  buildPrompt: buildProposalPrompt,
});

function buildProposalPrompt(project: SavedProject) {
  return `아래 프로젝트 정보를 바탕으로 기관 제출용 강의 제안서 초안을 작성해 주세요.

조건:
- 한국어로 작성
- 기관 담당자가 이해하기 쉽게 작성
- 제목, 대상, 목적, 운영 개요, 활동 흐름, 기대 효과, 준비사항, 다음 단계 포함
- 너무 과장하지 말고 실제 제출 가능한 문장으로 작성

프로젝트 정보:
- 프로젝트 이름: ${project.title || "미입력"}
- 기관명: ${project.organization || "미입력"}
- 강의 대상: ${project.audience || "미입력"}
- 강의 날짜: ${project.date || "미입력"}
- 강의 시간: ${project.time || "미입력"}
- 강의 형태: ${project.format || "미입력"}
- 강의 목적: ${project.purpose || "미입력"}
- 특이사항: ${project.notes || "미입력"}`;
}
