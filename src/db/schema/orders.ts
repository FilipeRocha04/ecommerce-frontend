import { sql } from "drizzle-orm";
import { check, index, integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, money, updatedAt } from "./_helpers";
import { users } from "./users";
import { products } from "./catalog";

export const ORDER_STATUSES = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export const ORDER_CHANNELS = ["web", "assistant"] as const;

export const orders = pgTable(
  "orders",
  {
    id: id(),
    orderNumber: varchar("order_number", { length: 30 }).notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    status: varchar("status", { length: 30 }).notNull().default("pending_payment"),

    subtotal: money("subtotal").notNull(),
    discount: money("discount").notNull().default("0"),
    shippingCost: money("shipping_cost").notNull().default("0"),
    total: money("total").notNull(),

    channel: varchar("channel", { length: 20 }).notNull(),

    shippingName: varchar("shipping_name", { length: 120 }).notNull(),
    shippingZipCode: varchar("shipping_zip_code", { length: 9 }).notNull(),
    shippingStreet: varchar("shipping_street", { length: 200 }).notNull(),
    shippingNumber: varchar("shipping_number", { length: 20 }).notNull(),
    shippingComplement: varchar("shipping_complement", { length: 120 }),
    shippingNeighborhood: varchar("shipping_neighborhood", { length: 120 }).notNull(),
    shippingCity: varchar("shipping_city", { length: 120 }).notNull(),
    shippingState: varchar("shipping_state", { length: 2 }).notNull(),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("orders_user_id_idx").on(table.userId),
    check(
      "orders_status_check",
      sql`${table.status} in ('pending_payment', 'paid', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')`,
    ),
    check("orders_channel_check", sql`${table.channel} in ('web', 'assistant')`),
    check("orders_subtotal_non_negative_check", sql`${table.subtotal} >= 0`),
    check("orders_discount_non_negative_check", sql`${table.discount} >= 0`),
    check("orders_shipping_cost_non_negative_check", sql`${table.shippingCost} >= 0`),
    check("orders_total_non_negative_check", sql`${table.total} >= 0`),
  ],
);

/**
 * Historical snapshot of what was actually purchased. Deliberately does NOT
 * rely on `products` for name/sku/price — those can change or the product
 * row can be removed, and the order must keep showing what the customer paid.
 */
export const orderItems = pgTable(
  "order_items",
  {
    id: id(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    productName: varchar("product_name", { length: 200 }).notNull(),
    sku: varchar("sku", { length: 60 }).notNull(),
    quantity: integer("quantity").notNull(),
    unitPrice: money("unit_price").notNull(),
    totalPrice: money("total_price").notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    check("order_items_quantity_positive_check", sql`${table.quantity} > 0`),
  ],
);
