"use client";

import type { SavedProject } from "@/features/projects/projectStorage";
import { ProjectDraftEditor } from "@/features/projects/ProjectDraftEditor";

type InterviewDraftViewProps = {
  projectId: string;
};

export function InterviewDraftView({ projectId }: InterviewDraftViewProps) {
  return (
    <ProjectDraftEditor
      projectId={projectId}
      activeStep="interview"
      theme="violet"
      eyebrow="인터뷰 AI"
      title="강사 회고와 블로그 작성을 위한 질문"
      description="자료수집 기록과 현장 사진이 있으면 함께 참고해 질문을 만듭니다. 답을 적어 저장하면 블로그 AI에서 이어서 활용할 수 있습니다."
      fieldLabel="인터뷰 질문과 답변 본문"
      copyLabel="질문 복사"
      saveLabel="인터뷰 저장"
      resetLabel="기본 질문 다시 만들기"
      savedTitle="인터뷰 질문과 답변이 저장되었습니다."
      aiEndpoint="/api/ai/interview"
      getDraft={(project) => project.interviewDraft}
      getUpdatedAt={(project) => project.interviewUpdatedAt}
      buildDefaultDraft={buildInterviewDraft}
      applyDraft={(project, draft) => ({
        ...project,
        interviewDraft: draft,
        interviewUpdatedAt: new Date().toISOString(),
      })}
    />
  );
}

function buildInterviewDraft(project: SavedProject) {
  return `[인터뷰 질문 초안]

1. 이번 ${project.title || "강의"}에서 가장 기억에 남는 장면은 무엇인가요?
답변:

2. 참여자들이 가장 몰입했던 활동은 무엇인가요?
답변:

3. 강사로서 가장 뿌듯했거나 의미 있었던 부분은 무엇인가요?
답변:

4. 아이들의 강점이나 가능성이 드러난 순간이 있었다면 적어 주세요.
답변:

5. 다음에 보완하거나 더 발전시키고 싶은 점은 무엇인가요?
답변:

6. 블로그에 꼭 넣고 싶은 문장이나 메시지가 있다면 적어 주세요.
답변:

참고 자료:
${project.resultReportDraft || project.dataCollection?.summary || "아직 저장된 참고 자료가 없습니다."}

사진 및 현장 상황:
${project.dataCollection?.photoNotes || "사진 설명은 아직 없습니다."}
${project.dataCollection?.fieldNotes || "현장 메모는 아직 없습니다."}`;
}
