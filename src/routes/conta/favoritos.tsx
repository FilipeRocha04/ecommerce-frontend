import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useStore";
import { getProduct } from "@/mocks/products";

export const Route = createFileRoute("/conta/favoritos")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites } = useStore();
  const products = favorites
    .map((id) => getProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-xl font-bold">Favoritos</h1>

        {products.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <Heart className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Você ainda não favoritou nenhuma peça.</p>
            <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
              <Link to="/produtos">Ver peças</Link>
            </Button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
