import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Revenue data for the main bar chart
export const revenue = pgTable("revenue", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  revenue: integer("revenue").notNull(),
  expenses: integer("expenses").notNull(),
});

// General dashboard stats
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  change: integer("change"), // percentage change
  trend: text("trend").$type<"up" | "down" | "neutral">().default("neutral"),
  progress: integer("progress"), // 0-100 for progress bars
});

// Material data
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  currentBalance: integer("current_balance").notNull().default(0),
  orderPoint: integer("order_point").notNull().default(0),
});

export const insertMaterialSchema = createInsertSchema(materials).omit({ id: true });
export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Revenue = typeof revenue.$inferSelect;
export type Stat = typeof stats.$inferSelect;
