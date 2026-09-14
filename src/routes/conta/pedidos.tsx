import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { brl } from "@/lib/format";
import { ORDERS, ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from "@/mocks/orders";
import { getProduct } from "@/mocks/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/conta/pedidos")({
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-xl font-bold">Meus pedidos</h1>

        {ORDERS.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <Package className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Você ainda não fez nenhum pedido.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {ORDERS.map((order) => {
              const stepIndex = ORDER_STATUS_FLOW.indexOf(order.status);
              return (
                <div key={order.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-bold">{order.number}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{order.date}</span>
                    </div>
                    <span className="font-bold text-brand">{brl(order.total)}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-1">
                    {ORDER_STATUS_FLOW.map((status, i) => (
                      <div key={status} className="flex flex-1 items-center gap-1">
                        <div
                          className={cn(
                            "size-2.5 shrink-0 rounded-full",
                            i <= stepIndex ? "bg-brand" : "bg-muted",
                          )}
                        />
                        {i < ORDER_STATUS_FLOW.length - 1 && (
                          <div
                            className={cn("h-0.5 flex-1", i < stepIndex ? "bg-brand" : "bg-muted")}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs font-semibold text-brand">
                    {ORDER_STATUS_LABEL[order.status]}
                    {order.status !== "entregue" ? ` · previsão ${order.eta}` : ""}
                  </p>

                  <div className="mt-3 space-y-1 border-t border-border pt-3">
                    {order.items.map((item) => {
                      const product = getProduct(item.productId);
                      if (!product) return null;
                      return (
                        <Link
                          key={item.productId}
                          to="/produto/$id"
                          params={{ id: item.productId }}
                          className="flex items-center gap-2 text-sm hover:text-brand"
                        >
                          <img src={product.image} alt="" className="size-8 rounded object-cover" />
                          <span className="flex-1">{product.name}</span>
                          <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {order.payment} · Entrega em {order.address}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
