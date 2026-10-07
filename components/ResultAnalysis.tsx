"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { scenarios, getScenarioBySlug } from "@/data/scenarios";
import Reveal, { useCountUp, useInView } from "./Reveal";

type Answer = { key: string; label: string; tags: string[] };
type Answers = Record<number, Answer>;

/* ───────────────────────── 유형 ───────────────────────── */

type Cat = "결과" | "원칙" | "관계" | "절차";

const CATEGORY_MAP: Record<Cat, string[]> = {
  결과: ["공리주의", "결과주의"],
  원칙: ["의무론", "권리 기반", "이중결과 원칙", "행위/방관 구분"],
  관계: ["덕 윤리", "관계 윤리"],
  절차: ["계약주의", "공평주의", "절차적 정의"],
};
const CATEGORY_LABEL: Record<Cat, string> = { 결과: "결과주의", 원칙: "의무론", 관계: "관계 윤리", 절차: "절차적 정의" };
const COORD: Record<Cat, { x: number; y: number }> = {
  결과: { x: -1, y: -1 },
  원칙: { x: 1, y: -0.3 },
  절차: { x: 0.5, y: -1 },
  관계: { x: 0, y: 1 },
};

export type Profile = {
  key: string;
  name: string;
  alias: string;
  tagline: string;
  motto: string;
  description: string;
  strength: string;
  weakness: string;
  philosopher: { name: string; note: string };
  character: { name: string; note: string };
  rarityPct: number;
  coords: { x: number; y: number };
};

