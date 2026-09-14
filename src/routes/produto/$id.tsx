import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Heart } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { Stars } from "@/components/Stars";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { brl } from "@/lib/format";
import { useStore } from "@/hooks/useStore";
import { useCatalog } from "@/hooks/useCatalog";
import { backend, ApiError } from "@/services/backend/client";
import { toProduct } from "@/services/backend/adapters";
import { track } from "@/services/tracking";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produto/$id")({
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { products, categoriasPorId } = useCatalog();
  const { addToCart, isCompatible, toggleFavorite, isFavorite } = useStore();

  const produtoQuery = useQuery({
    queryKey: ["produto", id],
    queryFn: () => backend.produtos.obter(id),
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status === 404 ? false : failureCount < 2,
  });

  const estoqueQuery = useQuery({
    queryKey: ["estoque", id],
    queryFn: () => backend.produtos.estoque(id),
    enabled: produtoQuery.isSuccess,
  });

  useEffect(() => {
    if (produtoQuery.isSuccess) track("product_viewed", { productId: id });
  }, [produtoQuery.isSuccess, id]);

  if (produtoQuery.isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-muted-foreground">
          Carregando produto...
        </div>
      </SiteLayout>
    );
  }

  if (produtoQuery.isError || !produtoQuery.data) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-xl font-bold">Produto não encontrado</h1>
          <Link
            to="/produtos"
            className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
          >
            ← Voltar para todas as peças
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const product = toProduct(produtoQuery.data, categoriasPorId);
  const stock = estoqueQuery.data?.quantidade_disponivel ?? product.stock;

  const compatible = isCompatible(product);
  const fav = isFavorite(product.id);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg bg-secondary">
            <img src={product.image} alt={product.name} className="size-full object-cover" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {product.brand}
            </span>
            <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
            <div className="mt-2">
              <Stars rating={product.rating} count={product.reviewsCount} />
            </div>
            <div className="mt-3">
              <CompatibilityBadge compatible={compatible} />
            </div>

            <div className="mt-5 rounded-lg border border-border p-4">
              {product.oldPrice && (
                <span className="block text-sm text-muted-foreground line-through">
                  {brl(product.oldPrice)}
                </span>
              )}
              <span className="block text-3xl font-bold text-brand">{brl(product.price)}</span>
              <span className="block text-sm text-muted-foreground">
                {product.installments}x de {brl(product.price / product.installments)} sem juros
              </span>
              <p className="mt-2 text-xs text-muted-foreground">
                {stock > 0 ? `${stock} em estoque` : "Sem estoque"} · Garantia: {product.warranty} ·
                Código: {product.partCode}
              </p>

              <div className="mt-4 flex gap-2">
                <Button
                  className="flex-1 bg-brand text-brand-foreground hover:bg-brand/90"
                  disabled={stock === 0}
                  onClick={() => {
                    addToCart(product.id);
                    toast.success("Adicionado ao carrinho", { description: product.name });
                  }}
                >
                  <ShoppingCart className="size-4" /> Adicionar ao carrinho
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Favoritar"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart className={cn("size-4", fav ? "fill-brand text-brand" : "")} />
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wide">Descrição</h2>
              <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wide">Especificações</h2>
              <dl className="mt-2 divide-y divide-border text-sm">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between py-1.5">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold">Você também pode gostar</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-8">
          <Link to="/produtos" className="text-sm font-semibold text-brand hover:underline">
            ← Voltar para todas as peças
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
