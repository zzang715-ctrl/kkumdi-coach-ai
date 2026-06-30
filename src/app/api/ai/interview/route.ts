import { NextResponse } from "next/server";
import type { SavedProject } from "@/features/projects/projectStorage";
import { buildOpenAiErrorMessage, extractText } from "@/lib/openaiServer";

type AiRequestBody = {
  project?: SavedProject;
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

  let body: AiRequestBody;

  try {
    body = (await request.json()) as AiRequestBody;
  } catch {
    return NextResponse.json({ error: "요청 데이터를 읽을 수 없습니다." }, { status: 400 });
  }

  if (!body.project?.id) {
    return NextResponse.json({ error: "프로젝트 정보가 없습니다." }, { status: 400 });
  }

  const photos = body.project.dataCollection?.photos ?? [];

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
              "당신은 교육 강사와 코치를 돕는 한국어 AI 강사비서입니다. 강사가 쉽게 회고하고 블로그 글의 재료를 얻을 수 있도록 구체적이고 답하기 쉬운 인터뷰 질문을 만듭니다. 사진 속 사람의 신원, 이름, 얼굴, 성별, 민감정보는 절대 추정하지 말고, 보이는 활동 장면과 결과물만 질문 소재로 활용하세요.",
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: buildInterviewPrompt(body.project, photos.length),
              },
              ...photos.map((photo) => ({
                type: "input_image",
                image_url: photo.dataUrl,
              })),
            ],
          },
        ],
        max_output_tokens: 1800,
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

    if (!text) {
      return NextResponse.json({ error: "AI 응답에서 인터뷰 질문을 찾을 수 없습니다." }, { status: 500 });
    }

    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "AI 서버와 연결할 수 없습니다." }, { status: 500 });
  }
}

function buildInterviewPrompt(project: SavedProject, photoCount: number) {
  const data = project.dataCollection;
  const photoList = (data?.photos ?? [])
    .map((photo, index) => `${index + 1}. ${photo.name}${photo.note ? ` - ${photo.note}` : ""}`)
    .join("\n");

  return `아래 프로젝트 정보, 자료수집 기록${photoCount > 0 ? ", 업로드된 현장 사진" : ""}을 바탕으로 강사용 인터뷰 질문지를 작성해 주세요.

조건:
- 한국어로 작성
- 강사가 부담 없이 답할 수 있는 쉬운 질문으로 작성
- 강사 회고 질문, 참여자 반응 질문, 블로그 작성 질문, 결과보고서 보완 질문을 구분
- 각 질문 아래에 "답변:" 칸을 넣기
- 저장된 결과보고서와 자료수집 기록이 있으면 구체적으로 반영
- 사진이 있으면 사진 속 활동 장면, 결과물, 공간 분위기를 바탕으로 질문을 더 구체화
- 사진 속 아이의 이름, 얼굴, 신원, 성별, 나이, 감정 상태는 추정하지 않기
- 사진만으로 확정할 수 없는 내용은 단정하지 말고 "사진에서 보이는 장면을 기준으로" 질문하기
- 블로그 AI가 다음 단계에서 활용할 수 있도록 장면, 메시지, 배운 점, 강점 발견을 끌어내는 질문 포함

프로젝트 정보:
- 프로젝트 이름: ${project.title || "미입력"}
- 기관명: ${project.organization || "미입력"}
- 강의 대상: ${project.audience || "미입력"}
- 강의 날짜: ${project.date || "미입력"}
- 강의 시간: ${project.time || "미입력"}
- 강의 형태: ${project.format || "미입력"}
- 강의 목적: ${project.purpose || "미입력"}
- 특이사항: ${project.notes || "미입력"}

저장된 결과보고서:
${project.resultReportDraft || "아직 저장된 결과보고서가 없습니다."}

자료수집 기록:
- 사진 설명: ${data?.photoNotes || "미입력"}
- 현장 메모: ${data?.fieldNotes || "미입력"}
- 참여자 반응: ${data?.studentReactions || "미입력"}
- 강점 포인트: ${data?.strengthPoints || "미입력"}
- 키워드: ${data?.keywords || "미입력"}
- 요약: ${data?.summary || "미입력"}

업로드된 사진 메모:
${photoList || "업로드된 사진 메모가 없습니다."}`;
}
