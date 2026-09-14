import type { Channel } from "@/types";

export type TrackingEvent =
  | "product_viewed"
  | "product_searched"
  | "vehicle_selected"
  | "product_recommended"
  | "product_added_to_cart"
  | "product_removed_from_cart"
  | "checkout_started"
  | "purchase_completed"
  | "assistant_started"
  | "assistant_message_sent"
  | "assistant_product_recommended"
  | "assistant_add_to_cart";

export interface TrackedPayload {
  event: TrackingEvent;
  channel: Channel;
  timestamp: string;
  properties: Record<string, unknown>;
}

const queue: TrackedPayload[] = [];

/**
 * Single entry point for analytics. Today it only buffers + logs the event;
 * later this is where a POST to the tracking API goes.
 */
export function track(
  event: TrackingEvent,
  properties: Record<string, unknown> = {},
  channel: Channel = "web",
) {
  const payload: TrackedPayload = {
    event,
    channel,
    timestamp: new Date().toISOString(),
    properties,
  };
  queue.push(payload);
  if (import.meta.env.DEV) {
    console.debug("[track]", payload.event, payload.channel, payload.properties);
  }
}

export function getTrackedEvents() {
  return [...queue];
}
