import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "꿈디코치 AI 강사비서",
  description: "강의 전, 강의 중, 강의 후 업무를 하나의 프로젝트 흐름으로 연결하는 AI 강사 비서",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
