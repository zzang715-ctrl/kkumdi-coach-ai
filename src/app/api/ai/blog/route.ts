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
              "당신은 교육 강사와 코치를 돕는 한국어 AI 강사비서입니다. 교육 현장의 장면과 의미를 따뜻하지만 과장 없이 블로그 후기 글로 정리합니다. 사진 속 사람의 신원, 이름, 얼굴, 성별, 민감정보는 절대 추정하지 말고, 보이는 활동 장면과 결과물만 블로그 소재로 활용하세요.",
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: buildBlogPrompt(body.project, photos.length),
              },
              ...photos.map((photo) => ({
                type: "input_image",
                image_url: photo.dataUrl,
              })),
            ],
          },
        ],
        max_output_tokens: 2200,
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
      return NextResponse.json({ error: "AI 응답에서 블로그 글을 찾을 수 없습니다." }, { status: 500 });
    }

    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "AI 서버와 연결할 수 없습니다." }, { status: 500 });
  }
}

function buildBlogPrompt(project: SavedProject, photoCount: number) {
  const data = project.dataCollection;
  const photoList = (data?.photos ?? [])
    .map((photo, index) => `${index + 1}. ${photo.name}${photo.note ? ` - ${photo.note}` : ""}`)
    .join("\n");
  const photoInstruction =
    photoCount > 0
      ? `- 업로드된 사진을 보고 블로그 흐름에 맞는 삽입 위치를 정하기
- 사진을 실제로 붙이지 말고, 글 본문 사이에 아래 형식으로 위치 표시를 넣기
  [사진 1 넣기: 활동 시작 장면]
  [사진 2 넣기: 결과물 또는 발표 장면]
- 사진 번호는 업로드된 사진 순서를 기준으로 사용
- 각 사진 표시 뒤에는 1문장 정도의 짧은 캡션 후보를 함께 쓰기
- 사진이 어울리지 않는 경우에는 억지로 넣지 말고 "사진 위치 제안" 섹션에 제외 이유를 적기`
      : `- 업로드된 사진이 없으므로 글 마지막에 "사진 위치 제안" 섹션을 만들고, 어떤 사진을 추가하면 좋은지 안내하기`;

  return `아래 프로젝트 정보, 인터뷰 답변, 자료수집 기록${photoCount > 0 ? ", 업로드된 현장 사진" : ""}을 바탕으로 교육 후기 블로그 글 초안을 작성해 주세요.

조건:
- 한국어로 작성
- 제목 후보 3개 포함
- 도입, 현장 분위기, 주요 활동, 기억에 남는 장면, 참여자 반응, 강사 회고, 마무리 순서로 작성
- 블로그 독자가 자연스럽게 읽을 수 있는 따뜻한 문체 사용
- 기관명, 참여자 반응, 활동 장면을 적절히 반영
- 개인정보가 드러나지 않도록 특정 학생 이름은 적지 않기
- 사진 속 사람의 신원, 얼굴, 성별, 감정 상태를 단정하지 않기
- 없는 정보는 지어내지 말고 자연스럽게 비워두거나 "추가하면 좋은 내용"으로 표시
- 마지막에 해시태그 후보 8개 포함
${photoInstruction}

프로젝트 정보:
- 프로젝트 이름: ${project.title || "미입력"}
- 기관명: ${project.organization || "미입력"}
- 강의 대상: ${project.audience || "미입력"}
- 강의 날짜: ${project.date || "미입력"}
- 강의 시간: ${project.time || "미입력"}
- 강의 형태: ${project.format || "미입력"}
- 강의 목적: ${project.purpose || "미입력"}
- 특이사항: ${project.notes || "미입력"}

인터뷰 질문과 답변:
${project.interviewDraft || "아직 저장된 인터뷰 질문과 답변이 없습니다."}

결과보고서:
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
