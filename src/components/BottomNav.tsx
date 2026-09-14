import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, MessageSquareText, ShoppingCart, User } from "lucide-react";
import { useStore } from "@/hooks/useStore";

export function BottomNav() {
  const { cartCount } = useStore();
  const item = "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] text-muted-foreground";
  const active = { className: `${item} text-brand` };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background md:hidden">
      <Link to="/" className={item} activeOptions={{ exact: true }} activeProps={active}>
        <Home className="size-5" /> Início
      </Link>
      <Link to="/produtos" className={item} activeProps={active}>
        <LayoutGrid className="size-5" /> Peças
      </Link>
      <Link to="/assistente" className={item} activeProps={active}>
        <MessageSquareText className="size-5" /> Assistente
      </Link>
      <Link to="/carrinho" className={item} activeProps={active}>
        <span className="relative">
          <ShoppingCart className="size-5" />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-1 rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">
              {cartCount}
            </span>
          )}
        </span>
        Carrinho
      </Link>
      <Link to="/conta" className={item} activeProps={active}>
        <User className="size-5" /> Conta
      </Link>
    </nav>
  );
}
