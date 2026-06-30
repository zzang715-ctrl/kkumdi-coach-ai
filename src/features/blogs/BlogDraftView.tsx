"use client";

import type { SavedProject } from "@/features/projects/projectStorage";
import { ProjectDraftEditor } from "@/features/projects/ProjectDraftEditor";

type BlogDraftViewProps = {
  projectId: string;
};

export function BlogDraftView({ projectId }: BlogDraftViewProps) {
  return (
    <ProjectDraftEditor
      projectId={projectId}
      activeStep="blog"
      theme="slate"
      eyebrow="블로그 AI"
      title="교육 후기 블로그 글"
      description="인터뷰 답변과 현장 기록을 바탕으로 교육 후기 글을 만들고 수정합니다."
      fieldLabel="블로그 본문"
      copyLabel="글 복사"
      saveLabel="블로그 저장"
      resetLabel="기본 글 다시 만들기"
      savedTitle="블로그 초안이 저장되었습니다."
      aiEndpoint="/api/ai/blog"
      getDraft={(project) => project.blogDraft}
      getUpdatedAt={(project) => project.blogUpdatedAt}
      buildDefaultDraft={buildBlogDraft}
      applyDraft={(project, draft) => ({
        ...project,
        blogDraft: draft,
        blogUpdatedAt: new Date().toISOString(),
      })}
    />
  );
}

function buildBlogDraft(project: SavedProject) {
  return `[블로그 초안]

제목 후보
${project.title || "교육 프로그램"} 현장에서 만난 아이들의 가능성

도입
${project.organization || "교육 현장"}에서 ${project.audience || "참여자"}를 대상으로 ${project.title || "교육 프로그램"}을 진행했습니다.

이번 시간은 아이들이 자신의 생각을 말하고, 서로의 강점을 발견하며, 활동을 통해 배운 점을 기록하는 시간이었습니다.

현장 분위기
${project.dataCollection?.summary || "자료수집 요약을 추가하면 더 생생한 글이 됩니다."}

강사 회고
${project.interviewDraft || "인터뷰 답변을 저장하면 이 부분에 더 깊이 있는 회고를 반영할 수 있습니다."}

교육의 의미
이번 강의는 단순한 활동을 넘어 참여자들이 자기 안의 가능성을 발견하고 표현하는 시간이었습니다. 강사는 아이들의 말과 행동을 관찰하며 강점의 단서를 기록했고, 그 기록은 결과보고서와 교육 후기 콘텐츠로 이어질 수 있습니다.

마무리
아이들의 가능성은 작은 질문과 기다림 속에서 드러납니다. 이번 강의가 참여자들에게 자신을 더 잘 이해하고 표현하는 계기가 되었기를 바랍니다.

해시태그
#교육후기 #강점교육 #AI강사비서 #꿈디코치AI`;
}
