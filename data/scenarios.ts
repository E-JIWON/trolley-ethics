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
  body: string[];
  question: string;
  choices: Choice[];
  /** 선택지 막대 수치의 출처. 추정치면 그렇다고 적는다. */
  pctNote: string;
  /** 답한 뒤 보여주는 실제 연구 데이터 */
  evidence: Evidence[];
  notes: string;
  sources: Source[];
};

export const scenarios: Scenario[] = [
  {
    id: 1,
    slug: "trolley",
    number: "01",
    eyebrow: "고전",
    title: "선로 위의 다섯 사람",
    attribution: "필리파 풋, 1967",
    hook: "당신의 손이 레버 위에 있다.",
    body: [
      "브레이크가 고장 난 트롤리가 선로 위 인부 다섯 명을 향해 달린다. 당신 옆에 레버가 있다. 당기면 트롤리는 옆 선로로 빠지고, 그곳에 있던 한 명이 죽는다.",
      "몇 초 안에 정해야 한다.",
    ],
    question: "레버를 당길 것인가?",
    choices: [
      {
        key: "switch",
        label: "당긴다",
        sub: "한 명이 죽지만 다섯이 산다",
        tags: ["공리주의", "결과주의"],
        globalPct: 89,
      },
      {
        key: "nothing",
        label: "당기지 않는다",
        sub: "다섯이 죽어도, 내가 그 한 명을 죽인 건 아니다",
        tags: ["의무론", "행위/방관 구분"],
        globalPct: 11,
      },
    ],
    pctNote: "Hauser 외 (2007), 온라인 응답자 5,000명 이상 중 '허용된다'고 답한 비율.",
    evidence: [
      {
        label: "일반인",
        detail:
          "89%가 '당겨도 된다'고 답했다. 국적·종교·교육 수준과 거의 무관하게 같은 비율이 나온다. (Hauser, Cushman, Young, Jin & Mikhail 2007)",
      },
      {
        label: "철학자",
        detail:
          "2020 PhilPapers 설문에서 전문 철학자 1,736명 중 63%가 '당긴다', 13%가 '당기지 않는다'. 나머지는 판단을 유보했다. 2009년보다 '당기지 않는다'가 늘었다.",
      },
      {
        label: "기원",
        detail:
          "풋은 1967년 낙태와 '이중효과 원칙'을 논하며 이 예를 처음 썼다. 원래 버전에서 선택하는 사람은 구경꾼이 아니라 트롤리 운전사다. 구경꾼 버전은 톰슨(1985)이 만들었다.",
      },
    ],
    notes:
      "표면적으로는 단순한 산수다. 다음 시나리오에서 그 단순함이 무너진다.",
    sources: [
      {
        title: "Foot, P. (1967). The Problem of Abortion and the Doctrine of the Double Effect. Oxford Review 5.",
        url: "https://philpapers.org/rec/FOOTPO-2",
      },
      {
        title: "Hauser, M. et al. (2007). A Dissociation Between Moral Judgments and Justifications. Mind & Language 22(1).",
        url: "https://doi.org/10.1111/j.1468-0017.2006.00297.x",
      },
      {
        title: "Bourget, D. & Chalmers, D. (2023). Philosophers on Philosophy: The 2020 PhilPapers Survey. Philosophers' Imprint.",
        url: "https://survey2020.philpeople.org/survey/results/4922",
      },
    ],
  },
  {
    id: 2,
    slug: "footbridge",
    number: "02",
    eyebrow: "변형",
    title: "육교 위의 낯선 사람",
    attribution: "주디스 자비스 톰슨, 1985",
    hook: "이번엔 레버가 없다.",
    body: [
      "같은 트롤리, 같은 다섯 명. 당신은 선로 위 육교에 서 있고, 옆에 체구가 큰 낯선 사람이 난간에 기대 있다. 그를 밀어 떨어뜨리면 트롤리는 멈추고 다섯은 산다. 그는 죽는다. 당신이 뛰어내리는 건 소용없다. 체중이 모자란다.",
      "숫자는 1번과 똑같다. 그런데 왜 손이 떨리는가?",
    ],
    question: "그를 밀 것인가?",
    choices: [
      {
        key: "push",
        label: "민다",
        sub: "산수는 똑같다. 결과를 우선한다",
        tags: ["공리주의", "결과주의"],
        globalPct: 11,
      },
      {
        key: "nothing",
        label: "밀지 않는다",
        sub: "사람을 도구로 쓰는 것은 다르다",
        tags: ["의무론", "이중결과 원칙"],
        globalPct: 89,
      },
    ],
    pctNote: "Hauser 외 (2007), 같은 응답자 집단. 1번과 비교하기 위해 같은 출처를 썼다.",
    evidence: [
      {
        label: "일반인",
        detail:
          "11%만 '밀어도 된다'고 답했다. 1번(89%)과의 격차가 도덕심리학 연구 전체의 출발점이 됐다. 대부분은 왜 두 답이 다른지 설명하지 못했다. (Hauser 외 2007)",
      },
      {
        label: "철학자",
        detail:
          "22%가 '민다', 56%가 '밀지 않는다'. (PhilPapers 2020, n=1,740) 철학자도 일반인과 같은 방향으로 갈리지만 덜 극단적이다. 질문 순서를 바꾸면 답이 달라지는 '순서 효과'도 확인됐다.",
      },
      {
        label: "메커니즘",
        detail:
          "그린 외(2009)는 '직접 몸으로 가하는 힘'과 '죽음을 수단으로 삼는 의도'를 실험으로 분리했다. 둘이 겹칠 때 거부감이 가장 컸다. 레버는 둘 다 없고, 밀기는 둘 다 있다.",
      },
    ],
    notes:
      "칸트의 '사람을 수단으로만 대하지 말라'는 정언명령, 그리고 아퀴나스의 이중효과 원칙과 맞닿아 있다. 죽음이 의도된 수단인지, 예측된 부수효과인지. 이 차이가 직관을 가른다.",
    sources: [
      {
        title: "Thomson, J. J. (1985). The Trolley Problem. Yale Law Journal 94(6).",
        url: "https://doi.org/10.2307/796133",
      },
      {
        title: "Greene, J. D. et al. (2009). Pushing Moral Buttons: The Interaction Between Personal Force and Intention in Moral Judgment. Cognition 111(3).",
        url: "https://doi.org/10.1016/j.cognition.2009.02.001",
      },
      {
        title: "PhilPapers Survey 2020 — 전체 결과",
        url: "https://survey2020.philpeople.org/survey/results/all",
      },
    ],
  },
  {
    id: 3,
    slug: "transplant",
    number: "03",
    eyebrow: "확장",
    title: "장기 이식 의사",
    attribution: "주디스 자비스 톰슨, 1976",
    hook: "이번엔 메스다.",
    body: [
      "당신은 외과의사다. 환자 다섯이 각각 심장, 폐, 간, 신장 둘을 기다리며 죽어간다. 마침 검진을 받으러 온 건강한 청년의 장기가 다섯 모두와 맞는다. 그는 가족이 없고, 발각될 가능성은 0이다.",
      "1번과 수학적으로 똑같다. 그런데 거의 모든 사람이 즉시 거부한다.",
    ],
    question: "청년의 장기를 적출할 것인가?",
    choices: [
      {
        key: "kill",
        label: "적출한다",
        sub: "다섯 생명이 한 생명보다 무겁다",
        tags: ["공리주의", "결과주의"],
        globalPct: 5,
      },
      {
        key: "nothing",
        label: "정상 진료한다",
        sub: "의사는 살인자가 되어선 안 된다",
        tags: ["의무론", "권리 기반"],
        globalPct: 95,
      },
    ],
    pctNote: "근사치. 그린 연구실의 표준 딜레마 세트에서 이 사례의 '허용' 응답은 10% 미만으로 보고된다.",
    evidence: [
      {
        label: "일반인",
        detail:
          "도덕심리학에서 이 사례는 '저갈등' 딜레마로 분류된다. 공리주의적 응답이 10%를 밑돌고, 응답 속도도 가장 빠르다. 고민조차 하지 않는다는 뜻이다. (Greene 외 2001의 딜레마 세트)",
      },
      {
        label: "철학",
        detail:
          "톰슨은 이 사례로 '숫자만 세는' 결과주의를 반박했다. 권리와 신뢰의 문제다. 의사가 환자를 자원으로 볼 수 있는 사회에서는 아무도 병원에 가지 않는다.",
      },
      {
        label: "반전",
        detail:
          "톰슨 자신은 2008년 논문 「Turning the Trolley」에서 입장을 바꿨다. 구경꾼은 1번에서도 레버를 당기면 안 된다는 것. 트롤리 문제를 만든 사람이 트롤리 문제의 '정답'을 뒤집었다.",
      },
    ],
    notes:
      "만약 숫자만 중요하다면, 우리는 매일 길거리에서 끌려가도 이상할 것이 없는 세상에 산다. 권리(right)와 사회적 신뢰(trust)는 효용 계산 바깥에 있다는 직관이다.",
    sources: [
      {
        title: "Thomson, J. J. (1976). Killing, Letting Die, and the Trolley Problem. The Monist 59(2).",
        url: "https://doi.org/10.5840/monist197659224",
      },
      {
        title: "Thomson, J. J. (2008). Turning the Trolley. Philosophy & Public Affairs 36(4).",
        url: "https://doi.org/10.1111/j.1088-4963.2008.00144.x",
      },
      {
        title: "Greene, J. D. et al. (2001). An fMRI Investigation of Emotional Engagement in Moral Judgment. Science 293.",
        url: "https://doi.org/10.1126/science.1062872",
      },
    ],
  },
  {
    id: 4,
    slug: "autonomous",
    number: "04",
    eyebrow: "현재",
    title: "자율주행차의 알고리즘",
    attribution: "Bonnefon · Shariff · Rahwan, 2016 / Moral Machine, 2018",
    hook: "이번엔 당신이 코드를 쓴다.",
    body: [
      "당신은 자율주행차의 결정 알고리즘을 설계한다. 사고는 피할 수 없다. 직진하면 보행자 셋, 핸들을 꺾으면 운전자 한 명이 죽는다. 어느 쪽으로 짤 것인가?",
      "가상이 아니다. 자동차 회사 엔지니어들이 실제로 받는 질문이다.",
    ],
    question: "어떤 알고리즘을 설계할 것인가?",
    choices: [
      {
        key: "swerve",
        label: "사망자 최소화 우선",
        sub: "총 인명 피해를 줄이도록 설계",
        tags: ["공리주의"],
        globalPct: 76,
      },
      {
        key: "protect",
        label: "운전자 보호 우선",
        sub: "차주의 안전이 제품의 본분",
        tags: ["의무론", "계약주의"],
        globalPct: 19,
      },
      {
        key: "random",
        label: "AI가 결정하지 않도록",
        sub: "생명의 무게를 알고리즘이 정해선 안 된다",
        tags: ["덕 윤리", "절차적 정의"],
        globalPct: 5,
      },
    ],
    pctNote: "'최소화' 76%는 Bonnefon 외 (2016) 수치. 나머지 둘은 추정이다.",
    evidence: [
      {
        label: "딜레마",
        detail:
          "응답자 76%가 '승객 한 명을 희생해 보행자 열 명을 살리는 차가 더 도덕적'이라 답했다. 그런데 같은 사람들이 자기가 살 차는 '승객 보호' 모델을 원했다. 남들은 공리주의 차를 타길 바라고, 나는 아니다. (Bonnefon, Shariff & Rahwan 2016)",
      },
      {
        label: "모럴 머신",
        detail:
          "233개국 4천만 건의 판단. 전 세계가 공유한 선호는 셋뿐이었다. 동물보다 사람, 적은 수보다 많은 수, 노인보다 젊은이. 나머지는 서구·동양·남부 세 문화권으로 갈렸다. 동양권은 노인을 살리는 쪽에, 남부권은 젊은이를 살리는 쪽에 훨씬 기울었다. (Awad 외 2018)",
      },
      {
        label: "제도",
        detail:
          "독일 연방교통부 윤리위원회(2017)는 나이·성별·신체 조건으로 생명을 차등하는 알고리즘을 금지했다. 다만 '전체 피해자 수를 줄이는 설계'는 정당화될 수 있다고 봤다. 지금까지 나온 유일한 정부 차원의 답이다.",
      },
    ],
    notes:
      "진짜 어려움은 답이 아니라 메타 질문이다. 누가 이 결정을 내려야 하는가? 엔지니어, 회사, 정부, 사용자? 보편 윤리란 가능한가, 아니면 결국 협상해야 하는가?",
    sources: [
      {
        title: "Bonnefon, J.-F., Shariff, A. & Rahwan, I. (2016). The Social Dilemma of Autonomous Vehicles. Science 352(6293).",
        url: "https://doi.org/10.1126/science.aaf2654",
      },
      {
        title: "Awad, E. et al. (2018). The Moral Machine Experiment. Nature 563.",
        url: "https://doi.org/10.1038/s41586-018-0637-6",
      },
      {
        title: "Moral Machine — 직접 참여해보기 (MIT)",
        url: "https://www.moralmachine.net/",
      },
      {
        title: "독일 연방교통디지털부 윤리위원회 보고서 (2017)",
        url: "https://bmdv.bund.de/SharedDocs/EN/publications/report-ethics-commission.html",
      },
    ],
  },
  {
    id: 5,
    slug: "kin",
    number: "05",
    eyebrow: "사적인 것",
    title: "당신의 가족이 그곳에 있다면",
    attribution: "버나드 윌리엄스, 1981",
    hook: "다시 1번으로. 단 하나만 바뀐다.",
    body: [
      "옆 선로의 한 명이 당신의 가족이다. 부모, 동생, 연인, 자식. 공평한 도덕이라면 답은 1번과 같아야 한다. 다섯은 하나보다 많고, 그 하나가 누구인지는 산수에 들어가지 않는다.",
      "망설임 없이 당기는 사람은 도덕적으로 성숙한 것인가, 사랑이 모자란 것인가?",
    ],
    question: "그래도 레버를 당길 것인가?",
    choices: [
      {
        key: "switch",
        label: "당긴다",
        sub: "도덕은 사적 관계를 넘어서야 한다",
        tags: ["공리주의", "공평주의"],
        globalPct: 30,
      },
      {
        key: "nothing",
        label: "당기지 않는다",
        sub: "특별한 관계엔 특별한 의무가 있다",
        tags: ["덕 윤리", "관계 윤리"],
        globalPct: 70,
      },
    ],
    pctNote: "추정치. 아래 연구들은 설계가 달라 이 질문과 직접 비교하기 어렵다.",
    evidence: [
      {
        label: "실험",
        detail:
          "선로 위 한 명이 낯선 사람에서 형제·부모·자녀, 또는 현재 연인으로 바뀌면 레버를 당기는 비율이 뚜렷하게 떨어진다. 유전적 관련도가 높을수록 더 떨어졌다. 전체적으로는 53%만 당겼다. (Bleske-Rechek 외 2010)",
      },
      {
        label: "반전",
        detail:
          "다섯 명도 가족이라면? '형제 한 명 vs 형제 다섯'에서는 88.7%가 당겼다. '낯선 이 한 명 vs 낯선 이 다섯'(77.1%)보다 오히려 높다. 가족은 계산을 멈추게 하는 게 아니라 계산의 단위를 바꾼다. (Kurzban, DeScioli & Fein 2012, n=616)",
      },
      {
        label: "철학",
        detail:
          "윌리엄스는 물에 빠진 아내와 낯선 이 중 아내를 구하면서 '이게 정당한가'를 먼저 따지는 사람을 두고 '생각이 하나 더 많다(one thought too many)'고 했다. 그 생각 자체가 결함이라는 것이다.",
      },
    ],
    notes:
      "이 시나리오에서 '비일관적'으로 답하는 것은 결함이 아니라 인간 도덕의 핵심일 수 있다. 윌리엄스, 수전 울프 같은 철학자들은 공평주의 윤리(공리주의·칸트주의)가 관계의 무게를 설명하지 못한다고 비판해왔다. 도덕은 '모두를 평등하게'가 아니라 '관계를 책임지는 것'에 더 가까울지 모른다.",
    sources: [
      {
        title: "Williams, B. (1981). Persons, Character and Morality. In Moral Luck. Cambridge University Press.",
        url: "https://doi.org/10.1017/CBO9781139165860.002",
      },
      {
        title: "Bleske-Rechek, A. et al. (2010). Evolution and the Trolley Problem. Journal of Social, Evolutionary, and Cultural Psychology 4(3).",
        url: "https://www.bleske-rechek.com/April%20Website%20Files/BleskeRechek%20et%20al.%202010%20JSEC%20Trolley%20Problem.pdf",
      },
      {
        title: "Kurzban, R., DeScioli, P. & Fein, D. (2012). Hamilton vs. Kant: Pitting Adaptations for Altruism Against Adaptations for Moral Judgment. Evolution and Human Behavior 33(4).",
        url: "https://doi.org/10.1016/j.evolhumbehav.2011.11.002",
      },
    ],
  },
];

export function getScenarioBySlug(slug: string) {
  return scenarios.find((s) => s.slug === slug);
}

export function getScenarioById(id: number) {
  return scenarios.find((s) => s.id === id);
}

export function getNextScenario(currentId: number) {
  return scenarios.find((s) => s.id === currentId + 1);
}
