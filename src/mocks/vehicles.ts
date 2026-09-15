import type { Vehicle } from "@/types";

export function vehicleLabel(v: Vehicle) {
  return `${v.brand} ${v.model} ${v.engine} ${v.year}`;
}
