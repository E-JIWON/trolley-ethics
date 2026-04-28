import { ImageResponse } from "next/og";
import { scenarios } from "@/data/scenarios";

export const runtime = "edge";

async function loadFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer> {
  // v1 /css endpoint serves TTF (format: truetype) by default — Satori needs TTF/OTF, not WOFF2.
  const css = await fetch(
    `https://fonts.googleapis.com/css?family=${encodeURIComponent(
      family
    )}:${weight}&text=${encodeURIComponent(text)}&display=swap`,
    { cache: "force-cache" }
  ).then((r) => r.text());

  const match =
    css.match(/src:\s*url\((https:[^)]+)\)\s*format\(['"]truetype['"]\)/) ??
    css.match(/src:\s*url\((https:[^)]+)\)/);
  if (!match) {
    throw new Error(`Font URL not found: ${family} ${weight}`);
  }

  return fetch(match[1], { cache: "force-cache" }).then((r) => r.arrayBuffer());
}

type AnswerRow = {
  number: string;
  label: string | null;
  pct: number | null;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") ?? "미지의 유형";
    const alias = searchParams.get("alias") ?? "Unknown";
    const subtitle = searchParams.get("subtitle") ?? "";
    const motto = searchParams.get("motto") ?? "";
    const rarity = parseInt(searchParams.get("rarity") ?? "0", 10);
    const answersStr = searchParams.get("answers") ?? "";
    const answerKeys = answersStr.split(",");

    const answerTrail: AnswerRow[] = scenarios.map((s, i) => {
      const key = answerKeys[i];
      if (!key || key === "-") {
        return { number: s.number, label: null, pct: null };
      }
      const choice = s.choices.find((c) => c.key === key);
      return {
        number: s.number,
        label: choice?.label ?? "—",
        pct: choice?.globalPct ?? null,
      };
    });

    const allText =
      `${name}${alias}${subtitle}${motto}당신의도덕유형은트롤리응답자중같은유형TROLLEYETHICSIssueNo01trolleyethicsvercelapp${rarity}%답변과패턴건너뜀` +
      answerTrail.map((r) => r.label ?? "").join("");
    const koText = Array.from(new Set(allText.split(""))).join("");

    const [serif400, serif500] = await Promise.all([
      loadFont("Noto Serif KR", 400, koText),
      loadFont("Noto Serif KR", 500, koText),
    ]);

    const nameFontSize = name.length <= 5 ? 144 : 108;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "#fafaf7",
            color: "#1a1a1a",
            padding: "72px 80px",
            fontFamily: "Serif400",
          }}
        >
          {/* Brand bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 18,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#6b6b66",
            }}
          >
            <div style={{ display: "flex" }}>TROLLEY ETHICS</div>
            <div style={{ display: "flex" }}>Issue No. 01</div>
          </div>

          <div style={{ display: "flex", height: 56 }} />

          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#6b6b66",
              marginBottom: 24,
            }}
          >
            당신의 도덕 유형
          </div>

          {/* Name */}
          <div
            style={{
              display: "flex",
              fontFamily: "Serif500",
              fontSize: nameFontSize,
              fontWeight: 500,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              marginBottom: 18,
            }}
          >
            {name}
          </div>

          {/* Alias */}
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#8b3a3a",
              marginBottom: 36,
            }}
          >
            {alias}
          </div>

          {/* Motto */}
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontFamily: "Serif500",
              lineHeight: 1.4,
              color: "#1a1a1a",
              marginBottom: 24,
              maxWidth: 880,
            }}
          >
            “{motto}”
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontFamily: "Serif400",
              lineHeight: 1.4,
              color: "rgba(26,26,26,0.65)",
              maxWidth: 880,
            }}
          >
            — {subtitle}
          </div>

          {/* Data panel — No.06 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 40,
              paddingTop: 22,
              borderTop: "1px solid rgba(26,26,26,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 16,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#6b6b66",
                marginBottom: 14,
              }}
            >
              No. 06 · 답변과 패턴
            </div>
            {answerTrail.map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  paddingTop: 11,
                  paddingBottom: 11,
                  borderBottom:
                    i < answerTrail.length - 1
                      ? "1px solid rgba(26,26,26,0.08)"
                      : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 17,
                    fontFamily: "Serif400",
                    color: "rgba(26,26,26,0.45)",
                    width: 30,
                  }}
                >
                  {row.number}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 22,
                    fontFamily: "Serif400",
                    color: row.label ? "#1a1a1a" : "rgba(26,26,26,0.4)",
                    flexGrow: 1,
                  }}
                >
                  {row.label ?? "건너뜀"}
                </div>
                {row.pct !== null && (
                  <div
                    style={{
                      display: "flex",
                      fontSize: 18,
                      fontFamily: "Serif500",
                      color: "#8b3a3a",
                    }}
                  >
                    {row.pct}%
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexGrow: 1, minHeight: 28 }} />

          {/* Rarity */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              paddingTop: 22,
              borderTop: "1px solid rgba(26,26,26,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 84,
                fontFamily: "Serif500",
                fontWeight: 500,
                color: "#8b3a3a",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
              }}
            >
              {rarity}%
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "#6b6b66",
                paddingBottom: 10,
              }}
            >
              응답자 중 같은 유형
            </div>
          </div>

          <div style={{ display: "flex", flexGrow: 1, minHeight: 28 }} />

          {/* CTA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: 22,
              borderTop: "1px solid rgba(26,26,26,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontFamily: "Serif500",
                color: "#1a1a1a",
                marginBottom: 8,
              }}
            >
              당신의 도덕 유형은?
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 17,
                letterSpacing: "0.15em",
                color: "#6b6b66",
              }}
            >
              trolley-ethics.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1350,
        fonts: [
          { name: "Serif400", data: serif400, weight: 400, style: "normal" },
          { name: "Serif500", data: serif500, weight: 500, style: "normal" },
        ],
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return new Response(`OG generation failed: ${msg}`, { status: 500 });
  }
}
