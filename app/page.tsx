import Link from "next/link";
import { scenarios } from "@/data/scenarios";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      {/* 헤더 */}
      <header className="border-b border-line">
        <div className="max-w-wide mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="text-[11px] tracking-[0.2em] uppercase text-muted">
            윤리 사고실험 시리즈
          </div>
          <div className="text-[11px] tracking-[0.15em] uppercase text-muted">
            01 / 트롤리
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="max-w-wide mx-auto px-6 md:px-10 pt-20 md:pt-32 pb-20 md:pb-32">
        <div className="fade-up">
          <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-8">
            Issue No. 01 — 봄, 2026
          </div>
        </div>

        <h1 className="serif fade-up fade-up-delay-1 text-[44px] md:text-[72px] leading-[1.05] tracking-[-0.02em] font-medium max-w-[18ch] mb-10">
          선로 위의<br />
          다섯 사람
        </h1>

        <div className="rule mb-10 fade-up fade-up-delay-2" />

        <p className="serif fade-up fade-up-delay-2 text-xl md:text-2xl leading-[1.6] text-ink max-w-[28ch] mb-16 italic">
          한 명을 죽이고 다섯 명을 살릴 수 있다면,<br />
          당신은 어느 쪽을 택할 것인가.
        </p>

        <div className="editorial-body fade-up fade-up-delay-3 max-w-prose">
          <p className="dropcap">
            1967년, 영국의 철학자 필리파 풋이 한 가지 사고실험을 제시했다. 폭주하는 트롤리가 다섯 명을 향해 달려가고, 당신 손엔 레버가 있다. 단순해 보이는 이 질문이 60년 동안 윤리학을 흔들어온 이유는, 답이 어렵기 때문이 아니다. 우리가 답을 알고 있다고 착각하기 때문이다.
          </p>
          <p>
            이 시리즈는 다섯 개의 시나리오를 통해 자신의 도덕적 직관을 들여다보는 작은 실험이다. 처음 두 시나리오를 풀고 나면, 대부분의 사람은 자신이 일관된 원칙을 가졌다고 믿는다. 그러나 세 번째에서 그 믿음은 무너진다.
          </p>
          <p className="text-muted text-[15px] italic">
            — 이것은 게임이 아니다. 그러나 답을 회피할 수도 없다.
          </p>
        </div>
      </section>

      {/* 목차 */}
      <section className="max-w-wide mx-auto px-6 md:px-10 pb-20">
        <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-8">
          다섯 개의 시나리오
        </div>

        <ol className="border-t border-ink/15">
          {scenarios.map((s) => (
            <li key={s.id} className="border-b border-ink/15">
              <Link
                href={`/scenario/${s.slug}`}
                className="block py-7 md:py-9 group transition-colors hover:bg-black/[0.02]"
              >
                <div className="flex items-baseline gap-6 md:gap-10">
                  <div className="serif text-2xl md:text-3xl text-muted/60 w-12 shrink-0 tabular-nums">
                    {s.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] tracking-[0.2em] uppercase text-muted mb-2">
                      {s.eyebrow}
                    </div>
                    <h2 className="serif text-2xl md:text-[34px] leading-[1.2] tracking-[-0.01em] mb-2 group-hover:text-accent transition-colors">
                      {s.title}
                    </h2>
                    <div className="text-sm text-muted">{s.attribution}</div>
                  </div>
                  <div className="serif text-xl text-muted/40 group-hover:text-accent group-hover:translate-x-1 transition-all hidden md:block">
                    →
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* 시작 CTA */}
      <section className="max-w-wide mx-auto px-6 md:px-10 pb-32">
        <div className="border-t border-ink pt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-md">
            <div className="text-[11px] tracking-[0.25em] uppercase text-muted mb-3">
              시작하기
            </div>
            <p className="serif text-2xl leading-[1.4] tracking-[-0.01em]">
              당신의 답은 기록되며, 끝에서 직관의 패턴을 보여드립니다.
            </p>
          </div>
          <Link
            href="/scenario/trolley"
            className="inline-flex items-center gap-3 bg-ink text-paper px-8 py-4 text-sm tracking-wide hover:bg-accent transition-colors self-start md:self-end"
          >
            <span>첫 시나리오로</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-line">
        <div className="max-w-wide mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row md:justify-between gap-4 text-[12px] text-muted">
          <div>
            © 2026. 사고실험 자료는 인용 출처를 표기했다.
          </div>
          <div className="serif italic">
            "한 가지 생각이 너무 많다." — 버나드 윌리엄스
          </div>
        </div>
      </footer>
    </main>
  );
}
