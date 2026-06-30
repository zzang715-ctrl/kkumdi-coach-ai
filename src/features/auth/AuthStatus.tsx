"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabaseClient";

const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(!hasSupabaseConfig);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      return;
    }

    let mounted = true;
    const supabase = createBrowserSupabaseClient();

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!mounted) {
          return;
        }

        setUser(data.user ?? null);
        setIsReady(true);
      })
      .catch(() => {
        if (mounted) {
          setIsReady(true);
        }
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) {
        return;
      }

      setUser(session?.user ?? null);
      setIsReady(true);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    setIsLoggingOut(true);

    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (!isReady) {
    return (
      <span className="inline-flex h-11 items-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-500">
        로그인 확인 중
      </span>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-wrap gap-2">
        <Link
          href="/login"
          className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-500"
        >
          로그인
        </Link>
        <Link
          href="/signup"
          className="inline-flex h-11 items-center justify-center rounded-md border border-emerald-200 bg-white px-4 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
        >
          회원가입
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex min-h-11 items-center rounded-md border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-900">
        {user.email}
      </span>
      <button
        type="button"
        onClick={logout}
        disabled={isLoggingOut}
        className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
      </button>
    </div>
  );
}
