import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MessageSquareText, Search } from "lucide-react";
import { PRODUCTS } from "@/mocks/products";
import { track } from "@/services/tracking";
import { cn } from "@/lib/utils";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function SearchBar({ className }: { className?: string }) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    if (q.trim().length < 2) return [];
    const t = normalize(q);
    return PRODUCTS.filter(
      (p) => normalize(p.name).includes(t) || normalize(p.brand).includes(t),
    ).slice(0, 6);
  }, [q]);

  const isQuestion = q.trim().split(/\s+/).length >= 4 || /\?/.test(q);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    track("product_searched", { query: q });
    navigate({ to: "/produtos", search: { q: q.trim() } });
    setFocused(false);
  }

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={submit} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 150)}
          placeholder="Buscar peça, marca ou código..."
          aria-label="Buscar peças"
          className="h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand"
        />
      </form>

      {focused && q.trim().length >= 2 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-border bg-popover shadow-lg">
          {suggestions.map((p) => (
            <button
              key={p.id}
              type="button"
              onMouseDown={() => {
                navigate({ to: "/produto/$id", params: { id: p.id } });
                setFocused(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent"
            >
              <img src={p.image} alt="" className="size-9 rounded object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{p.name}</span>
                <span className="block text-xs text-muted-foreground">{p.brand}</span>
              </span>
            </button>
          ))}
          {isQuestion && (
            <button
              type="button"
              onMouseDown={() => navigate({ to: "/assistente" })}
              className="flex w-full items-center gap-2 border-t border-border bg-brand/5 px-3 py-3 text-left text-sm font-semibold text-brand"
            >
              <MessageSquareText className="size-4" />
              Quer conversar com nosso assistente?
            </button>
          )}
          {!suggestions.length && !isQuestion && (
            <p className="px-3 py-3 text-sm text-muted-foreground">Nenhuma peça encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}
