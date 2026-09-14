import { Link } from "@tanstack/react-router";
import { CreditCard, Truck, ShieldCheck } from "lucide-react";
import { CATEGORIES } from "@/mocks/products";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-xl font-extrabold tracking-tight">
            AUTO<span className="text-brand">PARTS</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">
            Peças automotivas com compatibilidade verificada e ajuda de um assistente de compras.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Categorias</h3>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/produtos"
                  search={{ categoria: c.slug }}
                  className="hover:text-primary-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Ajuda</h3>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
            <li>
              <Link to="/assistente" className="hover:text-primary-foreground">
                Falar com o assistente
              </Link>
            </li>
            <li>
              <Link to="/conta/pedidos" className="hover:text-primary-foreground">
                Meus pedidos
              </Link>
            </li>
            <li>
              <Link to="/conta/veiculos" className="hover:text-primary-foreground">
                Meus veículos
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3 text-sm text-primary-foreground/70">
          <p className="flex items-center gap-2">
            <Truck className="size-4 text-brand" /> Frete grátis acima de R$ 299
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand" /> Garantia em todas as peças
          </p>
          <p className="flex items-center gap-2">
            <CreditCard className="size-4 text-brand" /> Pix, boleto e cartão em até 6x
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 px-4 py-5 text-center text-xs text-primary-foreground/50">
        © 2026 AutoParts. Loja demonstrativa com dados fictícios.
      </div>
    </footer>
  );
}
