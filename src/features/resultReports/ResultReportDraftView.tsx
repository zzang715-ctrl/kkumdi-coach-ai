"use client";

import type { SavedProject } from "@/features/projects/projectStorage";
import { ProjectDraftEditor } from "@/features/projects/ProjectDraftEditor";

type ResultReportDraftViewProps = {
  projectId: string;
};

export function ResultReportDraftView({ projectId }: ResultReportDraftViewProps) {
  return (
    <ProjectDraftEditor
      projectId={projectId}
      activeStep="result-report"
      theme="rose"
      eyebrow="결과보고서 AI"
      title="기관 제출용 결과보고서"
      description="프로젝트 정보와 현장 기록을 바탕으로 기관 제출용 결과보고서를 만들고 수정합니다."
      fieldLabel="결과보고서 본문"
      copyLabel="보고서 복사"
      saveLabel="보고서 저장"
      resetLabel="기본 보고서 다시 만들기"
      savedTitle="결과보고서가 저장되었습니다."
      aiEndpoint="/api/ai/result-report"
      getDraft={(project) => project.resultReportDraft}
      getUpdatedAt={(project) => project.resultReportUpdatedAt}
      buildDefaultDraft={buildResultReportDraft}
      applyDraft={(project, draft) => ({
        ...project,
        resultReportDraft: draft,
        resultReportUpdatedAt: new Date().toISOString(),
      })}
    />
  );
}

function buildResultReportDraft(project: SavedProject) {
  return `[강의 결과보고서 초안]

1. 프로젝트 개요
- 강의명: ${project.title || "강의 프로젝트"}
- 기관: ${project.organization || "미입력"}
- 대상: ${project.audience || "미입력"}
- 일정: ${project.date || "미입력"}
- 시간: ${project.time || "미입력"}
- 형태: ${project.format || "미입력"}

2. 강의 목적
${project.purpose || "강의 목적을 입력해 주세요."}

3. 운영 내용
${project.lecturePlanDraft || "강의 기획서가 아직 저장되지 않았습니다."}

4. 현장 기록 요약
${project.dataCollection?.summary || "자료수집 요약이 아직 저장되지 않았습니다."}

5. 주요 성과
- 참여자들이 자신의 생각과 경험을 표현하는 시간이 마련되었습니다.
- 활동 과정에서 강점, 몰입, 협력 모습을 관찰할 수 있었습니다.
- 강의 결과물을 이후 교육 후기와 홍보 콘텐츠로 연결할 수 있습니다.

6. 향후 제안
- 다음 회차에서는 참여자 결과물을 공유하는 시간을 추가하면 좋습니다.
- 기관의 교육 목표에 맞춰 후속 활동 또는 심화 프로그램을 제안할 수 있습니다.`;
}
