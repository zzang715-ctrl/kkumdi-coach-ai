import type { SavedProject } from "@/features/projects/projectStorage";
import { createProjectAiRoute } from "@/lib/openaiServer";

export const POST = createProjectAiRoute({
  systemPrompt:
    "당신은 교육 강사와 코치를 돕는 한국어 AI 강사비서입니다. 강사가 쉽게 회고하고 블로그 글의 재료를 얻을 수 있도록 구체적이고 답하기 쉬운 인터뷰 질문을 만듭니다.",
  buildPrompt: buildInterviewPrompt,
});

function buildInterviewPrompt(project: SavedProject) {
  const data = project.dataCollection;

  return `아래 프로젝트 정보를 바탕으로 강사용 인터뷰 질문지를 작성해 주세요.

조건:
- 한국어로 작성
- 강사가 부담 없이 답할 수 있는 쉬운 질문으로 작성
- 강사 회고 질문, 참여자 반응 질문, 블로그 작성 질문, 결과보고서 보완 질문을 구분
- 각 질문 아래에 "답변:" 칸을 넣기
- 저장된 결과보고서와 자료수집 기록이 있으면 구체적으로 반영
- 블로그 AI가 다음 단계에서 활용할 수 있도록 장면, 감정, 메시지, 배운 점을 끌어내는 질문 포함

프로젝트 정보:
- 프로젝트 이름: ${project.title || "미입력"}
- 기관명: ${project.organization || "미입력"}
- 강의 대상: ${project.audience || "미입력"}
- 강의 날짜: ${project.date || "미입력"}
- 강의 시간: ${project.time || "미입력"}
- 강의 형태: ${project.format || "미입력"}
- 강의 목적: ${project.purpose || "미입력"}
- 특이사항: ${project.notes || "미입력"}

저장된 결과보고서:
${project.resultReportDraft || "아직 저장된 결과보고서가 없습니다."}

자료수집 기록:
- 사진 메모: ${data?.photoNotes || "미입력"}
- 현장 메모: ${data?.fieldNotes || "미입력"}
- 참여자 반응: ${data?.studentReactions || "미입력"}
- 강점 포인트: ${data?.strengthPoints || "미입력"}
- 키워드: ${data?.keywords || "미입력"}
- 요약: ${data?.summary || "미입력"}`;
}
