import { createFileRoute } from "@tanstack/react-router";
import { Car, Star, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { VehicleSelector } from "@/components/VehicleSelector";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useStore";
import { vehicleLabel } from "@/mocks/vehicles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/conta/veiculos")({
  component: VehiclesPage,
});

function VehiclesPage() {
  const { vehicles, vehicle, setVehicle, removeVehicle, makePrimary } = useStore();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Meus veículos</h1>
          <VehicleSelector />
        </div>

        {vehicles.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <Car className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhum veículo cadastrado ainda.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-4",
                  vehicle?.id === v.id ? "border-brand" : "border-border",
                )}
              >
                <Car className="size-5 shrink-0 text-brand" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{vehicleLabel(v)}</p>
                  {v.primary && <p className="text-xs text-brand">Veículo principal</p>}
                </div>
                {!v.primary && (
                  <Button variant="outline" size="sm" onClick={() => makePrimary(v.id)}>
                    <Star className="size-4" /> Tornar principal
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Remover veículo"
                  onClick={() => removeVehicle(v.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {vehicle && vehicles.every((v) => v.id !== vehicle.id) && (
          <p className="mt-4 text-xs text-muted-foreground">
            Veículo ativo no momento: {vehicleLabel(vehicle)}.{" "}
            <button className="text-brand underline" onClick={() => setVehicle(null)}>
              Limpar
            </button>
          </p>
        )}
      </div>
    </SiteLayout>
  );
}
