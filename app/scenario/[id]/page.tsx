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
    title: `${scenario.title} · 시나리오 ${scenario.number}/0${scenarios.length}`,
    description: scenario.hook,
  };
}

export default function ScenarioPage({ params }: { params: { id: string } }) {
  const scenario = getScenarioBySlug(params.id);
  if (!scenario) notFound();

  const next = getNextScenario(scenario.id);
  const progress = (scenario.id / scenarios.length) * 100;

  return (
    <main key={scenario.slug} className="min-h-screen bg-paper">
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
            ← 처음으로
          </Link>
          <div className="text-[11px] tracking-[0.15em] uppercase text-muted tabular-nums">
            {scenario.number} / {String(scenarios.length).padStart(2, "0")}
          </div>
        </div>
      </header>

      <article className="max-w-prose mx-auto px-6 md:px-10 py-8 md:py-12">
        {/* 제목부 */}
        <div className="fade-up mb-7">
          <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-3">
            시나리오 {scenario.number} · {scenario.eyebrow}
          </div>
          <h1 className="serif text-[26px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-medium mb-3">
            {scenario.title}
          </h1>
          <div className="text-sm text-muted italic serif">
            {scenario.attribution}
          </div>
        </div>

        <div className="rule mb-7 fade-up fade-up-delay-1" />

        {/* 훅 */}
        <p className="serif fade-up fade-up-delay-1 text-[17px] md:text-[19px] leading-[1.55] tracking-[-0.01em] text-ink mb-7 italic">
          {scenario.hook}
        </p>

        {/* 본문 */}
        <div className="editorial-body fade-up fade-up-delay-2 mb-10">
          {scenario.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* 질문 */}
        <div className="fade-up fade-up-delay-3 mb-6">
          <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-2">
            질문
          </div>
          <h2 className="serif text-lg md:text-[22px] leading-[1.4] tracking-[-0.01em]">
            {scenario.question}
          </h2>
        </div>

        {/* 선택지 */}
        <div className="fade-up fade-up-delay-3 mb-12">
          <ChoiceSelector
            scenarioId={scenario.id}
            choices={scenario.choices}
            nextSlug={next?.slug ?? null}
            pctNote={scenario.pctNote}
          />
        </div>

        {/* 실제 데이터 */}
        <section className="fade-up mb-10">
          <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-3">
            사람들은 어떻게 답했나
          </div>
          <dl className="border-y border-ink/15 divide-y divide-ink/10">
            {scenario.evidence.map((e) => (
              <div
                key={e.label}
                className="py-3 grid grid-cols-[56px_1fr] md:grid-cols-[72px_1fr] gap-3"
              >
                <dt className="text-[10px] tracking-[0.15em] uppercase text-muted pt-1">
                  {e.label}
                </dt>
                <dd className="text-[13.5px] leading-[1.7] text-ink/85">
                  {e.detail}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 노트 */}
        <details className="fade-up group border-t border-ink/15 pt-6">
          <summary className="cursor-pointer list-none flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-muted hover:text-ink transition-colors">
            <span>편집자 주 · 출처</span>
            <span className="serif text-base group-open:rotate-45 transition-transform">
              +
            </span>
          </summary>
          <p className="serif text-[14px] leading-[1.8] text-muted mt-4 italic">
            {scenario.notes}
          </p>
          <ul className="mt-4 space-y-1.5">
            {scenario.sources.map((s) => (
              <li key={s.url} className="text-[12px] leading-[1.6] text-muted">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-ink/20 underline-offset-2 hover:text-ink hover:decoration-ink"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </article>
    </main>
  );
}
