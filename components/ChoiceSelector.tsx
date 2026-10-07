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

  function handleNext() {
    if (exiting) return;
    setExiting(true);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (typeof window !== "undefined" && !reduced) {
      const main = document.querySelector("main") as HTMLElement | null;
      if (main) {
        main.style.transition =
          "opacity 320ms ease-in, transform 480ms cubic-bezier(0.4, 0, 0.85, 0.5)";
        main.style.transform = "translateY(-100vh)";
        main.style.opacity = "0";
      }
    }

    window.setTimeout(
      () => {
        if (nextSlug) {
          router.push(`/scenario/${nextSlug}`);
        } else {
          router.push("/result");
        }
      },
      reduced ? 0 : 460
    );
  }

  return (
    <div className="space-y-2">
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
              "w-full text-left px-4 py-3 md:px-5 md:py-3.5 transition-all group border",
              isSelected
                ? "border-ink bg-white"
                : isOther
                ? "border-ink/10 bg-paper opacity-60"
                : "border-ink/15 bg-paper hover:border-ink hover:bg-white",
              selectedKey === null ? "cursor-pointer" : "cursor-default",
            ].join(" ")}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={[
                  "serif text-[13px] tabular-nums shrink-0 mt-[3px]",
                  isSelected ? "text-accent" : "text-muted/50",
                ].join(" ")}
              >
                {String.fromCharCode(65 + idx)}.
              </div>
              <div className="flex-1">
                <div
                  className={[
                    "serif text-[14.5px] md:text-[15.5px] leading-snug mb-0.5 transition-colors",
                    isSelected ? "text-ink" : "group-hover:text-accent",
                  ].join(" ")}
                >
                  {choice.label}
                </div>
                <div
                  className={[
                    "text-[12px] leading-snug",
                    isSelected ? "text-accent" : "text-ink/75",
                  ].join(" ")}
                >
                  → {choice.outcome}
                </div>
                <div className="text-[11.5px] text-muted leading-snug">{choice.sub}</div>

                {selectedKey !== null && (
                  <div className="mt-2.5 pt-2.5 border-t border-ink/10 flex items-baseline gap-3">
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
              </div>
              <div
                className={[
                  "serif transition-all",
                  isSelected
                    ? "text-accent"
                    : "text-muted/30 group-hover:text-accent group-hover:translate-x-1",
                ].join(" ")}
              >
                {isSelected ? "✓" : "→"}
              </div>
            </div>
          </button>
        );
      })}

      {selectedKey !== null && (
        <div className="pt-6 fade-up">
          <p className="text-[13px] text-muted mb-4 leading-relaxed">
            막대는 같은 답을 한 사람의 비율. {pctNote}
          </p>
          <button
            onClick={handleNext}
            disabled={exiting}
            className="w-full bg-ink text-paper py-4 text-sm tracking-wide hover:bg-accent transition-colors disabled:opacity-50"
          >
            {nextSlug ? "다음 시나리오로 →" : "결과 보기 →"}
          </button>
        </div>
      )}
    </div>
  );
}
