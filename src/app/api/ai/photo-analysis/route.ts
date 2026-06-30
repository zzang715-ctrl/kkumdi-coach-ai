import { NextResponse } from "next/server";
import type { SavedProject } from "@/features/projects/projectStorage";
import { buildOpenAiErrorMessage, extractText } from "@/lib/openaiServer";

type PhotoAnalysisRequest = {
  project?: SavedProject;
};

type PhotoAnalysisResult = {
  photoNotes?: string;
  fieldNotes?: string;
  studentReactions?: string;
  strengthPoints?: string;
  keywords?: string;
  summary?: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY가 설정되어 있지 않습니다. Vercel 환경 변수에 OpenAI API 키를 추가한 뒤 다시 배포해 주세요.",
      },
      { status: 400 },
    );
  }

  let body: PhotoAnalysisRequest;

  try {
    body = (await request.json()) as PhotoAnalysisRequest;
  } catch {
    return NextResponse.json({ error: "요청 데이터를 읽을 수 없습니다." }, { status: 400 });
  }

  if (!body.project?.id) {
    return NextResponse.json({ error: "프로젝트 정보가 없습니다." }, { status: 400 });
  }

  const photos = body.project.dataCollection?.photos ?? [];

  if (photos.length === 0) {
    return NextResponse.json({ error: "분석할 사진이 없습니다. 먼저 현장 사진을 올려 주세요." }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content:
              "당신은 교육 현장 기록을 돕는 한국어 AI 강사비서입니다. 사진 속 사람의 신원, 이름, 얼굴, 성별, 민감정보를 추정하지 마세요. 보이는 활동 장면, 교구, 결과물, 참여 분위기만 조심스럽게 관찰하고, 확실하지 않은 내용은 '추가 확인 필요'라고 표시하세요.",
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: buildPrompt(body.project),
              },
              ...photos.map((photo) => ({
                type: "input_image",
                image_url: photo.dataUrl,
              })),
            ],
          },
        ],
        max_output_tokens: 1200,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: buildOpenAiErrorMessage(data?.error?.message, response.status) },
        { status: response.status },
      );
    }

    const text = extractText(data);
    const analysis = parseAnalysisJson(text);

    if (!analysis) {
      return NextResponse.json({ error: "AI 사진 분석 결과를 읽을 수 없습니다. 다시 시도해 주세요." }, { status: 500 });
    }

    return NextResponse.json({ analysis });
  } catch {
    return NextResponse.json({ error: "AI 사진 분석 서버와 연결하지 못했습니다." }, { status: 500 });
  }
}

function buildPrompt(project: SavedProject) {
  const data = project.dataCollection;
  const photoList = (data?.photos ?? [])
    .map((photo, index) => `${index + 1}. 파일명: ${photo.name}${photo.note ? ` / 메모: ${photo.note}` : ""}`)
    .join("\n");

  return `아래 프로젝트의 현장 사진을 보고 자료수집 항목을 채워 주세요.

반드시 JSON 하나만 반환해 주세요. 설명 문장이나 코드블록은 붙이지 마세요.

JSON 형식:
{
  "photoNotes": "사진에서 보이는 장면 설명",
  "fieldNotes": "현장 관찰 메모",
  "studentReactions": "참여자 반응",
  "strengthPoints": "강점 포인트",
  "keywords": "쉼표로 구분한 핵심 키워드",
  "summary": "결과보고서와 블로그에 이어 쓸 수 있는 자료수집 요약"
}

작성 규칙:
- 한국어로 작성
- 아이의 이름, 얼굴, 신원, 성별, 나이, 감정 상태를 단정하지 않기
- 사진으로 확인되는 활동, 협력 장면, 발표 장면, 결과물, 공간 분위기 중심으로 정리
- 사진만으로 확정할 수 없는 내용은 '추가 확인 필요'라고 표시
- 교육 강사나 기관 담당자가 바로 수정해 쓸 수 있게 자연스럽게 작성

프로젝트 정보:
- 프로젝트 이름: ${project.title || "미입력"}
- 기관명: ${project.organization || "미입력"}
- 대상: ${project.audience || "미입력"}
- 날짜: ${project.date || "미입력"}
- 시간: ${project.time || "미입력"}
- 형식: ${project.format || "미입력"}
- 목적: ${project.purpose || "미입력"}

기존 자료수집 메모:
- 사진 설명: ${data?.photoNotes || "미입력"}
- 현장 메모: ${data?.fieldNotes || "미입력"}
- 참여자 반응: ${data?.studentReactions || "미입력"}
- 강점 포인트: ${data?.strengthPoints || "미입력"}
- 키워드: ${data?.keywords || "미입력"}

사진별 메모:
${photoList || "사진별 메모 없음"}`;
}

function parseAnalysisJson(text: string): PhotoAnalysisResult | null {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || start >= end) {
    return null;
  }

  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1)) as PhotoAnalysisResult;
    return {
      photoNotes: sanitizeString(parsed.photoNotes),
      fieldNotes: sanitizeString(parsed.fieldNotes),
      studentReactions: sanitizeString(parsed.studentReactions),
      strengthPoints: sanitizeString(parsed.strengthPoints),
      keywords: sanitizeString(parsed.keywords),
      summary: sanitizeString(parsed.summary),
    };
  } catch {
    return null;
  }
}

function sanitizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
