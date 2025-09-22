// @ts-nocheck
"use client";

import { useMemo } from "react";

export default function GuideShots() {
  const sources = useMemo(() => {
    const arr: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const num = String(i).padStart(2, "0");
      arr.push(`/guide/step-${num}.png`);
      arr.push(`/guide/step-${num}.jpg`);
    }
    return arr;
  }, []);

  return (
    <div className="max-h-[440px] overflow-y-auto rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-3 space-y-4">
      {sources.map((src) => (
        <img
          key={src}
          src={src}
          alt="Screenshot"
          className="w-full rounded-md border border-black/10 dark:border-white/10"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.style.display = "none";
          }}
        />
      ))}
    </div>
  );
}


