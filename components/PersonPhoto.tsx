"use client";

import { useEffect, useState } from "react";
import { PersonMedal } from "./TypeIcon";

/** 실존 인물만 — 위키백과 문서 제목. 가상 인물은 저작권 때문에 사진 없이 메달로 둔다 */
const WIKI: Record<string, string> = {
  "피터 싱어": "Peter_Singer",
  "임마누엘 칸트": "Immanuel_Kant",
  "한나 아렌트": "Hannah_Arendt",
  "버나드 윌리엄스": "Bernard_Williams",
  "존 롤스": "John_Rawls",
  "주디스 자비스 톰슨": "Judith_Jarvis_Thomson",
  "데이비드 흄": "David_Hume",
  "존 스튜어트 밀": "John_Stuart_Mill",
  "머니볼의 빌리 빈": "Billy_Beane",
  "아리스토텔레스": "Aristotle",
  "로널드 드워킨": "Ronald_Dworkin",
  "로버트 볼트의 토머스 모어": "Thomas_More",
  "위르겐 하버마스": "Jürgen_Habermas",
  "알베르 카뮈": "Albert_Camus",
};

/** 위키백과 대표 이미지를 흑백 원형으로. 못 불러오면 이니셜 메달 */
export default function PersonPhoto({ name, size = 56 }: { name: string; size?: number }) {
  const title = WIKI[name];
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!title) return;
    let alive = true;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const url: string | undefined = d?.thumbnail?.source;
        if (alive) url ? setSrc(url) : setFailed(true);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [title]);

  if (!title || failed || !src) return <PersonMedal name={name} size={size} />;

  return (
    <a
      href={`https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`}
      target="_blank"
      rel="noopener noreferrer"
      title="사진: Wikipedia / Wikimedia Commons"
      className="relative shrink-0 rounded-full overflow-hidden border border-ink/15"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className="w-full h-full object-cover object-top grayscale contrast-[1.05]"
      />
    </a>
  );
}
