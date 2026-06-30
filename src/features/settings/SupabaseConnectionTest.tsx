"use client";

import Link from "next/link";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabaseClient";

type TestState = "idle" | "loading" | "success" | "error";

export function SupabaseConnectionTest() {
  const [state, setState] = useState<TestState>("idle");
  const [message, setMessage] = useState(
    "Supabase URL과 anon key를 넣은 뒤 이 버튼을 누르면 로그인과 서버 저장 준비 상태를 확인합니다.",
  );

  async function testConnection() {
    setState("loading");
    setMessage("Supabase 연결과 프로젝트 테이블을 확인하는 중입니다. 잠시만 기다려 주세요.");

    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setState("error");
        setMessage(error.message);
        return;
      }

      if (!data.session?.user) {
        setState("success");
        setMessage("Supabase 연결 확인 완료. 아직 로그인하지 않아 projects 테이블 검사는 건너뛰었습니다.");
        return;
      }

      const { error: tableError } = await supabase.from("projects").select("id").limit(1);

      if (tableError) {
        setState("error");
        setMessage(`Supabase는 연결됐지만 projects 테이블 확인에 실패했습니다. ${tableError.message}`);
        return;
      }

      setState("success");
      setMessage(`Supabase 연결과 projects 테이블 확인 완료. 현재 로그인 계정: ${data.session.user.email}`);
    } catch {
      setState("error");
      setMessage(".env.local에 Supabase URL과 anon key를 넣고 개발 서버를 다시 켜 주세요.");
    }
  }

  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold text-sky-700">Supabase 연결 테스트</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">로그인과 서버 저장 준비 확인</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{message}</p>
        </div>
        <button
          type="button"
          onClick={testConnection}
          disabled={state === "loading"}
          className="inline-flex h-12 min-w-44 items-center justify-center rounded-md bg-sky-700 px-5 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-wait disabled:bg-sky-400"
        >
          {state === "loading" ? "확인 중..." : "Supabase 테스트"}
        </button>
      </div>
      {state !== "idle" && (
        <p
          className={`mt-4 rounded-md px-3 py-2 text-sm font-semibold ${
            state === "success"
              ? "bg-white text-sky-800"
              : state === "error"
                ? "bg-white text-rose-700"
                : "bg-white text-slate-700"
          }`}
        >
          {state === "success" ? "성공: " : state === "error" ? "확인 필요: " : ""}
          {message}
        </p>
      )}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/supabase-guide"
          className="inline-flex h-10 items-center justify-center rounded-md border border-sky-300 bg-white px-3 text-sm font-bold text-sky-800 transition hover:bg-sky-100"
        >
          Supabase 테이블 안내 보기
        </Link>
        <Link
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
        >
          로그인 화면으로
        </Link>
      </div>
    </div>
  );
}
