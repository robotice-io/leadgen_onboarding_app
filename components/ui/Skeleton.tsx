export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`
        animate-pulse bg-black/10 dark:bg-white/10 rounded
        ${className}
      `}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white/90 dark:bg-black/30 backdrop-blur rounded-xl border border-black/5 dark:border-white/10 p-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-10 w-full mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}
