import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  rating,
  count,
  className,
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              "size-3.5",
              i <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/40",
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {rating.toFixed(1)}
        {count !== undefined ? ` (${count})` : ""}
      </span>
    </div>
  );
}
