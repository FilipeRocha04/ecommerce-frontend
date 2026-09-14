import { CheckCircle2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function CompatibilityBadge({
  compatible,
  className,
}: {
  compatible: boolean | null;
  className?: string;
}) {
  if (compatible === true) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success",
          className,
        )}
      >
        <CheckCircle2 className="size-3.5" /> Compatível com seu veículo
      </span>
    );
  }
  if (compatible === false) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground",
          className,
        )}
      >
        <HelpCircle className="size-3.5" /> Não indicado para seu veículo
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground",
        className,
      )}
    >
      <HelpCircle className="size-3.5" /> Verificar compatibilidade
    </span>
  );
}
