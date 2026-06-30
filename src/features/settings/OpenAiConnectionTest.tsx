"use client";

import { useState } from "react";

type TestState = "idle" | "loading" | "success" | "error";

export function OpenAiConnectionTest() {
  const [state, setState] = useState<TestState>("idle");
  const [message, setMessage] = useState(
    "OpenAI 키를 넣은 뒤 이 버튼을 누르면 실제 연결 상태를 확인합니다.",
  );

  async function testConnection() {
    setState("loading");
    setMessage("OpenAI에 연결하는 중입니다. 잠시만 기다려 주세요.");

    try {
      const response = await fetch("/api/ai/test", {
        method: "POST",
      });
      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setState("error");
        setMessage(data.error || "연결 테스트에 실패했습니다.");
        return;
      }

      setState("success");
      setMessage(data.message || "OpenAI 연결 확인 완료");
    } catch {
      setState("error");
      setMessage("브라우저에서 테스트 요청을 보내지 못했습니다. 개발 서버가 켜져 있는지 확인해 주세요.");
    }
  }

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold text-emerald-700">OpenAI 연결 테스트</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">AI 생성 준비 확인</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{message}</p>
        </div>
        <button
          type="button"
          onClick={testConnection}
          disabled={state === "loading"}
          className="inline-flex h-12 min-w-44 items-center justify-center rounded-md bg-emerald-700 px-5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:bg-emerald-400"
        >
          {state === "loading" ? "확인 중..." : "연결 테스트"}
        </button>
      </div>
      {state !== "idle" && (
        <p
          className={`mt-4 rounded-md px-3 py-2 text-sm font-semibold ${
            state === "success"
              ? "bg-white text-emerald-800"
              : state === "error"
                ? "bg-white text-rose-700"
                : "bg-white text-slate-700"
          }`}
        >
          {state === "success" ? "성공: " : state === "error" ? "확인 필요: " : ""}
          {message}
        </p>
      )}
    </div>
  );
}
