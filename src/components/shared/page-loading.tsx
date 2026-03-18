import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({ message, className }: PageLoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-64 gap-3",
        className
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      {message && (
        <p className="text-sm text-zinc-500">{message}</p>
      )}
    </div>
  );
}