import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  revenue,
  stats,
  materials,
  type InsertMaterial,
  type Material,
  type Revenue,
  type Stat
} from "@shared/schema";

export interface IStorage {
  getRevenue(): Promise<Revenue[]>;
  getStats(): Promise<Stat[]>;
  getMaterials(): Promise<Material[]>;
  updateMaterial(code: string, data: Partial<InsertMaterial>): Promise<Material | undefined>;
  updateRevenue(month: string, data: Partial<{ revenue: number, expenses: number }>): Promise<Revenue | undefined>;
  updateStat(label: string, data: Partial<{ value: string, change: number, trend: string }>): Promise<Stat | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getRevenue(): Promise<Revenue[]> {
    return await db.select().from(revenue).orderBy(revenue.id);
  }

  async getStats(): Promise<Stat[]> {
    return await db.select().from(stats).orderBy(stats.id);
  }

  async getMaterials(): Promise<Material[]> {
    return await db.select().from(materials).orderBy(materials.id);
  }

  async updateMaterial(code: string, data: Partial<InsertMaterial>): Promise<Material | undefined> {
    const [updated] = await db.update(materials)
      .set(data)
      .where(eq(materials.code, code))
      .returning();
    return updated;
  }

  async updateRevenue(month: string, data: Partial<{ revenue: number, expenses: number }>): Promise<Revenue | undefined> {
    const [updated] = await db.update(revenue)
      .set(data)
      .where(eq(revenue.month, month))
      .returning();
    return updated;
  }

  async updateStat(label: string, data: Partial<{ value: string, change: number, trend: string }>): Promise<Stat | undefined> {
    const [updated] = await db.update(stats)
      .set(data)
      .where(eq(stats.label, label))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
