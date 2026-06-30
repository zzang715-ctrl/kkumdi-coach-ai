import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kkumdi-coach-ai.vercel.app"),
  title: "꿈디코치 AI 강사비서",
  description: "강의 전, 강의 중, 강의 후 업무를 하나의 프로젝트 흐름으로 연결하는 AI 강사 비서",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "꿈디코치 AI 강사비서",
    description: "기본정보와 자료수집을 바탕으로 결과보고서, 블로그, 마케팅 콘텐츠를 만드는 AI 강사 비서",
    url: "https://kkumdi-coach-ai.vercel.app",
    siteName: "꿈디코치 AI 강사비서",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "꿈디코치 AI 강사비서 링크 미리보기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "꿈디코치 AI 강사비서",
    description: "교육 강사와 코치를 위한 AI 업무 파트너",
    images: ["/opengraph-image"],
  },
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
