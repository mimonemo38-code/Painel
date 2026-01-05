import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/revenue", async (req, res) => {
    const data = await storage.getRevenue();
    res.json(data);
  });

  app.get("/api/stats", async (req, res) => {
    const data = await storage.getStats();
    res.json(data);
  });

  app.get("/api/materials", async (req, res) => {
    const data = await storage.getMaterials();
    res.json(data);
  });

  app.patch("/api/materials/:code", async (req, res) => {
    const data = await storage.updateMaterial(req.params.code, req.body);
    if (!data) return res.status(404).json({ message: "Material não encontrado" });
    res.json(data);
  });

  app.patch("/api/revenue/:month", async (req, res) => {
    const data = await storage.updateRevenue(req.params.month, req.body);
    if (!data) return res.status(404).json({ message: "Mês não encontrado" });
    res.json(data);
  });

  app.patch("/api/stats/:label", async (req, res) => {
    const data = await storage.updateStat(req.params.label, req.body);
    if (!data) return res.status(404).json({ message: "Stat não encontrado" });
    res.json(data);
  });

  return httpServer;
}
