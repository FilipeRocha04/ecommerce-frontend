/**
 * Development seed data.
 *
 * All prices, stock levels and vehicle/part compatibility here are mock data
 * for local development — they are NOT verified fitment information and must
 * never be treated as an authoritative parts catalog.
 *
 * Run with: npm run db:seed
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env["DATABASE_URL"];
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------------------------------------------------------------------
// Vehicle makes / models / variants
// ---------------------------------------------------------------------------

interface VariantSeed {
  engine: string;
  fuel: string;
  yearStart: number;
  yearEnd: number;
}

const MAKE_MODELS: Record<string, Record<string, VariantSeed[]>> = {
  Volkswagen: {
    Gol: [
      { engine: "1.0 MPI", fuel: "flex", yearStart: 2016, yearEnd: 2022 },
      { engine: "1.6 MSI", fuel: "flex", yearStart: 2016, yearEnd: 2022 },
    ],
    Polo: [
      { engine: "1.0 TSI", fuel: "flex", yearStart: 2018, yearEnd: 2023 },
      { engine: "1.6 MSI", fuel: "flex", yearStart: 2018, yearEnd: 2023 },
    ],
    "T-Cross": [{ engine: "1.4 TSI", fuel: "flex", yearStart: 2019, yearEnd: 2024 }],
  },
  Chevrolet: {
    Onix: [
      { engine: "1.0 Turbo", fuel: "flex", yearStart: 2016, yearEnd: 2022 },
      { engine: "1.4 SPE", fuel: "flex", yearStart: 2016, yearEnd: 2022 },
    ],
    Corsa: [
      { engine: "1.0", fuel: "flex", yearStart: 2005, yearEnd: 2012 },
      { engine: "1.4", fuel: "flex", yearStart: 2005, yearEnd: 2012 },
      { engine: "1.8", fuel: "flex", yearStart: 2005, yearEnd: 2012 },
    ],
  },
  Fiat: {
    Uno: [
      { engine: "1.0 Fire", fuel: "flex", yearStart: 2012, yearEnd: 2021 },
      { engine: "1.3 Firefly", fuel: "flex", yearStart: 2012, yearEnd: 2021 },
    ],
    Argo: [
      { engine: "1.0 Firefly", fuel: "flex", yearStart: 2018, yearEnd: 2023 },
      { engine: "1.3 Firefly", fuel: "flex", yearStart: 2018, yearEnd: 2023 },
    ],
    Palio: [
      { engine: "1.0", fuel: "flex", yearStart: 2008, yearEnd: 2017 },
      { engine: "1.4", fuel: "flex", yearStart: 2008, yearEnd: 2017 },
      { engine: "1.6", fuel: "flex", yearStart: 2008, yearEnd: 2017 },
    ],
  },
  Honda: {
    Civic: [
      { engine: "1.5 Turbo", fuel: "flex", yearStart: 2014, yearEnd: 2021 },
      { engine: "2.0 i-VTEC", fuel: "flex", yearStart: 2014, yearEnd: 2021 },
    ],
  },
  Toyota: {
    Corolla: [
      { engine: "1.8 VVT-i", fuel: "flex", yearStart: 2015, yearEnd: 2022 },
      { engine: "2.0 Dynamic Force", fuel: "flex", yearStart: 2015, yearEnd: 2022 },
    ],
  },
  Hyundai: {
    HB20: [
      { engine: "1.0 Turbo", fuel: "flex", yearStart: 2015, yearEnd: 2022 },
      { engine: "1.6 Flex", fuel: "flex", yearStart: 2015, yearEnd: 2022 },
    ],
  },
};

// ---------------------------------------------------------------------------
// Part brands / categories
// ---------------------------------------------------------------------------

const PART_BRANDS = [
  "Bosch",
  "TRW",
  "NGK",
  "Cofap",
  "Monroe",
  "Tecfil",
  "Mann Filter",
  "Mobil",
  "Shell",
  "Philips",
];

const CATEGORY_TREE: Record<string, string[]> = {
  Freios: ["Pastilhas", "Discos", "Fluidos"],
  Motor: ["Ignição", "Correias", "Arrefecimento"],
  Suspensão: [],
  Filtros: ["Óleo", "Ar", "Combustível"],
  Elétrica: [],
  "Óleos e Fluidos": [],
  Iluminação: [],
  Acessórios: [],
};

// ---------------------------------------------------------------------------
// Products — ported from src/mocks/products.ts so the storefront mock and the
// seeded database describe the same demo catalog.
// ---------------------------------------------------------------------------

interface ProductSeed {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  oldPrice?: number;
  stock: number;
  partCode: string;
  warrantyMonths: number;
  description: string;
  /** "brand model" lowercase keys, matched against every variant of that model */
  fitment: string[];
}