/** 11가지 유형 — 순수형 4 · 혼합형 6 · 흔들림 1 */
export const PROFILES: Profile[] = [
  {
    key: "결과", name: "계산자", alias: "The Calculator", tagline: "다섯이 한보다 무겁다고 믿는 사람",
    motto: "한 명보다 다섯이다. 그 다섯이 누구인지는 묻지 않는다.",
    description: "당신은 세계가 결국 산수로 정리될 수 있다고 믿고 싶어 합니다. 그 믿음 덕에 결정의 무게를 줄여본 적이 있을 거예요. 다만 산수가 끝나는 자리에서 한 번쯤 멈춘 적이 있고, 그 멈춤이 생각보다 오래 남아 있을 겁니다.",
    strength: "복잡한 상황에서도 주저앉지 않고 결정을 내린다.",
    weakness: "사랑을 산수에 넣어버리는 순간이 있다. 본인은 그 순간을 잘 모른다.",
    philosopher: { name: "피터 싱어", note: "효율적 이타주의의 대부. 연못의 아이로 당신의 직관을 흔든 사람." },
    character: { name: "닥터 스트레인지", note: "1,400만 가지 미래 중 하나를 골라야 했던 사람." },
    rarityPct: 14, coords: { x: -0.75, y: -0.7 },
  },
  {
    key: "원칙", name: "원칙주의자", alias: "The Principlist", tagline: "결과가 좋아도 안 되는 일이 있다",
    motto: "결과가 좋아도, 어떤 일은 그 자체로 잘못이다.",
    description: "당신은 결과가 좋아도 어떤 일은 그 자체로 잘못이라는 감각을 잃은 적이 없습니다. 사람은 수단이 아니라 사람이라는 직관이 당신을 당신답게 만들어요. 다만 다섯의 죽음 앞에서 '나는 깨끗하다'는 말이 충분한지, 가끔 스스로에게 물을 겁니다.",
    strength: "유혹 앞에서 흔들리지 않는다. 자기 자신을 가장 신뢰할 수 있는 사람.",
    weakness: "'나는 깨끗하다'는 말을 너무 일찍 꺼낼 수 있다.",
    philosopher: { name: "임마누엘 칸트", note: "'사람을 수단으로만 대하지 말라' — 정언명령을 만든 사람." },
    character: { name: "한나 아렌트", note: "악의 평범성을 지목하며, 사유하지 않는 것을 가장 무서워한 사람." },
    rarityPct: 16, coords: { x: 0.85, y: -0.3 },
  },
  {
    key: "관계", name: "관계주의자", alias: "The Particularist", tagline: "내 사람부터, 변명은 그 다음",
    motto: "내 사람부터. 변명은 그 다음에.",
    description: "당신에게 도덕은 규칙이 아니라 누구를 어떻게 사랑하는가의 문제입니다. 가족과 낯선 사람의 무게가 다르다는 것을 굳이 정당화하지 않아도 알고 있어요. 다만 그 사랑의 경계 바깥에 누가 있는지를 가끔은 떠올릴 필요가 있을지 모릅니다.",
    strength: "추상적 정의가 사라진 자리에서 사람을 사람으로 대하는 능력.",
    weakness: "당신의 사랑이 닿지 않는 사람들에 대해 의외로 차가울 수 있다.",
    philosopher: { name: "버나드 윌리엄스", note: "'생각이 하나 더 많다' — 사랑은 정당화를 거치지 않는다고 말한 사람." },
    character: { name: "응답하라 1988의 덕선", note: "원칙보다 먼저, 옆에 있는 사람을 본다." },
    rarityPct: 12, coords: { x: 0, y: 0.85 },
  },
  {
    key: "절차", name: "절차주의자", alias: "The Proceduralist", tagline: "어떻게 정했느냐가 먼저",
    motto: "무엇을 정했느냐보다, 어떻게 정했느냐가 먼저다.",
    description: "당신은 누가 결정하는가, 어떤 절차로 결정하는가를 먼저 묻습니다. 결과의 옳고 그름보다 결정의 정당성이 앞선다는 직관이죠. 다만 절차가 갖춰지지 않은 순간에도 결정은 내려져야 한다는 사실을 종종 무겁게 안고 있을 거예요.",
    strength: "감정과 권력에 휩쓸리지 않는 균형 감각. 약자 편에 자주 선다.",
    weakness: "절차가 갖춰지지 않은 순간, 결정을 미루다 더 큰 손해를 본다.",
    philosopher: { name: "존 롤스", note: "'무지의 베일' — 누가 어떤 자리에 앉을지 모르는 채로 규칙을 정하라고 한 사람." },
    character: { name: "12인의 성난 사람들의 8번 배심원", note: "끝까지 절차의 결을 지킨 사람." },
    rarityPct: 7, coords: { x: 0.5, y: -0.8 },
  },
  {
    key: "결과+원칙", name: "현실적 원칙주의자", alias: "The Pragmatist", tagline: "원칙을 지키되, 숫자가 너무 크면 돌아본다",
    motto: "선은 있다. 다만 선 너머의 숫자가 너무 크면 선을 다시 긋는다.",
    description: "당신은 레버는 당기지만 사람은 밀지 않습니다. 원칙이 있지만 원칙이 재앙을 부르면 원칙을 의심해요. 대부분의 사람이 실제로 사는 방식이고, 그래서 가장 흔한 유형입니다. 다만 '어디까지가 재앙인가'의 기준이 상황마다 움직인다는 것을 본인도 압니다.",
    strength: "극단으로 가지 않는다. 현실에서 가장 믿을 만한 판단을 내린다.",
    weakness: "기준선이 그때그때 움직인다. 남들에겐 그게 '편의'로 보일 수 있다.",
    philosopher: { name: "주디스 자비스 톰슨", note: "트롤리 문제를 만들고, 평생 그 답을 고쳐 쓴 사람." },
    character: { name: "아티커스 핀치", note: "원칙을 믿지만, 그 원칙이 사람을 다치게 할 땐 멈춰 선 변호사." },
    rarityPct: 22, coords: { x: 0.1, y: -0.55 },
  },
  {
    key: "결과+관계", name: "온정적 계산자", alias: "The Warm Utilitarian", tagline: "다수를 세되, 내 사람은 셈 밖에 둔다",
    motto: "모두를 위해 계산한다. 단, 내 사람은 계산에 넣지 않는다.",
    description: "낯선 이들 사이에서 당신은 공리주의자입니다. 그러나 사랑하는 사람이 저울에 오르면 저울을 내려놓아요. 모순처럼 보이지만, 대부분의 인간이 실제로 느끼는 도덕에 가장 가깝습니다. 다만 그 경계 바깥 사람들에겐 당신의 산수가 차갑게 보일 수 있어요.",
    strength: "큰 그림을 보면서도 사람을 잃지 않는다.",
    weakness: "'내 사람'의 범위가 좁아질수록 산수가 잔인해진다.",
    philosopher: { name: "데이비드 흄", note: "도덕은 이성이 아니라 공감에서 나온다고 본 사람. 공감은 가까운 쪽으로 기운다." },
    character: { name: "오션스 일레븐의 대니 오션", note: "계산은 정확하지만, 팀원 한 명 때문에 계획을 바꾼다." },
    rarityPct: 9, coords: { x: -0.45, y: 0.25 },
  },
  {
    key: "결과+절차", name: "제도 설계자", alias: "The Engineer", tagline: "최선의 결과를 내는 규칙을 만든다",
    motto: "한 번의 결정이 아니라, 결정의 규칙을 설계한다.",
    description: "당신은 트롤리 앞에서 레버를 보지 않고 선로 설계도를 봅니다. 이번 한 번보다 이런 상황이 백 번 반복될 때 가장 좋은 규칙이 무엇인가를 묻죠. 자율주행차와 인공호흡기 문제에서 가장 편안했을 유형입니다. 다만 규칙이 결정된 뒤, 규칙에 깔리는 한 사람의 얼굴을 보는 일은 남에게 맡길 수 있어요.",
    strength: "감정에 휘둘리지 않고 시스템을 만든다. 정책을 설계할 사람.",
    weakness: "통계 뒤의 얼굴이 안 보인다. 본인이 규칙의 예외가 될 때 당황한다.",
    philosopher: { name: "존 스튜어트 밀", note: "규칙 공리주의 — 행위가 아니라 규칙의 효용을 따진 사람." },
    character: { name: "머니볼의 빌리 빈", note: "스카우트의 직감을 통계로 바꾼 사람." },
    rarityPct: 8, coords: { x: -0.3, y: -0.9 },
  },
  {
    key: "원칙+관계", name: "수호자", alias: "The Guardian", tagline: "지켜야 할 것과 지켜야 할 사람",
    motto: "넘지 말아야 할 선이 있고, 그 선 안에 내 사람이 있다.",
    description: "당신은 원칙을 지키는 사람이면서, 그 원칙이 결국 누구를 위한 것인지를 잊지 않습니다. 사람을 수단으로 쓰지 않고, 가족을 저울에 올리지 않아요. 숫자가 아무리 커도 움직이지 않는 두 가지가 있는 사람입니다. 다만 그 둘이 충돌하는 순간 — 가족을 위해 원칙을 깰 것인가 — 가장 오래 괴로워할 거예요.",
    strength: "신뢰할 수 있다. 위기에서 등을 맡길 사람.",
    weakness: "다수의 고통 앞에서 '나와 내 사람은 깨끗하다'에 머물 수 있다.",
    philosopher: { name: "아리스토텔레스", note: "덕은 규칙이 아니라 좋은 사람이 하는 일이라고 본 사람." },
    character: { name: "반지의 제왕의 샘", note: "반지는 들지 않지만, 프로도는 업는다." },
    rarityPct: 11, coords: { x: 0.55, y: 0.45 },
  },
  {
    key: "원칙+절차", name: "법관", alias: "The Judge", tagline: "정당한 절차가 정당한 결과를 만든다",
    motto: "누구도 재판 없이 벌할 수 없고, 누구도 동의 없이 희생될 수 없다.",
    description: "당신에게 도덕은 권리와 절차의 문제입니다. 범인이라도 내가 죽일 수 없고, 다수가 원해도 한 명의 권리를 뺏을 수 없어요. 구명보트와 폭탄 문제에서 '그래도 안 된다'를 고른 사람입니다. 다만 절차가 없는 긴급 상황에서 당신의 침묵이 곧 선택이라는 사실을 받아들이기 어려워할 수 있어요.",
    strength: "권력 앞에서 흔들리지 않는다. 소수의 편에 선다.",
    weakness: "절차가 무너진 곳에서는 할 수 있는 게 없다고 느낀다.",
    philosopher: { name: "로널드 드워킨", note: "권리는 다수의 효용을 이기는 '으뜸패'라고 한 사람." },
    character: { name: "로버트 볼트의 토머스 모어", note: "왕 앞에서도 법의 숲을 베지 않은 사람." },
    rarityPct: 6, coords: { x: 0.8, y: -0.7 },
  },
  {
    key: "관계+절차", name: "중재자", alias: "The Mediator", tagline: "사람 사이의 합의를 먼저",
    motto: "정답을 정하는 게 아니라, 모두가 받아들일 수 있는 방법을 찾는다.",
    description: "당신은 '누가 옳은가'보다 '어떻게 하면 모두가 받아들이겠는가'를 묻습니다. 제비뽑기를 고르고, AI가 아니라 사람이 정하길 바라는 유형이에요. 사람과 사람 사이를 중요하게 보면서도 특정인을 편들지 않으려 애씁니다. 다만 시간이 없는 상황에서 합의를 기다리다 결정을 놓칠 수 있어요.",
    strength: "갈등을 풀고, 결정에 사람들을 참여시킨다.",
    weakness: "결정이 필요한 순간에 '같이 정하자'가 도망이 될 수 있다.",
    philosopher: { name: "위르겐 하버마스", note: "옳음은 토론의 절차에서 나온다고 본 사람." },
    character: { name: "슬기로운 의사생활의 채송화", note: "결정 전에 사람들의 얼굴을 한 번씩 본다." },
    rarityPct: 5, coords: { x: 0.25, y: 0.2 },
  },
  {
    key: "흔들리는", name: "흔들리는 직관", alias: "The Wavering Mind", tagline: "한 저울로는 다 못 잰다",
    motto: "정답이 하나라면, 살아있는 것이 너무 단순할 것이다.",
    description: "당신은 한 가지 원칙으로 열다섯 개의 답을 끌어내려 하지 않았습니다. 어떤 사람들은 이걸 일관성의 부족이라 부를 거예요. 하지만 어쩌면 인간의 도덕은 원래 한 자루 저울로는 잴 수 없는 것이었을지도 모릅니다.",
    strength: "한 이론에 갇히지 않는 융통성. 상황의 결을 읽는 감각.",
    weakness: "결정의 근거를 본인도 설명하지 못하는 순간이 있다.",
    philosopher: { name: "알베르 카뮈", note: "부조리 앞에서 답을 거부하면서도 살아내려 했던 사람." },
    character: { name: "햄릿", note: "결정을 미루는 것이 비겁이 아니라 도덕의 한 형태일 수 있는 사람." },
    rarityPct: 10, coords: { x: 0, y: 0 },
  },
];

