export type Tag =
  | "공리주의"
  | "결과주의"
  | "의무론"
  | "행위/방관 구분"
  | "이중결과 원칙"
  | "권리 기반"
  | "계약주의"
  | "덕 윤리"
  | "절차적 정의"
  | "공평주의"
  | "관계 윤리";

export type Choice = {
  key: string;
  label: string;
  /** 그래서 무슨 일이 일어나는가 — 선택지 바로 아래 한 줄 */
  outcome: string;
  /** 이 선택의 논리 */
  sub: string;
  tags: Tag[];
  globalPct: number;
};

export type Evidence = { label: string; detail: string };
export type Source = { title: string; url: string };

export type Scenario = {
  id: number;
  slug: string;
  number: string;
  eyebrow: string;
  title: string;
  attribution: string;
  hook: string;
  /** 본문. `**이렇게**` 감싼 부분은 강조(밑줄)로 렌더된다 */
  body: string[];
  question: string;
  choices: Choice[];
  pctNote: string;
  evidence: Evidence[];
  notes: string;
  sources: Source[];
};

const S = (n: number) => String(n).padStart(2, "0");

export const scenarios: Scenario[] = [
  {
    id: 1, slug: "trolley", number: S(1), eyebrow: "고전",
    title: "선로 위의 다섯 사람", attribution: "필리파 풋, 1967",
    hook: "당신의 손이 레버 위에 있다.",
    body: [
      "브레이크가 고장 난 트롤리가 선로 위 **인부 다섯 명**을 향해 달린다. 당신 옆에 레버가 있다. 당기면 트롤리는 옆 선로로 빠지고, 그곳에 있던 **한 명**이 죽는다.",
      "몇 초 안에 정해야 한다.",
    ],
    question: "레버를 당길 것인가?",
    choices: [
      { key: "switch", label: "당긴다", outcome: "한 명이 죽고, 다섯이 산다", sub: "수가 많은 쪽을 살린다", tags: ["공리주의", "결과주의"], globalPct: 89 },
      { key: "nothing", label: "당기지 않는다", outcome: "다섯이 죽고, 한 명이 산다", sub: "내 손으로 누군가를 죽이지는 않는다", tags: ["의무론", "행위/방관 구분"], globalPct: 11 },
    ],
    pctNote: "Hauser 외 (2007), 온라인 응답자 5,000명 이상 중 '허용된다'고 답한 비율.",
    evidence: [
      { label: "일반인", detail: "89%가 '당겨도 된다'고 답했다. 국적·종교·교육 수준과 거의 무관하게 같은 비율이 나온다. (Hauser, Cushman, Young, Jin & Mikhail 2007)" },
      { label: "철학자", detail: "2020 PhilPapers 설문에서 전문 철학자 1,736명 중 63%가 '당긴다', 13%가 '당기지 않는다'. 나머지는 유보." },
      { label: "기원", detail: "풋은 1967년 낙태와 '이중효과 원칙'을 논하며 이 예를 처음 썼다. 원래는 구경꾼이 아니라 운전사가 선택한다. 구경꾼 버전은 톰슨(1985)." },
    ],
    notes: "표면적으로는 단순한 산수다. 다음 질문들에서 그 단순함이 무너진다.",
    sources: [
      { title: "Foot, P. (1967). The Problem of Abortion and the Doctrine of the Double Effect. Oxford Review 5.", url: "https://philpapers.org/rec/FOOTPO-2" },
      { title: "Hauser, M. et al. (2007). A Dissociation Between Moral Judgments and Justifications. Mind & Language 22(1).", url: "https://doi.org/10.1111/j.1468-0017.2006.00297.x" },
      { title: "Bourget & Chalmers (2023). The 2020 PhilPapers Survey.", url: "https://survey2020.philpeople.org/survey/results/4922" },
    ],
  },
  {
    id: 2, slug: "footbridge", number: S(2), eyebrow: "변형",
    title: "육교 위의 낯선 사람", attribution: "주디스 자비스 톰슨, 1985",
    hook: "이번엔 레버가 없다.",
    body: [
      "같은 트롤리, 같은 다섯 명. 당신은 선로 위 육교에 서 있고, 옆에 **체구가 큰 낯선 사람**이 난간에 기대 있다. 그를 **밀어 떨어뜨리면** 트롤리는 멈추고 다섯은 산다. 그는 죽는다. 당신이 뛰어내리는 건 소용없다. 체중이 모자란다.",
      "숫자는 1번과 똑같다. 그런데 왜 손이 떨리는가?",
    ],
    question: "그를 밀 것인가?",
    choices: [
      { key: "push", label: "민다", outcome: "그가 죽고, 다섯이 산다", sub: "산수는 1번과 같다", tags: ["공리주의", "결과주의"], globalPct: 11 },
      { key: "nothing", label: "밀지 않는다", outcome: "다섯이 죽고, 그가 산다", sub: "사람을 도구로 쓰는 것은 다르다", tags: ["의무론", "이중결과 원칙"], globalPct: 89 },
    ],
    pctNote: "Hauser 외 (2007), 1번과 같은 응답자 집단.",
    evidence: [
      { label: "일반인", detail: "11%만 '밀어도 된다'고 답했다. 1번(89%)과의 격차가 도덕심리학 연구의 출발점이 됐다. 대부분은 왜 두 답이 다른지 설명하지 못했다. (Hauser 외 2007)" },
      { label: "철학자", detail: "22%가 '민다', 56%가 '밀지 않는다'. (PhilPapers 2020, n=1,740) 철학자도 같은 방향으로 갈리지만 덜 극단적이다." },
    ],
    notes: "칸트의 '사람을 수단으로만 대하지 말라', 아퀴나스의 이중효과 원칙. 죽음이 의도된 수단인지, 예측된 부수효과인지가 직관을 가른다.",
    sources: [
      { title: "Thomson, J. J. (1985). The Trolley Problem. Yale Law Journal 94(6).", url: "https://doi.org/10.2307/796133" },
      { title: "PhilPapers Survey 2020 — 전체 결과", url: "https://survey2020.philpeople.org/survey/results/all" },
    ],
  },
  {
    id: 3, slug: "loop", number: S(3), eyebrow: "변형",
    title: "되돌아오는 선로", attribution: "주디스 자비스 톰슨, 1985",
    hook: "레버는 있다. 그런데 선로가 고리다.",
    body: [
      "1번과 같다. 다만 옆 선로가 **고리 모양으로 본선에 다시 합류**한다. 레버를 당기면 트롤리는 옆 선로로 가서 한 명을 치고, **그의 몸에 걸려** 멈춘다. 만약 그 한 명이 없었다면 트롤리는 고리를 돌아 다섯을 쳤을 것이다.",
      "레버를 당기는 손은 1번과 같다. 하지만 이번엔 그 한 명이 **멈추는 수단**이다.",
    ],
    question: "레버를 당길 것인가?",
    choices: [
      { key: "switch", label: "당긴다", outcome: "한 명이 죽고(그의 몸이 트롤리를 멈춤), 다섯이 산다", sub: "손은 레버에만 닿는다", tags: ["공리주의", "결과주의"], globalPct: 56 },
      { key: "nothing", label: "당기지 않는다", outcome: "다섯이 죽고, 한 명이 산다", sub: "그는 수단이다. 육교의 사람과 같다", tags: ["의무론", "이중결과 원칙"], globalPct: 44 },
    ],
    pctNote: "Hauser 외 (2007)의 고리 변형('Ned') 허용 비율 약 56%를 반영.",
    evidence: [
      { label: "일반인", detail: "고리 변형은 1번(89%)과 2번(11%)의 한가운데 떨어진다. 수단으로 쓰는 건 같은데 '밀기'가 아니라서 거부감이 절반만 든다. (Hauser 외 2007)" },
      { label: "철학", detail: "톰슨이 이중효과 원칙을 시험하려고 만든 사례. 이 원칙대로면 고리는 육교와 같아야 하는데, 사람들의 직관은 그렇지 않다. 그래서 이 변형이 유명하다." },
    ],
    notes: "원칙이 직관을 설명하지 못하는 첫 지점. 당신은 원칙을 고칠 것인가, 직관을 의심할 것인가?",
    sources: [
      { title: "Thomson, J. J. (1985). The Trolley Problem. Yale Law Journal 94(6).", url: "https://doi.org/10.2307/796133" },
      { title: "Hauser, M. et al. (2007). Mind & Language 22(1).", url: "https://doi.org/10.1111/j.1468-0017.2006.00297.x" },
    ],
  },
  {
    id: 4, slug: "trapdoor", number: S(4), eyebrow: "변형",
    title: "발판 아래의 함정문", attribution: "조슈아 그린 외, 2009",
    hook: "밀지 않아도 된다. 스위치만 누르면.",
    body: [
      "육교 위 체구가 큰 사람이 **함정문 위에** 서 있다. 당신은 멀리 떨어진 곳에서 **스위치**를 누를 수 있다. 누르면 문이 열리고 그는 선로로 떨어져 트롤리를 멈춘다. 다섯은 산다.",
      "결과는 2번과 같다. 당신의 손이 그의 몸에 **닿지 않는다**는 것만 다르다.",
    ],
    question: "스위치를 누를 것인가?",
    choices: [
      { key: "press", label: "누른다", outcome: "그가 떨어져 죽고, 다섯이 산다", sub: "밀지 않았다. 스위치일 뿐이다", tags: ["공리주의", "결과주의"], globalPct: 60 },
      { key: "nothing", label: "누르지 않는다", outcome: "다섯이 죽고, 그가 산다", sub: "손이 닿든 안 닿든 그를 떨어뜨리는 건 나다", tags: ["의무론", "이중결과 원칙"], globalPct: 40 },
    ],
    pctNote: "추정치. Greene 외 (2009)에서 '직접 밀기'보다 '스위치로 떨어뜨리기'의 허용 비율이 두 배 가까이 높았던 경향을 반영.",
    evidence: [
      { label: "실험", detail: "그린 연구팀은 '직접 몸으로 힘을 가하는가'와 '죽음을 수단으로 의도하는가'를 따로 조작했다. 둘 다 있을 때(밀기) 거부가 가장 크고, 의도만 있을 때(스위치)는 훨씬 약해진다. (Greene 외 2009)" },
      { label: "해석", detail: "우리 직관은 '수단으로 쓰는가'보다 '내 근육이 그를 죽이는가'에 더 민감하다. 도덕 원칙이 아니라 몸의 감각이 판단을 바꾼다." },
    ],
    notes: "총을 쏘는 것과 드론 버튼을 누르는 것. 이 변형은 그 차이를 실험실로 가져온 것이다.",
    sources: [
      { title: "Greene, J. D. et al. (2009). Pushing Moral Buttons. Cognition 111(3).", url: "https://doi.org/10.1016/j.cognition.2009.02.001" },
    ],
  },
  {
    id: 5, slug: "transplant", number: S(5), eyebrow: "확장",
    title: "장기 이식 의사", attribution: "주디스 자비스 톰슨, 1976",
    hook: "이번엔 메스다.",
    body: [
      "당신은 외과의사다. 환자 다섯이 각각 심장, 폐, 간, 신장 둘을 기다리며 죽어간다. 마침 검진을 받으러 온 **건강한 청년**의 장기가 다섯 모두와 맞는다. 그는 가족이 없고, **발각될 가능성은 0**이다.",
      "1번과 수학적으로 똑같다. 그런데 거의 모든 사람이 즉시 거부한다.",
    ],
    question: "청년의 장기를 적출할 것인가?",
    choices: [
      { key: "kill", label: "적출한다", outcome: "청년이 죽고, 환자 다섯이 산다", sub: "다섯 생명이 한 생명보다 무겁다", tags: ["공리주의", "결과주의"], globalPct: 5 },
      { key: "nothing", label: "정상 진료한다", outcome: "환자 다섯이 죽고, 청년은 집에 간다", sub: "의사는 살인자가 되어선 안 된다", tags: ["의무론", "권리 기반"], globalPct: 95 },
    ],
    pctNote: "근사치. 그린 연구실의 표준 딜레마 세트에서 이 사례의 '허용' 응답은 10% 미만.",
    evidence: [
      { label: "일반인", detail: "'저갈등' 딜레마로 분류된다. 공리주의적 응답이 10%를 밑돌고 응답 속도도 가장 빠르다. 고민조차 하지 않는다는 뜻이다. (Greene 외 2001)" },
      { label: "반전", detail: "톰슨 자신은 2008년 「Turning the Trolley」에서 입장을 바꿨다. 구경꾼은 1번에서도 레버를 당기면 안 된다는 것." },
    ],
    notes: "숫자만 중요하다면 우리는 매일 길거리에서 끌려가도 이상할 것이 없는 세상에 산다. 권리와 신뢰는 효용 계산 바깥에 있다.",
    sources: [
      { title: "Thomson, J. J. (1976). Killing, Letting Die, and the Trolley Problem. The Monist 59(2).", url: "https://doi.org/10.5840/monist197659224" },
      { title: "Thomson, J. J. (2008). Turning the Trolley. Philosophy & Public Affairs 36(4).", url: "https://doi.org/10.1111/j.1088-4963.2008.00144.x" },
      { title: "Greene, J. D. et al. (2001). Science 293.", url: "https://doi.org/10.1126/science.1062872" },
    ],
  },
  {
    id: 6, slug: "villain", number: S(6), eyebrow: "변형",
    title: "선로에 묶은 사람", attribution: "변형 — 응보 직관",
    hook: "옆 선로의 한 명이 바로 그 범인이다.",
    body: [
      "1번과 같다. 다만 옆 선로에 있는 한 명은 **다섯 명을 선로에 묶어 놓은 범인**이다. 그는 자기 작품을 구경하러 옆 선로에 내려와 있다.",
      "숫자도 같고 레버도 같다. 바뀐 건 그 한 명이 **누구인가**뿐이다.",
    ],
    question: "레버를 당길 것인가?",
    choices: [
      { key: "switch", label: "당긴다", outcome: "범인이 죽고, 다섯이 산다", sub: "자기가 만든 결과를 자기가 받는다", tags: ["공리주의", "결과주의"], globalPct: 82 },
      { key: "nothing", label: "당기지 않는다", outcome: "다섯이 죽고, 범인이 산다", sub: "죄가 있어도 내가 죽일 권한은 없다", tags: ["의무론", "절차적 정의"], globalPct: 18 },
    ],
    pctNote: "추정치. 희생자가 '유죄'일 때 희생 허용이 뚜렷이 오른다는 여러 실험의 경향을 반영.",
    evidence: [
      { label: "실험", detail: "희생될 한 명이 상황을 만든 장본인이면 레버를 당기는 비율이 올라가고, 2번처럼 '밀기'여도 거부감이 줄어든다. 응보 직관이 산수 위에 얹힌다." },
      { label: "철학", detail: "응보주의: 벌은 결과와 무관하게 마땅함(desert)의 문제다. 그러나 재판 없이 '마땅함'을 내가 집행해도 되는가. 그 질문이 다음 선택지다." },
    ],
    notes: "1번에서 당기지 않았는데 여기서 당겼다면, 당신의 원칙 안에는 '자격'이라는 변수가 들어 있다.",
    sources: [
      { title: "Thomson, J. J. (1985). The Trolley Problem. Yale Law Journal 94(6).", url: "https://doi.org/10.2307/796133" },
    ],
  },
  {
    id: 7, slug: "self", number: S(7), eyebrow: "변형",
    title: "당신이 뛰어내린다면", attribution: "휴브너 · 하우저, 2011",
    hook: "이번엔 당신의 체중으로 충분하다.",
    body: [
      "육교 위에 당신 혼자다. 옆에 밀 사람은 없다. 그리고 이번엔 **당신이 뛰어내리면** 트롤리는 멈춘다. 다섯은 산다. 당신은 죽는다.",
      "2번에서 '밀지 않는다'고 했다면, 그 이유가 **그를 수단으로 쓸 수 없어서**인지 **죽는 게 그이기 때문**인지 지금 드러난다.",
    ],
    question: "뛰어내릴 것인가?",
    choices: [
      { key: "jump", label: "뛰어내린다", outcome: "당신이 죽고, 다섯이 산다", sub: "다섯은 하나보다 많다. 그 하나가 나여도", tags: ["공리주의", "덕 윤리"], globalPct: 35 },
      { key: "nothing", label: "뛰어내리지 않는다", outcome: "다섯이 죽고, 당신이 산다", sub: "희생은 의무가 아니다", tags: ["권리 기반", "관계 윤리"], globalPct: 65 },
    ],
    pctNote: "추정치. 자기희생을 '허용'이라 보는 사람은 많지만 '의무'라 보는 사람은 적다는 연구를 반영.",
    evidence: [
      { label: "실험", detail: "사람들은 타인을 희생시키는 것보다 자기를 희생하는 것을 훨씬 더 '허용'한다. 그러나 '해야 한다'로 가면 비율이 뚝 떨어진다. 허용과 의무 사이의 틈. (Huebner & Hauser 2011)" },
      { label: "철학", detail: "공리주의는 '내'가 특별하지 않다고 본다. 내 목숨도 하나로 센다. 그 결론을 끝까지 받아들이는 공리주의자는 드물다. 이것이 공리주의에 대한 가장 오래된 비판이다." },
    ],
    notes: "이 질문은 당신을 심판하려는 게 아니다. 2번의 답이 어디서 왔는지 보여주려는 것이다.",
    sources: [
      { title: "Huebner, B. & Hauser, M. (2011). Moral Judgments About Altruistic Self-Sacrifice. Philosophical Psychology 24(1).", url: "https://doi.org/10.1080/09515089.2010.534447" },
    ],
  },
  {
    id: 8, slug: "jim", number: S(8), eyebrow: "고전",
    title: "짐과 스무 명의 포로", attribution: "버나드 윌리엄스, 1973",
    hook: "총은 당신 손에 쥐어진다.",
    body: [
      "식물학자 짐이 남미 소도시에 들어서자 **묶인 포로 스무 명**과 군인들이 있다. 대장이 말한다. 당신은 손님이니 특별히, **당신이 한 명을 쏘면 나머지 열아홉은 풀어주겠다.** 거절하면 우리가 스무 명을 전부 쏜다.",
      "도망칠 수도, 설득할 수도 없다. 포로들은 당신이 쏘기를 **바라고** 있다.",
    ],
    question: "한 명을 쏠 것인가?",
    choices: [
      { key: "shoot", label: "쏜다", outcome: "한 명이 죽고, 열아홉이 풀려난다", sub: "열아홉이 산다. 그들도 원한다", tags: ["공리주의", "결과주의"], globalPct: 70 },
      { key: "refuse", label: "거절한다", outcome: "스무 명이 군인들에게 죽는다", sub: "내가 쏘지 않으면 죽이는 건 그들이다", tags: ["의무론", "행위/방관 구분"], globalPct: 30 },
    ],
    pctNote: "추정치. 이 사례에 대한 대규모 설문은 없다.",
    evidence: [
      { label: "철학", detail: "윌리엄스는 이 사례로 공리주의가 '내가 한 일'과 '남이 한 일'의 차이를 지운다고 비판했다. 쏘는 게 맞을지도 모른다. 그러나 그것이 '당연'하다고 말하는 이론은 인간의 온전함(integrity)을 무시한다." },
      { label: "비교", detail: "짐은 2번(육교)과 같은 구조지만 한 가지가 다르다. 희생될 사람이 동의한다. 당신의 답이 2번과 달라졌다면, 동의가 당신 원칙의 변수다." },
    ],
    notes: "윌리엄스의 결론은 '쏘라'도 '쏘지 말라'도 아니었다. 답을 산수로 끝내는 이론을 의심하라는 것이었다.",
    sources: [
      { title: "Williams, B. (1973). A Critique of Utilitarianism. In Smart & Williams, Utilitarianism: For and Against. Cambridge UP.", url: "https://doi.org/10.1017/CBO9780511840852" },
    ],
  },
  {
    id: 9, slug: "baby", number: S(9), eyebrow: "확장",
    title: "우는 아기", attribution: "조슈아 그린 외, 2001",
    hook: "소리가 새어 나가면 모두 죽는다.",
    body: [
      "전시다. 적군이 마을을 수색하고 있고, 당신과 **마을 사람들**은 지하실에 숨어 있다. 당신 품의 **아기가 울기 시작한다.** 입을 막으면 아기는 숨을 쉬지 못한다. 손을 떼면 울음소리에 모두 발각되어 **아기를 포함해 전원** 죽는다.",
      "아기는 어느 쪽이든 죽는다. 다른 사람들은 당신 손에 달렸다.",
    ],
    question: "아기의 입을 막을 것인가?",
    choices: [
      { key: "smother", label: "막는다", outcome: "아기가 죽고, 마을 사람들이 산다", sub: "아기는 어차피 죽는다. 나머지는 살릴 수 있다", tags: ["공리주의", "결과주의"], globalPct: 50 },
      { key: "nothing", label: "막지 않는다", outcome: "발각되어 아기를 포함해 전원 죽는다", sub: "내 손으로 아기를 죽일 수는 없다", tags: ["의무론", "관계 윤리"], globalPct: 50 },
    ],
    pctNote: "추정치. 그린의 fMRI 연구에서 응답이 거의 반반으로 갈리고 응답 시간이 가장 길었던 '고갈등' 사례.",
    evidence: [
      { label: "실험", detail: "이 사례에서 뇌의 감정 영역과 통제 영역이 동시에 강하게 활성화됐다. 산수(막아라)와 직관(막지 마라)이 정면으로 부딪히는 드문 경우다. (Greene 외 2004)" },
      { label: "현실", detail: "M*A*S*H 마지막 회, 그리고 실제 홀로코스트 생존자 증언에도 같은 상황이 있다. 사고실험이 아니라 일어났던 일이다." },
    ],
    notes: "여기서는 '올바른 답'보다 '얼마나 오래 망설였는가'가 당신에 대해 더 많은 것을 말한다.",
    sources: [
      { title: "Greene, J. D. et al. (2004). The Neural Bases of Cognitive Conflict and Control in Moral Judgment. Neuron 44(2).", url: "https://doi.org/10.1016/j.neuron.2004.09.027" },
    ],
  },
  {
    id: 10, slug: "lifeboat", number: S(10), eyebrow: "실화",
    title: "구명보트의 네 사람", attribution: "여왕 대 더들리와 스티븐스, 1884",
    hook: "이건 사고실험이 아니다. 판결문이다.",
    body: [
      "1884년, 요트 미뇨넷호가 침몰하고 선원 넷이 구명보트에 탔다. 식량 없이 **19일**. 가장 어린 **급사 리처드 파커**는 바닷물을 마시고 혼수상태에 빠졌다. 선장 더들리는 그를 죽여 그 피와 살로 나머지 셋이 버텼고, 나흘 뒤 구조됐다.",
      "파커는 어차피 곧 죽을 상태였다. 그를 죽이지 않았다면 **넷 모두** 죽었을 가능성이 높다.",
    ],
    question: "당신이 배심원이라면, 더들리는 유죄인가?",
    choices: [
      { key: "acquit", label: "무죄", outcome: "더들리는 풀려난다. '긴급 상황'이 살인을 정당화한다", sub: "넷이 죽는 것보다 하나가 죽는 게 낫다", tags: ["공리주의", "결과주의"], globalPct: 40 },
      { key: "guilty", label: "유죄", outcome: "더들리는 살인죄로 처벌받는다", sub: "굶주림이 살인을 허가하는 법은 없다", tags: ["의무론", "절차적 정의"], globalPct: 60 },
    ],
    pctNote: "추정치. 실제 법원은 유죄(사형 선고 후 6개월 징역으로 감형).",
    evidence: [
      { label: "판결", detail: "영국 법원은 '필요(necessity)'는 살인의 변명이 될 수 없다고 판시했다. 사형을 선고했지만 여론을 고려해 여왕이 6개월로 감형했다. 유죄이되 가볍게. 법이 직관의 분열을 그대로 반영한 셈이다." },
      { label: "비교", detail: "5번(장기 이식)과 구조가 같다. 한 명을 죽여 여럿을 살린다. 다른 점은 '모두가 같은 배에 탔다'는 것. 당신의 답이 5번과 다르다면 그 차이가 어디서 오는지 생각해볼 만하다." },
    ],
    notes: "이 사건은 지금도 영미 법대 1학년 첫 주에 읽힌다. 마이클 샌델의 『정의란 무엇인가』 1장도 여기서 시작한다.",
    sources: [
      { title: "R v Dudley and Stephens [1884] 14 QBD 273 (판결문 전문)", url: "https://www.bailii.org/ew/cases/EWHC/QB/1884/2.html" },
      { title: "Sandel, M. (2009). Justice: What's the Right Thing to Do? Ch.1.", url: "https://justiceharvard.org/" },
    ],
  },
  {
    id: 11, slug: "bomb", number: S(11), eyebrow: "현재",
    title: "째깍거리는 폭탄", attribution: "마이클 월저 · 헨리 슈, 1973–1978",
    hook: "시한은 세 시간. 그는 알고 있다.",
    body: [
      "도심 어딘가에 폭탄이 설치됐고, **세 시간 뒤** 터진다. 설치한 사람은 당신 앞에 잡혀 있다. 그는 위치를 **알고 있고**, 말하지 않는다. 합법적인 방법은 전부 썼다.",
      "고문하면 그가 말할 **확률이 있다.** 확신은 없다. 그러나 폭탄이 터지면 **수백 명**이 죽는다.",
    ],
    question: "고문을 허가할 것인가?",
    choices: [
      { key: "torture", label: "허가한다", outcome: "그가 고통받고, 수백 명이 살 가능성이 생긴다", sub: "한 명의 고통과 수백의 목숨", tags: ["공리주의", "결과주의"], globalPct: 55 },
      { key: "refuse", label: "허가하지 않는다", outcome: "고문은 없다. 폭탄은 터질 수 있다", sub: "고문을 허가하는 국가는 이미 무언가를 잃었다", tags: ["권리 기반", "절차적 정의"], globalPct: 45 },
    ],
    pctNote: "추정치. 여러 나라 여론조사에서 '폭탄 시나리오' 틀을 주면 찬성이 과반 근처로 오르는 경향.",
    evidence: [
      { label: "철학", detail: "월저는 이것을 '더러운 손' 문제라 불렀다. 정치인은 때로 옳지 않은 일을 해야 하고, 그러고도 손이 더러워졌다는 사실을 잊어선 안 된다. 슈는 반대로, 이 시나리오 자체가 현실에 거의 없는 '인위적 사례'라며 고문 정당화의 문을 여는 것을 경계했다." },
      { label: "현실", detail: "9·11 이후 미국의 '강화된 심문' 논쟁이 정확히 이 틀로 진행됐다. 2014년 미 상원 보고서는 고문으로 얻은 정보가 결정적이었던 사례를 찾지 못했다고 결론 내렸다." },
    ],
    notes: "사고실험이 '확실히 안다'고 전제하는 것을 현실은 결코 주지 않는다. 그 전제를 빼고도 같은 답인가?",
    sources: [
      { title: "Walzer, M. (1973). Political Action: The Problem of Dirty Hands. Philosophy & Public Affairs 2(2).", url: "https://www.jstor.org/stable/2265139" },
      { title: "Shue, H. (1978). Torture. Philosophy & Public Affairs 7(2).", url: "https://www.jstor.org/stable/2264988" },
    ],
  },
  {
    id: 12, slug: "pond", number: S(12), eyebrow: "확장",
    title: "연못에 빠진 아이", attribution: "피터 싱어, 1972",
    hook: "이번엔 아무도 죽이지 않아도 된다.",
    body: [
      "출근길, 얕은 연못에 **어린아이가 빠져** 허우적거린다. 들어가면 쉽게 건질 수 있다. 다만 새로 산 **구두와 정장이 망가지고**, 중요한 회의에 늦는다.",
      "당연히 건진다고? 그렇다면 — 지금 이 순간 지구 반대편에서 같은 돈이면 살릴 수 있는 아이에게 당신은 왜 그 돈을 **보내지 않는가?**",
    ],
    question: "거리가 멀다는 것이 도덕적 차이를 만드는가?",
    choices: [
      { key: "same", label: "차이가 없다", outcome: "나는 구두 값만큼 매달 기부할 의무가 있다", sub: "거리는 도덕적 변수가 아니다", tags: ["공리주의", "공평주의"], globalPct: 35 },
      { key: "differs", label: "차이가 있다", outcome: "눈앞의 아이는 의무, 먼 아이는 선택", sub: "내 앞의 일과 세상의 모든 일은 다르다", tags: ["관계 윤리", "덕 윤리"], globalPct: 65 },
    ],
    pctNote: "추정치. '연못의 아이는 구해야 한다'에는 거의 전원이 동의하지만, 기부 의무로 넘어가면 동의가 급감한다.",
    evidence: [
      { label: "철학", detail: "싱어의 1972년 논문은 '효율적 이타주의' 운동의 출발점이 됐다. 논리는 단순하다. 큰 희생 없이 나쁜 일을 막을 수 있다면 막아야 한다. 거리는 그 의무를 지우지 못한다." },
      { label: "반론", detail: "모든 사람에 대한 의무가 같다면 가족·친구·이웃에 대한 특별한 의무는 어디서 오는가. 이 질문은 15번(가족)으로 이어진다." },
    ],
    notes: "이 시나리오의 불편함은 답이 어려워서가 아니라, 답이 너무 분명한데 우리가 그렇게 살지 않는다는 데 있다.",
    sources: [
      { title: "Singer, P. (1972). Famine, Affluence, and Morality. Philosophy & Public Affairs 1(3).", url: "https://www.jstor.org/stable/2265052" },
      { title: "The Life You Can Save (싱어의 비영리 프로젝트)", url: "https://www.thelifeyoucansave.org/" },
    ],
  },
  {
    id: 13, slug: "ventilator", number: S(13), eyebrow: "현재",
    title: "마지막 인공호흡기", attribution: "이매뉴얼 외, NEJM 2020",
    hook: "2020년 3월, 이탈리아 북부의 병원.",
    body: [
      "인공호흡기는 **하나**, 환자는 **둘**. 한 명은 **82세**, 다른 한 명은 **34세**. 둘 다 호흡기가 없으면 며칠 안에 죽고, 있으면 살 확률이 비슷하다. 먼저 온 사람은 82세다.",
      "당신은 당직 의사다. 결정은 **지금** 내려야 한다.",
    ],
    question: "누구에게 줄 것인가?",
    choices: [
      { key: "young", label: "34세", outcome: "82세가 죽는다. 살릴 수 있는 생애가 더 긴 쪽을 택했다", sub: "남은 생애를 센다", tags: ["공리주의", "결과주의"], globalPct: 65 },
      { key: "first", label: "먼저 온 82세", outcome: "34세가 죽는다. 순서를 지켰다", sub: "나이로 생명의 값을 매길 수 없다", tags: ["공평주의", "절차적 정의"], globalPct: 25 },
      { key: "lottery", label: "제비뽑기", outcome: "운이 정한다. 당신은 정하지 않았다", sub: "누구도 고를 자격이 없다", tags: ["절차적 정의", "계약주의"], globalPct: 10 },
    ],
    pctNote: "추정치. 팬데믹 시기 여러 설문에서 '남은 생애' 기준에 대한 지지가 가장 높았던 경향.",
    evidence: [
      { label: "지침", detail: "NEJM에 실린 권고(Emanuel 외 2020)는 '가장 많은 생명과 생애를 살리라'며 나이를 고려하되, 선착순은 배제하고, 동률이면 추첨하라고 했다. 이탈리아 마취·중환자의학회(SIAARTI)도 비슷한 지침을 냈다가 거센 논쟁에 휘말렸다." },
      { label: "반론", detail: "장애인 단체와 노인 단체는 '생애 연수' 기준이 체계적 차별이라고 반발했다. 공리주의가 제도가 되는 순간, 숫자 뒤의 얼굴이 보이기 시작한다." },
    ],
    notes: "트롤리는 비유였는데, 2020년에 비유가 아니게 됐다. 이 질문에서 당신의 답은 이론이 아니라 정책이다.",
    sources: [
      { title: "Emanuel, E. J. et al. (2020). Fair Allocation of Scarce Medical Resources in the Time of Covid-19. NEJM 382.", url: "https://doi.org/10.1056/NEJMsb2005114" },
    ],
  },
  {
    id: 14, slug: "autonomous", number: S(14), eyebrow: "현재",
    title: "자율주행차의 알고리즘", attribution: "Bonnefon · Shariff · Rahwan, 2016 / Moral Machine, 2018",
    hook: "이번엔 당신이 코드를 쓴다.",
    body: [
      "당신은 자율주행차의 결정 알고리즘을 설계한다. 사고는 피할 수 없다. 직진하면 **보행자 셋**, 핸들을 꺾으면 **운전자 한 명**이 죽는다. 어느 쪽으로 짤 것인가?",
      "가상이 아니다. 자동차 회사 엔지니어들이 실제로 받는 질문이다.",
    ],
    question: "어떤 알고리즘을 설계할 것인가?",
    choices: [
      { key: "swerve", label: "사망자 최소화", outcome: "차가 벽에 부딪혀 운전자가 죽고, 보행자 셋이 산다", sub: "총 인명 피해를 줄이도록 설계", tags: ["공리주의"], globalPct: 76 },
      { key: "protect", label: "운전자 보호", outcome: "보행자 셋이 죽고, 운전자가 산다", sub: "차주의 안전이 제품의 본분", tags: ["의무론", "계약주의"], globalPct: 19 },
      { key: "random", label: "AI가 정하지 않게", outcome: "결정을 사람(또는 우연)에게 넘긴다", sub: "생명의 무게를 알고리즘이 정해선 안 된다", tags: ["덕 윤리", "절차적 정의"], globalPct: 5 },
    ],
    pctNote: "'최소화' 76%는 Bonnefon 외 (2016) 수치. 나머지 둘은 추정.",
    evidence: [
      { label: "딜레마", detail: "응답자 76%가 '승객 한 명을 희생해 보행자 열 명을 살리는 차가 더 도덕적'이라 답했다. 그런데 같은 사람들이 자기가 살 차는 '승객 보호' 모델을 원했다. (Bonnefon, Shariff & Rahwan 2016)" },
      { label: "모럴 머신", detail: "233개국 4천만 건의 판단. 전 세계 공통 선호는 셋뿐: 동물보다 사람, 적은 수보다 많은 수, 노인보다 젊은이. 나머지는 서구·동양·남부 문화권으로 갈렸다. (Awad 외 2018)" },
      { label: "제도", detail: "독일 연방교통부 윤리위원회(2017)는 나이·성별로 생명을 차등하는 알고리즘을 금지했다. '피해자 수를 줄이는 설계'는 정당화될 수 있다고 봤다." },
    ],
    notes: "누가 이 결정을 내려야 하는가? 엔지니어, 회사, 정부, 사용자? 보편 윤리란 가능한가, 아니면 결국 협상해야 하는가?",
    sources: [
      { title: "Bonnefon, Shariff & Rahwan (2016). The Social Dilemma of Autonomous Vehicles. Science 352.", url: "https://doi.org/10.1126/science.aaf2654" },
      { title: "Awad, E. et al. (2018). The Moral Machine Experiment. Nature 563.", url: "https://doi.org/10.1038/s41586-018-0637-6" },
      { title: "Moral Machine — 직접 참여해보기 (MIT)", url: "https://www.moralmachine.net/" },
    ],
  },
  {
    id: 15, slug: "kin", number: S(15), eyebrow: "사적인 것",
    title: "당신의 가족이 그곳에 있다면", attribution: "버나드 윌리엄스, 1981",
    hook: "다시 1번으로. 단 하나만 바뀐다.",
    body: [
      "옆 선로의 한 명이 **당신의 가족**이다. 부모, 동생, 연인, 자식. 공평한 도덕이라면 답은 1번과 같아야 한다. 다섯은 하나보다 많고, 그 하나가 누구인지는 산수에 들어가지 않는다.",
      "망설임 없이 당기는 사람은 **도덕적으로 성숙한** 것인가, **사랑이 모자란** 것인가?",
    ],
    question: "그래도 레버를 당길 것인가?",
    choices: [
      { key: "switch", label: "당긴다", outcome: "가족이 죽고, 낯선 다섯이 산다", sub: "도덕은 사적 관계를 넘어서야 한다", tags: ["공리주의", "공평주의"], globalPct: 30 },
      { key: "nothing", label: "당기지 않는다", outcome: "낯선 다섯이 죽고, 가족이 산다", sub: "특별한 관계엔 특별한 의무가 있다", tags: ["덕 윤리", "관계 윤리"], globalPct: 70 },
    ],
    pctNote: "추정치. 아래 연구들은 설계가 달라 직접 비교하기 어렵다.",
    evidence: [
      { label: "실험", detail: "선로 위 한 명이 낯선 사람에서 형제·부모·자녀, 또는 연인으로 바뀌면 레버를 당기는 비율이 뚜렷이 떨어진다. 유전적 관련도가 높을수록 더. (Bleske-Rechek 외 2010)" },
      { label: "반전", detail: "다섯 명도 가족이라면? '형제 1 vs 형제 5'에서는 88.7%가 당겼다. '낯선 이 1 vs 5'(77.1%)보다 높다. 가족은 계산을 멈추게 하는 게 아니라 계산의 단위를 바꾼다. (Kurzban, DeScioli & Fein 2012)" },
      { label: "철학", detail: "윌리엄스: 물에 빠진 아내와 낯선 이 중 아내를 구하면서 '이게 정당한가'를 먼저 따지는 사람은 '생각이 하나 더 많다(one thought too many)'. 그 생각 자체가 결함이다." },
    ],
    notes: "여기서 '비일관적'으로 답하는 것은 결함이 아니라 인간 도덕의 핵심일지 모른다. 도덕은 '모두를 평등하게'가 아니라 '관계를 책임지는 것'에 가까울 수 있다.",
    sources: [
      { title: "Williams, B. (1981). Persons, Character and Morality. In Moral Luck. Cambridge UP.", url: "https://doi.org/10.1017/CBO9781139165860.002" },
      { title: "Bleske-Rechek, A. et al. (2010). Evolution and the Trolley Problem. JSEC 4(3).", url: "https://www.bleske-rechek.com/April%20Website%20Files/BleskeRechek%20et%20al.%202010%20JSEC%20Trolley%20Problem.pdf" },
      { title: "Kurzban, DeScioli & Fein (2012). Hamilton vs. Kant. Evolution and Human Behavior 33(4).", url: "https://doi.org/10.1016/j.evolhumbehav.2011.11.002" },
    ],
  },
];

export const SITE_URL = "https://trolley-ethics.vercel.app";

export function getScenarioBySlug(slug: string) {
  return scenarios.find((s) => s.slug === slug);
}

export function getScenarioById(id: number) {
  return scenarios.find((s) => s.id === id);
}

export function getNextScenario(currentId: number) {
  return scenarios.find((s) => s.id === currentId + 1);
}

/** `**강조**` 마크업을 조각으로 — 렌더러가 strong으로 감싼다 */
export function splitEmphasis(text: string): { text: string; em: boolean }[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => ({ text: part, em: i % 2 === 1 })).filter((p) => p.text);
}
