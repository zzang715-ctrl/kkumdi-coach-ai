import type { SavedProject } from "@/features/projects/projectStorage";
import { createProjectAiRoute } from "@/lib/openaiServer";

export const POST = createProjectAiRoute({
  systemPrompt:
    "당신은 교육 강사와 코치를 돕는 한국어 AI 강사비서입니다. 기관에 제출할 수 있는 결과보고서를 정확하고 정중한 문체로 작성합니다.",
  buildPrompt: buildResultReportPrompt,
});

function buildResultReportPrompt(project: SavedProject) {
  const data = project.dataCollection;

  return `아래 프로젝트 정보를 바탕으로 기관 제출용 강의 결과보고서 초안을 작성해 주세요.

조건:
- 한국어로 작성
- 기관 담당자가 읽기 쉬운 정중하고 명확한 문체 사용
- 프로젝트 개요, 강의 목적, 운영 내용, 주요 활동, 참여자 반응, 관찰된 강점, 운영 성과, 개선 및 후속 제안 포함
- 자료수집 내용이 있으면 구체적으로 반영
- 없는 정보는 지어내지 말고 "추가 확인 필요"라고 표시
- 블로그 글처럼 과장하지 말고 공식 보고서에 어울리게 작성

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
${project.proposalDraft || "아직 저장된 제안서가 없습니다."}

저장된 강의 기획서:
${project.lecturePlanDraft || "아직 저장된 강의 기획서가 없습니다."}

자료수집 기록:
- 사진 메모: ${data?.photoNotes || "미입력"}
- 현장 메모: ${data?.fieldNotes || "미입력"}
- 참여자 반응: ${data?.studentReactions || "미입력"}
- 강점 포인트: ${data?.strengthPoints || "미입력"}
- 키워드: ${data?.keywords || "미입력"}
- 요약: ${data?.summary || "미입력"}`;
}