function computeScore(answers: Answers) {
  const score: Record<Cat, number> = { 결과: 0, 원칙: 0, 관계: 0, 절차: 0 };
  Object.values(answers).forEach((a) =>
    a.tags?.forEach((tag) => {
      (Object.keys(CATEGORY_MAP) as Cat[]).forEach((cat) => {
        if (CATEGORY_MAP[cat].includes(tag)) score[cat] += 1;
      });
    })
  );
  return score;
}

/** 1위가 2위의 1.5배 이상이면 순수형, 아니면 상위 둘의 혼합형. 전부 0이거나 셋 이상 동률이면 흔들림 */
function pickProfile(score: Record<Cat, number>): Profile {
  const sorted = (Object.entries(score) as [Cat, number][]).sort((a, b) => b[1] - a[1]);
  const [c1, s1] = sorted[0];
  const [c2, s2] = sorted[1];
  const s3 = sorted[2][1];
  const find = (k: string) => PROFILES.find((p) => p.key === k)!;
  if (s1 === 0 || (s1 === s2 && s2 === s3)) return find("흔들리는");
  if (s1 >= s2 * 1.5) return find(c1);
  const pair = [c1, c2].sort((a, b) => ["결과", "원칙", "관계", "절차"].indexOf(a) - ["결과", "원칙", "관계", "절차"].indexOf(b));
  return find(`${pair[0]}+${pair[1]}`) ?? find(c1);
}

