import { ImageResponse } from "next/og";
import { getScenarioBySlug, scenarios } from "@/data/scenarios";
import { loadFont } from "@/lib/og-font";

export const runtime = "edge";
export const alt = "선로 위의 다섯 사람 — 질문";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const s = getScenarioBySlug(params.id) ?? scenarios[0];
  const eyebrow = `질문 ${s.number} / ${String(scenarios.length).padStart(2, "0")} · 선로 위의 다섯 사람`;
  const ask = "너라면?";
  const text = Array.from(new Set((s.title + s.question + eyebrow + ask).split(""))).join("");
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
          justifyContent: "space-between",
          background: "#fafaf7",
          color: "#1a1a1a",
          padding: "64px 80px",
          fontFamily: "Serif400",
        }}
      >
        <div style={{ display: "flex", fontSize: 20, letterSpacing: "0.25em", color: "#6b6b66" }}>{eyebrow}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 40, color: "#6b6b66", marginBottom: 20 }}>{s.title}</div>
          <div style={{ display: "flex", fontFamily: "Serif500", fontSize: s.question.length > 18 ? 68 : 84, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            {s.question}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 11, height: 11, borderRadius: 99, background: "#8b3a3a" }} />
          <div style={{ display: "flex", fontFamily: "Serif500", fontSize: 30, color: "#8b3a3a" }}>{ask}</div>
          <div style={{ display: "flex", marginLeft: "auto", fontSize: 20, letterSpacing: "0.15em", color: "#6b6b66" }}>trolley-ethics.vercel.app</div>
        </div>
      </div>
    ),
    { ...size, fonts: [
      { name: "Serif400", data: serif400, weight: 400, style: "normal" },
      { name: "Serif500", data: serif500, weight: 500, style: "normal" },
    ] }
  );
}