const PRODUCTS: ProductSeed[] = [
  {
    id: "pastilha-bosch-diant",
    name: "Pastilha de Freio Dianteira Bosch",
    brand: "Bosch",
    category: "Freios",
    subcategory: "Pastilhas",
    price: 189.9,
    oldPrice: 219.9,
    stock: 24,
    partCode: "BB-1234",
    warrantyMonths: 12,
    description:
      "Pastilha de freio dianteira com composto cerâmico de baixa emissão de pó, alto poder de frenagem e ruído reduzido.",
    fitment: ["volkswagen gol", "volkswagen polo", "fiat argo", "chevrolet onix"],
  },
  {
    id: "pastilha-trw-diant",
    name: "Pastilha de Freio Dianteira TRW",
    brand: "TRW",
    category: "Freios",
    subcategory: "Pastilhas",
    price: 169.9,
    stock: 18,
    partCode: "TRW-8891",
    warrantyMonths: 12,
    description: "Pastilha de freio dianteira TRW com excelente relação custo-benefício.",
    fitment: ["volkswagen gol", "chevrolet onix", "fiat palio", "hyundai hb20"],
  },
  {
    id: "pastilha-cobreq-tras",
    name: "Pastilha de Freio Traseira Cofap",
    brand: "Cofap",
    category: "Freios",
    subcategory: "Pastilhas",
    price: 139.9,
    stock: 9,
    partCode: "CB-3320",
    warrantyMonths: 6,
    description: "Pastilha traseira com composto orgânico, ideal para uso diário.",
    fitment: ["volkswagen gol", "fiat uno", "chevrolet corsa"],
  },
  {
    id: "disco-bosch-diant",
    name: "Disco de Freio Dianteiro Bosch",
    brand: "Bosch",
    category: "Freios",
    subcategory: "Discos",
    price: 259.9,
    stock: 12,
    partCode: "BR-5510",
    warrantyMonths: 12,
    description: "Par de discos de freio ventilados com tratamento anticorrosivo.",
    fitment: ["volkswagen gol", "volkswagen polo", "chevrolet onix", "toyota corolla"],
  },
  {
    id: "fluido-bosch-dot4",
    name: "Fluido de Freio DOT 4 Bosch 500ml",
    brand: "Bosch",
    category: "Freios",
    subcategory: "Fluidos",
    price: 34.9,
    stock: 60,
    partCode: "FL-DOT4",
    warrantyMonths: 6,
    description: "Fluido de freio sintético DOT 4 com alto ponto de ebulição.",
    fitment: [],
  },
  {
    id: "amortecedor-cofap-diant",
    name: "Amortecedor Dianteiro Cofap Turbogás",
    brand: "Cofap",
    category: "Suspensão",
    price: 329.9,
    oldPrice: 389.9,
    stock: 14,
    partCode: "CF-2201",
    warrantyMonths: 12,
    description: "Amortecedor pressurizado a gás, com maior estabilidade em curvas.",
    fitment: ["volkswagen gol", "fiat palio", "chevrolet corsa", "fiat uno"],
  },
  {
    id: "mola-monroe-diant",
    name: "Mola Helicoidal Dianteira Monroe",
    brand: "Monroe",
    category: "Suspensão",
    price: 219.9,
    stock: 7,
    partCode: "MN-7712",
    warrantyMonths: 12,
    description: "Mola helicoidal com aço temperado e pintura eletrostática antiferrugem.",
    fitment: ["volkswagen gol", "chevrolet onix", "hyundai hb20"],
  },
  {
    id: "vela-ngk-iridium",
    name: "Vela de Ignição NGK Iridium",
    brand: "NGK",
    category: "Motor",
    subcategory: "Ignição",
    price: 49.9,
    stock: 80,
    partCode: "NGK-IX22",
    warrantyMonths: 12,
    description:
      "Vela de ignição com eletrodo de irídio, partida mais rápida e economia de combustível.",
    fitment: [
      "volkswagen gol",
      "volkswagen polo",
      "chevrolet onix",
      "honda civic",
      "toyota corolla",
    ],
  },
  {
    id: "correia-dentada-bosch",
    name: "Kit Correia Dentada + Tensor Bosch",
    brand: "Bosch",
    category: "Motor",
    subcategory: "Correias",
    price: 389.9,
    oldPrice: 449.9,
    stock: 11,
    partCode: "BS-KIT77",
    warrantyMonths: 12,
    description: "Kit completo de correia dentada com tensor para revisão preventiva.",
    fitment: ["volkswagen gol", "fiat palio", "chevrolet corsa", "fiat uno"],
  },
  {
    id: "bomba-agua-bosch",
    name: "Bomba d'Água Motor Bosch",
    brand: "Bosch",
    category: "Motor",
    subcategory: "Arrefecimento",
    price: 229.9,
    stock: 8,
    partCode: "BS-BA10",
    warrantyMonths: 12,
    description: "Bomba d'água com rotor em alumínio e vedação reforçada.",
    fitment: ["volkswagen gol", "honda civic", "toyota corolla"],
  },
  {
    id: "filtro-oleo-mann",
    name: "Filtro de Óleo Mann Filter",
    brand: "Mann Filter",
    category: "Filtros",
    subcategory: "Óleo",
    price: 32.9,
    stock: 100,
    partCode: "MF-W610",
    warrantyMonths: 3,
    description: "Filtro de óleo com meio filtrante de alta retenção.",
    fitment: [
      "volkswagen gol",
      "volkswagen polo",
      "chevrolet onix",
      "honda civic",
      "toyota corolla",
      "hyundai hb20",
    ],
  },
  {
    id: "filtro-ar-tecfil",
    name: "Filtro de Ar Tecfil",
    brand: "Tecfil",
    category: "Filtros",
    subcategory: "Ar",
    price: 49.9,
    stock: 45,
    partCode: "TF-ARL99",
    warrantyMonths: 3,
    description: "Filtro de ar do motor com papel plissado.",
    fitment: [
      "volkswagen gol",
      "volkswagen polo",
      "chevrolet onix",
      "honda civic",
      "toyota corolla",
      "hyundai hb20",
    ],
  },
  {
    id: "filtro-cabine-tecfil",
    name: "Filtro de Ar-Condicionado Tecfil",
    brand: "Tecfil",
    category: "Filtros",
    subcategory: "Ar",
    price: 39.9,
    stock: 52,
    partCode: "TF-AKX45",
    warrantyMonths: 3,
    description: "Filtro de cabine com carvão ativado.",
    fitment: ["volkswagen gol", "volkswagen polo", "honda civic", "toyota corolla", "hyundai hb20"],
  },
  {
    id: "filtro-combustivel-mann",
    name: "Filtro de Combustível Mann Filter",
    brand: "Mann Filter",
    category: "Filtros",
    subcategory: "Combustível",
    price: 44.9,
    stock: 38,
    partCode: "MF-WK512",
    warrantyMonths: 3,
    description: "Filtro de combustível de alta eficiência.",
    fitment: ["volkswagen gol", "fiat uno", "chevrolet corsa", "fiat palio"],
  },
  {
    id: "bateria-bosch-60ah",
    name: "Bateria Automotiva 60Ah Bosch",
    brand: "Bosch",
    category: "Elétrica",
    price: 549.9,
    oldPrice: 629.9,
    stock: 6,
    partCode: "BS-60AH",
    warrantyMonths: 18,
    description: "Bateria selada livre de manutenção, alta corrente de partida.",
    fitment: [],
  },
  {
    id: "bobina-bosch",
    name: "Bobina de Ignição Bosch",
    brand: "Bosch",
    category: "Elétrica",
    price: 199.9,
    stock: 15,
    partCode: "BS-BI21",
    warrantyMonths: 12,
    description: "Bobina de ignição com isolamento térmico reforçado.",
    fitment: ["volkswagen gol", "chevrolet onix", "fiat argo", "hyundai hb20"],
  },
  {
    id: "oleo-mobil-5w30",
    name: "Óleo de Motor Mobil Super 5W-30 Sintético 1L",
    brand: "Mobil",
    category: "Óleos e Fluidos",
    price: 64.9,
    stock: 120,
    partCode: "MB-5W30",
    warrantyMonths: 0,
    description: "Óleo 100% sintético que protege o motor contra desgaste.",
    fitment: [],
  },
  {
    id: "oleo-shell-hx8",
    name: "Óleo de Motor Shell Helix HX8 5W-30 1L",
    brand: "Shell",
    category: "Óleos e Fluidos",
    price: 59.9,
    stock: 90,
    partCode: "SH-HX8",
    warrantyMonths: 0,
    description: "Óleo sintético com tecnologia de limpeza ativa.",
    fitment: [],
  },
  {
    id: "lampada-philips-h4",
    name: "Lâmpada Farol Philips H4 Crystal Vision",
    brand: "Philips",
    category: "Iluminação",
    price: 89.9,
    stock: 40,
    partCode: "PH-H4CV",
    warrantyMonths: 6,
    description: "Par de lâmpadas com luz branca de alta visibilidade.",
    fitment: ["fiat uno", "chevrolet corsa", "fiat palio"],
  },
  {
    id: "led-philips-h7",
    name: "Kit Lâmpada LED H7 Philips Ultinon",
    brand: "Philips",
    category: "Iluminação",
    price: 249.9,
    oldPrice: 299.9,
    stock: 16,
    partCode: "PH-LEDH7",
    warrantyMonths: 12,
    description: "Kit LED com luz branca 6000K, instalação plug and play.",
    fitment: ["volkswagen polo", "chevrolet onix", "honda civic", "toyota corolla", "hyundai hb20"],
  },
  {
    id: "palheta-bosch",
    name: "Par de Palhetas Limpador Bosch Aerofit",
    brand: "Bosch",
    category: "Acessórios",
    price: 79.9,
    stock: 55,
    partCode: "BS-AF22",
    warrantyMonths: 6,
    description: "Palhetas com borracha de grafite e perfil aerodinâmico.",
    fitment: [],
  },
];

