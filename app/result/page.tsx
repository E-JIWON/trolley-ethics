import Link from "next/link";
import ResultAnalysis from "@/components/ResultAnalysis";

export const metadata = {
  title: "결과 — 선로 위의 다섯 사람",
  description: "당신의 답변을 통해 본 도덕적 지문",
};

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-line sticky top-0 bg-paper/90 backdrop-blur z-10">
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
      <ResultAnalysis />
    </main>
  );
}
