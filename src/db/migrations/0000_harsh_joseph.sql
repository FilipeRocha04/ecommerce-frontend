CREATE EXTENSION IF NOT EXISTS "pgcrypto";--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"zip_code" varchar(9) NOT NULL,
	"street" varchar(200) NOT NULL,
	"number" varchar(20) NOT NULL,
	"complement" varchar(120),
	"neighborhood" varchar(120) NOT NULL,
	"city" varchar(120) NOT NULL,
	"state" varchar(2) NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(30),
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vehicle_makes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(80) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicle_makes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "vehicle_models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"make_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"year_start" integer NOT NULL,
	"year_end" integer NOT NULL,
	"engine" varchar(80) NOT NULL,
	"version" varchar(80),
	"fuel" varchar(30) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicle_variants_year_range_check" CHECK ("vehicle_variants"."year_end" >= "vehicle_variants"."year_start"),
	CONSTRAINT "vehicle_variants_fuel_check" CHECK ("vehicle_variants"."fuel" in ('flex', 'gasolina', 'etanol', 'diesel', 'hibrido', 'eletrico', 'gnv'))
);
--> statement-breakpoint
CREATE TABLE "user_vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"vehicle_variant_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"nickname" varchar(80),
	"license_plate" varchar(8),
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(80) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "brands_name_unique" UNIQUE("name"),
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"url" text NOT NULL,
	"position" smallint DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_vehicle_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"vehicle_variant_id" uuid NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_vehicle_applications_unique" UNIQUE("product_id","vehicle_variant_id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" varchar(60) NOT NULL,
	"brand_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"part_number" varchar(80) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"promotional_price" numeric(10, 2),
	"warranty_months" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_sku_unique" UNIQUE("sku"),
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_promotional_price_lower_check" CHECK ("products"."promotional_price" is null or "products"."promotional_price" < "products"."price"),
	CONSTRAINT "products_price_positive_check" CHECK ("products"."price" >= 0),
	CONSTRAINT "products_warranty_months_check" CHECK ("products"."warranty_months" >= 0)
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"reserved_quantity" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_product_id_unique" UNIQUE("product_id"),
	CONSTRAINT "inventory_quantity_non_negative_check" CHECK ("inventory"."quantity" >= 0),
	CONSTRAINT "inventory_reserved_non_negative_check" CHECK ("inventory"."reserved_quantity" >= 0),
	CONSTRAINT "inventory_reserved_not_exceeding_quantity_check" CHECK ("inventory"."reserved_quantity" <= "inventory"."quantity")
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cart_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cart_items_cart_id_product_id_unique" UNIQUE("cart_id","product_id"),
	CONSTRAINT "cart_items_quantity_positive_check" CHECK ("cart_items"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"session_id" varchar(120),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "carts_status_check" CHECK ("carts"."status" in ('active', 'converted', 'abandoned')),
	CONSTRAINT "carts_owner_present_check" CHECK ("carts"."user_id" is not null or "carts"."session_id" is not null)
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid,
	"product_name" varchar(200) NOT NULL,
	"sku" varchar(60) NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_items_quantity_positive_check" CHECK ("order_items"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar(30) NOT NULL,
	"user_id" uuid NOT NULL,
	"status" varchar(30) DEFAULT 'pending_payment' NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"discount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"shipping_cost" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"channel" varchar(20) NOT NULL,
	"shipping_name" varchar(120) NOT NULL,
	"shipping_zip_code" varchar(9) NOT NULL,
	"shipping_street" varchar(200) NOT NULL,
	"shipping_number" varchar(20) NOT NULL,
	"shipping_complement" varchar(120),
	"shipping_neighborhood" varchar(120) NOT NULL,
	"shipping_city" varchar(120) NOT NULL,
	"shipping_state" varchar(2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number"),
	CONSTRAINT "orders_status_check" CHECK ("orders"."status" in ('pending_payment', 'paid', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')),
	CONSTRAINT "orders_channel_check" CHECK ("orders"."channel" in ('web', 'assistant')),
	CONSTRAINT "orders_subtotal_non_negative_check" CHECK ("orders"."subtotal" >= 0),
	CONSTRAINT "orders_discount_non_negative_check" CHECK ("orders"."discount" >= 0),
	CONSTRAINT "orders_shipping_cost_non_negative_check" CHECK ("orders"."shipping_cost" >= 0),
	CONSTRAINT "orders_total_non_negative_check" CHECK ("orders"."total" >= 0)
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"method" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"provider" varchar(60),
	"provider_transaction_id" varchar(120),
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_method_check" CHECK ("payments"."method" in ('pix', 'credit_card', 'boleto')),
	CONSTRAINT "payments_status_check" CHECK ("payments"."status" in ('pending', 'approved', 'failed', 'refunded', 'cancelled')),
	CONSTRAINT "payments_amount_non_negative_check" CHECK ("payments"."amount" >= 0)
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"session_id" varchar(120) NOT NULL,
	"vehicle_variant_id" uuid,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	CONSTRAINT "conversations_status_check" CHECK ("conversations"."status" in ('active', 'ended'))
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "messages_role_check" CHECK ("messages"."role" in ('user', 'assistant', 'tool'))
);
--> statement-breakpoint
CREATE TABLE "product_recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"user_id" uuid,
	"product_id" uuid NOT NULL,
	"vehicle_variant_id" uuid,
	"position" smallint DEFAULT 0 NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tool_calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"message_id" uuid,
	"tool_name" varchar(100) NOT NULL,
	"arguments" jsonb NOT NULL,
	"result" jsonb,
	"status" varchar(20) DEFAULT 'started' NOT NULL,
	"latency_ms" integer,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tool_calls_status_check" CHECK ("tool_calls"."status" in ('started', 'success', 'error'))
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_name" varchar(100) NOT NULL,
	"user_id" uuid,
	"session_id" varchar(120) NOT NULL,
	"conversation_id" uuid,
	"channel" varchar(20) NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"properties" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "events_channel_check" CHECK ("events"."channel" in ('web', 'assistant', 'system'))
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_models" ADD CONSTRAINT "vehicle_models_make_id_vehicle_makes_id_fk" FOREIGN KEY ("make_id") REFERENCES "public"."vehicle_makes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_variants" ADD CONSTRAINT "vehicle_variants_model_id_vehicle_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."vehicle_models"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vehicles" ADD CONSTRAINT "user_vehicles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vehicles" ADD CONSTRAINT "user_vehicles_vehicle_variant_id_vehicle_variants_id_fk" FOREIGN KEY ("vehicle_variant_id") REFERENCES "public"."vehicle_variants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_vehicle_applications" ADD CONSTRAINT "product_vehicle_applications_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_vehicle_applications" ADD CONSTRAINT "product_vehicle_applications_vehicle_variant_id_vehicle_variants_id_fk" FOREIGN KEY ("vehicle_variant_id") REFERENCES "public"."vehicle_variants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_vehicle_variant_id_vehicle_variants_id_fk" FOREIGN KEY ("vehicle_variant_id") REFERENCES "public"."vehicle_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_recommendations" ADD CONSTRAINT "product_recommendations_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_recommendations" ADD CONSTRAINT "product_recommendations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_recommendations" ADD CONSTRAINT "product_recommendations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_recommendations" ADD CONSTRAINT "product_recommendations_vehicle_variant_id_vehicle_variants_id_fk" FOREIGN KEY ("vehicle_variant_id") REFERENCES "public"."vehicle_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tool_calls" ADD CONSTRAINT "tool_calls_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tool_calls" ADD CONSTRAINT "tool_calls_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "addresses_user_id_idx" ON "addresses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vehicle_models_make_id_idx" ON "vehicle_models" USING btree ("make_id");--> statement-breakpoint
CREATE INDEX "vehicle_models_make_id_name_idx" ON "vehicle_models" USING btree ("make_id","name");--> statement-breakpoint
CREATE INDEX "vehicle_variants_model_id_idx" ON "vehicle_variants" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "user_vehicles_user_id_idx" ON "user_vehicles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_vehicles_vehicle_variant_id_idx" ON "user_vehicles" USING btree ("vehicle_variant_id");--> statement-breakpoint
CREATE INDEX "categories_parent_id_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "product_images_product_id_idx" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_vehicle_applications_product_id_idx" ON "product_vehicle_applications" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_vehicle_applications_vehicle_variant_id_idx" ON "product_vehicle_applications" USING btree ("vehicle_variant_id");--> statement-breakpoint
CREATE INDEX "products_brand_id_idx" ON "products" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_part_number_idx" ON "products" USING btree ("part_number");--> statement-breakpoint
CREATE INDEX "cart_items_cart_id_idx" ON "cart_items" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "carts_user_id_idx" ON "carts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "carts_session_id_idx" ON "carts" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payments_order_id_idx" ON "payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "conversations_user_id_idx" ON "conversations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "conversations_session_id_idx" ON "conversations" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_id_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "product_recommendations_conversation_id_idx" ON "product_recommendations" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "product_recommendations_product_id_idx" ON "product_recommendations" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "tool_calls_conversation_id_idx" ON "tool_calls" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "tool_calls_tool_name_idx" ON "tool_calls" USING btree ("tool_name");--> statement-breakpoint
CREATE INDEX "events_event_name_idx" ON "events" USING btree ("event_name");--> statement-breakpoint
CREATE INDEX "events_session_id_idx" ON "events" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "events_user_id_idx" ON "events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "events_conversation_id_idx" ON "events" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "events_timestamp_idx" ON "events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "events_event_name_timestamp_idx" ON "events" USING btree ("event_name","timestamp");