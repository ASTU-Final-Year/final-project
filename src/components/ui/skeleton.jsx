import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
