import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { brl } from "@/lib/format";
import { useStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/Stars";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, isCompatible, toggleFavorite, isFavorite } = useStore();
  const compatible = isCompatible(product);
  const fav = isFavorite(product.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <button
        type="button"
        aria-label="Favoritar"
        onClick={() => toggleFavorite(product.id)}
        className="absolute right-2 top-2 z-10 rounded-full bg-background/90 p-1.5 shadow-sm"
      >
        <Heart className={cn("size-4", fav ? "fill-brand text-brand" : "text-muted-foreground")} />
      </button>

      <Link
        to="/produto/$id"
        params={{ id: product.id }}
        className="block aspect-square overflow-hidden bg-secondary"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </span>
        <Link
          to="/produto/$id"
          params={{ id: product.id }}
          className="line-clamp-2 text-sm font-semibold leading-snug hover:text-brand"
        >
          {product.name}
        </Link>
        <Stars rating={product.rating} count={product.reviewsCount} />
        <CompatibilityBadge compatible={compatible} />

        <div className="mt-auto pt-2">
          {product.oldPrice && (
            <span className="block text-xs text-muted-foreground line-through">
              {brl(product.oldPrice)}
            </span>
          )}
          <span className="block text-lg font-bold text-brand">{brl(product.price)}</span>
          <span className="block text-xs text-muted-foreground">
            {product.installments}x de {brl(product.price / product.installments)} sem juros
          </span>
          <Button
            size="sm"
            className="mt-3 w-full bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={() => {
              addToCart(product.id);
              toast.success("Adicionado ao carrinho", { description: product.name });
            }}
          >
            <ShoppingCart className="size-4" /> Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}
