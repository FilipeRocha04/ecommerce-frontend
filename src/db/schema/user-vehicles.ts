import { boolean, index, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./_helpers";
import { users } from "./users";
import { vehicleVariants } from "./vehicles";

export const userVehicles = pgTable(
  "user_vehicles",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    vehicleVariantId: uuid("vehicle_variant_id")
      .notNull()
      .references(() => vehicleVariants.id, { onDelete: "restrict" }),
    year: integer("year").notNull(),
    nickname: varchar("nickname", { length: 80 }),
    licensePlate: varchar("license_plate", { length: 8 }),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("user_vehicles_user_id_idx").on(table.userId),
    index("user_vehicles_vehicle_variant_id_idx").on(table.vehicleVariantId),
  ],
);
