import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kkumdi-coach-ai.vercel.app"),
  title: "꿈디코치 AI 강사비서",
  description: "강의 준비, 현장 자료 수집, 결과 보고와 홍보 콘텐츠 제작을 하나의 프로젝트 흐름으로 연결하는 AI 강사비서",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "꿈디코치 AI 강사비서",
    description: "제안서부터 결과 보고서, 블로그, 마케팅 문구까지 강의 업무를 한 흐름으로 완성합니다.",
    url: "https://kkumdi-coach-ai.vercel.app",
    siteName: "꿈디코치 AI 강사비서",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://kkumdi-coach-ai.vercel.app/kakao-thumbnail.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "꿈디코치 AI 강사비서 링크 미리보기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "꿈디코치 AI 강사비서",
    description: "교육 강사와 코치를 위한 AI 업무 파트너",
    images: ["https://kkumdi-coach-ai.vercel.app/kakao-thumbnail.png"],
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
