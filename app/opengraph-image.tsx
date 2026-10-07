import { ImageResponse } from "next/og";
import { loadFont } from "@/lib/og-font";

export const runtime = "edge";
export const alt = "선로 위의 다섯 사람 — 윤리 사고실험";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "선로 위의 다섯 사람";
const SUB = "트롤리 문제 · 15개의 질문 · 약 12분 · 도덕 유형 분석";
const EYEBROW = "TROLLEY PROBLEM · 윤리 사고실험";

export default async function Image() {
  const text = Array.from(new Set((TITLE + SUB + EYEBROW).split(""))).join("");
  const [serif400, serif500] = await Promise.all([
    loadFont("Noto Serif KR", 400, text),
    loadFont("Noto Serif KR", 500, text),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#fafaf7",
          color: "#1a1a1a",
          fontFamily: "Serif400",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: "0.3em",
            color: "#6b6b66",
            marginBottom: 40,
          }}
        >
          {EYEBROW}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Serif500",
            fontSize: 132,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            marginBottom: 48,
          }}
        >
          {TITLE}
        </div>
        <div
          style={{
            display: "flex",
            width: 320,
            height: 1,
            background: "rgba(26,26,26,0.2)",
            position: "relative",
            marginBottom: 48,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 155,
              top: -5,
              width: 11,
              height: 11,
              borderRadius: 99,
              background: "#8b3a3a",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.15em",
            color: "#6b6b66",
          }}
        >
          {SUB}
        </div>
      </div>
    ),
    { ...size, fonts: [
      { name: "Serif400", data: serif400, weight: 400, style: "normal" },
      { name: "Serif500", data: serif500, weight: 500, style: "normal" },
    ] }
  );
}
