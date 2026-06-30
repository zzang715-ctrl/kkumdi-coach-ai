"use client";

import type { SavedProject } from "@/features/projects/projectStorage";
import { ProjectDraftEditor } from "@/features/projects/ProjectDraftEditor";

type ProposalDraftViewProps = {
  projectId: string;
};

export function ProposalDraftView({ projectId }: ProposalDraftViewProps) {
  return (
    <ProjectDraftEditor
      projectId={projectId}
      activeStep="proposal"
      theme="amber"
      eyebrow="제안서 AI"
      title="기관 제출용 강의 제안서"
      description="프로젝트 기본 정보를 바탕으로 기관에 제출할 수 있는 강의 제안서 초안을 만들고 수정합니다."
      fieldLabel="제안서 본문"
      copyLabel="제안서 복사"
      saveLabel="제안서 저장"
      resetLabel="기본 제안서 다시 만들기"
      savedTitle="제안서가 저장되었습니다."
      aiEndpoint="/api/ai/proposal"
      getDraft={(project) => project.proposalDraft}
      getUpdatedAt={(project) => project.proposalUpdatedAt}
      buildDefaultDraft={buildProposalDraft}
      applyDraft={(project, draft) => ({
        ...project,
        proposalDraft: draft,
        proposalUpdatedAt: new Date().toISOString(),
      })}
    />
  );
}

function buildProposalDraft(project: SavedProject) {
  return `[강의 제안서 초안]

1. 강의명
${project.title || "강의 프로젝트"}

2. 제안 기관
${project.organization || "기관명 미입력"}

3. 교육 대상
${project.audience || "대상 미입력"}

4. 일정 및 형태
- 날짜: ${project.date || "미입력"}
- 시간: ${project.time || "미입력"}
- 형태: ${project.format || "미입력"}

5. 강의 목적
${project.purpose || "강의 목적을 입력해 주세요."}

6. 운영 개요
본 강의는 참여자가 자신의 가능성과 강점을 발견하고, 활동을 통해 생각을 표현할 수 있도록 돕는 교육 프로그램입니다.

7. 기대 효과
- 참여자는 자신의 강점과 가능성을 언어로 정리할 수 있습니다.
- 기관은 강의 결과를 보고서, 후기 글, 홍보 콘텐츠로 활용할 수 있습니다.
- 강사는 강의 전후 업무를 하나의 프로젝트 흐름으로 관리할 수 있습니다.

8. 준비물 및 요청 사항
활동지, 필기구, 발표용 화면 또는 보드가 필요합니다.

9. 특이사항
${project.notes || "특이사항 없음"}`;
}
