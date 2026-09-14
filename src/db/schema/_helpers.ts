import { sql } from "drizzle-orm";
import { numeric, timestamp, uuid } from "drizzle-orm/pg-core";

export function id() {
  return uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`);
}

export function createdAt() {
  return timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
}

export function updatedAt() {
  return timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();
}

/** Monetary value stored as fixed-point decimal — never a float. */
export function money(name: string) {
  return numeric(name, { precision: 10, scale: 2 });
}
