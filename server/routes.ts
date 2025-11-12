import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBuildSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/builds", async (req, res) => {
    try {
      const validatedData = insertBuildSchema.parse(req.body);
      const build = await storage.createBuild(validatedData);
      res.status(201).json(build);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create build" });
      }
    }
  });

  app.get("/api/builds/:id", async (req, res) => {
    try {
      const build = await storage.getBuild(req.params.id);
      if (!build) {
        return res.status(404).json({ error: "Build not found" });
      }
      res.json(build);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch build" });
    }
  });

  app.get("/api/builds", async (req, res) => {
    try {
      const builds = await storage.getAllBuilds();
      res.json(builds);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch builds" });
    }
  });

  app.get("/api/pre-built-pcs", async (req, res) => {
    try {
      const preBuiltPCs = await storage.getAllPreBuiltPCs();
      res.json(preBuiltPCs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pre-built PCs" });
    }
  });

  app.get("/api/pre-built-pcs/:id", async (req, res) => {
    try {
      const pc = await storage.getPreBuiltPC(req.params.id);
      if (!pc) {
        return res.status(404).json({ error: "Pre-built PC not found" });
      }
      res.json(pc);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pre-built PC" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
