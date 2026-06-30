import { NextResponse } from "next/server";
import { extractText } from "@/lib/openaiServer";

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OpenAI API 키가 아직 없습니다. .env.local 파일의 OPENAI_API_KEY= 뒤에 키를 넣고 서버를 다시 켜 주세요.",
      },
      { status: 400 },
    );
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
        input: "한국어로 짧게만 답하세요: OpenAI 연결 확인 완료",
        max_output_tokens: 30,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error?.message || "OpenAI 연결 테스트에 실패했습니다.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: extractText(data) || "OpenAI 연결 확인 완료",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "OpenAI 서버에 연결하지 못했습니다. 인터넷 연결과 API 키를 확인해 주세요.",
      },
      { status: 500 },
    );
  }
}
