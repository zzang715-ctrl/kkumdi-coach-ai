"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabaseClient";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isLogin = mode === "login";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const supabase = createBrowserSupabaseClient();
      const result = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (result.error) {
        setError(toKoreanAuthError(result.error.message));
        return;
      }

      if (isLogin) {
        setMessage("로그인되었습니다. 프로젝트 목록으로 이동합니다.");
        router.push("/projects");
      } else {
        setMessage("회원가입 요청이 완료되었습니다. 이메일 확인이 필요하면 받은 편지함을 확인해 주세요.");
      }
    } catch {
      setError(".env.local에 Supabase URL과 anon key를 먼저 설정해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-sm font-bold text-emerald-700">꿈디코치 AI 강사비서</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">{isLogin ? "로그인" : "회원가입"}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {isLogin
          ? "저장된 프로젝트를 더 안전하게 관리하기 위한 로그인 화면입니다."
          : "이메일과 비밀번호로 새 계정을 만듭니다."}
      </p>

      <label className="mt-6 grid gap-2 text-sm font-semibold text-slate-800">
        이메일
        <input
          type="email"
          name={`kkumdi-${mode}-email`}
          autoComplete="new-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="이메일을 입력하세요"
          className="h-12 rounded-md border border-slate-300 px-3 text-base outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-800">
        비밀번호
        <input
          type="password"
          name={`kkumdi-${mode}-password`}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
          placeholder="비밀번호를 입력하세요"
          className="h-12 rounded-md border border-slate-300 px-3 text-base outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      {error ? (
        <div className="mt-5 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-emerald-700 text-base font-semibold text-white hover:bg-emerald-800 disabled:bg-slate-400"
      >
        {isSubmitting ? "처리 중..." : isLogin ? "로그인하기" : "회원가입하기"}
      </button>

      <div className="mt-5 flex justify-between text-sm font-semibold">
        <Link href="/" className="text-slate-600 hover:text-slate-950">
          첫 화면으로
        </Link>
        <Link href={isLogin ? "/signup" : "/login"} className="text-emerald-700 hover:text-emerald-900">
          {isLogin ? "회원가입" : "로그인"}
        </Link>
      </div>
    </form>
  );
}

function toKoreanAuthError(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("invalid login")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }

  if (lowerMessage.includes("password")) {
    return "비밀번호를 확인해 주세요. 보통 6자 이상이어야 합니다.";
  }

  return `인증 오류: ${message}`;
}
