import { NextResponse } from "next/server";
import type { SavedProject } from "@/features/projects/projectStorage";

type AiRouteOptions = {
  systemPrompt: string;
  buildPrompt: (project: SavedProject) => string;
  includeTeachingMaterials?: boolean;
  transformText?: (text: string, project: SavedProject) => string;
};

type AiRequestBody = {
  project?: SavedProject;
};

type OpenAiInputContent =
  | {
      type: "input_text";
      text: string;
    }
  | {
      type: "input_file";
      filename: string;
      file_data: string;
    };

export function createProjectAiRoute({ systemPrompt, buildPrompt, includeTeachingMaterials = false, transformText }: AiRouteOptions) {
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
      const prompt = buildPrompt(body.project);
      const materialInputs = includeTeachingMaterials ? buildTeachingMaterialInputs(body.project) : [];
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
              content: materialInputs.length ? [{ type: "input_text", text: prompt }, ...materialInputs] : prompt,
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          {
            error: buildOpenAiErrorMessage(data?.error?.message, response.status),
          },
          { status: response.status },
        );
      }

      const text = extractText(data);

      if (!text) {
        return NextResponse.json({ error: "AI 응답에서 본문을 찾을 수 없습니다." }, { status: 500 });
      }

      return NextResponse.json({ text: transformText ? transformText(text, body.project) : text });
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

export function buildTeachingMaterialInputs(project: SavedProject): OpenAiInputContent[] {
  return (project.dataCollection?.materials ?? [])
    .filter(
      (material): material is typeof material & { dataUrl: string } =>
        Boolean(material.dataUrl) && isSupportedMaterialForOpenAi(material.name),
    )
    .map((material) => ({
      type: "input_file",
      filename: material.name,
      file_data: material.dataUrl,
    }));
}

export function formatTeachingMaterialList(project: SavedProject) {
  return (project.dataCollection?.materials ?? [])
    .map((material, index) => `${index + 1}. ${material.name}${material.note ? ` - ${material.note}` : ""}`)
    .join("\n");
}

function isSupportedMaterialForOpenAi(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return ["pdf", "txt", "md"].includes(extension || "");
}

export function buildOpenAiErrorMessage(message: unknown, status: number) {
  const rawMessage = typeof message === "string" ? message : "";

  if (status === 429) {
    return [
      "OpenAI 사용량 한도 또는 결제 설정 때문에 AI 생성이 잠시 막혔습니다.",
      "OpenAI 결제와 사용량 한도를 확인한 뒤 다시 눌러 주세요.",
      rawMessage ? `원문 오류: ${rawMessage}` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (status === 401) {
    return "OpenAI API 키가 올바르지 않습니다. .env.local 또는 Vercel 환경변수의 OPENAI_API_KEY 값을 다시 확인해 주세요.";
  }

  if (status === 403) {
    return "OpenAI API 접근 권한이 없습니다. API 키 권한과 프로젝트 설정을 확인해 주세요.";
  }

  return rawMessage || "OpenAI API 호출 중 오류가 발생했습니다.";
}
