import { cn } from "@/lib/utils";

// Palantir-style skeleton with subtle blue-tinted shimmer animation
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-primary/5 dark:bg-primary/10",
        className
      )}
      {...props}
    />
  );
}

// Skeleton card matching the stat cards on Dashboard
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <Skeleton className="mt-3 h-8 w-16" />
      <Skeleton className="mt-2 h-3 w-32" />
    </div>
  );
}

// Skeleton for list items (students, recent analyses)
function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm", className)}>
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="hidden sm:block h-4 w-20" />
    </div>
  );
}

// Skeleton for class cards in grid layout
function SkeletonClassCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-4 rounded" />
      </div>
    </div>
  );
}

// Full dashboard skeleton layout
function SkeletonDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent analyses skeleton */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="p-6 space-y-1.5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="px-6 pb-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-44" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-10 rounded-md" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Classes skeleton */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="p-6 space-y-1.5">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-44" />
          </div>
          <div className="px-6 pb-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg p-2">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-5 w-24 rounded-md" />
              </div>
            ))}
            <div className="mt-4 pt-4 border-t">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Students page skeleton
function SkeletonStudentsList() {
  return (
    <div className="p-6 space-y-6">
      {/* Search bar + button */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 flex-1 max-w-md rounded-md" />
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>
      <Skeleton className="h-4 w-28" />
      {/* Student items */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    </div>
  );
}

// Classes page skeleton
function SkeletonClassesGrid() {
  return (
    <div className="p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonClassCard key={i} />
        ))}
      </div>
    </div>
  );
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonListItem,
  SkeletonClassCard,
  SkeletonDashboard,
  SkeletonStudentsList,
  SkeletonClassesGrid,
};
