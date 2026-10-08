"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Choice } from "@/data/scenarios";
import { useCountUp } from "./Reveal";

type Props = {
  scenarioId: number;
  choices: Choice[];
  nextSlug: string | null;
  pctNote: string;
};

function ChoicePct({
  pct,
  revealed,
  delay,
  isSelected,
}: {
  pct: number;
  revealed: boolean;
  delay: number;
  isSelected: boolean;
}) {
  const v = useCountUp(pct, revealed, 1100, delay);
  return (
    <div
      className={[
        "text-[12px] tabular-nums shrink-0 w-9 text-right",
        isSelected ? "text-accent" : "text-muted",
      ].join(" ")}
    >
      {v}%
    </div>
  );
}

export default function ChoiceSelector({
  scenarioId,
  choices,
  nextSlug,
  pctNote,
}: Props) {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [exiting, setExiting] = useState(false);

  // 뒤로 가기 등으로 다시 왔을 때 이미 고른 답을 복원
  useEffect(() => {
    try {
      const saved = JSON.parse(
        window.localStorage.getItem("trolley-answers") || "{}"
      )[scenarioId];
      if (saved?.key && choices.some((c) => c.key === saved.key)) {
        setSelectedKey(saved.key);
        setRevealed(true);
      }
    } catch {}
  }, [scenarioId, choices]);

  function handleSelect(choice: Choice) {
    if (typeof window === "undefined") return;
    if (selectedKey) return;

    const existing = JSON.parse(
      window.localStorage.getItem("trolley-answers") || "{}"
    );
    existing[scenarioId] = {
      key: choice.key,
      label: choice.label,
      tags: choice.tags,
    };
    window.localStorage.setItem("trolley-answers", JSON.stringify(existing));
    setSelectedKey(choice.key);
    window.setTimeout(() => setRevealed(true), 60);
  }

  // 다음 페이지를 미리 받아 두어 버튼을 누르면 바로 넘어가게
  useEffect(() => {
    router.prefetch(nextSlug ? `/scenario/${nextSlug}` : "/result");
  }, [router, nextSlug]);

  function handleNext() {
    if (exiting) return;
    setExiting(true);
    router.push(nextSlug ? `/scenario/${nextSlug}` : "/result");
  }

  return (
    <div className="space-y-4">
      {choices.map((choice, idx) => {
        const isSelected = selectedKey === choice.key;
        const isOther = selectedKey !== null && !isSelected;
        const stagger = idx * 140;

        return (
          <button
            key={choice.key}
            onClick={() => handleSelect(choice)}
            disabled={selectedKey !== null}
            className={[
              "w-full text-left pl-4 py-0.5 border-l-2 transition-colors group",
              isSelected
                ? "border-accent"
                : isOther
                ? "border-ink/10 opacity-50"
                : "border-ink/15 hover:border-ink",
              selectedKey === null ? "cursor-pointer" : "cursor-default",
            ].join(" ")}
          >
            {/* 1줄: 선택 — 결과 / 2줄: 그 논리 */}
            <div className="flex items-baseline flex-wrap gap-x-2.5 gap-y-0.5">
              <span
                className={[
                  "serif text-[16px] md:text-[17px] leading-snug transition-colors",
                  isSelected ? "text-accent" : "text-ink group-hover:text-accent",
                ].join(" ")}
              >
                {choice.label}
                {isSelected && <span className="ml-1.5 text-[13px]">✓</span>}
              </span>
              <span className="text-[12.5px] leading-snug text-ink/60">→ {choice.outcome}</span>
            </div>
            <div className="mt-1 text-[12px] leading-snug text-muted">{choice.sub}</div>

            {selectedKey !== null && (
              <div className="mt-2 flex items-baseline gap-3 pr-1">
                <div className="flex-1 h-[3px] bg-line relative overflow-hidden">
                  <div
                    className={[
                      "absolute inset-y-0 left-0 transition-[width] duration-[1100ms] ease-out",
                      isSelected ? "bg-accent" : "bg-ink/30",
                    ].join(" ")}
                    style={{
                      width: revealed ? `${choice.globalPct}%` : "0%",
                      transitionDelay: `${stagger}ms`,
                    }}
                  />
                </div>
                <ChoicePct
                  pct={choice.globalPct}
                  revealed={revealed}
                  delay={stagger}
                  isSelected={isSelected}
                />
              </div>
            )}
          </button>
        );
      })}

      {selectedKey !== null && (
        <div className="pt-5 fade-up">
          <p className="text-[12.5px] text-muted mb-4 leading-relaxed">
            막대는 같은 답을 한 사람의 비율. {pctNote}
          </p>
          <button
            onClick={handleNext}
            disabled={exiting}
            className="w-full bg-ink text-paper py-3.5 text-sm tracking-wide hover:bg-accent transition-colors disabled:opacity-50"
          >
            {nextSlug ? "다음 시나리오로 →" : "결과 보기 →"}
          </button>
        </div>
      )}
    </div>
  );
}
