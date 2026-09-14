import { sql } from "drizzle-orm";
import { check, index, jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { id } from "./_helpers";
import { users } from "./users";
import { conversations } from "./assistant";

export const EVENT_CHANNELS = ["web", "assistant", "system"] as const;

/**
 * Generic behavioral event log. Deliberately a single wide table instead of
 * one table per event type — `properties` carries the event-specific shape.
 * Keeping this schema-light (JSONB payload, no per-event tables/columns) is
 * what lets it later be shipped as-is to a stream (Kafka/Redpanda) and landed
 * as Parquet without a backend rewrite.
 */
export const events = pgTable(
  "events",
  {
    id: id(),
    eventName: varchar("event_name", { length: 100 }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    sessionId: varchar("session_id", { length: 120 }).notNull(),
    conversationId: uuid("conversation_id").references(() => conversations.id, {
      onDelete: "set null",
    }),
    channel: varchar("channel", { length: 20 }).notNull(),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
    properties: jsonb("properties").notNull().default({}),
  },
  (table) => [
    index("events_event_name_idx").on(table.eventName),
    index("events_session_id_idx").on(table.sessionId),
    index("events_user_id_idx").on(table.userId),
    index("events_conversation_id_idx").on(table.conversationId),
    index("events_timestamp_idx").on(table.timestamp),
    index("events_event_name_timestamp_idx").on(table.eventName, table.timestamp),
    check("events_channel_check", sql`${table.channel} in ('web', 'assistant', 'system')`),
  ],
);
