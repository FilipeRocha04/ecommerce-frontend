/**
 * Exercises the critical constraints described in the schema design against
 * a real Postgres instance (DATABASE_URL). Every test runs inside a
 * transaction that is always rolled back, so nothing here touches the
 * seeded/dev data permanently.
 *
 * Requires the dev database to be up: `docker compose up -d` + migrated.
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "../client";
import * as schema from "../schema";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

class RollbackSignal extends Error {}

function pgMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.cause instanceof Error ? error.cause.message : error.message;
  }
  return String(error);
}

/** Asserts `promise` rejects with a Postgres error whose message matches `pattern`. */
async function expectPgError(promise: Promise<unknown>, pattern: RegExp) {
  let caught: unknown;
  try {
    await promise;
  } catch (error) {
    caught = error;
  }
  expect(caught, "expected promise to reject").toBeDefined();
  expect(pgMessage(caught)).toMatch(pattern);
}

function shortId() {
  return crypto.randomUUID().slice(0, 8);
}

/** Runs `fn` inside a transaction that is unconditionally rolled back. */
async function withRollback(fn: (tx: Tx) => Promise<void>) {
  try {
    await db.transaction(async (tx) => {
      await fn(tx);
      throw new RollbackSignal();
    });
  } catch (error) {
    if (!(error instanceof RollbackSignal)) throw error;
  }
}

let brandId: string;
let categoryId: string;
let variantId: string;

beforeAll(async () => {
  const [make] = await db
    .insert(schema.vehicleMakes)
    .values({ name: `TestMake-${crypto.randomUUID()}` })
    .returning();
  const [model] = await db
    .insert(schema.vehicleModels)
    .values({ makeId: make!.id, name: "TestModel" })
    .returning();
  const [variant] = await db
    .insert(schema.vehicleVariants)
    .values({ modelId: model!.id, yearStart: 2020, yearEnd: 2022, engine: "1.0", fuel: "flex" })
    .returning();
  const [brand] = await db
    .insert(schema.brands)
    .values({ name: `TestBrand-${crypto.randomUUID()}`, slug: `test-brand-${crypto.randomUUID()}` })
    .returning();
  const [category] = await db
    .insert(schema.categories)
    .values({
      name: `TestCategory-${crypto.randomUUID()}`,
      slug: `test-category-${crypto.randomUUID()}`,
    })
    .returning();

  brandId = brand!.id;
  categoryId = category!.id;
  variantId = variant!.id;
});

afterAll(async () => {
  // Fixtures created in beforeAll are outside any test transaction, so clean
  // them up explicitly. Cascades take care of the rest (variant -> model -> make).
  await db.delete(schema.categories).where(eq(schema.categories.id, categoryId));
  await db.delete(schema.brands).where(eq(schema.brands.id, brandId));
});

async function makeProduct(tx: Tx, overrides: Partial<typeof schema.products.$inferInsert> = {}) {
  const suffix = crypto.randomUUID();
  const [product] = await tx
    .insert(schema.products)
    .values({
      sku: `SKU-${suffix}`,
      brandId,
      categoryId,
      name: "Test product",
      slug: `test-product-${suffix}`,
      partNumber: "PN-1",
      price: "100.00",
      ...overrides,
    })
    .returning();
  if (!product) throw new Error("failed to insert test product");
  return product;
}

async function makeUser(tx: Tx) {
  const [user] = await tx
    .insert(schema.users)
    .values({ name: "A", email: `a-${crypto.randomUUID()}@example.com`, passwordHash: "x" })
    .returning();
  if (!user) throw new Error("failed to insert test user");
  return user;
}

function orderFixture(userId: string, overrides: Partial<typeof schema.orders.$inferInsert> = {}) {
  return {
    orderNumber: `ORD-${shortId()}`,
    userId,
    subtotal: "10.00",
    total: "10.00",
    channel: "web" as const,
    shippingName: "A",
    shippingZipCode: "00000-000",
    shippingStreet: "Street",
    shippingNumber: "1",
    shippingNeighborhood: "N",
    shippingCity: "C",
    shippingState: "SP",
    ...overrides,
  };
}

