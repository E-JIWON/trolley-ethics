/** 유형마다 하나씩 — 가는 선으로 그린 상징. 색은 currentColor를 따른다 */
const PATHS: Record<string, JSX.Element> = {
  // 계산자 — 다섯 대 하나
  결과: (
    <>
      {[10, 18, 26, 34, 42].map((x) => <circle key={x} cx={x} cy={20} r={2.6} />)}
      <line x1={8} y1={30} x2={44} y2={30} />
      <circle cx={26} cy={40} r={2.6} />
    </>
  ),
  // 원칙주의자 — 넘지 않는 선
  원칙: (
    <>
      <line x1={6} y1={34} x2={46} y2={34} />
      <line x1={26} y1={10} x2={26} y2={42} />
      <path d="M10 26 L20 26" />
      <path d="M17 22 L21 26 L17 30" />
    </>
  ),
  // 관계주의자 — 겹친 두 원
  관계: (
    <>
      <circle cx={20} cy={26} r={11} />
      <circle cx={32} cy={26} r={11} />
    </>
  ),
  // 절차주의자 — 차례로 밟는 계단
  절차: <path d="M8 42 H18 V32 H28 V22 H38 V12 H46" />,
  // 현실적 원칙주의자 — 저울
  "결과+원칙": (
    <>
      <line x1={26} y1={8} x2={26} y2={44} />
      <line x1={18} y1={44} x2={34} y2={44} />
      <line x1={10} y1={16} x2={42} y2={12} />
      <path d="M10 16 L5 28 H15 Z" />
      <path d="M42 12 L37 24 H47 Z" />
    </>
  ),
  // 온정적 계산자 — 무리 속 하나를 감싼 원
  "결과+관계": (
    <>
      {[[10, 14], [42, 14], [10, 38], [42, 38], [26, 8], [26, 44]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={2.2} />)}
      <circle cx={26} cy={26} r={2.6} />
      <circle cx={26} cy={26} r={9} />
    </>
  ),
  // 제도 설계자 — 갈라지는 선로
  "결과+절차": (
    <>
      <path d="M8 44 L20 28 L20 8" />
      <path d="M20 28 L44 12" />
      {[14, 22, 30, 38].map((y) => <line key={y} x1={14} y1={y} x2={26} y2={y} strokeOpacity={0.45} />)}
    </>
  ),
  // 수호자 — 방패
  "원칙+관계": (
    <>
      <path d="M26 6 L42 12 V24 C42 34 35 41 26 46 C17 41 10 34 10 24 V12 Z" />
      <circle cx={26} cy={25} r={4} />
    </>
  ),
  // 법관 — 기둥
  "원칙+절차": (
    <>
      <path d="M8 14 L26 6 L44 14 Z" />
      {[14, 22, 30, 38].map((x) => <line key={x} x1={x} y1={18} x2={x} y2={40} />)}
      <line x1={8} y1={44} x2={44} y2={44} />
    </>
  ),
  // 중재자 — 두 점을 잇는 다리
  "관계+절차": (
    <>
      <circle cx={10} cy={30} r={4} />
      <circle cx={42} cy={30} r={4} />
      <path d="M14 30 C20 16 32 16 38 30" />
      <line x1={26} y1={20} x2={26} y2={44} strokeOpacity={0.45} />
    </>
  ),
  // 흔들리는 직관 — 물결
  흔들리는: (
    <>
      <path d="M6 20 C12 12 18 28 26 20 S40 12 46 20" />
      <path d="M6 32 C12 24 18 40 26 32 S40 24 46 32" strokeOpacity={0.45} />
    </>
  ),
};

export default function TypeIcon({ typeKey, size = 52, className = "" }: { typeKey: string; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[typeKey] ?? PATHS["흔들리는"]}
    </svg>
  );
}

/** 인물 메달 — 사진 대신 이름의 첫 글자를 판화풍 원 안에 */
export function PersonMedal({ name, size = 52, className = "" }: { name: string; size?: number; className?: string }) {
  const last = name.trim().split(/\s+/).pop() ?? name;
  return (
    <div
      className={`relative shrink-0 rounded-full border border-ink/25 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div className="absolute inset-[3px] rounded-full border border-ink/10" />
      <span className="serif text-ink/70" style={{ fontSize: size * 0.4 }}>{last[0]}</span>
    </div>
  );
}
