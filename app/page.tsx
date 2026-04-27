import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper flex flex-col">
      <header className="border-b border-line">
        <div className="max-w-wide mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="text-[11px] tracking-[0.25em] uppercase text-muted">
            윤리 사고실험
          </div>
          <div className="text-[11px] tracking-[0.2em] uppercase text-muted/70">
            Issue No. 01
          </div>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-6 md:px-10 py-12">
        <div className="max-w-wide w-full text-center">
          <div className="fade-up text-[11px] tracking-[0.3em] uppercase text-muted mb-10">
            Trolley Problem · 트롤리 문제
          </div>

          <h1 className="fade-up fade-up-delay-1 serif text-[60px] md:text-[112px] leading-[0.95] tracking-[-0.03em] font-medium mb-12">
            선로 위의<br />다섯 사람
          </h1>

          <div className="fade-up fade-up-delay-2 max-w-[320px] mx-auto mb-12">
            <div className="trolley-track" />
          </div>

          <div className="fade-up fade-up-delay-2 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[11px] tracking-[0.2em] uppercase text-muted mb-14">
            <span>5개의 질문</span>
            <span className="text-ink/15">·</span>
            <span>약 5분</span>
            <span className="text-ink/15">·</span>
            <span>도덕 유형 분석</span>
          </div>

          <div className="fade-up fade-up-delay-3">
            <Link
              href="/scenario/trolley"
              className="group inline-flex items-center gap-4 bg-ink text-paper px-12 py-5 text-[15px] tracking-wide hover:bg-accent transition-colors"
            >
              <span>시작하기</span>
              <span className="transition-transform group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </div>

          <p className="fade-up fade-up-delay-3 serif text-[15px] text-muted italic mt-12 max-w-md mx-auto leading-relaxed">
            당신의 도덕 직관을 들여다보는 작은 거울.
          </p>
        </div>
      </section>
    </main>
  );
}
