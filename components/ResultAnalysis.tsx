"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { scenarios } from "@/data/scenarios";
import Reveal, { useCountUp, useInView } from "./Reveal";

type Answer = {
  key: string;
  label: string;
  tags: string[];
};

type Answers = Record<number, Answer>;

type Profile = {
  key: string;
  name: string;
  alias: string;
  motto: string;
  subtitle: string;
  description: string;
  strength: string;
  weakness: string;
  similarTo: {
    philosopher: { name: string; note: string };
    character: { name: string; note: string };
  };
  oftenSays: string;
  oftenHears: string;
  clashWith: { type: string; reason: string };
  syncWith: { type: string; reason: string };
  ifYouWere: { heading: string; behavior: string };
  rarityPct: number;
  hypotheticals: { situation: string; reaction: string }[];
};

const CATEGORY_MAP: Record<string, string[]> = {
  결과: ["공리주의", "결과주의"],
  원칙: ["의무론", "권리 기반", "이중결과 원칙", "행위/방관 구분"],
  관계: ["덕 윤리", "관계 윤리"],
  절차: ["계약주의", "공평주의", "절차적 정의"],
};

const COORD_WEIGHTS: Record<string, { x: number; y: number }> = {
  결과: { x: -1, y: -1 },
  원칙: { x: 1, y: -0.3 },
  절차: { x: 0.5, y: -1 },
  관계: { x: 0, y: 1 },
};

const TYPE_BRIEFS: {
  key: string;
  name: string;
  alias: string;
  tagline: string;
  coords: { x: number; y: number };
}[] = [
  {
    key: "계산자",
    name: "계산자",
    alias: "The Calculator",
    tagline: "다섯이 한보다 무겁다고 믿는 사람",
    coords: { x: -0.7, y: -0.7 },
  },
  {
    key: "원칙주의자",
    name: "원칙주의자",
    alias: "The Principlist",
    tagline: "결과가 좋아도 안 되는 일이 있다",
    coords: { x: 0.8, y: -0.3 },
  },
  {
    key: "관계주의자",
    name: "관계주의자",
    alias: "The Particularist",
    tagline: "내 사람부터, 변명은 그 다음",
    coords: { x: 0, y: 0.8 },
  },
  {
    key: "절차주의자",
    name: "절차주의자",
    alias: "The Proceduralist",
    tagline: "어떻게 정했느냐가 먼저",
    coords: { x: 0.5, y: -0.7 },
  },
  {
    key: "흔들리는",
    name: "흔들리는 직관",
    alias: "The Wavering Mind",
    tagline: "한 저울로는 다 못 잰다",
    coords: { x: 0, y: 0 },
  },
];

function computeScore(answers: Answers) {
  const score: Record<string, number> = { 결과: 0, 원칙: 0, 관계: 0, 절차: 0 };
  Object.values(answers).forEach((a) => {
    a.tags?.forEach((tag) => {
      for (const [cat, tags] of Object.entries(CATEGORY_MAP)) {
        if (tags.includes(tag)) score[cat] += 1;
      }
    });
  });
  return score;
}

