import { sql } from "drizzle-orm";
import { check, index, integer, pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, money, updatedAt } from "./_helpers";
import { users } from "./users";
import { products } from "./catalog";

export const CART_STATUSES = ["active", "converted", "abandoned"] as const;

export const carts = pgTable(
  "carts",
  {
    id: id(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    sessionId: varchar("session_id", { length: 120 }),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("carts_user_id_idx").on(table.userId),
    index("carts_session_id_idx").on(table.sessionId),
    check("carts_status_check", sql`${table.status} in ('active', 'converted', 'abandoned')`),
    check(
      "carts_owner_present_check",
      sql`${table.userId} is not null or ${table.sessionId} is not null`,
    ),
  ],
);

export const cartItems = pgTable(
  "cart_items",
  {
    id: id(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: money("unit_price").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    unique("cart_items_cart_id_product_id_unique").on(table.cartId, table.productId),
    index("cart_items_cart_id_idx").on(table.cartId),
    check("cart_items_quantity_positive_check", sql`${table.quantity} > 0`),
  ],
);