describe("users", () => {
  it("rejects a duplicate email", async () => {
    await withRollback(async (tx) => {
      const email = `dup-${crypto.randomUUID()}@example.com`;
      await tx.insert(schema.users).values({ name: "A", email, passwordHash: "x" });
      await expectPgError(
        tx.insert(schema.users).values({ name: "B", email, passwordHash: "x" }),
        /unique/i,
      );
    });
  });
});

describe("products", () => {
  it("rejects a duplicate sku", async () => {
    await withRollback(async (tx) => {
      const sku = `DUP-${crypto.randomUUID()}`;
      await makeProduct(tx, { sku, slug: `a-${crypto.randomUUID()}` });
      await expectPgError(makeProduct(tx, { sku, slug: `b-${crypto.randomUUID()}` }), /unique/i);
    });
  });

  it("rejects a promotional price that is not lower than price", async () => {
    await withRollback(async (tx) => {
      await expectPgError(
        makeProduct(tx, { price: "100.00", promotionalPrice: "150.00" }),
        /check/i,
      );
    });
  });
});

describe("inventory", () => {
  it("rejects reserved_quantity greater than quantity", async () => {
    await withRollback(async (tx) => {
      const product = await makeProduct(tx);
      await expectPgError(
        tx
          .insert(schema.inventory)
          .values({ productId: product.id, quantity: 5, reservedQuantity: 6 }),
        /check/i,
      );
    });
  });

  it("rejects a negative quantity", async () => {
    await withRollback(async (tx) => {
      const product = await makeProduct(tx);
      await expectPgError(
        tx.insert(schema.inventory).values({ productId: product.id, quantity: -1 }),
        /check/i,
      );
    });
  });

  it("accepts reserved_quantity equal to quantity", async () => {
    await withRollback(async (tx) => {
      const product = await makeProduct(tx);
      await expect(
        tx
          .insert(schema.inventory)
          .values({ productId: product.id, quantity: 3, reservedQuantity: 3 }),
      ).resolves.not.toThrow();
    });
  });
});

describe("product_vehicle_applications", () => {
  it("rejects a duplicate product+vehicle_variant combination", async () => {
    await withRollback(async (tx) => {
      const product = await makeProduct(tx);
      await tx
        .insert(schema.productVehicleApplications)
        .values({ productId: product.id, vehicleVariantId: variantId });
      await expectPgError(
        tx
          .insert(schema.productVehicleApplications)
          .values({ productId: product.id, vehicleVariantId: variantId }),
        /unique/i,
      );
    });
  });
});

describe("cart_items", () => {
  it("rejects the same product twice in the same cart", async () => {
    await withRollback(async (tx) => {
      const product = await makeProduct(tx);
      const [cart] = await tx
        .insert(schema.carts)
        .values({ sessionId: crypto.randomUUID() })
        .returning();
      await tx
        .insert(schema.cartItems)
        .values({ cartId: cart!.id, productId: product.id, unitPrice: "10.00" });
      await expectPgError(
        tx
          .insert(schema.cartItems)
          .values({ cartId: cart!.id, productId: product.id, unitPrice: "10.00" }),
        /unique/i,
      );
    });
  });

  it("rejects a non-positive quantity", async () => {
    await withRollback(async (tx) => {
      const product = await makeProduct(tx);
      const [cart] = await tx
        .insert(schema.carts)
        .values({ sessionId: crypto.randomUUID() })
        .returning();
      await expectPgError(
        tx.insert(schema.cartItems).values({
          cartId: cart!.id,
          productId: product.id,
          quantity: 0,
          unitPrice: "10.00",
        }),
        /check/i,
      );
    });
  });
});

describe("carts", () => {
  it("requires either a user or a session to own the cart", async () => {
    await withRollback(async (tx) => {
      await expectPgError(tx.insert(schema.carts).values({}), /check/i);
    });
  });

  it("rejects an invalid status", async () => {
    await withRollback(async (tx) => {
      await expectPgError(
        tx.insert(schema.carts).values({ sessionId: crypto.randomUUID(), status: "bogus" }),
        /check/i,
      );
    });
  });
});

