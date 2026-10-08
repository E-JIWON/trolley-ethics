import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getScenarioBySlug,
  getNextScenario,
  scenarios,
  SITE_URL,
} from "@/data/scenarios";
import ChoiceSelector from "@/components/ChoiceSelector";
import ShareButton from "@/components/ShareButton";
import Em from "@/components/Em";

export function generateStaticParams() {
  return scenarios.map((s) => ({ id: s.slug }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const scenario = getScenarioBySlug(params.id);
  if (!scenario) return {};
  return {
    title: `${scenario.question} · 질문 ${scenario.number}/${scenarios.length}`,
    description: `${scenario.title} — ${scenario.hook}`,
    openGraph: {
      title: scenario.question,
      description: `${scenario.title} · 너라면 어떻게 할래? — 선로 위의 다섯 사람`,
      url: `${SITE_URL}/scenario/${scenario.slug}`,
    },
  };
}

export default function ScenarioPage({ params }: { params: { id: string } }) {
  const scenario = getScenarioBySlug(params.id);
  if (!scenario) notFound();

  const next = getNextScenario(scenario.id);
  const progress = (scenario.id / scenarios.length) * 100;
  const total = String(scenarios.length).padStart(2, "0");

  return (
    <main key={scenario.slug} className="min-h-screen bg-paper lg:flex lg:flex-col">
      {/* 진행 표시 */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-line z-50">
        <div className="h-full bg-ink transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* 헤더 */}
      <header className="border-b border-line">
        <div className="max-w-prose lg:max-w-[1080px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <Link href="/" className="text-[11px] tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors">
            ← 처음으로
          </Link>
          <div className="text-[11px] tracking-[0.15em] uppercase text-muted tabular-nums">
            {scenario.number} / {total}
          </div>
        </div>
      </header>

      {/* PC: 왼쪽 본문 · 오른쪽 질문과 선택지(고정), 화면 세로 가운데. 모바일: 한 줄로 이어짐 */}
      <div className="lg:flex-1 lg:flex lg:items-center">
        <article className="w-full max-w-prose lg:max-w-[1080px] mx-auto px-6 md:px-10 pt-8 md:pt-10 lg:py-14 pb-14 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-x-16 xl:gap-x-20">
          {/* 묶음 1 · 제목 · 훅 · 본문 */}
          <div className="lg:col-start-1 lg:row-start-1">
            <div className="mb-8 md:mb-10">
              <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-2.5">
                질문 {scenario.number} · {scenario.eyebrow}
                <span className="normal-case tracking-normal serif italic text-muted/80 ml-2">{scenario.attribution}</span>
              </div>
              <h1 className="serif text-[26px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-medium">
                {scenario.title}
              </h1>
            </div>

            <p className="serif text-[17px] md:text-[19px] leading-[1.55] tracking-[-0.01em] text-ink mb-7 md:mb-8 italic">
              {scenario.hook}
            </p>

            <div className="editorial-body mb-10 lg:mb-12">
              {scenario.body.map((paragraph, i) => (
                <p key={i}>
                  <Em>{paragraph}</Em>
                </p>
              ))}
            </div>
          </div>

          {/* 묶음 2 · 질문 + 선택지 — PC에서는 오른쪽에 붙어 따라온다 */}
          <aside className="mb-12 lg:mb-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <div className="lg:sticky lg:top-10 lg:border-l lg:border-line lg:pl-10 xl:pl-12">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] tracking-[0.25em] uppercase text-muted">질문</div>
                  <ShareButton
                    title={`${scenario.question} — 선로 위의 다섯 사람`}
                    text={`너는 이 질문에 뭐라고 답할래? "${scenario.question}"`}
                    url={`/scenario/${scenario.slug}`}
                  />
                </div>
                <h2 className="serif text-lg md:text-[21px] leading-[1.4] tracking-[-0.01em]">{scenario.question}</h2>
              </div>

              <div>
                <ChoiceSelector
                  scenarioId={scenario.id}
                  choices={scenario.choices}
                  nextSlug={next?.slug ?? null}
                  pctNote={scenario.pctNote}
                />
              </div>
            </div>
          </aside>

          {/* 묶음 3 · 노트 */}
          <details className="group border-t border-ink/15 pt-5 lg:col-start-1 lg:row-start-2 lg:self-start">
            <summary className="cursor-pointer list-none flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-muted hover:text-ink transition-colors">
              <span>편집자 주 · 출처</span>
              <span className="serif text-base group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="serif text-[14px] leading-[1.8] text-muted mt-4 italic">{scenario.notes}</p>
            <ul className="mt-4 space-y-1.5">
              {scenario.sources.map((s) => (
                <li key={s.url} className="text-[12px] leading-[1.6] text-muted">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink/20 underline-offset-2 hover:text-ink hover:decoration-ink">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </article>
      </div>
    </main>
  );
}
