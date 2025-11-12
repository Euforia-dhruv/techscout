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
      
      const componentIds = Object.values(validatedData.components).filter(Boolean) as string[];
      const components: Record<string, any> = {};
      
      for (const componentId of componentIds) {
        const product = await storage.getProduct(componentId);
        if (!product) {
          return res.status(400).json({ 
            error: `Invalid component ID: ${componentId}` 
          });
        }
        
        const componentKey = Object.entries(validatedData.components).find(([, id]) => id === componentId)?.[0];
        if (componentKey) {
          components[componentKey] = product;
        }
      }
      
      const cpu = components.cpu;
      const motherboard = components.motherboard;
      const ram = components.ram;
      const psu = components.psu;
      
      if (cpu && motherboard) {
        if (cpu.specs.socket !== motherboard.specs.socket) {
          return res.status(400).json({
            error: `CPU socket ${cpu.specs.socket} is incompatible with motherboard socket ${motherboard.specs.socket}`
          });
        }
      }
      
      if (motherboard && ram) {
        if (motherboard.specs.ramType !== ram.specs.type) {
          return res.status(400).json({
            error: `RAM type ${ram.specs.type} is incompatible with motherboard (requires ${motherboard.specs.ramType})`
          });
        }
      }
      
      if (psu && validatedData.estimatedPower > 0) {
        const psuWattage = Number(psu.specs.wattage) || 0;
        if (validatedData.estimatedPower > psuWattage) {
          return res.status(400).json({
            error: `Total power consumption (${validatedData.estimatedPower}W) exceeds PSU capacity (${psuWattage}W)`
          });
        }
      }
      
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
      
      const allProducts = await storage.getAllProducts();
      const productsMap = new Map(allProducts.map(p => [p.id, p]));
      
      const buildWithComponents: any = {
        ...build,
        resolvedComponents: {}
      };
      
      Object.entries(build.components).forEach(([key, componentId]) => {
        if (componentId) {
          const product = productsMap.get(componentId);
          if (product) {
            buildWithComponents.resolvedComponents[key] = product;
          }
        }
      });
      
      res.json(buildWithComponents);
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
