import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export default function AcriveBadge({ isActive }) {
  return (
    <Badge
      variant={"outline"}
      className={cn(
        "pb-1 rounded w-[75]",
        isActive
          ? "border-green-600/15 bg-green-600/10 text-green-700"
          : "text-foreground",
      )}
    >
      {isActive ? "active" : "inactive"}
    </Badge>
  );
}