async function main() {
  console.log("Seeding database...");

  await db.transaction(async (tx) => {
    // --- Vehicle makes / models / variants ---------------------------------
    // Keyed by "make model" (-> every engine variant of that model) and by
    // "make model engine" (-> that single variant), lowercased.
    const variantIdsByKey = new Map<string, string[]>();
    function addVariantKey(key: string, variantId: string) {
      const existing = variantIdsByKey.get(key);
      if (existing) existing.push(variantId);
      else variantIdsByKey.set(key, [variantId]);
    }

    for (const [makeName, models] of Object.entries(MAKE_MODELS)) {
      const [make] = await tx.insert(schema.vehicleMakes).values({ name: makeName }).returning();
      if (!make) throw new Error(`Failed to insert make ${makeName}`);

      for (const [modelName, variants] of Object.entries(models)) {
        const [model] = await tx
          .insert(schema.vehicleModels)
          .values({ makeId: make.id, name: modelName })
          .returning();
        if (!model) throw new Error(`Failed to insert model ${modelName}`);

        for (const v of variants) {
          const [variant] = await tx
            .insert(schema.vehicleVariants)
            .values({
              modelId: model.id,
              yearStart: v.yearStart,
              yearEnd: v.yearEnd,
              engine: v.engine,
              fuel: v.fuel,
            })
            .returning();
          if (!variant) throw new Error(`Failed to insert variant ${modelName} ${v.engine}`);
          addVariantKey(`${makeName} ${modelName}`.toLowerCase(), variant.id);
          addVariantKey(`${makeName} ${modelName} ${v.engine}`.toLowerCase(), variant.id);
        }
      }
    }

    // --- Part brands ---------------------------------------------------------
    const brandIdByName = new Map<string, string>();
    for (const name of PART_BRANDS) {
      const [brand] = await tx
        .insert(schema.brands)
        .values({ name, slug: slugify(name) })
        .returning();
      if (!brand) throw new Error(`Failed to insert brand ${name}`);
      brandIdByName.set(name, brand.id);
    }

    // --- Categories (hierarchical) -------------------------------------------
    const categoryIdByName = new Map<string, string>();
    for (const [parentName, children] of Object.entries(CATEGORY_TREE)) {
      const [parent] = await tx
        .insert(schema.categories)
        .values({ name: parentName, slug: slugify(parentName) })
        .returning();
      if (!parent) throw new Error(`Failed to insert category ${parentName}`);
      categoryIdByName.set(parentName, parent.id);

      for (const childName of children) {
        const [child] = await tx
          .insert(schema.categories)
          .values({
            parentId: parent.id,
            name: childName,
            slug: slugify(`${parentName}-${childName}`),
          })
          .returning();
        if (!child) throw new Error(`Failed to insert category ${childName}`);
        categoryIdByName.set(`${parentName}/${childName}`, child.id);
      }
    }

    // --- Products, images, inventory, compatibility ---------------------------
    const productIdBySeedId = new Map<string, string>();

    for (const p of PRODUCTS) {
      const brandId = brandIdByName.get(p.brand);
      const categoryId = p.subcategory
        ? categoryIdByName.get(`${p.category}/${p.subcategory}`)
        : categoryIdByName.get(p.category);
      if (!brandId || !categoryId) {
        throw new Error(`Missing brand/category for product ${p.id}`);
      }

      const [product] = await tx
        .insert(schema.products)
        .values({
          sku: p.partCode,
          brandId,
          categoryId,
          name: p.name,
          slug: p.id,
          description: p.description,
          partNumber: p.partCode,
          // If there's an `oldPrice`, the real price/promo split is fixed up
          // in the pass below (regular price becomes the "was" price).
          price: p.price.toFixed(2),
          warrantyMonths: p.warrantyMonths,
        })
        .returning();
      if (!product) throw new Error(`Failed to insert product ${p.id}`);
      productIdBySeedId.set(p.id, product.id);

      await tx.insert(schema.productImages).values({
        productId: product.id,
        url: `https://picsum.photos/seed/${p.id}/640/640`,
        position: 0,
        isPrimary: true,
      });

      await tx.insert(schema.inventory).values({
        productId: product.id,
        quantity: p.stock,
        reservedQuantity: 0,
      });

      for (const key of p.fitment) {
        const variantIds = variantIdsByKey.get(key) ?? [];
        for (const variantId of variantIds) {
          await tx
            .insert(schema.productVehicleApplications)
            .values({
              productId: product.id,
              vehicleVariantId: variantId,
              notes:
                "Compatibilidade de demonstração — dado de desenvolvimento, não validado tecnicamente.",
            })
            .onConflictDoNothing();
        }
      }
    }

    // products.price stores the *current* price; `oldPrice` in the mock is a
    // "was" reference price, not our `promotional_price` (which is the
    // current discounted price). Re-derive it in a second pass so the insert
    // above can stay a single flat literal instead of two branches per row.
    for (const p of PRODUCTS) {
      if (!p.oldPrice) continue;
      const productId = productIdBySeedId.get(p.id);
      if (!productId) continue;
      await tx
        .update(schema.products)
        .set({ promotionalPrice: p.price.toFixed(2), price: p.oldPrice.toFixed(2) })
        .where(eq(schema.products.id, productId));
    }

    // --- Demo users, addresses, garage -----------------------------------
    const passwordHash = await bcrypt.hash("Senha123!", 10);

    const [customer] = await tx
      .insert(schema.users)
      .values({
        name: "Marcos Andrade",
        email: "cliente@autoparts.dev",
        phone: "+55 11 91234-5678",
        passwordHash,
      })
      .returning();
    if (!customer) throw new Error("Failed to insert demo user");

    await tx.insert(schema.addresses).values({
      userId: customer.id,
      name: "Casa",
      zipCode: "01310-100",
      street: "Av. Paulista",
      number: "1000",
      complement: "Apto 52",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      isDefault: true,
    });

    const golVariantId = variantIdsByKey.get("volkswagen gol 1.6 msi")?.[0];
    const civicVariantId = variantIdsByKey.get("honda civic 2.0 i-vtec")?.[0];
    if (golVariantId) {
      await tx.insert(schema.userVehicles).values({
        userId: customer.id,
        vehicleVariantId: golVariantId,
        year: 2020,
        nickname: "Gol do dia a dia",
        isPrimary: true,
      });
    }
    if (civicVariantId) {
      await tx.insert(schema.userVehicles).values({
        userId: customer.id,
        vehicleVariantId: civicVariantId,
        year: 2018,
        nickname: "Civic de família",
        isPrimary: false,
      });
    }

    // --- Demo cart ---------------------------------------------------------
    const [cart] = await tx
      .insert(schema.carts)
      .values({ userId: customer.id, status: "active" })
      .returning();
    const pastilhaId = productIdBySeedId.get("pastilha-bosch-diant");
    if (cart && pastilhaId) {
      await tx.insert(schema.cartItems).values({
        cartId: cart.id,
        productId: pastilhaId,
        quantity: 1,
        unitPrice: "189.90",
      });
    }

    // --- Demo order + payment ----------------------------------------------
    const oleoId = productIdBySeedId.get("oleo-shell-hx8");
    if (pastilhaId && oleoId) {
      const [order] = await tx
        .insert(schema.orders)
        .values({
          orderNumber: "AP874321",
          userId: customer.id,
          status: "out_for_delivery",
          subtotal: "249.80",
          discount: "0.00",
          shippingCost: "0.00",
          total: "249.80",
          channel: "web",
          shippingName: customer.name,
          shippingZipCode: "01310-100",
          shippingStreet: "Av. Paulista",
          shippingNumber: "1000",
          shippingComplement: "Apto 52",
          shippingNeighborhood: "Bela Vista",
          shippingCity: "São Paulo",
          shippingState: "SP",
        })
        .returning();
      if (!order) throw new Error("Failed to insert demo order");

      await tx.insert(schema.orderItems).values([
        {
          orderId: order.id,
          productId: pastilhaId,
          productName: "Pastilha de Freio Dianteira Bosch",
          sku: "BB-1234",
          quantity: 1,
          unitPrice: "189.90",
          totalPrice: "189.90",
        },
        {
          orderId: order.id,
          productId: oleoId,
          productName: "Óleo de Motor Shell Helix HX8 5W-30 1L",
          sku: "SH-HX8",
          quantity: 1,
          unitPrice: "59.90",
          totalPrice: "59.90",
        },
      ]);

      await tx.insert(schema.payments).values({
        orderId: order.id,
        method: "pix",
        status: "approved",
        amount: "249.80",
        provider: "mock-psp",
        providerTransactionId: "mock-txn-0001",
        paidAt: new Date(),
      });
    }

    // --- Demo assistant conversation -----------------------------------------
    const sessionId = "demo-session-0001";
    const [conversation] = await tx
      .insert(schema.conversations)
      .values({
        userId: customer.id,
        sessionId,
        vehicleVariantId: golVariantId,
        status: "ended",
        endedAt: new Date(),
      })
      .returning();

    if (conversation) {
      const [userMessage] = await tx
        .insert(schema.messages)
        .values({
          conversationId: conversation.id,
          role: "user",
          content: "Preciso de pastilhas de freio para um Gol 1.6 2020",
        })
        .returning();

      const searchStartedAt = Date.now();
      const [searchToolCall] = await tx
        .insert(schema.toolCalls)
        .values({
          conversationId: conversation.id,
          messageId: userMessage?.id,
          toolName: "search_products",
          arguments: {
            category: "freios",
            vehicle: { brand: "Volkswagen", model: "Gol", year: 2020 },
          },
          result: { productIds: pastilhaId ? [pastilhaId] : [] },
          status: "success",
          latencyMs: Date.now() - searchStartedAt,
        })
        .returning();

      const [assistantMessage] = await tx
        .insert(schema.messages)
        .values({
          conversationId: conversation.id,
          role: "assistant",
          content: "Encontrei pastilhas de freio dianteiras compatíveis com o seu Gol 1.6 2020.",
        })
        .returning();

      if (pastilhaId) {
        await tx.insert(schema.productRecommendations).values({
          conversationId: conversation.id,
          userId: customer.id,
          productId: pastilhaId,
          vehicleVariantId: golVariantId,
          position: 0,
          reason: "Compatível com o veículo informado e categoria solicitada (freios).",
        });
      }

      if (pastilhaId) {
        const addToCartStartedAt = Date.now();
        await tx.insert(schema.toolCalls).values({
          conversationId: conversation.id,
          messageId: assistantMessage?.id,
          toolName: "add_to_cart",
          arguments: { product_id: pastilhaId, quantity: 1 },
          result: { success: true },
          status: "success",
          latencyMs: Date.now() - addToCartStartedAt,
        });
      }

      await tx.insert(schema.events).values([
        {
          eventName: "assistant_started",
          userId: customer.id,
          sessionId,
          conversationId: conversation.id,
          channel: "assistant",
          properties: {},
        },
        {
          eventName: "assistant_message_sent",
          userId: customer.id,
          sessionId,
          conversationId: conversation.id,
          channel: "assistant",
          properties: { text: "Preciso de pastilhas de freio para um Gol 1.6 2020" },
        },
        {
          eventName: "assistant_product_recommended",
          userId: customer.id,
          sessionId,
          conversationId: conversation.id,
          channel: "assistant",
          properties: { productIds: pastilhaId ? [pastilhaId] : [] },
        },
        {
          eventName: "assistant_add_to_cart",
          userId: customer.id,
          sessionId,
          conversationId: conversation.id,
          channel: "assistant",
          properties: { productId: pastilhaId, quantity: 1 },
        },
      ]);
    }
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });
