import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brl } from "@/lib/format";
import { useStore } from "@/hooks/useStore";
import { track } from "@/services/tracking";

export const Route = createFileRoute("/carrinho")({
  component: CartPage,
});

function CartPage() {
  const {
    cartProducts,
    subtotal,
    shipping,
    discount,
    total,
    coupon,
    setQuantity,
    removeFromCart,
    applyCoupon,
    clearCart,
  } = useStore();
  const [couponInput, setCouponInput] = useState("");
  const navigate = useNavigate();

  function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    toast[ok ? "success" : "error"](ok ? "Cupom aplicado: 10% de desconto" : "Cupom inválido");
  }

  function handleCheckout() {
    track("checkout_started", { itemCount: cartProducts.length, total });
    track("purchase_completed", { total });
    clearCart();
    toast.success("Pedido realizado com sucesso!");
    navigate({ to: "/conta/pedidos" });
  }

  if (cartProducts.length === 0) {
    return (
      <SiteLayout>
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-20 text-center">
          <ShoppingCart className="size-10 text-muted-foreground" />
          <h1 className="text-xl font-bold">Seu carrinho está vazio</h1>
          <p className="text-sm text-muted-foreground">Que tal dar uma olhada nas nossas peças?</p>
          <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Link to="/produtos">Ver peças</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-xl font-bold">Meu carrinho</h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cartProducts.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 rounded-lg border border-border p-3">
                <Link
                  to="/produto/$id"
                  params={{ id: product.id }}
                  className="size-20 shrink-0 overflow-hidden rounded-md bg-secondary"
                >
                  <img src={product.image} alt={product.name} className="size-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <Link
                    to="/produto/$id"
                    params={{ id: product.id }}
                    className="text-sm font-semibold hover:text-brand"
                  >
                    {product.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">{product.brand}</span>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        onClick={() => setQuantity(product.id, quantity - 1)}
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        onClick={() => setQuantity(product.id, quantity + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                    <span className="font-bold text-brand">{brl(product.price * quantity)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Remover"
                  onClick={() => removeFromCart(product.id)}
                  className="self-start rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-lg border border-border p-4">
            <h2 className="text-sm font-bold uppercase tracking-wide">Resumo</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{brl(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span>{shipping === 0 ? "Grátis" : brl(shipping)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Desconto ({coupon})</span>
                  <span>-{brl(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                <span>Total</span>
                <span className="text-brand">{brl(total)}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Cupom de desconto"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <Button variant="outline" onClick={handleApplyCoupon}>
                Aplicar
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Experimente o cupom AUTO10</p>

            <Button
              className="mt-4 w-full bg-brand text-brand-foreground hover:bg-brand/90"
              onClick={handleCheckout}
            >
              Finalizar compra
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
