"use client";

import type { SavedProject } from "@/features/projects/projectStorage";
import { ProjectDraftEditor } from "@/features/projects/ProjectDraftEditor";

type LecturePlanDraftViewProps = {
  projectId: string;
};

export function LecturePlanDraftView({ projectId }: LecturePlanDraftViewProps) {
  return (
    <ProjectDraftEditor
      projectId={projectId}
      activeStep="lecture-plan"
      theme="sky"
      eyebrow="강의 기획서 AI"
      title="목적, 시간표, 활동 흐름 설계"
      description="강의 목적과 대상에 맞는 운영 흐름을 만들고 수정합니다."
      fieldLabel="강의 기획서 본문"
      copyLabel="기획서 복사"
      saveLabel="기획서 저장"
      resetLabel="기본 기획서 다시 만들기"
      savedTitle="강의 기획서가 저장되었습니다."
      aiEndpoint="/api/ai/lecture-plan"
      getDraft={(project) => project.lecturePlanDraft}
      getUpdatedAt={(project) => project.lecturePlanUpdatedAt}
      buildDefaultDraft={buildLecturePlanDraft}
      applyDraft={(project, draft) => ({
        ...project,
        lecturePlanDraft: draft,
        lecturePlanUpdatedAt: new Date().toISOString(),
      })}
    />
  );
}

function buildLecturePlanDraft(project: SavedProject) {
  return `[강의 기획서 초안]

1. 강의명
${project.title || "강의 프로젝트"}

2. 운영 개요
- 기관: ${project.organization || "미입력"}
- 대상: ${project.audience || "미입력"}
- 일정: ${project.date || "미입력"}
- 시간: ${project.time || "미입력"}
- 형태: ${project.format || "미입력"}

3. 강의 목적
${project.purpose || "강의 목적을 입력해 주세요."}

4. 추천 활동 흐름
- 도입: 인사, 강의 목적 안내, 마음 열기 질문
- 활동 1: 경험과 생각 꺼내기
- 활동 2: 나의 강점 발견하기
- 활동 3: 모둠 또는 개인 발표
- 정리: 배운 점 기록, 다음 행동 정리

5. 강사의 진행 포인트
- 아이들이 정답보다 자기 생각을 말할 수 있도록 기다립니다.
- 관찰한 강점은 구체적인 말로 다시 들려줍니다.
- 결과물은 사진, 메모, 키워드로 기록해 이후 보고서와 블로그에 활용합니다.

6. 준비물
활동지, 필기구, 포스트잇, 발표용 화면 또는 보드

7. 특이사항
${project.notes || "특이사항 없음"}`;
}
