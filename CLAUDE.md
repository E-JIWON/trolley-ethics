# CLAUDE.md

이 파일은 Claude Code가 이 프로젝트에서 작업할 때 자동으로 읽는 컨텍스트야.

## 프로젝트 개요

**선로 위의 다섯 사람** — 트롤리 문제와 그 변형 5가지를 통해 자신의 도덕 직관을 들여다보는 인터랙티브 에디토리얼 페이지.

## 스택

- Next.js 14.2 (App Router)
- TypeScript (strict)
- Tailwind CSS
- Pretendard (산세리프) + Noto Serif KR (세리프)
- localStorage 기반 답변 저장 (서버 DB 없음)
- Vercel 배포 전제

## 디자인 톤

Noema, Stripe Press, NYT Magazine 같은 에디토리얼 매거진의 무게감.
"가볍지 않게, 그러나 페이지를 넘기게."

- 헤드라인: Noto Serif KR (`.serif` 클래스)
- 본문: Pretendard
- 컬러 팔레트는 `tailwind.config.ts`에 정의:
  - `ink` `#1a1a1a` (잉크 블랙)
  - `paper` `#fafaf7` (페이퍼)
  - `muted` `#6b6b66`
  - `line` `#e5e3dc`
  - `accent` `#8b3a3a` (와인색, 매우 절제해서 사용)
- 그라디언트, 드롭섀도우, 네온 효과 절대 안 씀
- 본문 폭은 좁게 (`max-w-prose` = 640px)
- 가로줄(`<div class="rule" />`)을 섹션 구분에 즐겨 사용

## 디자인 작업 시 원칙

1. 톤이 무거운 주제이므로 "재미"나 "게임" 느낌 금지. 진지하지만 답답하지 않게.
2. 한글 가독성이 최우선. 영문 디자인 패턴을 그대로 차용하지 말고 한글 행간/자간 보정.
3. 새 컴포넌트 만들 때 Server Component 기본, 인터랙션 필요한 경우만 `"use client"`.
4. 애니메이션은 `fade-up` 정도로 절제.

## 구조

```
app/
  layout.tsx                루트 레이아웃 + 메타데이터
  page.tsx                  홈 (목차 + 인트로)
  globals.css               타이포그래피 베이스 (드롭캡, fade-up 등)
  scenario/[id]/page.tsx    각 시나리오 (generateStaticParams로 정적 생성)
  result/page.tsx           결과 분석 (클라이언트 컴포넌트 wrap)
components/
  ChoiceSelector.tsx        선택지, localStorage에 답변 저장
  ResultAnalysis.tsx        결과 분석 + 비일관성 감지
data/
  scenarios.ts              5개 시나리오 + Tag 타입 + 헬퍼 함수
```

## 자주 하게 될 작업과 위치

- **시나리오 추가/수정**: `data/scenarios.ts`만 건드리면 자동으로 라우트 생성됨
- **선택지 분석 로직 변경**: `components/ResultAnalysis.tsx`의 `inconsistencies` 배열
- **글로벌 타이포 조정**: `app/globals.css`
- **컬러 팔레트 조정**: `tailwind.config.ts`

## 명령어

```bash
npm run dev    # 로컬 개발 서버
npm run build  # 프로덕션 빌드 (배포 전 항상 한 번)
npm run lint
```

## 배포

Vercel. GitHub 연동하면 push할 때마다 자동 배포.
별도 환경변수 없음 (현재까지는).

## 작업 가이드라인

- 새 기능 추가하기 전에 먼저 작은 단위로 제안하고 확인받기
- 디자인 변경 시 흑백 + accent 한 톤 원칙 깨지 않기
- 본문 카피 변경 시 톤 유지 (진지하고 절제된 에디토리얼)
- 빌드 안 되는 코드 절대 커밋하지 말기 (`npm run build` 통과 확인)
