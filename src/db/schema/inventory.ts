import { sql } from "drizzle-orm";
import { check, integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { updatedAt } from "./_helpers";
import { products } from "./catalog";

/** Single-warehouse MVP: one inventory row per product. */
export const inventory = pgTable(
  "inventory",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    productId: uuid("product_id")
      .notNull()
      .unique()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(0),
    reservedQuantity: integer("reserved_quantity").notNull().default(0),
    updatedAt: updatedAt(),
  },
  (table) => [
    check("inventory_quantity_non_negative_check", sql`${table.quantity} >= 0`),
    check("inventory_reserved_non_negative_check", sql`${table.reservedQuantity} >= 0`),
    check(
      "inventory_reserved_not_exceeding_quantity_check",
      sql`${table.reservedQuantity} <= ${table.quantity}`,
    ),
  ],
);
