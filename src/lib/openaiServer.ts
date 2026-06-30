import { NextResponse } from "next/server";
import type { SavedProject } from "@/features/projects/projectStorage";

type AiRouteOptions = {
  systemPrompt: string;
  buildPrompt: (project: SavedProject) => string;
};

type AiRequestBody = {
  project?: SavedProject;
};

export function createProjectAiRoute({ systemPrompt, buildPrompt }: AiRouteOptions) {
  return async function POST(request: Request) {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY가 설정되어 있지 않습니다. 프로젝트 폴더의 .env.local 파일에 OpenAI API 키를 추가하고 개발 서버를 다시 실행해 주세요.",
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
              content: systemPrompt,
            },
            {
              role: "user",
              content: buildPrompt(body.project),
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          {
            error: data?.error?.message || "OpenAI API 호출 중 오류가 발생했습니다.",
          },
          { status: response.status },
        );
      }

      const text = extractText(data);

      if (!text) {
        return NextResponse.json({ error: "AI 응답에서 본문을 찾을 수 없습니다." }, { status: 500 });
      }

      return NextResponse.json({ text });
    } catch {
      return NextResponse.json({ error: "AI 서버와 연결할 수 없습니다." }, { status: 500 });
    }
  };
}

export function extractText(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "output_text" in data &&
    typeof (data as { output_text?: unknown }).output_text === "string"
  ) {
    return (data as { output_text: string }).output_text;
  }

  const output = (data as { output?: unknown }).output;

  if (!Array.isArray(output)) {
    return "";
  }

  return output
    .flatMap((item) => {
      const content = (item as { content?: unknown }).content;
      return Array.isArray(content) ? content : [];
    })
    .map((contentItem) => {
      const text = (contentItem as { text?: unknown }).text;
      return typeof text === "string" ? text : "";
    })
    .filter(Boolean)
    .join("\n");
}