function computeCoords(score: Record<string, number>) {
  let x = 0;
  let y = 0;
  let total = 0;
  for (const [cat, count] of Object.entries(score)) {
    const w = COORD_WEIGHTS[cat];
    if (!w) continue;
    x += w.x * count;
    y += w.y * count;
    total += count;
  }
  if (total > 0) {
    x /= total;
    y /= total;
  }
  return { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
}

function computeProfile(answers: Answers, score: Record<string, number>): Profile {
  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const [topCat, topScore] = sorted[0];
  const secondScore = sorted[1]?.[1] ?? 0;
  const wavering = topScore === 0 || topScore === secondScore;
  const q5 = answers[5]?.key;

  if (wavering) {
    return {
      key: "흔들리는",
      name: "흔들리는 직관",
      alias: "The Wavering Mind",
      motto: "정답이 하나라면, 살아있는 것이 너무 단순할 것이다.",
      subtitle: "한 이론에 묶이지 않으려는 사람",
      description:
        "당신은 한 가지 원칙으로 다섯 가지 답을 끌어내려 하지 않았습니다. 어떤 사람들은 이걸 일관성의 부족이라 부를 거예요. 하지만 어쩌면, 인간의 도덕은 원래 한 자루 저울로는 잴 수 없는 것이었을지도 모릅니다.",
      strength: "한 이론에 갇히지 않는 융통성. 상황의 결을 읽는 감각.",
      weakness: "결정의 근거를 본인도 설명하지 못하는 순간이 있다.",
      similarTo: {
        philosopher: {
          name: "알베르 카뮈",
          note: "부조리 앞에서 답을 거부하면서도, 살아내려 했던 사람.",
        },
        character: {
          name: "햄릿",
          note: "결정을 미루는 것이 비겁이 아니라 도덕의 한 형태일 수 있는 사람.",
        },
      },
      oftenSays: "그건 상황에 따라 달라.",
      oftenHears: "그래서 결국 어떻게 할 건데?",
      clashWith: {
        type: "원칙주의자",
        reason: "그들의 단호함이 당신에겐 가끔 폭력처럼 들린다.",
      },
      syncWith: {
        type: "관계주의자",
        reason: "둘 다, 정답이 아니라 결을 본다.",
      },
      ifYouWere: {
        heading: "만약 당신이 다큐멘터리 감독이라면",
        behavior:
          "당신은 한 사건을 양쪽에서 모두 보여줄 줄 안다. 다만 — 당신이 어디에 서 있는지를 묻는 사람에게, 끝까지 답하지 않을지도 모른다.",
      },
      rarityPct: 16,
      hypotheticals: [
        {
          situation: "거짓말 한 번이면 다섯 명의 목숨을 살릴 수 있다.",
          reaction:
            "거짓말과 죽음을 같은 저울에 올리지 않을 것이다. 다만 누군가는 올려야 한다는 사실에 오래 시달릴 것이다.",
        },
        {
          situation: "친구가 부탁한 위증 — 거절하면 친구의 인생이 끝난다.",
          reaction: "끝까지 답을 미룰 것이다. 그리고 미룬 시간이 답이 될 것이다.",
        },
      ],
    };
  }

  if (topCat === "결과") {
    return {
      key: "계산자",
      name: "계산자",
      alias: "The Calculator",
      motto: "한 명보다 다섯이다. 그 다섯이 누구인지는 묻지 않는다.",
      subtitle:
        q5 === "nothing"
          ? "산수가 멈추는 자리를 아는 사람"
          : "끝까지 산수를 지킨 사람",
      description:
        "당신은 이 세계가 결국 산수로 정리될 수 있다고 믿고 싶어 합니다. 그 믿음 덕분에 결정의 무게를 줄여본 적이 있을 거예요. 다만 산수가 끝나는 자리에서 한 번쯤 멈춘 적이 있고, 그 멈춤이 생각보다 오래 남아 있을 겁니다.",
      strength: "복잡한 상황에서도 주저앉지 않고 결정을 내리는 사람.",
      weakness: "사랑을 산수에 넣어버리는 순간이 있다. 본인은 그 순간을 잘 모른다.",
      similarTo: {
        philosopher: {
          name: "피터 싱어",
          note: "효율적 이타주의의 대부. 익사하는 아이 비유로 당신의 직관을 흔든 적이 있을 것이다.",
        },
        character: {
          name: "닥터 스트레인지",
          note: "1,400만 가지 미래 중 한 가지를 골라야 했던 사람.",
        },
      },
      oftenSays: "현실적으로 따져보면…",
      oftenHears: "네가 그렇게 차가운 사람이었어?",
      clashWith: {
        type: "관계주의자",
        reason: "당신의 산수가 그들에겐 사람을 잃은 시선으로 들린다.",
      },
      syncWith: {
        type: "절차주의자",
        reason: "둘 다, 감정이 결정을 흐리는 것을 의심한다.",
      },
      ifYouWere: {
        heading: "만약 당신이 응급실 의사라면",
        behavior:
          "당신은 트리아지(중증도 분류)에 가장 능숙한 의사가 될 것이다. 그러나 한밤중, 살리지 못한 한 명을 오래 떠올릴 것이다.",
      },
      rarityPct: 18,
      hypotheticals: [
        {
          situation:
            "발각될 일 없는 회삿돈 5천만 원. 그 돈으로 다섯 명을 후원할 수 있다.",
          reaction:
            "한 번쯤 계산할 것이다. 그리고 그 계산이 흔들렸다는 사실에 더 놀랄 것이다.",
        },
        {
          situation: "동료가 가짜 진단서를 부탁한다. 그러면 그가 산다.",
          reaction:
            "효용은 분명한데, '들킬 가능성은?'이라는 단서가 자꾸 끼어들 것이다.",
        },
      ],
    };
  }

  if (topCat === "원칙") {
    return {
      key: "원칙주의자",
      name: "원칙주의자",
      alias: "The Principlist",
      motto: "결과가 좋아도, 어떤 일은 그 자체로 잘못이다.",
      subtitle:
        q5 === "nothing"
          ? "원칙도 사랑도 양보하지 않는 사람"
          : "원칙은 사랑보다 먼저인 사람",
      description:
        "당신은 결과가 좋아도 어떤 일은 그 자체로 잘못이라는 감각을 잃은 적이 없습니다. 사람은 수단이 아니라 사람이라는 직관, 그것이 당신을 당신답게 만들어요. 다만 다섯의 죽음 앞에서 '나는 깨끗하다'는 말이 충분한지, 가끔 스스로에게 물을 겁니다.",
      strength: "유혹 앞에서 흔들리지 않는다. 자기 자신을 가장 신뢰할 수 있는 사람.",
      weakness: "다섯의 죽음 앞에서도 '나는 깨끗하다'는 말을 너무 일찍 꺼낼 수 있다.",
      similarTo: {
        philosopher: {
          name: "임마누엘 칸트",
          note: "'사람을 수단으로만 대하지 말라' — 정언명령을 만든 사람.",
        },
        character: {
          name: "한나 아렌트",
          note: "악의 평범성을 지목하며, 사유하지 않는 것을 가장 무서워한 사람.",
        },
      },
      oftenSays: "그건 안 되는 일이야.",
      oftenHears: "왜 그렇게 융통성이 없어?",
      clashWith: {
        type: "계산자",
        reason: "그들의 효용 계산이 당신에겐 모독으로 들린다.",
      },
      syncWith: {
        type: "절차주의자",
        reason: "둘 다 결과보다 결정의 자격을 먼저 묻는다.",
      },
      ifYouWere: {
        heading: "만약 당신이 법정 변호인이라면",
        behavior:
          "당신은 절차를 끝까지 지키는 변호인이 될 것이다. 결과가 패소여도 — 정의가 짓밟히는 것은 견디지 못한다.",
      },
      rarityPct: 28,
      hypotheticals: [
        {
          situation:
            "후배의 큰 실수를 당신이 했다고 덮어주면 후배는 살고, 당신만 책임진다.",
          reaction:
            "거짓말의 무게부터 잴 것이다. 그리고 그 거짓말을 안고 살아갈 자기 자신을 더 오래 견뎌야 한다는 걸 안다.",
        },
        {
          situation: "지하철에서 처음 본 노숙자가 추위에 떨고 있다.",
          reaction: "'해야 한다'와 '하면 좋다' 사이에서 끝까지 머뭇거릴 것이다.",
        },
      ],
    };
  }

  if (topCat === "관계") {
    return {
      key: "관계주의자",
      name: "관계주의자",
      alias: "The Particularist",
      motto: "내 사람부터. 변명은 그 다음에.",
      subtitle:
        q5 === "nothing"
          ? "사랑은 정당화되지 않는다고 믿는 사람"
          : "사랑조차 한 번은 의심해본 사람",
      description:
        "당신에게 도덕은 규칙이 아니라 누구를 어떻게 사랑하는가의 문제입니다. 가족과 낯선 사람의 무게가 다르다는 것을, 굳이 정당화하지 않아도 알고 있어요. 다만 그 사랑의 경계 바깥에 누가 있는지를, 가끔은 떠올릴 필요가 있을지 모릅니다.",
      strength: "추상적 정의가 사라진 자리에서 사람을 사람으로 대하는 능력.",
      weakness: "당신의 사랑이 닿지 않는 사람들에 대해 의외로 차가울 수 있다.",
      similarTo: {
        philosopher: {
          name: "버나드 윌리엄스",
          note: "'한 가지 생각이 너무 많다' — 사랑은 정당화를 거치지 않는다고 말한 사람.",
        },
        character: {
          name: "응답하라 1988의 덕선",
          note: "원칙보다 먼저, 옆에 있는 사람을 본다.",
        },
      },
      oftenSays: "그래도 사람이 먼저지.",
      oftenHears: "너는 너무 정에 약해.",
      clashWith: {
        type: "계산자",
        reason: "그들의 산수가 당신에겐 사람을 잃은 시선으로 보인다.",
      },
      syncWith: {
        type: "원칙주의자",
        reason: "결이 다르지만, 둘 다 사람을 단위로 취급하지 않는다는 점에서 만난다.",
      },
      ifYouWere: {
        heading: "만약 당신이 회사의 팀장이라면",
        behavior:
          "당신은 팀원의 실수를 위로 가져가지 않을 것이다. 그러나 당신의 보호 바깥에 있는 누군가는 — 가끔 그것을 편애로 본다.",
      },
      rarityPct: 24,
      hypotheticals: [
        {
          situation: "낯선 다섯 명과 친구 한 명이 동시에 도움을 청한다.",
          reaction:
            "친구에게 먼저 연락할 것이다. 그것이 잘못인지 잠깐 생각하고, 다시 친구에게 돌아갈 것이다.",
        },
        {
          situation: "회의에서 친한 후배의 의견이 명백히 틀렸다.",
          reaction: "그 자리에선 침묵하되, 끝나고 따로 후배를 찾아갈 것이다.",
        },
      ],
    };
  }

  // 절차
  return {
    key: "절차주의자",
    name: "절차주의자",
    alias: "The Proceduralist",
    motto: "무엇을 정했느냐보다, 어떻게 정했느냐가 먼저다.",
    subtitle:
      q5 === "nothing"
        ? "절차주의자이지만 가족 앞에선 인간인 사람"
        : "절차는 사랑보다 먼저인 사람",
    description:
      "당신은 누가 결정하는가, 어떤 절차로 결정하는가를 먼저 묻습니다. 결과의 옳고 그름보다 결정의 정당성이 앞선다는 직관이죠. 다만 절차가 갖춰지지 않은 순간에도 결정은 내려져야 한다는 사실을, 종종 무겁게 안고 있을 거예요.",
    strength: "감정과 권력에 휩쓸리지 않는 균형 감각. 약자 편에 자주 선다.",
    weakness: "절차가 갖춰지지 않은 순간, 결정을 미루다 더 큰 손해를 본다.",
    similarTo: {
      philosopher: {
        name: "존 롤스",
        note: "'무지의 베일' — 누가 어떤 자리에 앉을지 모르는 채로 규칙을 정하라고 한 사람.",
      },
      character: {
        name: "12인의 성난 사람들의 8번 배심원",
        note: "끝까지 절차의 결을 지킨 사람.",
      },
    },
    oftenSays: "근거가 뭐예요?",
    oftenHears: "그건 너무 이상적이야.",
    clashWith: {
      type: "계산자",
      reason: "그들은 결정의 정당성보다 결과의 효용을 먼저 본다.",
    },
    syncWith: {
      type: "원칙주의자",
      reason: "둘 다 결과보다 결정의 자격을 먼저 묻는다.",
    },
    ifYouWere: {
      heading: "만약 당신이 채용 면접관이라면",
      behavior:
        "당신은 평가표를 가장 정성껏 만든다. 그러나 평가표 밖에서 빛나는 사람을 — 평가표가 가리는 순간이 있다.",
    },
    rarityPct: 14,
    hypotheticals: [
      {
        situation: "회사가 한 명을 절차 없이 해고하면 백 명을 살릴 수 있다.",
        reaction: "'몇 명을 살리는가'보다 '어떻게 골랐는가'를 먼저 물을 것이다.",
      },
      {
        situation:
          "AI는 공정하게 채점하지만 가끔 틀리고, 인간은 편향되지만 일관적이다.",
        reaction: "정답을 못 고른 채 회의 끝까지 남아 있을 것이다.",
      },
    ],
  };
}

function getChoicePct(scenarioId: number, choiceKey: string): number | null {
  const s = scenarios.find((x) => x.id === scenarioId);
  if (!s) return null;
  const c = s.choices.find((x) => x.key === choiceKey);
  return c?.globalPct ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────

function ChapterHead({ no, title }: { no: string; title: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-3">
      <div className="text-[10px] tracking-[0.3em] uppercase text-muted/70 tabular-nums">
        No. {no}
      </div>
      <h3 className="serif text-[20px] md:text-[24px] tracking-[-0.01em] leading-tight">
        {title}
      </h3>
    </div>
  );
}

const SECTION = "max-w-wide mx-auto px-6 md:px-10 py-12 md:py-16";

// ─────────────────────────────────────────────────────────────────────────────

function StatRarity({ pct }: { pct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const v = useCountUp(pct, inView, 1100);
  return (
    <div ref={ref}>
      <div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1.5">
        희소성
      </div>
      <div className="serif text-[28px] tabular-nums text-ink leading-none">
        {v}
        <span className="text-base text-muted ml-0.5">%</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function CoordinateMap({ coords }: { coords: { x: number; y: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const dotLeft = `${50 + coords.x * 40}%`;
  const dotTop = `${50 + coords.y * 40}%`;

  return (
    <div ref={ref} className="relative w-full max-w-[260px] mx-auto">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.25em] uppercase text-muted">
        보편
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.25em] uppercase text-muted">
        관계
      </div>
      <div className="absolute top-1/2 -left-10 -translate-y-1/2 text-[9px] tracking-[0.25em] uppercase text-muted">
        결과
      </div>
      <div className="absolute top-1/2 -right-10 -translate-y-1/2 text-[9px] tracking-[0.25em] uppercase text-muted">
        원칙
      </div>

      <div className="aspect-square border border-ink/15 relative">
        <div className="absolute inset-x-0 top-1/2 h-px bg-ink/10" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-ink/10" />

        {TYPE_BRIEFS.map((t, i) => (
          <div
            key={t.key}
            className="absolute w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-ink/25 transition-opacity duration-700"
            style={{
              left: `${50 + t.coords.x * 40}%`,
              top: `${50 + t.coords.y * 40}%`,
              opacity: inView ? 1 : 0,
              transitionDelay: `${500 + i * 70}ms`,
            }}
          />
        ))}

        <div
          className="absolute w-3 h-3 -ml-[6px] -mt-[6px] rounded-full bg-accent ring-[5px] ring-accent/15 transition-all duration-[1300ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{
            left: inView ? dotLeft : "50%",
            top: inView ? dotTop : "50%",
            transitionDelay: inView ? "250ms" : "0ms",
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ShareButton({
  profile,
  answers,
}: {
  profile: Profile;
  answers: Answers;
}) {
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleShare() {
    if (sharing) return;
    setSharing(true);
    setError(null);

    try {
      const answerKeys = scenarios
        .map((s) => answers[s.id]?.key ?? "-")
        .join(",");
      const params = new URLSearchParams({
        name: profile.name,
        alias: profile.alias,
        subtitle: profile.subtitle,
        motto: profile.motto,
        rarity: String(profile.rarityPct),
        answers: answerKeys,
      });

      const res = await fetch(`/og?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const file = new File([blob], `trolley-${profile.key}.png`, {
        type: "image/png",
      });

      if (
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            title: "나의 도덕 유형",
            text: `나는 ${profile.name}. ${profile.subtitle}.`,
            files: [file],
          });
          return;
        } catch {
          // 사용자 취소 또는 share 실패 → 다운로드로 폴백
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trolley-${profile.key}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "실패");
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleShare}
        disabled={sharing}
        className="w-full bg-accent text-paper py-4 text-sm tracking-wide hover:bg-ink transition-colors disabled:opacity-60"
      >
        {sharing ? "이미지 만드는 중…" : "결과 이미지로 저장 / 공유 →"}
      </button>
      {error && (
        <p className="text-[12px] text-accent text-center">
          오류: {error}. 다시 시도해주세요.
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

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
      <div className="text-center py-32 max-w-md mx-auto px-6">
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

  const score = computeScore(answers);
  const profile = computeProfile(answers, score);
  const coords = computeCoords(score);

  const tagCount: Record<string, number> = {};
  Object.values(answers).forEach((a) => {
    a.tags?.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedTags[0]?.[1] || 1;
  const topTagName = sortedTags[0]?.[0] ?? "—";

  const inconsistencies: { type: string; desc: string }[] = [];
  if (answers[1]?.key === "switch" && answers[2]?.key === "nothing") {
    inconsistencies.push({
      type: "수단과 부수효과의 차이",
      desc: "1번엔 레버를 당겼지만, 2번엔 밀지 않았습니다. 결과가 같아도 행위의 방식이 다르면 직관은 달라진다는 뜻 — '이중결과 원칙'의 고전적 사례입니다.",
    });
  }
  if (answers[1]?.key === "switch" && answers[3]?.key === "nothing") {
    inconsistencies.push({
      type: "산수의 한계",
      desc: "1번과 3번은 수치상 똑같습니다(1명 희생, 5명 구함). 그런데 의사 시나리오는 거부했어요. 권리와 신뢰의 무게가 효용 계산을 초과한다는 직관입니다.",
    });
  }
  if (answers[1]?.key === "switch" && answers[5]?.key === "nothing") {
    inconsistencies.push({
      type: "공평성과 사랑",
      desc: "낯선 사람들에겐 공리주의자였지만, 가족 앞에선 멈췄습니다. 비일관성이 아니라 — 어쩌면 인간 도덕의 본질입니다.",
    });
  }

  return (
    <>
      {/* HERO */}
      <section className="max-w-wide mx-auto px-6 md:px-10 pt-10 md:pt-14 pb-10">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="fade-up text-[11px] tracking-[0.3em] uppercase text-muted">
            당신의 도덕 유형
          </div>
          <div className="fade-up fade-up-delay-3 border border-ink/30 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center serif text-xl text-accent shrink-0">
            {profile.name[0]}
          </div>
        </div>
        <h2 className="fade-up fade-up-delay-1 serif text-[44px] md:text-[72px] leading-[0.98] tracking-[-0.03em] font-medium mb-3">
          {profile.name}
        </h2>
        <div className="fade-up fade-up-delay-2 text-[11px] tracking-[0.3em] uppercase text-accent mb-5">
          {profile.alias}
        </div>
        <p className="fade-up fade-up-delay-3 serif text-lg md:text-xl text-ink/90 leading-[1.45] italic max-w-[28ch]">
          — {profile.subtitle}
        </p>
      </section>

      {/* STAT STRIP */}
      <Reveal>
        <section className="max-w-wide mx-auto px-6 md:px-10 py-6 border-y border-ink/15 bg-white/40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
            <StatRarity pct={profile.rarityPct} />
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1.5">
                우세 이론
              </div>
              <div className="serif text-[16px] leading-tight">{topTagName}</div>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1.5">
                답변 패턴
              </div>
              <div className="serif text-[16px] leading-tight">
                {inconsistencies.length === 0
                  ? "일관"
                  : `다층 · ${inconsistencies.length}건`}
              </div>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1.5">
                응답
              </div>
              <div className="serif text-[16px] leading-tight tabular-nums">
                {answered} / {scenarios.length}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* MOTTO */}
      <Reveal>
        <section className="max-w-wide mx-auto px-6 md:px-10 py-10 md:py-14 border-b border-ink/10">
          <div className="flex items-baseline gap-5">
            <div className="text-[10px] tracking-[0.25em] uppercase text-muted shrink-0 mt-1.5">
              모토
            </div>
            <p className="serif text-[20px] md:text-[28px] leading-[1.4] italic max-w-[28ch]">
              "{profile.motto}"
            </p>
          </div>
        </section>
      </Reveal>

      {/* No.01 — 당신이라는 사람 */}
      <Reveal>
        <section className={SECTION}>
          <ChapterHead no="01" title="당신이라는 사람" />
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {sortedTags.slice(0, 3).map(([tag, count]) => (
                  <span
                    key={tag}
                    className="text-[10px] tracking-[0.15em] uppercase border border-ink/20 px-2 py-1 text-ink/70"
                  >
                    {tag} · {count}
                  </span>
                ))}
              </div>
              <p className="text-[15px] md:text-[16px] leading-[1.9] text-ink/85">
                {profile.description}
              </p>
            </div>

            <div className="space-y-7">
              <div>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="serif text-accent leading-none">＋</span>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted">
                    강점
                  </div>
                </div>
                <p className="serif text-[17px] md:text-lg leading-snug pl-5">
                  {profile.strength}
                </p>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="serif text-accent/80 leading-none">−</span>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted">
                    약점
                  </div>
                </div>
                <p className="serif text-[17px] md:text-lg leading-snug pl-5">
                  {profile.weakness}
                </p>
              </div>
              <div className="border-t border-ink/15 pt-5 space-y-2.5 text-[14px]">
                <p className="text-muted">
                  자주 하는 말{" "}
                  <span className="text-ink/30 mx-1">·</span>{" "}
                  <span className="serif italic text-ink">
                    "{profile.oftenSays}"
                  </span>
                </p>
                <p className="text-muted">
                  자주 듣는 말{" "}
                  <span className="text-ink/30 mx-1">·</span>{" "}
                  <span className="serif italic text-ink/65">
                    "{profile.oftenHears}"
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* No.02 — 닮은 사람 */}
      <Reveal>
        <section className={SECTION + " border-t border-ink/10"}>
          <ChapterHead no="02" title="닮은 사람" />
          <div className="grid md:grid-cols-2 gap-3">
            <Reveal delay={100}>
              <div className="border border-ink/15 p-5 h-full bg-white/40">
                <div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-2">
                  철학자
                </div>
                <div className="serif text-xl mb-3 leading-snug text-accent">
                  {profile.similarTo.philosopher.name}
                </div>
                <p className="text-[13px] leading-[1.85] text-ink/75">
                  {profile.similarTo.philosopher.note}
                </p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="border border-ink/15 p-5 h-full bg-white/40">
                <div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-2">
                  인물 / 캐릭터
                </div>
                <div className="serif text-xl mb-3 leading-snug">
                  {profile.similarTo.character.name}
                </div>
                <p className="text-[13px] leading-[1.85] text-ink/75">
                  {profile.similarTo.character.note}
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </Reveal>

      {/* No.03 — 도덕 좌표 */}
      <Reveal>
        <section className={SECTION + " border-t border-ink/10"}>
          <ChapterHead no="03" title="도덕 좌표" />
          <div className="grid md:grid-cols-[260px_1fr] gap-12 md:gap-16 items-center">
            <div className="px-10 md:px-0 py-6">
              <CoordinateMap coords={coords} />
            </div>
            <div>
              <p className="serif text-lg md:text-xl leading-[1.55] mb-4 text-ink/90">
                붉은 점이 당신의 위치입니다.
              </p>
              <p className="text-[14px] leading-[1.85] text-ink/70 max-w-prose">
                가로축은 결과주의(왼쪽)와 의무론(오른쪽)을, 세로축은 보편성(위)과 관계 윤리(아래)를 나타냅니다. 작은 점들은 다섯 도덕 유형의 평균 위치예요.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* No.04 — 관계 그리고 역할 */}
      <Reveal>
        <section className={SECTION + " border-t border-ink/10"}>
          <ChapterHead no="04" title="관계 그리고 역할" />

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-7 mb-9">
            <div className="flex gap-4">
              <div className="serif text-2xl text-accent shrink-0 leading-none">
                ×
              </div>
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-1">
                  부딪히는
                </div>
                <div className="serif text-lg mb-1.5">
                  {profile.clashWith.type}
                </div>
                <p className="text-[13px] leading-[1.75] text-ink/75 max-w-[28ch]">
                  {profile.clashWith.reason}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="serif text-2xl text-ink shrink-0 leading-none">
                ○
              </div>
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1">
                  통하는
                </div>
                <div className="serif text-lg mb-1.5">
                  {profile.syncWith.type}
                </div>
                <p className="text-[13px] leading-[1.75] text-ink/75 max-w-[28ch]">
                  {profile.syncWith.reason}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-ink/15 pt-7">
            <div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">
              {profile.ifYouWere.heading}
            </div>
            <p className="serif text-base md:text-lg leading-[1.65] text-ink/90 italic max-w-prose">
              {profile.ifYouWere.behavior}
            </p>
          </div>
        </section>
      </Reveal>

      {/* No.05 — 트롤리 바깥 */}
      <Reveal>
        <section className={SECTION + " border-t border-ink/10"}>
          <ChapterHead no="05" title="트롤리 바깥" />
          <div className="grid md:grid-cols-2 gap-3">
            {profile.hypotheticals.map((h, i) => (
              <Reveal key={i} delay={100 + i * 150}>
                <div className="border border-ink/15 p-5 h-full bg-white/40">
                  <p className="serif text-base md:text-[17px] leading-[1.55] mb-4">
                    {h.situation}
                  </p>
                  <div className="border-t border-ink/15 pt-4 text-[13px] md:text-[14px] leading-[1.8] text-ink/70 italic">
                    <span className="text-muted not-italic mr-1.5">→</span>
                    {h.reaction}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* No.06 — 답변과 패턴 */}
      <Reveal>
        <section className={SECTION + " border-t border-ink/10"}>
          <ChapterHead no="06" title="답변과 패턴" />

          {/* 답변 list compact 2-col */}
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-1 mb-10">
            {scenarios.map((s) => {
              const a = answers[s.id];
              const pct = a ? getChoicePct(s.id, a.key) : null;
              return (
                <div
                  key={s.id}
                  className="flex items-start gap-3 py-2.5 border-b border-ink/10"
                >
                  <div className="serif text-muted/50 tabular-nums text-sm w-6 shrink-0 pt-0.5">
                    {s.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] mb-0.5 truncate">{s.title}</div>
                    {a ? (
                      <div className="text-[12px] text-muted">
                        {a.label}
                        {pct !== null && (
                          <span className="text-muted/60 tabular-nums ml-1.5">
                            · {pct}%
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-[12px] text-muted/50 italic">
                        건너뜀
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* inconsistencies */}
          {inconsistencies.length > 0 && (
            <div className="mb-10">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-4">
                눈여겨볼 지점
              </div>
              <div className="space-y-4">
                {inconsistencies.map((inc, i) => (
                  <Reveal key={i} delay={i * 120}>
                    <div className="border-l-2 border-accent pl-4 py-1">
                      <div className="serif text-base mb-1.5 leading-snug">
                        {inc.type}
                      </div>
                      <p className="text-[13px] leading-[1.75] text-ink/75 max-w-prose">
                        {inc.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* theory bars */}
          <div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-4">
              윤리 이론별 일치도
            </div>
            <div className="space-y-3">
              {sortedTags.map(([tag, count]) => {
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={tag}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <div className="serif text-[15px]">{tag}</div>
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
          </div>
        </section>
      </Reveal>

      {/* No.07 — 다른 자리들 */}
      <Reveal>
        <section className={SECTION + " border-t border-ink/10"}>
          <ChapterHead no="07" title="다른 자리들" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {TYPE_BRIEFS.map((t, i) => {
              const isMe = t.key === profile.key;
              return (
                <Reveal key={t.key} delay={i * 80}>
                  <div
                    className={[
                      "p-4 border h-full transition-colors relative",
                      isMe
                        ? "border-ink bg-white"
                        : "border-ink/15 bg-paper hover:border-ink/40",
                    ].join(" ")}
                  >
                    <div className="aspect-square w-10 mb-3 relative border border-ink/10">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-ink/10" />
                      <div className="absolute inset-y-0 left-1/2 w-px bg-ink/10" />
                      <div
                        className={[
                          "absolute w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full",
                          isMe ? "bg-accent" : "bg-ink/40",
                        ].join(" ")}
                        style={{
                          left: `${50 + t.coords.x * 35}%`,
                          top: `${50 + t.coords.y * 35}%`,
                        }}
                      />
                    </div>

                    <div
                      className={[
                        "serif text-[15px] leading-snug mb-1",
                        isMe ? "text-accent" : "text-ink",
                      ].join(" ")}
                    >
                      {t.name}
                    </div>
                    <div className="text-[9px] tracking-[0.2em] uppercase text-muted/70 mb-2">
                      {t.alias}
                    </div>
                    <p className="text-[12px] leading-[1.65] text-ink/70 italic">
                      "{t.tagline}"
                    </p>
                    {isMe && (
                      <div className="absolute top-2 right-2 text-[9px] tracking-[0.2em] uppercase text-accent">
                        당신
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <section className="max-w-wide mx-auto px-6 md:px-10 py-10 md:py-14 border-t border-ink/15 space-y-3">
          <ShareButton profile={profile} answers={answers} />
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.localStorage.removeItem("trolley-answers");
                  window.location.href = "/";
                }
              }}
              className="flex-1 border border-ink py-3.5 text-sm tracking-wide hover:bg-ink hover:text-paper transition-colors"
            >
              처음부터 다시
            </button>
            <Link
              href="/"
              className="flex-1 bg-ink text-paper py-3.5 text-sm tracking-wide hover:bg-accent transition-colors text-center"
            >
              목차로 돌아가기
            </Link>
          </div>
        </section>
      </Reveal>
    </>
  );
}
