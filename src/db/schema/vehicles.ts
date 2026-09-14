import { check, index, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createdAt, id, updatedAt } from "./_helpers";

export const vehicleMakes = pgTable("vehicle_makes", {
  id: id(),
  name: varchar("name", { length: 80 }).notNull().unique(),
  createdAt: createdAt(),
});

export const vehicleModels = pgTable(
  "vehicle_models",
  {
    id: id(),
    makeId: uuid("make_id")
      .notNull()
      .references(() => vehicleMakes.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 80 }).notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    index("vehicle_models_make_id_idx").on(table.makeId),
    // Same model name may repeat across makes (e.g. no clash expected, but not
    // across the same make).
    index("vehicle_models_make_id_name_idx").on(table.makeId, table.name),
  ],
);

/**
 * A specific buildable configuration of a model — this is the level product
 * compatibility is declared against (year range + engine + version + fuel).
 */
export const vehicleVariants = pgTable(
  "vehicle_variants",
  {
    id: id(),
    modelId: uuid("model_id")
      .notNull()
      .references(() => vehicleModels.id, { onDelete: "restrict" }),
    yearStart: integer("year_start").notNull(),
    yearEnd: integer("year_end").notNull(),
    engine: varchar("engine", { length: 80 }).notNull(),
    version: varchar("version", { length: 80 }),
    fuel: varchar("fuel", { length: 30 }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("vehicle_variants_model_id_idx").on(table.modelId),
    check("vehicle_variants_year_range_check", sql`${table.yearEnd} >= ${table.yearStart}`),
    check(
      "vehicle_variants_fuel_check",
      sql`${table.fuel} in ('flex', 'gasolina', 'etanol', 'diesel', 'hibrido', 'eletrico', 'gnv')`,
    ),
  ],
);
