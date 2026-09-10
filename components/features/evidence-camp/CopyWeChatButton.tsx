"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const WECHAT_ID = "IAMCAT156";

export function CopyWeChatButton() {
  const [copied, setCopied] = useState(false);

  const copyWeChatId = async () => {
    await navigator.clipboard.writeText(WECHAT_ID);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={() => void copyWeChatId()}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[3px] border border-gold-light/70 bg-gold-light px-5 text-sm font-bold text-ink transition duration-160 hover:-translate-y-0.5 hover:bg-[#f6d48d]"
    >
      {copied ? <Check size={17} aria-hidden /> : <Copy size={17} aria-hidden />}
      {copied ? "微信号已复制" : "复制微信号报名"}
    </button>
  );
}
