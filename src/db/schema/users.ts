import { boolean, index, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./_helpers";

export const users = pgTable("users", {
  id: id(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 30 }),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const addresses = pgTable(
  "addresses",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    zipCode: varchar("zip_code", { length: 9 }).notNull(),
    street: varchar("street", { length: 200 }).notNull(),
    number: varchar("number", { length: 20 }).notNull(),
    complement: varchar("complement", { length: 120 }),
    neighborhood: varchar("neighborhood", { length: 120 }).notNull(),
    city: varchar("city", { length: 120 }).notNull(),
    state: varchar("state", { length: 2 }).notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("addresses_user_id_idx").on(table.userId)],
);
