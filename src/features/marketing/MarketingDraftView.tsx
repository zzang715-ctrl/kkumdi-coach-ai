"use client";

import type { SavedProject } from "@/features/projects/projectStorage";
import { ProjectDraftEditor } from "@/features/projects/ProjectDraftEditor";

type MarketingDraftViewProps = {
  projectId: string;
};

export function MarketingDraftView({ projectId }: MarketingDraftViewProps) {
  return (
    <ProjectDraftEditor
      projectId={projectId}
      activeStep="marketing"
      theme="indigo"
      eyebrow="마케팅 AI"
      title="SNS, 카드뉴스, 홍보 문구"
      description="블로그 초안과 결과보고서를 바탕으로 채널별 마케팅 문구를 만들고 수정합니다."
      fieldLabel="마케팅 문구 본문"
      copyLabel="문구 복사"
      saveLabel="마케팅 저장"
      resetLabel="기본 문구 다시 만들기"
      savedTitle="마케팅 문구가 저장되었습니다."
      aiEndpoint="/api/ai/marketing"
      getDraft={(project) => project.marketingDraft}
      getUpdatedAt={(project) => project.marketingUpdatedAt}
      buildDefaultDraft={buildMarketingDraft}
      applyDraft={(project, draft) => ({
        ...project,
        marketingDraft: draft,
        marketingUpdatedAt: new Date().toISOString(),
      })}
    />
  );
}

function buildMarketingDraft(project: SavedProject) {
  return `[마케팅 콘텐츠 초안]

1. SNS 게시글
${project.title || "교육 프로그램"}을 통해 참여자들이 자신의 강점과 가능성을 발견하는 시간을 가졌습니다.
작은 질문 하나가 아이들의 생각을 열고, 기록은 교육의 가치를 더 선명하게 보여줍니다.

2. 짧은 홍보 문구
- 교육 현장을 기록하고 글로 완성하는 AI 강사비서
- 제안서부터 결과보고서, 블로그, 마케팅까지 한 번에
- 강사의 시간을 아끼고 교육의 가치를 더 선명하게

3. 카드뉴스 문구
1장. ${project.title || "교육 프로그램"}
2장. 참여자가 자신의 강점을 발견하는 시간
3장. 현장 기록은 결과보고서와 블로그의 재료가 됩니다
4장. 꿈디코치 AI와 함께 교육 현장을 콘텐츠로 완성하세요

4. 기관 안내 문구
${project.organization || "기관"}에서 진행한 이번 교육은 참여자의 생각, 강점, 활동 장면을 기록하고 결과물로 정리하는 데 초점을 두었습니다. 교육 후에는 보고서와 후기 콘텐츠로 연결해 기관의 교육 성과를 더 잘 보여줄 수 있습니다.

5. 참고 블로그
${project.blogDraft || "블로그 초안이 아직 저장되지 않았습니다."}`;
}
