"use client";

import { useState } from "react";

type CopySqlButtonProps = {
  sql: string;
};

export function CopySqlButton({ sql }: CopySqlButtonProps) {
  const [message, setMessage] = useState("SQL 복사");

  async function copySql() {
    try {
      await navigator.clipboard.writeText(sql);
      setMessage("복사 완료");
      window.setTimeout(() => setMessage("SQL 복사"), 1800);
    } catch {
      setMessage("복사 실패");
      window.setTimeout(() => setMessage("SQL 복사"), 1800);
    }
  }

  return (
    <button
      type="button"
      onClick={copySql}
      className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-bold text-white transition hover:bg-emerald-800"
    >
      {message}
    </button>
  );
}
