export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function AgentCardSkeleton() {
  return (
    <div className="bg-bg-card border border-white/[0.06] rounded-card overflow-hidden">
      <div className="skeleton h-40 rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-3 w-1/2 mt-4" />
        <div className="flex justify-between mt-4">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-4 w-16" />
        </div>
        <div className="skeleton h-10 w-full mt-3 rounded-full" />
      </div>
    </div>
  );
}