describe("orders", () => {
  it("rejects an invalid status", async () => {
    await withRollback(async (tx) => {
      const user = await makeUser(tx);
      await expectPgError(
        tx.insert(schema.orders).values(orderFixture(user.id, { status: "bogus" })),
        /check/i,
      );
    });
  });

  it("rejects an invalid channel", async () => {
    await withRollback(async (tx) => {
      const user = await makeUser(tx);
      await expectPgError(
        tx.insert(schema.orders).values(orderFixture(user.id, { channel: "carrier-pigeon" })),
        /check/i,
      );
    });
  });

  it("rejects a duplicate order_number", async () => {
    await withRollback(async (tx) => {
      const user = await makeUser(tx);
      const fixture = orderFixture(user.id);
      await tx.insert(schema.orders).values(fixture);
      await expectPgError(tx.insert(schema.orders).values(fixture), /unique/i);
    });
  });
});

describe("order_items snapshot", () => {
  it("keeps its own product_name/sku/unit_price independent of the live product row", async () => {
    await withRollback(async (tx) => {
      const product = await makeProduct(tx, { name: "Original name", price: "100.00" });
      const user = await makeUser(tx);
      const [order] = await tx
        .insert(schema.orders)
        .values(orderFixture(user.id, { subtotal: "100.00", total: "100.00" }))
        .returning();
      await tx.insert(schema.orderItems).values({
        orderId: order!.id,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity: 1,
        unitPrice: "100.00",
        totalPrice: "100.00",
      });

      await tx
        .update(schema.products)
        .set({ name: "Changed name", price: "999.00" })
        .where(eq(schema.products.id, product.id));

      const [item] = await tx
        .select()
        .from(schema.orderItems)
        .where(eq(schema.orderItems.orderId, order!.id));
      expect(item?.productName).toBe("Original name");
      expect(item?.unitPrice).toBe("100.00");
    });
  });

  it("survives the referenced product being deleted (product_id set null)", async () => {
    await withRollback(async (tx) => {
      const product = await makeProduct(tx, { name: "Deletable", price: "50.00" });
      const user = await makeUser(tx);
      const [order] = await tx
        .insert(schema.orders)
        .values(orderFixture(user.id, { subtotal: "50.00", total: "50.00" }))
        .returning();
      const [item] = await tx
        .insert(schema.orderItems)
        .values({
          orderId: order!.id,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity: 1,
          unitPrice: "50.00",
          totalPrice: "50.00",
        })
        .returning();

      await tx.delete(schema.products).where(eq(schema.products.id, product.id));

      const [reloaded] = await tx
        .select()
        .from(schema.orderItems)
        .where(eq(schema.orderItems.id, item!.id));
      expect(reloaded?.productId).toBeNull();
      expect(reloaded?.productName).toBe("Deletable");
    });
  });
});

describe("payments", () => {
  it("rejects an invalid method", async () => {
    await withRollback(async (tx) => {
      const user = await makeUser(tx);
      const [order] = await tx.insert(schema.orders).values(orderFixture(user.id)).returning();
      await expectPgError(
        tx.insert(schema.payments).values({ orderId: order!.id, method: "cash", amount: "10.00" }),
        /check/i,
      );
    });
  });
});

describe("vehicle_variants", () => {
  it("rejects year_end earlier than year_start", async () => {
    await withRollback(async (tx) => {
      const [make] = await tx
        .insert(schema.vehicleMakes)
        .values({ name: `M-${crypto.randomUUID()}` })
        .returning();
      const [model] = await tx
        .insert(schema.vehicleModels)
        .values({ makeId: make!.id, name: "Model" })
        .returning();
      await expectPgError(
        tx.insert(schema.vehicleVariants).values({
          modelId: model!.id,
          yearStart: 2022,
          yearEnd: 2020,
          engine: "1.0",
          fuel: "flex",
        }),
        /check/i,
      );
    });
  });
});
