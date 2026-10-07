// Google Fonts v1 /css 엔드포인트는 기본으로 TTF를 내려준다 — Satori는 TTF/OTF만 받는다.
export async function loadFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css?family=${encodeURIComponent(
      family
    )}:${weight}&text=${encodeURIComponent(text)}&display=swap`,
    { cache: "force-cache" }
  ).then((r) => r.text());

  const match =
    css.match(/src:\s*url\((https:[^)]+)\)\s*format\(['"]truetype['"]\)/) ??
    css.match(/src:\s*url\((https:[^)]+)\)/);
  if (!match) throw new Error(`Font URL not found: ${family} ${weight}`);

  return fetch(match[1], { cache: "force-cache" }).then((r) => r.arrayBuffer());
}
