import { useState } from "react";
import { Car, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VEHICLE_BRANDS, getModelInfo, getModels, vehicleLabel } from "@/mocks/vehicles";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";

export function VehicleSelector({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "block";
}) {
  const { vehicle, setVehicle, addVehicle, vehicles } = useStore();
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");

  const models = brand ? Object.keys(getModels(brand)) : [];
  const info = brand && model ? getModelInfo(brand, model) : null;
  const complete = Boolean(brand && model && year && engine);

  function confirm() {
    if (!complete) return;
    addVehicle({
      id: `${brand}-${model}-${year}-${engine}`,
      brand,
      model,
      year: Number(year),
      engine,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:border-brand/50 hover:bg-accent",
            variant === "block" && "w-full",
            className,
          )}
        >
          <Car className="size-4 shrink-0 text-brand" />
          <span className="min-w-0 flex-1 truncate">
            {vehicle ? (
              <>
                <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                  Seu veículo
                </span>
                <span className="block truncate font-semibold">{vehicleLabel(vehicle)}</span>
              </>
            ) : (
              <span className="font-semibold">Escolher meu veículo</span>
            )}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Qual é o seu carro?</DialogTitle>
          <DialogDescription>
            Assim mostramos só as peças que servem no seu veículo.
          </DialogDescription>
        </DialogHeader>

        {vehicles.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Veículos salvos
            </p>
            <div className="flex flex-wrap gap-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setVehicle(v);
                    setOpen(false);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent",
                    vehicle?.id === v.id ? "border-brand text-brand" : "border-border",
                  )}
                >
                  {vehicleLabel(v)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            value={brand}
            onValueChange={(v) => {
              setBrand(v);
              setModel("");
              setYear("");
              setEngine("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_BRANDS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={model}
            onValueChange={(v) => {
              setModel(v);
              setYear("");
              setEngine("");
            }}
            disabled={!brand}
          >
            <SelectTrigger>
              <SelectValue placeholder="Modelo" />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear} disabled={!info}>
            <SelectTrigger>
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {info?.years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={engine} onValueChange={setEngine} disabled={!info}>
            <SelectTrigger>
              <SelectValue placeholder="Motor" />
            </SelectTrigger>
            <SelectContent>
              {info?.engines.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-brand text-brand-foreground hover:bg-brand/90"
            disabled={!complete}
            onClick={confirm}
          >
            Confirmar veículo
          </Button>
          {vehicle && (
            <Button
              variant="outline"
              onClick={() => {
                setVehicle(null);
                setOpen(false);
              }}
            >
              Limpar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
