import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquareText } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { VehicleSelector } from "@/components/VehicleSelector";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/hooks/useCatalog";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { categories, products } = useCatalog();
  const featured = products.slice(0, 8);

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-lg">
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              A peça certa para o seu carro, sem chute.
            </h1>
            <p className="mt-3 text-sm text-primary-foreground/80 sm:text-base">
              Informe seu veículo e mostramos só peças compatíveis. Precisa de ajuda? Fale com nosso
              assistente de compras.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <VehicleSelector
                variant="block"
                className="border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10"
              />
              <Link
                to="/assistente"
                className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
              >
                <MessageSquareText className="size-4" /> Falar com assistente
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-lg font-bold">Categorias</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/produtos"
              search={{ categoria: c.slug }}
              className="group flex flex-col items-center gap-2 rounded-lg border border-border p-3 text-center transition-colors hover:border-brand/50 hover:bg-accent"
            >
              <img
                src={c.image}
                alt={c.name}
                className="size-14 rounded-md object-cover transition-transform group-hover:scale-105"
              />
              <span className="text-xs font-semibold">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Mais procurados</h2>
          <Link to="/produtos" className="text-sm font-semibold text-brand hover:underline">
            Ver todas as peças
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
