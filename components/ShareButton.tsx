"use client";

import { useState } from "react";

type Props = { title: string; text: string; url: string; className?: string };

/** 이 질문 공유 — Web Share가 있으면 시트, 없으면 링크 복사 */
export default function ShareButton({ title, text, url, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const full = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url: full });
        return;
      } catch {
        /* 취소 → 복사로 */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${full}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("링크를 복사하세요", full);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex items-center gap-2 border border-ink/20 px-3.5 py-2 text-[12px] tracking-wide text-muted hover:border-ink hover:text-ink transition-colors ${className}`}
    >
      <span aria-hidden>↗</span>
      {copied ? "링크 복사됨" : "이 질문 공유"}
    </button>
  );
}
