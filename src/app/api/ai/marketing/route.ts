import type { SavedProject } from "@/features/projects/projectStorage";
import { createProjectAiRoute } from "@/lib/openaiServer";

export const POST = createProjectAiRoute({
  systemPrompt:
    "당신은 교육 강사와 코치를 돕는 한국어 AI 마케팅 비서입니다. 교육 현장의 가치를 과장 없이 매력적인 SNS, 카드뉴스, 홍보 문구로 바꿉니다.",
  buildPrompt: buildMarketingPrompt,
});

function buildMarketingPrompt(project: SavedProject) {
  const data = project.dataCollection;

  return `아래 프로젝트 정보를 바탕으로 마케팅 콘텐츠 초안을 작성해 주세요.

조건:
- 한국어로 작성
- 인스타그램/페이스북 게시글 2개
- 짧은 SNS 문구 5개
- 카드뉴스 6장 구성 문구
- 홍보 배너 문구 5개
- 문자/카카오톡 안내 문구 2개
- 해시태그 후보 12개
- 교육 현장의 가치가 드러나게 하되 과장 광고처럼 보이지 않게 작성
- 개인정보가 드러나지 않도록 특정 학생 이름은 적지 않기
- 블로그 초안이 있으면 핵심 메시지를 짧게 변환

프로젝트 정보:
- 프로젝트 이름: ${project.title || "미입력"}
- 기관명: ${project.organization || "미입력"}
- 강의 대상: ${project.audience || "미입력"}
- 강의 날짜: ${project.date || "미입력"}
- 강의 시간: ${project.time || "미입력"}
- 강의 형태: ${project.format || "미입력"}
- 강의 목적: ${project.purpose || "미입력"}
- 특이사항: ${project.notes || "미입력"}

블로그 초안:
${project.blogDraft || "아직 저장된 블로그 초안이 없습니다."}

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
