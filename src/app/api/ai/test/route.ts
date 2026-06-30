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
          error: buildOpenAiTestErrorMessage(data?.error?.message, response.status),
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

function buildOpenAiTestErrorMessage(message: unknown, status: number) {
  const rawMessage = typeof message === "string" ? message : "";

  if (status === 429) {
    return [
      "OpenAI 키는 연결되었지만 사용량 한도 또는 결제 설정 때문에 테스트가 막혔습니다.",
      "OpenAI 결제와 사용량 한도를 확인하면 실제 AI 생성까지 사용할 수 있습니다.",
      rawMessage ? `원문 오류: ${rawMessage}` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (status === 401) {
    return "OpenAI API 키가 올바르지 않습니다. OPENAI_API_KEY 값을 다시 확인해 주세요.";
  }

  if (status === 403) {
    return "OpenAI API 접근 권한이 없습니다. API 키 권한과 프로젝트 설정을 확인해 주세요.";
  }

  return rawMessage || "OpenAI 연결 테스트에 실패했습니다.";
}
