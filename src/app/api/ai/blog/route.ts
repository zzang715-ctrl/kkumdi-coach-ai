import type { SavedProject } from "@/features/projects/projectStorage";
import { createProjectAiRoute } from "@/lib/openaiServer";

export const POST = createProjectAiRoute({
  systemPrompt:
    "당신은 교육 강사와 코치를 돕는 한국어 AI 강사비서입니다. 교육 현장의 장면과 의미를 따뜻하지만 과장 없이 블로그 후기 글로 정리합니다.",
  buildPrompt: buildBlogPrompt,
});

function buildBlogPrompt(project: SavedProject) {
  const data = project.dataCollection;

  return `아래 프로젝트 정보를 바탕으로 교육 후기 블로그 글 초안을 작성해 주세요.

조건:
- 한국어로 작성
- 제목 후보 3개 포함
- 도입, 현장 분위기, 주요 활동, 기억에 남는 장면, 참여자 반응, 강사 회고, 마무리 순서로 작성
- 블로그 독자가 자연스럽게 읽을 수 있는 따뜻한 문체 사용
- 기관명, 참여자 반응, 활동 장면을 적절히 반영
- 개인정보가 드러나지 않도록 특정 학생 이름은 적지 않기
- 없는 정보는 지어내지 말고 자연스럽게 비워두거나 "추가하면 좋은 내용"으로 표시
- 마지막에 해시태그 후보 8개 포함

프로젝트 정보:
- 프로젝트 이름: ${project.title || "미입력"}
- 기관명: ${project.organization || "미입력"}
- 강의 대상: ${project.audience || "미입력"}
- 강의 날짜: ${project.date || "미입력"}
- 강의 시간: ${project.time || "미입력"}
- 강의 형태: ${project.format || "미입력"}
- 강의 목적: ${project.purpose || "미입력"}
- 특이사항: ${project.notes || "미입력"}

인터뷰 질문과 답변:
${project.interviewDraft || "아직 저장된 인터뷰 질문과 답변이 없습니다."}

결과보고서:
${project.resultReportDraft || "아직 저장된 결과보고서가 없습니다."}

자료수집 기록:
- 사진 메모: ${data?.photoNotes || "미입력"}
- 현장 메모: ${data?.fieldNotes || "미입력"}
- 참여자 반응: ${data?.studentReactions || "미입력"}
- 강점 포인트: ${data?.strengthPoints || "미입력"}
- 키워드: ${data?.keywords || "미입력"}
- 요약: ${data?.summary || "미입력"}`;
}
