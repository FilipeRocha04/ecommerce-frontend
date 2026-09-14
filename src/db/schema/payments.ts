import { sql } from "drizzle-orm";
import { check, index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, money, updatedAt } from "./_helpers";
import { orders } from "./orders";

export const PAYMENT_METHODS = ["pix", "credit_card", "boleto"] as const;
export const PAYMENT_STATUSES = ["pending", "approved", "failed", "refunded", "cancelled"] as const;

export const payments = pgTable(
  "payments",
  {
    id: id(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    method: varchar("method", { length: 20 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    amount: money("amount").notNull(),
    provider: varchar("provider", { length: 60 }),
    providerTransactionId: varchar("provider_transaction_id", { length: 120 }),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("payments_order_id_idx").on(table.orderId),
    check("payments_method_check", sql`${table.method} in ('pix', 'credit_card', 'boleto')`),
    check(
      "payments_status_check",
      sql`${table.status} in ('pending', 'approved', 'failed', 'refunded', 'cancelled')`,
    ),
    check("payments_amount_non_negative_check", sql`${table.amount} >= 0`),
  ],
);
