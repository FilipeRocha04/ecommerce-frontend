import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Package, Car, User } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useStore } from "@/hooks/useStore";

export const Route = createFileRoute("/conta/")({
  component: AccountPage,
});

function AccountPage() {
  const { favorites, vehicles } = useStore();

  const links = [
    {
      to: "/conta/pedidos" as const,
      icon: Package,
      label: "Meus pedidos",
      hint: "Acompanhe suas entregas",
    },
    {
      to: "/conta/favoritos" as const,
      icon: Heart,
      label: "Favoritos",
      hint: `${favorites.length} peças salvas`,
    },
    {
      to: "/conta/veiculos" as const,
      icon: Car,
      label: "Meus veículos",
      hint: `${vehicles.length} veículos cadastrados`,
    },
  ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
            <User className="size-6 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Minha conta</h1>
            <p className="text-sm text-muted-foreground">Cliente AutoParts</p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-border rounded-lg border border-border">
          {links.map(({ to, icon: Icon, label, hint }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 p-4 transition-colors hover:bg-accent"
            >
              <Icon className="size-5 text-brand" />
              <span className="flex-1">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-xs text-muted-foreground">{hint}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
