"use client";

import { useRouter } from "next/navigation";
import type { Choice } from "@/data/scenarios";

type Props = {
  scenarioId: number;
  choices: Choice[];
  nextSlug: string | null;
};

export default function ChoiceSelector({ scenarioId, choices, nextSlug }: Props) {
  const router = useRouter();

  function handleSelect(choice: Choice) {
    if (typeof window === "undefined") return;

    const existing = JSON.parse(
      window.localStorage.getItem("trolley-answers") || "{}"
    );
    existing[scenarioId] = {
      key: choice.key,
      label: choice.label,
      tags: choice.tags,
    };
    window.localStorage.setItem("trolley-answers", JSON.stringify(existing));

    if (nextSlug) {
      router.push(`/scenario/${nextSlug}`);
    } else {
      router.push("/result");
    }
  }

  return (
    <div className="space-y-3">
      {choices.map((choice, idx) => (
        <button
          key={choice.key}
          onClick={() => handleSelect(choice)}
          className="w-full text-left bg-paper border border-ink/15 hover:border-ink hover:bg-white p-6 md:p-7 transition-all group"
        >
          <div className="flex items-start gap-5">
            <div className="serif text-muted/50 text-lg tabular-nums shrink-0 mt-0.5">
              {String.fromCharCode(65 + idx)}.
            </div>
            <div className="flex-1">
              <div className="serif text-xl md:text-2xl leading-snug mb-2 group-hover:text-accent transition-colors">
                {choice.label}
              </div>
              <div className="text-[14px] text-muted leading-relaxed">
                {choice.sub}
              </div>
            </div>
            <div className="serif text-muted/30 group-hover:text-accent group-hover:translate-x-1 transition-all">
              →
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
