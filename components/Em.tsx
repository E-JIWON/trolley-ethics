import { splitEmphasis } from "@/data/scenarios";

/** `**강조**` 마크업 → 밑줄 강조. 서버 컴포넌트. */
export default function Em({ children }: { children: string }) {
  return (
    <>
      {splitEmphasis(children).map((p, i) =>
        p.em ? (
          <strong key={i} className="em">
            {p.text}
          </strong>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}
