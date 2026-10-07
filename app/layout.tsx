import type { Metadata } from "next";
import "./globals.css";

const SITE = "https://trolley-ethics.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "선로 위의 다섯 사람 — 윤리 사고실험",
    template: "%s — 선로 위의 다섯 사람",
  },
  description:
    "트롤리 문제와 그 변형들. 60년의 철학적 고뇌를 열다섯 개의 질문으로 따라가본다.",
  openGraph: {
    title: "선로 위의 다섯 사람",
    description: "윤리 사고실험을 따라 자신의 도덕 직관을 살펴보는 시간",
    type: "website",
    siteName: "선로 위의 다섯 사람",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
