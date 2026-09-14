import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  check,
  index,
  integer,
  pgTable,
  smallint,
  text,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createdAt, id, money, updatedAt } from "./_helpers";
import { vehicleVariants } from "./vehicles";

export const brands = pgTable("brands", {
  id: id(),
  name: varchar("name", { length: 80 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: createdAt(),
});

export const categories = pgTable(
  "categories",
  {
    id: id(),
    parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, {
      onDelete: "restrict",
    }),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("categories_parent_id_idx").on(table.parentId)],
);

export const products = pgTable(
  "products",
  {
    id: id(),
    sku: varchar("sku", { length: 60 }).notNull().unique(),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "restrict" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull().unique(),
    description: text("description").notNull().default(""),
    partNumber: varchar("part_number", { length: 80 }).notNull(),
    price: money("price").notNull(),
    promotionalPrice: money("promotional_price"),
    warrantyMonths: integer("warranty_months").notNull().default(0),
    active: boolean("active").notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("products_brand_id_idx").on(table.brandId),
    index("products_category_id_idx").on(table.categoryId),
    index("products_part_number_idx").on(table.partNumber),
    check(
      "products_promotional_price_lower_check",
      sql`${table.promotionalPrice} is null or ${table.promotionalPrice} < ${table.price}`,
    ),
    check("products_price_positive_check", sql`${table.price} >= 0`),
    check("products_warranty_months_check", sql`${table.warrantyMonths} >= 0`),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: id(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    position: smallint("position").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: createdAt(),
  },
  (table) => [index("product_images_product_id_idx").on(table.productId)],
);

/**
 * N:N compatibility between a catalog product and a specific vehicle
 * variant (year range + engine). This is the table both the storefront and
 * the AI assistant query to answer "does this part fit this car?".
 */
export const productVehicleApplications = pgTable(
  "product_vehicle_applications",
  {
    id: id(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    vehicleVariantId: uuid("vehicle_variant_id")
      .notNull()
      .references(() => vehicleVariants.id, { onDelete: "restrict" }),
    notes: text("notes"),
    createdAt: createdAt(),
  },
  (table) => [
    unique("product_vehicle_applications_unique").on(table.productId, table.vehicleVariantId),
    index("product_vehicle_applications_product_id_idx").on(table.productId),
    index("product_vehicle_applications_vehicle_variant_id_idx").on(table.vehicleVariantId),
  ],
);
