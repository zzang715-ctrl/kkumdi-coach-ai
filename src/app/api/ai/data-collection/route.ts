import type { SavedProject } from "@/features/projects/projectStorage";
import { createProjectAiRoute } from "@/lib/openaiServer";

export const POST = createProjectAiRoute({
  systemPrompt:
    "당신은 교육 강사와 코치를 돕는 한국어 AI 강사비서입니다. 강의 현장의 사진 메모, 관찰 기록, 참여자 반응을 결과보고서와 블로그에 쓸 수 있게 정리합니다.",
  buildPrompt: buildDataCollectionPrompt,
});

function buildDataCollectionPrompt(project: SavedProject) {
  const data = project.dataCollection;
  const photoList = (data?.photos ?? [])
    .map((photo, index) => `${index + 1}. ${photo.name}${photo.note ? ` - ${photo.note}` : ""}`)
    .join("\n");

  return `아래 현장 기록을 바탕으로 자료수집 요약을 작성해 주세요.

조건:
- 한국어로 작성
- 결과보고서에 넣을 수 있는 공식적인 요약과 블로그에 쓸 수 있는 현장감 있는 표현을 함께 담기
- 참여자의 개인정보나 실명은 적지 않기
- 사진 설명, 현장 메모, 참여자 반응, 강점 포인트, 핵심 키워드를 구분
- 없는 내용은 지어내지 말고 "추가 기록 필요"라고 표시
- 마지막에 다음 단계에서 활용할 수 있는 문장 3개를 제안

프로젝트 정보:
- 프로젝트 이름: ${project.title || "미입력"}
- 기관명: ${project.organization || "미입력"}
- 강의 대상: ${project.audience || "미입력"}
- 강의 날짜: ${project.date || "미입력"}
- 강의 시간: ${project.time || "미입력"}
- 강의 형태: ${project.format || "미입력"}
- 강의 목적: ${project.purpose || "미입력"}
- 특이사항: ${project.notes || "미입력"}

현장 기록:
- 사진 설명: ${data?.photoNotes || "미입력"}
- 업로드한 사진 메모:
${photoList || "업로드한 사진 메모가 없습니다."}
- 현장 메모: ${data?.fieldNotes || "미입력"}
- 참여자 반응: ${data?.studentReactions || "미입력"}
- 강점 포인트: ${data?.strengthPoints || "미입력"}
- 키워드: ${data?.keywords || "미입력"}`;
}