function computeCoords(score: Record<Cat, number>) {
  let x = 0, y = 0, total = 0;
  (Object.keys(score) as Cat[]).forEach((cat) => {
    x += COORD[cat].x * score[cat];
    y += COORD[cat].y * score[cat];
    total += score[cat];
  });
  if (total) { x /= total; y /= total; }
  return { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
}

function pct(scenarioId: number, key: string) {
  return scenarios.find((s) => s.id === scenarioId)?.choices.find((c) => c.key === key)?.globalPct ?? null;
}
const idOf = (slug: string) => getScenarioBySlug(slug)?.id ?? -1;

/* ───────────────────────── 조각 ───────────────────────── */

function ChapterHead({ no, title }: { no: string; title: string }) {
  return (
    <div className="mb-6 flex items-baseline gap-3">
      <div className="text-[10px] tracking-[0.3em] uppercase text-muted/70 tabular-nums">No. {no}</div>
      <h3 className="serif text-[18px] md:text-[20px] tracking-[-0.01em] leading-tight">{title}</h3>
    </div>
  );
}
const SECTION = "max-w-wide mx-auto px-6 md:px-10 py-8 md:py-10";

function StatRarity({ pct }: { pct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const v = useCountUp(pct, inView, 1100);
  return (
    <div ref={ref}>
      <div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1.5">희소성 (추정)</div>
      <div className="serif text-[28px] tabular-nums text-ink leading-none">{v}<span className="text-base text-muted ml-0.5">%</span></div>
    </div>
  );
}

function CoordinateMap({ coords }: { coords: { x: number; y: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} className="relative w-full max-w-[260px] mx-auto">
      {[["보편", "-top-6 left-1/2 -translate-x-1/2"], ["관계", "-bottom-6 left-1/2 -translate-x-1/2"], ["결과", "top-1/2 -left-10 -translate-y-1/2"], ["원칙", "top-1/2 -right-10 -translate-y-1/2"]].map(([t, c]) => (
        <div key={t} className={`absolute ${c} text-[9px] tracking-[0.25em] uppercase text-muted`}>{t}</div>
      ))}
      <div className="aspect-square border border-ink/15 relative">
        <div className="absolute inset-x-0 top-1/2 h-px bg-ink/10" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-ink/10" />
        {PROFILES.map((t, i) => (
          <div key={t.key} title={t.name} className="absolute w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-ink/25 transition-opacity duration-700"
            style={{ left: `${50 + t.coords.x * 40}%`, top: `${50 + t.coords.y * 40}%`, opacity: inView ? 1 : 0, transitionDelay: `${400 + i * 50}ms` }} />
        ))}
        <div className="absolute w-3 h-3 -ml-[6px] -mt-[6px] rounded-full bg-accent ring-[5px] ring-accent/15 transition-all duration-[1300ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{ left: inView ? `${50 + coords.x * 40}%` : "50%", top: inView ? `${50 + coords.y * 40}%` : "50%", transitionDelay: inView ? "250ms" : "0ms" }} />
      </div>
    </div>
  );
}

function ShareButton({ profile, answers }: { profile: Profile; answers: Answers }) {
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleShare() {
    if (sharing) return;
    setSharing(true); setError(null);
    try {
      const params = new URLSearchParams({
        name: profile.name, alias: profile.alias, subtitle: profile.tagline, motto: profile.motto,
        rarity: String(profile.rarityPct), answers: scenarios.map((s) => answers[s.id]?.key ?? "-").join(","),
      });
      const res = await fetch(`/og?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const file = new File([blob], `trolley-${profile.key}.png`, { type: "image/png" });
      if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ title: "나의 도덕 유형", text: `나는 ${profile.name}. ${profile.tagline}.`, files: [file] }); return; } catch { /* 폴백 */ }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch (e) { setError(e instanceof Error ? e.message : "실패"); } finally { setSharing(false); }
  }
  return (
    <div className="flex flex-col gap-2">
      <button onClick={handleShare} disabled={sharing} className="w-full bg-accent text-paper py-4 text-sm tracking-wide hover:bg-ink transition-colors disabled:opacity-60">
        {sharing ? "이미지 만드는 중…" : "결과 이미지로 저장 / 공유 →"}
      </button>
      {error && <p className="text-[12px] text-accent text-center">오류: {error}. 다시 시도해주세요.</p>}
    </div>
  );
}

/* ───────────────────────── 본체 ───────────────────────── */

export default function ResultAnalysis() {
  const [answers, setAnswers] = useState<Answers | null>(null);
  useEffect(() => {
    const raw = window.localStorage.getItem("trolley-answers");
    try { setAnswers(raw ? JSON.parse(raw) : {}); } catch { setAnswers({}); }
  }, []);

  if (answers === null) return <div className="text-center py-20 text-muted text-sm">결과를 불러오는 중...</div>;
  const answered = Object.keys(answers).filter((k) => scenarios.some((s) => s.id === Number(k))).length;
  if (answered === 0) {
    return (
      <div className="text-center py-32 max-w-md mx-auto px-6">
        <p className="serif text-2xl mb-6 leading-relaxed">아직 답한 질문이 없습니다.</p>
        <Link href="/scenario/trolley" className="inline-flex items-center gap-3 bg-ink text-paper px-8 py-4 text-sm tracking-wide hover:bg-accent transition-colors">첫 질문으로 →</Link>
      </div>
    );
  }

  const score = computeScore(answers);
  const profile = pickProfile(score);
  const coords = computeCoords(score);
  const topCat = (Object.entries(score) as [Cat, number][]).sort((a, b) => b[1] - a[1])[0][0];

  const tagCount: Record<string, number> = {};
  Object.values(answers).forEach((a) => a.tags?.forEach((t) => (tagCount[t] = (tagCount[t] || 0) + 1)));
  const inTop = (t: string) => (CATEGORY_MAP[topCat].includes(t) ? 1 : 0);
  const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1] || inTop(b[0]) - inTop(a[0]));
  const maxCount = sortedTags[0]?.[1] || 1;

  const ans = (slug: string) => answers[idOf(slug)]?.key;
  const notes: { type: string; desc: string }[] = [];
  if (ans("trolley") === "switch" && ans("footbridge") === "nothing") notes.push({ type: "수단과 부수효과", desc: "레버는 당겼지만 사람은 밀지 않았습니다. 결과가 같아도 행위의 방식이 다르면 직관이 달라진다는 것 — 이중결과 원칙의 고전적 사례." });
  if (ans("footbridge") === "nothing" && ans("trapdoor") === "press") notes.push({ type: "손이 닿는가", desc: "밀지는 않았지만 스위치는 눌렀습니다. 당신의 거부감은 '수단으로 쓰는 것'보다 '내 몸이 직접 가하는 힘'에서 옵니다." });
  if (ans("trolley") === "switch" && ans("transplant") === "nothing") notes.push({ type: "산수의 한계", desc: "레버와 이식은 수치상 똑같지만 이식은 거부했어요. 권리와 신뢰의 무게가 효용 계산을 초과한다는 직관." });
  if (ans("footbridge") === "nothing" && ans("self") === "jump") notes.push({ type: "희생의 주인", desc: "남은 밀지 않지만 자신은 뛰어내립니다. 당신의 '밀지 않는다'는 타인의 목숨을 내가 결정할 수 없다는 뜻이었군요." });
  if (ans("trolley") === "nothing" && ans("villain") === "switch") notes.push({ type: "자격이라는 변수", desc: "낯선 한 명은 희생시키지 않지만 범인은 희생시킵니다. 당신의 원칙 안에 '마땅함(desert)'이 들어 있습니다." });
  if (ans("transplant") === "nothing" && ans("lifeboat") === "acquit") notes.push({ type: "같은 배", desc: "의사의 적출은 안 되지만 구명보트의 살인은 용서합니다. '모두가 같은 처지'라는 조건이 당신의 판단을 바꿉니다." });
  if (ans("trolley") === "switch" && ans("kin") === "nothing") notes.push({ type: "공평성과 사랑", desc: "낯선 사람들에겐 공리주의자였지만 가족 앞에선 멈췄습니다. 비일관성이 아니라 어쩌면 인간 도덕의 본질." });
  if (ans("pond") === "same" && ans("kin") === "nothing") notes.push({ type: "거리와 관계", desc: "먼 아이에게도 의무가 있다면서 가족은 특별합니다. '거리'는 변수가 아니고 '관계'는 변수라는 것 — 흥미로운 조합입니다." });

  return (
    <>
      {/* HERO */}
      <section className="max-w-wide mx-auto px-6 md:px-10 pt-8 md:pt-10 pb-6">
        <div className="flex items-start justify-between gap-6 mb-5">
          <div className="fade-up text-[11px] tracking-[0.3em] uppercase text-muted">당신의 도덕 유형</div>
          <div className="fade-up fade-up-delay-3 border border-ink/30 w-11 h-11 flex items-center justify-center serif text-xl text-accent shrink-0">{profile.name[0]}</div>
        </div>
        <h1 className="fade-up fade-up-delay-1 serif text-[30px] md:text-[44px] leading-[1.08] tracking-[-0.03em] font-medium mb-3">{profile.name}</h1>
        <div className="fade-up fade-up-delay-2 text-[11px] tracking-[0.3em] uppercase text-accent mb-4">{profile.alias}</div>
        <p className="fade-up fade-up-delay-3 serif text-base md:text-lg text-ink/90 leading-[1.5] italic max-w-[32ch]">— {profile.tagline}</p>
      </section>

      {/* STAT STRIP */}
      <Reveal>
        <section className="max-w-wide mx-auto px-6 md:px-10 py-5 border-y border-ink/15 bg-white/40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
            <StatRarity pct={profile.rarityPct} />
            <div><div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1.5">우세 축</div><div className="serif text-[16px] leading-tight">{profile.key === "흔들리는" ? "혼합" : CATEGORY_LABEL[topCat]}</div></div>
            <div><div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1.5">눈여겨볼 지점</div><div className="serif text-[16px] leading-tight">{notes.length === 0 ? "없음" : `${notes.length}건`}</div></div>
            <div><div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1.5">응답</div><div className="serif text-[16px] leading-tight tabular-nums">{answered} / {scenarios.length}</div></div>
          </div>
        </section>
      </Reveal>

      {/* MOTTO + 설명 + 강점/약점 (한 섹션) */}
      <Reveal>
        <section className={SECTION}>
          <p className="serif text-[17px] md:text-[21px] leading-[1.5] italic max-w-[36ch] mb-6">"{profile.motto}"</p>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {sortedTags.slice(0, 3).map(([tag, count]) => (
                  <span key={tag} className="text-[10px] tracking-[0.15em] uppercase border border-ink/20 px-2 py-1 text-ink/70">{tag} · {count}</span>
                ))}
              </div>
              <p className="text-[14px] md:text-[15px] leading-[1.85] text-ink/85">{profile.description}</p>
            </div>
            <div className="space-y-5">
              <div><div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1"><span className="serif text-accent mr-1.5">＋</span>강점</div><p className="serif text-[15px] md:text-base leading-snug">{profile.strength}</p></div>
              <div><div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1"><span className="serif text-accent/80 mr-1.5">−</span>약점</div><p className="serif text-[15px] md:text-base leading-snug">{profile.weakness}</p></div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 답변과 패턴 */}
      <Reveal>
        <section className={SECTION + " border-t border-ink/10"}>
          <ChapterHead no="01" title="답변과 패턴" />
          {notes.length > 0 && (
            <div className="mb-8 space-y-3">
              {notes.map((n, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="border-l-2 border-accent pl-4 py-0.5">
                    <div className="serif text-[15px] mb-1 leading-snug">{n.type}</div>
                    <p className="text-[13px] leading-[1.7] text-ink/75 max-w-prose">{n.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-0 mb-8">
            {scenarios.map((s) => {
              const a = answers[s.id];
              const p = a ? pct(s.id, a.key) : null;
              return (
                <div key={s.id} className="flex items-start gap-3 py-2 border-b border-ink/10">
                  <div className="serif text-muted/50 tabular-nums text-sm w-6 shrink-0 pt-0.5">{s.number}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] mb-0.5 truncate">{s.title}</div>
                    {a ? <div className="text-[12px] text-muted">{a.label}{p !== null && <span className="text-muted/60 tabular-nums ml-1.5">· {p}%</span>}</div> : <div className="text-[12px] text-muted/50 italic">건너뜀</div>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">윤리 이론별 일치도</div>
          <div className="space-y-2.5">
            {sortedTags.map(([tag, count]) => (
              <div key={tag}>
                <div className="flex justify-between items-baseline mb-1"><div className="serif text-[14px]">{tag}</div><div className="text-[11px] text-muted tabular-nums">{count}회</div></div>
                <div className="h-[2px] bg-line"><div className="h-full bg-ink transition-all duration-1000" style={{ width: `${Math.round((count / maxCount) * 100)}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 다른 자리들 — 11 */}
      <Reveal>
        <section className={SECTION + " border-t border-ink/10"}>
          <ChapterHead no="02" title="다른 자리들" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {PROFILES.map((t, i) => {
              const isMe = t.key === profile.key;
              return (
                <Reveal key={t.key} delay={i * 50}>
                  <div className={["p-4 border h-full relative", isMe ? "border-ink bg-white" : "border-ink/15 bg-paper hover:border-ink/40"].join(" ")}>
                    <div className="aspect-square w-9 mb-3 relative border border-ink/10">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-ink/10" /><div className="absolute inset-y-0 left-1/2 w-px bg-ink/10" />
                      <div className={["absolute w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full", isMe ? "bg-accent" : "bg-ink/40"].join(" ")} style={{ left: `${50 + t.coords.x * 35}%`, top: `${50 + t.coords.y * 35}%` }} />
                    </div>
                    <div className={["serif text-[14px] leading-snug mb-0.5", isMe ? "text-accent" : "text-ink"].join(" ")}>{t.name}</div>
                    <div className="text-[9px] tracking-[0.2em] uppercase text-muted/70 mb-1.5">{t.alias}</div>
                    <p className="text-[11.5px] leading-[1.6] text-ink/70 italic">"{t.tagline}"</p>
                    <div className="mt-2 text-[10px] text-muted/60 tabular-nums">{t.rarityPct}%</div>
                    {isMe && <div className="absolute top-2 right-2 text-[9px] tracking-[0.2em] uppercase text-accent">당신</div>}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* 더 깊이 — 접힘 */}
      <Reveal>
        <section className={SECTION + " border-t border-ink/10"}>
          <details className="group">
            <summary className="cursor-pointer list-none flex items-baseline justify-between gap-3">
              <ChapterHead no="03" title="더 깊이 — 닮은 사람 · 도덕 좌표" />
              <span className="serif text-base text-muted group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div className="grid md:grid-cols-2 gap-3 mb-10">
              {[["철학자", profile.philosopher, "text-accent"], ["인물 / 캐릭터", profile.character, ""]].map(([label, who, cls]) => (
                <div key={label as string} className="border border-ink/15 p-5 bg-white/40">
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted mb-2">{label as string}</div>
                  <div className={`serif text-xl mb-2 leading-snug ${cls}`}>{(who as { name: string }).name}</div>
                  <p className="text-[13px] leading-[1.8] text-ink/75">{(who as { note: string }).note}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-[260px_1fr] gap-12 md:gap-16 items-center">
              <div className="px-10 md:px-0 py-6"><CoordinateMap coords={coords} /></div>
              <p className="text-[14px] leading-[1.85] text-ink/70 max-w-prose">붉은 점이 당신의 위치. 가로축은 결과주의(왼쪽)와 의무론(오른쪽), 세로축은 보편성(위)과 관계 윤리(아래). 작은 점들은 열한 유형의 평균 위치.</p>
            </div>
          </details>
        </section>
      </Reveal>

      {/* 연구 데이터 — 접힘 */}
      <Reveal>
        <section className={SECTION + " border-t border-ink/10"}>
          <details className="group">
            <summary className="cursor-pointer list-none flex items-baseline justify-between gap-3">
              <ChapterHead no="04" title="사람들은 어떻게 답했나" />
              <span className="serif text-base text-muted group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="-mt-3 mb-6 text-[12px] text-muted">각 질문의 실제 연구 수치와 출처. 궁금한 사람만 펼쳐 보면 된다.</p>
            <div className="space-y-7">
              {scenarios.map((s) => (
                <div key={s.id}>
                  <div className="serif text-[15px] mb-2"><span className="text-muted/50 tabular-nums mr-2">{s.number}</span>{s.title}</div>
                  <dl className="border-y border-ink/10 divide-y divide-ink/5">
                    {s.evidence.map((e) => (
                      <div key={e.label} className="py-2.5 grid grid-cols-[56px_1fr] md:grid-cols-[72px_1fr] gap-3">
                        <dt className="text-[10px] tracking-[0.15em] uppercase text-muted pt-0.5">{e.label}</dt>
                        <dd className="text-[13px] leading-[1.7] text-ink/80">{e.detail}</dd>
                      </div>
                    ))}
                  </dl>
                  <ul className="mt-2 space-y-1">
                    {s.sources.map((src) => (
                      <li key={src.url} className="text-[11.5px] leading-[1.6] text-muted"><a href={src.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink/20 underline-offset-2 hover:text-ink">{src.title}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <section className="max-w-wide mx-auto px-6 md:px-10 py-8 md:py-10 border-t border-ink/15 space-y-3">
          <ShareButton profile={profile} answers={answers} />
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => { window.localStorage.removeItem("trolley-answers"); window.location.href = "/"; }} className="flex-1 border border-ink py-3.5 text-sm tracking-wide hover:bg-ink hover:text-paper transition-colors">처음부터 다시</button>
            <Link href="/" className="flex-1 bg-ink text-paper py-3.5 text-sm tracking-wide hover:bg-accent transition-colors text-center">처음으로</Link>
          </div>
        </section>
      </Reveal>
    </>
  );
}
