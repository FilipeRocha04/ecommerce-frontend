import type { Vehicle } from "@/types";

export const VEHICLE_DB: Record<string, Record<string, { years: number[]; engines: string[] }>> = {
  Volkswagen: {
    Gol: { years: [2016, 2017, 2018, 2019, 2020, 2021, 2022], engines: ["1.0 MPI", "1.6 MSI"] },
    Polo: { years: [2018, 2019, 2020, 2021, 2022, 2023], engines: ["1.0 TSI", "1.6 MSI"] },
  },
  Chevrolet: {
    Onix: { years: [2016, 2017, 2018, 2019, 2020, 2021, 2022], engines: ["1.0 Turbo", "1.4 SPE"] },
    Corsa: {
      years: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012],
      engines: ["1.0", "1.4", "1.8"],
    },
  },
  Fiat: {
    Uno: { years: [2012, 2014, 2016, 2018, 2020, 2021], engines: ["1.0 Fire", "1.3 Firefly"] },
    Argo: { years: [2018, 2019, 2020, 2021, 2022, 2023], engines: ["1.0 Firefly", "1.3 Firefly"] },
    Palio: { years: [2008, 2010, 2012, 2014, 2016, 2017], engines: ["1.0", "1.4", "1.6"] },
  },
  Honda: {
    Civic: {
      years: [2014, 2016, 2017, 2018, 2019, 2020, 2021],
      engines: ["1.5 Turbo", "2.0 i-VTEC"],
    },
  },
  Toyota: {
    Corolla: {
      years: [2015, 2016, 2018, 2019, 2020, 2021, 2022],
      engines: ["1.8 VVT-i", "2.0 Dynamic Force"],
    },
  },
  Hyundai: {
    HB20: { years: [2015, 2017, 2019, 2020, 2021, 2022], engines: ["1.0 Turbo", "1.6 Flex"] },
  },
};

export const VEHICLE_BRANDS = Object.keys(VEHICLE_DB);

export function getModels(brand: string): Record<string, { years: number[]; engines: string[] }> {
  return VEHICLE_DB[brand] ?? {};
}

export function getModelInfo(
  brand: string,
  model: string,
): { years: number[]; engines: string[] } | null {
  return VEHICLE_DB[brand]?.[model] ?? null;
}

export const MY_VEHICLES: Vehicle[] = [
  { id: "v1", brand: "Volkswagen", model: "Gol", year: 2020, engine: "1.6 MSI", primary: true },
  { id: "v2", brand: "Honda", model: "Civic", year: 2018, engine: "2.0 i-VTEC" },
];

export function vehicleLabel(v: Vehicle) {
  return `${v.brand} ${v.model} ${v.engine} ${v.year}`;
}

export function fitmentKey(v: Vehicle) {
  return `${v.brand} ${v.model}`.toLowerCase();
}
