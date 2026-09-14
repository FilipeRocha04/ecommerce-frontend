import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createdAt, id } from "./_helpers";
import { users } from "./users";
import { vehicleVariants } from "./vehicles";
import { products } from "./catalog";

export const CONVERSATION_STATUSES = ["active", "ended"] as const;
export const MESSAGE_ROLES = ["user", "assistant", "tool"] as const;
export const TOOL_CALL_STATUSES = ["started", "success", "error"] as const;

export const conversations = pgTable(
  "conversations",
  {
    id: id(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    sessionId: varchar("session_id", { length: 120 }).notNull(),
    vehicleVariantId: uuid("vehicle_variant_id").references(() => vehicleVariants.id, {
      onDelete: "set null",
    }),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    createdAt: createdAt(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
  },
  (table) => [
    index("conversations_user_id_idx").on(table.userId),
    index("conversations_session_id_idx").on(table.sessionId),
    check("conversations_status_check", sql`${table.status} in ('active', 'ended')`),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: id(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 20 }).notNull(),
    content: text("content").notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    index("messages_conversation_id_idx").on(table.conversationId),
    check("messages_role_check", sql`${table.role} in ('user', 'assistant', 'tool')`),
  ],
);

/** Observability log for every tool the agent invokes against the backend. */
export const toolCalls = pgTable(
  "tool_calls",
  {
    id: id(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    messageId: uuid("message_id").references(() => messages.id, { onDelete: "set null" }),
    toolName: varchar("tool_name", { length: 100 }).notNull(),
    arguments: jsonb("arguments").notNull(),
    result: jsonb("result"),
    status: varchar("status", { length: 20 }).notNull().default("started"),
    latencyMs: integer("latency_ms"),
    errorMessage: text("error_message"),
    createdAt: createdAt(),
  },
  (table) => [
    index("tool_calls_conversation_id_idx").on(table.conversationId),
    index("tool_calls_tool_name_idx").on(table.toolName),
    check("tool_calls_status_check", sql`${table.status} in ('started', 'success', 'error')`),
  ],
);

/**
 * Every product the agent surfaced to a customer, so funnel analysis can
 * reconstruct recommended -> viewed -> add_to_cart -> purchased later via the
 * `events` table joined on product_id/session_id.
 */
export const productRecommendations = pgTable(
  "product_recommendations",
  {
    id: id(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    vehicleVariantId: uuid("vehicle_variant_id").references(() => vehicleVariants.id, {
      onDelete: "set null",
    }),
    position: smallint("position").notNull().default(0),
    reason: text("reason"),
    createdAt: createdAt(),
  },
  (table) => [
    index("product_recommendations_conversation_id_idx").on(table.conversationId),
    index("product_recommendations_product_id_idx").on(table.productId),
  ],
);
