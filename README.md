# 선로 위의 다섯 사람

> https://trolley-ethics.vercel.app

윤리 사고실험 시리즈 — 트롤리 문제와 그 변형·확장 열다섯 개를 통해 자신의 도덕 직관을 들여다보는 인터랙티브 페이지. 답을 모으면 11가지 도덕 유형 중 하나로 정리된다.

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
  scenario/[id]/page.tsx    각 질문 (정적 생성) + 공유 버튼
  scenario/[id]/opengraph-image.tsx  질문별 링크 미리보기 이미지
  result/page.tsx           결과 분석 (도덕 유형 · 좌표 · 비일관성)
  og/route.tsx              결과 공유 이미지 (1080×1350 PNG)
  opengraph-image.tsx       링크 미리보기용 기본 OG 이미지
components/
  ChoiceSelector.tsx        선택지 (클라이언트, localStorage)
  ResultAnalysis.tsx        결과 분석 — 11가지 유형 판정·비일관성 노트
  Reveal.tsx                스크롤 등장 · 카운트업 훅
lib/
  og-font.ts                OG 이미지용 Noto Serif KR 로더
data/
  scenarios.ts              15개 질문 데이터 (본문 `**강조**` · 선택지 결과 · 연구 수치 · 출처)
```

서버 컴포넌트가 본문/제목/메타데이터를 모두 렌더링하므로 SEO·SSR 친화적이고, 사용자 답변만 클라이언트에서 localStorage에 저장한다.

## 질문 목록

| # | 질문 | 출처 |
|---|---|---|
| 01 | 선로 위의 다섯 사람 | Foot 1967 · Hauser 2007 · PhilPapers 2020 |
| 02 | 육교 위의 낯선 사람 | Thomson 1985 |
| 03 | 되돌아오는 선로 | Thomson 1985 · Hauser 2007 |
| 04 | 발판 아래의 함정문 | Greene et al. 2009 |
| 05 | 장기 이식 의사 | Thomson 1976, 2008 · Greene 2001 |
| 06 | 선로에 묶은 사람 | 응보 변형 |
| 07 | 당신이 뛰어내린다면 | Huebner & Hauser 2011 |
| 08 | 짐과 스무 명의 포로 | Williams 1973 |
| 09 | 우는 아기 | Greene et al. 2004 |
| 10 | 구명보트의 네 사람 | R v Dudley & Stephens 1884 · Sandel 2009 |
| 11 | 째깍거리는 폭탄 | Walzer 1973 · Shue 1978 |
| 12 | 연못에 빠진 아이 | Singer 1972 |
| 13 | 마지막 인공호흡기 | Emanuel et al. NEJM 2020 |
| 14 | 자율주행차의 알고리즘 | Bonnefon 2016 · Awad 2018 |
| 15 | 당신의 가족이 그곳에 있다면 | Williams 1981 · Bleske-Rechek 2010 · Kurzban 2012 |

선택지 막대 수치는 실제 연구가 있으면 그 값, 없으면 추정치이며 화면에 추정이라고 표기한다. 전체 서지는 `data/scenarios.ts`의 `sources`에 DOI 링크로 들어 있고, 결과 페이지 "사람들은 어떻게 답했나"에서 펼쳐볼 수 있다.

## 도덕 유형 (11)

결과 · 원칙 · 관계 · 절차 네 축의 점수로 판정한다. 1위가 2위의 1.5배 이상이면 순수형(계산자 · 원칙주의자 · 관계주의자 · 절차주의자), 아니면 상위 두 축의 혼합형(현실적 원칙주의자 · 온정적 계산자 · 제도 설계자 · 수호자 · 법관 · 중재자), 전부 동률이면 흔들리는 직관.
