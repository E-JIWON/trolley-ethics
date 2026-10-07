# 선로 위의 다섯 사람

> https://trolley-ethics.vercel.app

윤리 사고실험 시리즈 — 트롤리 문제와 그 다섯 가지 변형을 통해 자신의 도덕 직관을 들여다보는 인터랙티브 페이지.

## 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Pretendard + Noto Serif KR (한글 에디토리얼 타이포그래피)
- 모든 페이지가 SSG로 빌드되어 SSR 친화적 — 검색엔진/SNS 공유에 최적

## 디자인 방향

Noema, Stripe Press, NYT Magazine 같은 에디토리얼 매거진의 톤을 차용했다. 가볍지 않게, 그러나 페이지를 넘기게 만드는 무게로.

- 세리프 헤드라인 (Noto Serif KR) + 산세리프 본문 (Pretendard)
- 페이퍼 톤 배경 (`#fafaf7`)과 잉크 블랙 (`#1a1a1a`)
- 액센트 컬러는 어두운 와인색 (`#8b3a3a`) 한 톤만
- 충분한 여백, 좁은 본문 폭, 큰 행간 — 천천히 읽히도록

## 로컬 실행

```bash
npm install
npm run dev
# http://localhost:3000
```

## 배포

**https://trolley-ethics.vercel.app** — GitHub `main`에 push하면 Vercel이 자동 배포한다. 환경변수 없음.

## 구조

```
app/
  layout.tsx                루트 레이아웃 + 메타데이터
  page.tsx                  홈 (목차 + 인트로)
  globals.css               타이포그래피 베이스
  scenario/[id]/page.tsx    각 시나리오 (정적 생성)
  result/page.tsx           결과 분석 (도덕 유형 · 좌표 · 비일관성)
  og/route.tsx              결과 공유 이미지 (1080×1350 PNG)
  opengraph-image.tsx       링크 미리보기용 기본 OG 이미지
components/
  ChoiceSelector.tsx        선택지 (클라이언트, localStorage)
  ResultAnalysis.tsx        결과 분석 (클라이언트)
  Reveal.tsx                스크롤 등장 · 카운트업 훅
lib/
  og-font.ts                OG 이미지용 Noto Serif KR 로더
data/
  scenarios.ts              5개 시나리오 데이터 + 출처
```

서버 컴포넌트가 본문/제목/메타데이터를 모두 렌더링하므로 SEO·SSR 친화적이고, 사용자 답변만 클라이언트에서 localStorage에 저장한다.

## 데이터와 출처

각 시나리오의 선택지 막대와 "사람들은 어떻게 답했나" 섹션은 실제 연구 수치다. 추정치는 화면에 추정이라고 표기한다.

| 시나리오 | 수치 | 출처 |
|---|---|---|
| 01 레버 | 일반인 89% 당김 · 철학자 63% 당김 / 13% 안 당김 | Hauser et al. 2007 (n>5,000) · PhilPapers 2020 (n=1,736) |
| 02 육교 | 일반인 11% 밈 · 철학자 22% 밈 / 56% 안 밈 | Hauser et al. 2007 · PhilPapers 2020 (n=1,740) · Greene et al. 2009 |
| 03 이식 | 공리주의 응답 10% 미만 (근사) | Greene et al. 2001 딜레마 세트 · Thomson 1976, 2008 |
| 04 자율주행 | 76% "최소화가 더 도덕적" · 4천만 건, 233개국 | Bonnefon, Shariff & Rahwan 2016 (Science) · Awad et al. 2018 (Nature) · 독일 윤리위 2017 |
| 05 가족 | 관련도 높을수록 덜 당김 (전체 53%) · 형제 1 vs 형제 5는 88.7% | Bleske-Rechek et al. 2010 · Kurzban, DeScioli & Fein 2012 (n=616) · Williams 1981 |

전체 서지는 `data/scenarios.ts`의 `sources` 배열에 DOI 링크로 들어 있고, 각 시나리오 하단 "편집자 주 · 출처"에서 열어볼 수 있다.
