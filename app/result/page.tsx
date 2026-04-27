import Link from "next/link";
import ResultAnalysis from "@/components/ResultAnalysis";

export const metadata = {
  title: "결과 — 선로 위의 다섯 사람",
  description: "당신의 답변을 통해 본 도덕적 지문",
};

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-line">
        <div className="max-w-wide mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="text-[11px] tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors"
          >
            ← 목차
          </Link>
          <div className="text-[11px] tracking-[0.15em] uppercase text-muted">
            결과
          </div>
        </div>
      </header>

      <article className="max-w-prose mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="fade-up mb-16">
          <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-6">
            결산
          </div>
          <h1 className="serif text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.02em] font-medium mb-8">
            당신이<br />걸어온 길
          </h1>
          <div className="rule mb-8" />
          <p className="serif text-xl text-muted leading-relaxed italic max-w-prose">
            아래는 분석이지 판결이 아닙니다. 당신의 답변에 '맞다'와 '틀리다'는 없어요. 다만 당신의 직관이 어디로 기우는지를 보여줄 뿐입니다.
          </p>
        </div>

        <ResultAnalysis />
      </article>
    </main>
  );
}
