"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { scenarios } from "@/data/scenarios";

type Answer = {
  key: string;
  label: string;
  tags: string[];
};

type Answers = Record<number, Answer>;

export default function ResultAnalysis() {
  const [answers, setAnswers] = useState<Answers | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("trolley-answers");
    if (raw) {
      try {
        setAnswers(JSON.parse(raw));
      } catch {
        setAnswers({});
      }
    } else {
      setAnswers({});
    }
  }, []);

  if (answers === null) {
    return (
      <div className="text-center py-20 text-muted text-sm">
        결과를 불러오는 중...
      </div>
    );
  }

  const answered = Object.keys(answers).length;

  if (answered === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <p className="serif text-2xl mb-6 leading-relaxed">
          아직 답한 시나리오가 없습니다.
        </p>
        <Link
          href="/scenario/trolley"
          className="inline-flex items-center gap-3 bg-ink text-paper px-8 py-4 text-sm tracking-wide hover:bg-accent transition-colors"
        >
          첫 시나리오로 →
        </Link>
      </div>
    );
  }

  // 태그 빈도 계산
  const tagCount: Record<string, number> = {};
  Object.values(answers).forEach((a) => {
    a.tags?.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedTags[0]?.[1] || 1;

  // 비일관성 감지
  const inconsistencies: { type: string; desc: string }[] = [];
  if (answers[1]?.key === "switch" && answers[2]?.key === "nothing") {
    inconsistencies.push({
      type: "수단과 부수효과의 차이",
      desc: "1번에선 레버를 당겼고, 2번에선 밀지 않았습니다. 두 시나리오 모두 한 명을 희생해 다섯 명을 살리는 구조이지만, 결과가 동일해도 행위의 방식이 다르면 직관이 달라진다는 뜻이에요. 이는 '이중결과 원칙' — 죽음이 의도된 수단인가, 예측된 부작용인가 — 의 고전적 사례입니다.",
    });
  }
  if (answers[1]?.key === "switch" && answers[3]?.key === "nothing") {
    inconsistencies.push({
      type: "산수의 한계",
      desc: "1번과 3번은 수치상 동일합니다(1명 희생, 5명 구함). 그러나 의사 시나리오는 거부했어요. 이는 권리, 사회적 신뢰, 약속의 무게가 단순 효용 계산을 초과한다는 직관입니다. 결과주의의 가장 강력한 반례 중 하나죠.",
    });
  }
  if (answers[1]?.key === "switch" && answers[5]?.key === "nothing") {
    inconsistencies.push({
      type: "공평성과 사랑",
      desc: "낯선 사람들에겐 공리주의자였지만, 가족 앞에선 멈췄습니다. 이건 비일관성이 아니라 — 어쩌면 인간 도덕의 본질입니다. 버나드 윌리엄스가 말한 '한 가지 생각이 너무 많다'의 직관, 즉 사랑은 정당화를 거치지 않는다는 감각이에요.",
    });
  }

  // 주된 윤리 성향
  const top = sortedTags[0]?.[0] || "";
  let summary = "";
  if (top.includes("공리") || top.includes("결과")) {
    summary =
      "결과를 중심으로 사고하는 경향이 있습니다. 가능한 가장 좋은 결과를 만들어내는 것이 도덕의 목표라는 직관이죠. 이는 J.S. 밀과 피터 싱어의 입장에 가깝습니다.";
  } else if (top.includes("의무") || top.includes("권리")) {
    summary =
      "원칙과 권리를 중심으로 사고합니다. 결과가 좋아도 어떤 행위는 본질적으로 잘못이라는 직관이죠. 칸트와 톰슨의 입장에 가깝습니다.";
  } else if (top.includes("덕") || top.includes("관계")) {
    summary =
      "성품과 관계를 중심으로 사고합니다. 도덕은 규칙이 아니라 어떤 사람이 되느냐의 문제라는 직관이죠. 아리스토텔레스, 윌리엄스, 메리 미즐리의 입장에 가깝습니다.";
  } else {
    summary =
      "여러 윤리 전통을 가로지르는 답변을 했습니다. 한 이론에 묶이지 않고 상황마다 다른 직관을 따른 것이에요.";
  }

  return (
    <div className="space-y-16">
      {/* 요약 */}
      <section className="fade-up">
        <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-4">
          당신의 도덕적 지문
        </div>
        <p className="serif text-2xl md:text-3xl leading-[1.5] tracking-[-0.01em] mb-6">
          {summary}
        </p>
        <p className="text-sm text-muted">
          {answered}개의 시나리오를 마쳤습니다.
        </p>
      </section>

      {/* 선택 기록 */}
      <section className="fade-up fade-up-delay-1">
        <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-6">
          당신의 선택
        </div>
        <ol className="border-t border-ink/15">
          {scenarios.map((s) => {
            const a = answers[s.id];
            return (
              <li
                key={s.id}
                className="border-b border-ink/15 py-5 flex items-start gap-5"
              >
                <div className="serif text-muted/50 tabular-nums w-8 shrink-0">
                  {s.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="serif text-lg leading-snug mb-1">
                    {s.title}
                  </div>
                  {a ? (
                    <div className="text-sm text-muted">→ {a.label}</div>
                  ) : (
                    <div className="text-sm text-muted/50 italic">건너뜀</div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* 이론 분포 */}
      <section className="fade-up fade-up-delay-2">
        <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-6">
          윤리 이론별 일치도
        </div>
        <div className="space-y-5">
          {sortedTags.map(([tag, count]) => {
            const pct = Math.round((count / maxCount) * 100);
            return (
              <div key={tag}>
                <div className="flex justify-between items-baseline mb-2">
                  <div className="serif text-lg">{tag}</div>
                  <div className="text-[11px] text-muted tabular-nums">
                    {count}회
                  </div>
                </div>
                <div className="h-[2px] bg-line">
                  <div
                    className="h-full bg-ink transition-all duration-1000"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 비일관성 */}
      {inconsistencies.length > 0 && (
        <section className="fade-up fade-up-delay-3">
          <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-6">
            눈여겨볼 지점
          </div>
          <div className="space-y-8">
            {inconsistencies.map((inc, i) => (
              <div key={i} className="border-l-2 border-accent pl-6 py-1">
                <div className="serif text-xl mb-3 leading-snug">
                  {inc.type}
                </div>
                <p className="text-[15px] leading-[1.8] text-ink/80">
                  {inc.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {inconsistencies.length === 0 && answered === scenarios.length && (
        <section className="fade-up fade-up-delay-3">
          <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-6">
            관찰
          </div>
          <p className="serif text-xl leading-[1.6] text-ink/80 italic">
            매우 일관된 직관을 가지고 있습니다. 시나리오의 표면적 차이에 흔들리지 않고 같은 원칙을 적용했어요. 이는 흔치 않은 패턴이며, 강한 윤리적 헌신을 시사합니다.
          </p>
        </section>
      )}

      {/* 액션 */}
      <section className="fade-up flex flex-col sm:flex-row gap-3 pt-8 border-t border-ink/15">
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.localStorage.removeItem("trolley-answers");
              window.location.href = "/";
            }
          }}
          className="flex-1 border border-ink py-4 text-sm tracking-wide hover:bg-ink hover:text-paper transition-colors"
        >
          처음부터 다시
        </button>
        <Link
          href="/"
          className="flex-1 bg-ink text-paper py-4 text-sm tracking-wide hover:bg-accent transition-colors text-center"
        >
          목차로 돌아가기
        </Link>
      </section>
    </div>
  );
}
