import { Link } from "@tanstack/react-router";
import { Heart, MessageSquareText, ShoppingCart, User } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { VehicleSelector } from "@/components/VehicleSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useStore } from "@/hooks/useStore";
import { CATEGORIES } from "@/mocks/products";

export function Header() {
  const { cartCount } = useStore();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="font-display text-xl font-extrabold tracking-tight">
          AUTO<span className="text-brand">PARTS</span>
        </Link>

        <SearchBar className="hidden flex-1 md:block" />

        <VehicleSelector className="hidden max-w-[240px] flex-1 lg:flex" />

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle className="rounded-md p-2 hover:bg-accent" />
          <Link
            to="/assistente"
            className="hidden items-center gap-2 rounded-md bg-brand px-3 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 sm:flex"
          >
            <MessageSquareText className="size-4" /> Assistente
          </Link>
          <Link
            to="/conta/favoritos"
            aria-label="Favoritos"
            className="hidden rounded-md p-2 hover:bg-accent md:block"
          >
            <Heart className="size-5" />
          </Link>
          <Link
            to="/conta"
            aria-label="Minha conta"
            className="hidden rounded-md p-2 hover:bg-accent md:block"
          >
            <User className="size-5" />
          </Link>
          <Link
            to="/carrinho"
            aria-label="Carrinho"
            className="relative rounded-md p-2 hover:bg-accent"
          >
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 rounded-full bg-brand px-1.5 text-[10px] font-bold text-brand-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="border-t border-border px-4 py-2 md:hidden">
        <SearchBar />
      </div>

      <nav className="hidden border-t border-border md:block">
        <ul className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-4 py-2 text-sm">
          <li>
            <Link
              to="/produtos"
              className="whitespace-nowrap font-semibold text-muted-foreground hover:text-brand"
            >
              Todas as peças
            </Link>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                to="/produtos"
                search={{ categoria: c.slug }}
                className="whitespace-nowrap text-muted-foreground hover:text-brand"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
