# 선로 위의 다섯 사람

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

## Vercel 배포

가장 간단한 두 가지 방법.

### 방법 1: GitHub + Vercel 대시보드 (추천)

1. GitHub에 새 레포지토리를 만들고 이 폴더를 push
   ```bash
   git init
   git add .
   git commit -m "init: trolley ethics"
   git branch -M main
   git remote add origin https://github.com/<사용자>/trolley-ethics.git
   git push -u origin main
   ```
2. https://vercel.com/new 에서 해당 레포 import
3. 프레임워크는 자동으로 Next.js로 감지됨. 그대로 Deploy
4. 끝. `<프로젝트>.vercel.app` 도메인이 즉시 발급됨

### 방법 2: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel        # 첫 배포 (preview)
vercel --prod # 프로덕션 배포
```

## 구조

```
app/
  layout.tsx                루트 레이아웃 + 메타데이터
  page.tsx                  홈 (목차 + 인트로)
  globals.css               타이포그래피 베이스
  scenario/[id]/page.tsx    각 시나리오 (정적 생성)
  result/page.tsx           결과 분석
components/
  ChoiceSelector.tsx        선택지 (클라이언트, localStorage)
  ResultAnalysis.tsx        결과 분석 (클라이언트)
data/
  scenarios.ts              5개 시나리오 데이터 + 출처
```

서버 컴포넌트가 본문/제목/메타데이터를 모두 렌더링하므로 SEO·SSR 친화적이고, 사용자 답변만 클라이언트에서 localStorage에 저장한다.

## 시나리오 출처

1. 필리파 풋, "The Problem of Abortion and the Doctrine of the Double Effect" (1967)
2. 주디스 자비스 톰슨, "The Trolley Problem" (1985)
3. 주디스 자비스 톰슨, "Killing, Letting Die, and the Trolley Problem" (1976)
4. Awad et al., "The Moral Machine Experiment" (Nature, 2018)
5. 버나드 윌리엄스, "A Critique of Utilitarianism" (1973)
