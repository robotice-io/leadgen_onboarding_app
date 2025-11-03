"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  prevHref?: string;
  nextHref?: string;
  onNext?: () => void;
  onBack?: () => void;
  children: ReactNode;
  nextLabelKey?: keyof any;
  backLabelKey?: keyof any;
  isLast?: boolean;
};

export default function StepLayout({
  title,
  description,
  prevHref,
  nextHref,
  onNext,
  onBack,
  children,
  nextLabelKey,
  backLabelKey,
  isLast,
}: Props) {
  const { t } = useI18n();
  const nextLabel = isLast ? t("ss.finish") : nextLabelKey ? (t as any)(nextLabelKey) : t("ss.next");
  const backLabel = backLabelKey ? (t as any)(backLabelKey) : t("ss.back");

  return (
    <div className="bg-white/90 dark:bg-black/30 backdrop-blur rounded-xl shadow-sm border border-black/5 dark:border-white/10 p-6 sm:p-8 max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-black/60 dark:text-white/70">{description}</p>
        )}
      </div>

      <div className="space-y-6">{children}</div>

      <div className="flex items-center justify-between pt-8">
        {prevHref ? (
          <Link href={prevHref}>
            <Button variant="secondary">{backLabel}</Button>
          </Link>
        ) : (
          <span />
        )}
        {nextHref ? (
          <Link href={nextHref}>
            <Button>{nextLabel}</Button>
          </Link>
        ) : (
          <Button onPress={onNext}>{nextLabel}</Button>
        )}
      </div>
    </div>
  );
}
