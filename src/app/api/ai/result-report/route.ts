import type { SavedProject } from "@/features/projects/projectStorage";
import { createProjectAiRoute, formatTeachingMaterialList } from "@/lib/openaiServer";

export const POST = createProjectAiRoute({
  systemPrompt:
    "당신은 교육 강사와 코치를 돕는 한국어 AI 강사비서입니다. 기관에 제출할 수 있는 결과보고서를 정확하고 정중한 문체로 작성합니다.",
  buildPrompt: buildResultReportPrompt,
  includeTeachingMaterials: true,
  transformText: normalizeResultReport,
});

function buildResultReportPrompt(project: SavedProject) {
  const data = project.dataCollection;
  const materialList = formatTeachingMaterialList(project);

  return `아래 프로젝트 정보를 바탕으로 강의 결과보고서 초안을 작성해 주세요.

조건:
- 한국어로 작성
- 기관 담당자가 읽기 쉬운 정중하고 명확한 문체 사용
- 반드시 아래 "고정 양식"의 제목, 번호, 순서를 그대로 사용
- 항목 제목을 바꾸거나 새 큰 항목을 추가하지 않기
- 각 항목은 2~5문장 또는 2~5개 불릿으로 작성
- 자료수집 내용이 있으면 구체적으로 반영
- 업로드된 강의자료가 있으면 강의 목적, 활동 흐름, 핵심 내용, 준비물 정보를 보고서에 반영
- 없는 정보는 지어내지 말고 "추가 확인 필요"라고 표시
- 블로그 글처럼 과장하지 말고 공식 보고서에 어울리게 작성
- 마지막에 "AI 강사비서 드림", "꿈디코치 AI 강사비서 드림" 같은 서명 문구를 넣지 않기

고정 양식:
[강의 결과보고서]

1. 강의 개요
- 강의명:
- 기관명:
- 대상:
- 일정:
- 시간:
- 형태:

2. 강의 목적

3. 운영 내용

4. 주요 활동

5. 참여자 반응

6. 관찰된 강점

7. 운영 성과

8. 보완 및 개선점

9. 후속 제안

프로젝트 정보:
- 프로젝트 이름: ${project.title || "미입력"}
- 기관명: ${project.organization || "미입력"}
- 강의 대상: ${project.audience || "미입력"}
- 강의 날짜: ${project.date || "미입력"}
- 강의 시간: ${project.time || "미입력"}
- 강의 형태: ${project.format || "미입력"}
- 강의 목적: ${project.purpose || "미입력"}
- 특이사항: ${project.notes || "미입력"}

저장된 제안서:
${project.proposalDraft || "아직 저장된 제안서가 없습니다."}

저장된 강의 기획서:
${project.lecturePlanDraft || "아직 저장된 강의 기획서가 없습니다."}

자료수집 기록:
- 사진 메모: ${data?.photoNotes || "미입력"}
- 현장 메모: ${data?.fieldNotes || "미입력"}
- 참여자 반응: ${data?.studentReactions || "미입력"}
- 강점 포인트: ${data?.strengthPoints || "미입력"}
- 키워드: ${data?.keywords || "미입력"}
- 요약: ${data?.summary || "미입력"}

업로드한 강의자료:
${materialList || "업로드한 강의자료가 없습니다."}`;
}

const reportSectionRules = [
  { title: "2. 강의 목적", patterns: ["강의 목적", "목적"] },
  { title: "3. 운영 내용", patterns: ["운영 내용", "운영 개요", "진행 내용", "강의 운영"] },
  { title: "4. 주요 활동", patterns: ["주요 활동", "활동 내용", "프로그램 활동", "활동"] },
  { title: "5. 참여자 반응", patterns: ["참여자 반응", "학생 반응", "아이들 반응", "반응"] },
  { title: "6. 관찰된 강점", patterns: ["관찰된 강점", "강점 포인트", "강점", "관찰 내용"] },
  { title: "7. 운영 성과", patterns: ["운영 성과", "주요 성과", "성과"] },
  { title: "8. 보완 및 개선점", patterns: ["보완 및 개선점", "개선점", "보완점", "보완 및 개선"] },
  { title: "9. 후속 제안", patterns: ["후속 제안", "향후 제안", "다음 제안", "제안"] },
];

function normalizeResultReport(text: string, project: SavedProject) {
  const cleanedText = cleanAiReportText(text);
  const sections = reportSectionRules.map((section) => ({
    title: section.title,
    content: extractReportSection(cleanedText, section.patterns) || "추가 확인 필요",
  }));

  return `[강의 결과보고서]

1. 강의 개요
- 강의명: ${project.title || "미입력"}
- 기관명: ${project.organization || "미입력"}
- 대상: ${project.audience || "미입력"}
- 일정: ${project.date || "미입력"}
- 시간: ${project.time || "미입력"}
- 형태: ${project.format || "미입력"}

${sections.map((section) => `${section.title}\n${section.content}`).join("\n\n")}`;
}

function cleanAiReportText(text: string) {
  return text
    .split("\n")
    .filter((line) => !/AI\s*강사비서\s*드림|꿈디코치\s*AI\s*강사비서\s*드림|강사비서\s*드림/i.test(line))
    .map((line) => line.replace(/기관\s*제출용\s*/g, "").trimEnd())
    .join("\n")
    .trim();
}

function extractReportSection(text: string, patterns: string[]) {
  const lines = text.split("\n");
  const startIndex = lines.findIndex((line) => matchesReportHeading(line, patterns));

  if (startIndex < 0) {
    return "";
  }

  const endIndex = lines.findIndex((line, index) => index > startIndex && matchesAnyReportHeading(line));
  return lines
    .slice(startIndex + 1, endIndex < 0 ? undefined : endIndex)
    .join("\n")
    .trim();
}

function matchesAnyReportHeading(line: string) {
  return reportSectionRules.some((section) => matchesReportHeading(line, section.patterns)) || matchesReportHeading(line, ["강의 개요"]);
}

function matchesReportHeading(line: string, patterns: string[]) {
  const normalizedLine = line
    .replace(/^#+\s*/, "")
    .replace(/^\d+\s*[.)]\s*/, "")
    .replace(/[:：]\s*$/, "")
    .trim();

  return patterns.some((pattern) => normalizedLine === pattern);
}
