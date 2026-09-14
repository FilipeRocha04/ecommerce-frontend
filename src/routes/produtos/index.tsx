import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/hooks/useCatalog";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  q: z.string().optional(),
  categoria: z.string().optional(),
});

export const Route = createFileRoute("/produtos/")({
  component: ProductsPage,
  validateSearch: searchSchema,
});

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function ProductsPage() {
  const { q, categoria } = Route.useSearch();
  const { products, categories, brands, categoryName } = useCatalog();
  const [brand, setBrand] = useState<string | null>(null);

  const results = useMemo(() => {
    let list = products;
    if (categoria) list = list.filter((p) => p.category === categoria);
    if (brand) list = list.filter((p) => p.brand === brand);
    if (q && q.trim()) {
      const t = normalize(q);
      list = list.filter((p) => normalize(p.name).includes(t) || normalize(p.brand).includes(t));
    }
    return list;
  }, [products, q, categoria, brand]);

  const title = categoria
    ? categoryName(categoria)
    : q
      ? `Resultados para "${q}"`
      : "Todas as peças";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{results.length} peças encontradas</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setBrand(null)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent",
              brand === null ? "border-brand text-brand" : "border-border text-muted-foreground",
            )}
          >
            Todas as marcas
          </button>
          {brands.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBrand(b === brand ? null : b)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent",
                brand === b ? "border-brand text-brand" : "border-border text-muted-foreground",
              )}
            >
              {b}
            </button>
          ))}
        </div>

        {!categoria && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
            {categories.map((c) => (
              <a
                key={c.slug}
                href={`/produtos?categoria=${c.slug}`}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand"
              >
                {c.name}
              </a>
            ))}
          </div>
        )}

        {results.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Nenhuma peça encontrada com esses filtros.
          </p>
        )}
      </div>
    </SiteLayout>
  );
}
