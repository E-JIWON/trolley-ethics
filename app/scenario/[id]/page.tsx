import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getScenarioBySlug,
  getNextScenario,
  scenarios,
} from "@/data/scenarios";
import ChoiceSelector from "@/components/ChoiceSelector";

export function generateStaticParams() {
  return scenarios.map((s) => ({ id: s.slug }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const scenario = getScenarioBySlug(params.id);
  if (!scenario) return {};
  return {
    title: `${scenario.title} — 선로 위의 다섯 사람`,
    description: scenario.hook,
  };
}

export default function ScenarioPage({ params }: { params: { id: string } }) {
  const scenario = getScenarioBySlug(params.id);
  if (!scenario) notFound();

  const next = getNextScenario(scenario.id);
  const progress = (scenario.id / scenarios.length) * 100;

  return (
    <main className="min-h-screen bg-paper">
      {/* 진행 표시 */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-line z-50">
        <div
          className="h-full bg-ink transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 헤더 */}
      <header className="border-b border-line">
        <div className="max-w-wide mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="text-[11px] tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors"
          >
            ← 목차
          </Link>
          <div className="text-[11px] tracking-[0.15em] uppercase text-muted tabular-nums">
            {scenario.number} / {String(scenarios.length).padStart(2, "0")}
          </div>
        </div>
      </header>

      <article className="max-w-prose mx-auto px-6 md:px-10 py-16 md:py-24">
        {/* 제목부 */}
        <div className="fade-up mb-12">
          <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-6">
            시나리오 {scenario.number} · {scenario.eyebrow}
          </div>
          <h1 className="serif text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.02em] font-medium mb-6">
            {scenario.title}
          </h1>
          <div className="text-sm text-muted italic serif">
            {scenario.attribution}
          </div>
        </div>

        <div className="rule mb-12 fade-up fade-up-delay-1" />

        {/* 훅 */}
        <p className="serif fade-up fade-up-delay-1 text-2xl md:text-[28px] leading-[1.5] tracking-[-0.01em] text-ink mb-12 italic">
          {scenario.hook}
        </p>

        {/* 본문 */}
        <div className="editorial-body fade-up fade-up-delay-2 mb-16">
          {scenario.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* 질문 */}
        <div className="fade-up fade-up-delay-3 mb-10">
          <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-4">
            질문
          </div>
          <h2 className="serif text-3xl md:text-4xl leading-[1.3] tracking-[-0.01em]">
            {scenario.question}
          </h2>
        </div>

        {/* 선택지 */}
        <div className="fade-up fade-up-delay-3 mb-20">
          <ChoiceSelector
            scenarioId={scenario.id}
            choices={scenario.choices}
            nextSlug={next?.slug ?? null}
          />
        </div>

        {/* 노트 */}
        <details className="fade-up group border-t border-ink/15 pt-8">
          <summary className="cursor-pointer list-none flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-muted hover:text-ink transition-colors">
            <span>편집자 주</span>
            <span className="serif text-base group-open:rotate-45 transition-transform">
              +
            </span>
          </summary>
          <p className="serif text-[15px] leading-[1.8] text-muted mt-5 italic">
            {scenario.notes}
          </p>
        </details>
      </article>
    </main>
  );
}
