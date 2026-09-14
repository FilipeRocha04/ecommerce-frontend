import { relations } from "drizzle-orm";
import { addresses, users } from "./users";
import { vehicleMakes, vehicleModels, vehicleVariants } from "./vehicles";
import { userVehicles } from "./user-vehicles";
import { brands, categories, productImages, products, productVehicleApplications } from "./catalog";
import { inventory } from "./inventory";
import { cartItems, carts } from "./cart";
import { orderItems, orders } from "./orders";
import { payments } from "./payments";
import { conversations, messages, productRecommendations, toolCalls } from "./assistant";
import { events } from "./events";

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  vehicles: many(userVehicles),
  carts: many(carts),
  orders: many(orders),
  conversations: many(conversations),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}));

export const vehicleMakesRelations = relations(vehicleMakes, ({ many }) => ({
  models: many(vehicleModels),
}));

export const vehicleModelsRelations = relations(vehicleModels, ({ one, many }) => ({
  make: one(vehicleMakes, { fields: [vehicleModels.makeId], references: [vehicleMakes.id] }),
  variants: many(vehicleVariants),
}));

export const vehicleVariantsRelations = relations(vehicleVariants, ({ one, many }) => ({
  model: one(vehicleModels, { fields: [vehicleVariants.modelId], references: [vehicleModels.id] }),
  userVehicles: many(userVehicles),
  applications: many(productVehicleApplications),
}));

export const userVehiclesRelations = relations(userVehicles, ({ one }) => ({
  user: one(users, { fields: [userVehicles.userId], references: [users.id] }),
  variant: one(vehicleVariants, {
    fields: [userVehicles.vehicleVariantId],
    references: [vehicleVariants.id],
  }),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id] }),
  children: many(categories),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
  inventory: one(inventory, { fields: [products.id], references: [inventory.productId] }),
  applications: many(productVehicleApplications),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  recommendations: many(productRecommendations),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const productVehicleApplicationsRelations = relations(
  productVehicleApplications,
  ({ one }) => ({
    product: one(products, {
      fields: [productVehicleApplications.productId],
      references: [products.id],
    }),
    variant: one(vehicleVariants, {
      fields: [productVehicleApplications.vehicleVariantId],
      references: [vehicleVariants.id],
    }),
  }),
);

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, { fields: [inventory.productId], references: [products.id] }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, { fields: [carts.userId], references: [users.id] }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, { fields: [conversations.userId], references: [users.id] }),
  vehicleVariant: one(vehicleVariants, {
    fields: [conversations.vehicleVariantId],
    references: [vehicleVariants.id],
  }),
  messages: many(messages),
  toolCalls: many(toolCalls),
  recommendations: many(productRecommendations),
  events: many(events),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  toolCalls: many(toolCalls),
}));

export const toolCallsRelations = relations(toolCalls, ({ one }) => ({
  conversation: one(conversations, {
    fields: [toolCalls.conversationId],
    references: [conversations.id],
  }),
  message: one(messages, { fields: [toolCalls.messageId], references: [messages.id] }),
}));

export const productRecommendationsRelations = relations(productRecommendations, ({ one }) => ({
  conversation: one(conversations, {
    fields: [productRecommendations.conversationId],
    references: [conversations.id],
  }),
  user: one(users, { fields: [productRecommendations.userId], references: [users.id] }),
  product: one(products, {
    fields: [productRecommendations.productId],
    references: [products.id],
  }),
  vehicleVariant: one(vehicleVariants, {
    fields: [productRecommendations.vehicleVariantId],
    references: [vehicleVariants.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, { fields: [events.userId], references: [users.id] }),
  conversation: one(conversations, {
    fields: [events.conversationId],
    references: [conversations.id],
  }),
}));
