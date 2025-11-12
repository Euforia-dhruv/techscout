import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type ComponentCategory = 
  | "CPU" 
  | "GPU" 
  | "RAM" 
  | "Motherboard" 
  | "PSU" 
  | "Storage" 
  | "Case" 
  | "Cooling"
  | "Monitor"
  | "Keyboard"
  | "Mouse"
  | "Headset";

export type ComponentSocket = "AM4" | "AM5" | "LGA1700" | "LGA1200";
export type ComponentChipset = "B550" | "X570" | "B650" | "X670" | "Z690" | "Z790" | "B760";
export type RAMType = "DDR4" | "DDR5";

export interface Product {
  id: string;
  name: string;
  category: ComponentCategory;
  brand: string;
  price: number;
  imageUrl: string;
  rating: number;
  specs: Record<string, string | number>;
  features: string[];
  isBestPick: boolean;
  inStock: boolean;
}

export interface CPUProduct extends Product {
  category: "CPU";
  specs: {
    socket: ComponentSocket;
    cores: number;
    threads: number;
    baseClock: string;
    boostClock: string;
    tdp: number;
  };
}

export interface GPUProduct extends Product {
  category: "GPU";
  specs: {
    vram: number;
    coreClock: string;
    powerConsumption: number;
    length: number;
  };
}

export interface RAMProduct extends Product {
  category: "RAM";
  specs: {
    type: RAMType;
    capacity: number;
    speed: number;
    modules: number;
    latency: string;
  };
}

export interface MotherboardProduct extends Product {
  category: "Motherboard";
  specs: {
    socket: ComponentSocket;
    chipset: ComponentChipset;
    ramType: RAMType;
    maxRam: number;
    formFactor: string;
    m2Slots: number;
  };
}

export interface PSUProduct extends Product {
  category: "PSU";
  specs: {
    wattage: number;
    efficiency: string;
    modular: boolean;
  };
}

export interface StorageProduct extends Product {
  category: "Storage";
  specs: {
    capacity: number;
    type: "SSD" | "HDD" | "NVMe";
    readSpeed: number;
    writeSpeed: number;
    formFactor: string;
  };
}

export interface Build {
  id: string;
  name: string;
  components: {
    cpu?: string;
    gpu?: string;
    ram?: string;
    motherboard?: string;
    psu?: string;
    storage?: string;
    case?: string;
    cooling?: string;
  };
  totalPrice: number;
  estimatedPower: number;
  createdAt: string;
  isPublic: boolean;
}

export const insertBuildSchema = z.object({
  name: z.string().min(1),
  components: z.object({
    cpu: z.string().optional(),
    gpu: z.string().optional(),
    ram: z.string().optional(),
    motherboard: z.string().optional(),
    psu: z.string().optional(),
    storage: z.string().optional(),
    case: z.string().optional(),
    cooling: z.string().optional(),
  }),
  totalPrice: z.number(),
  estimatedPower: z.number(),
  isPublic: z.boolean().default(false),
});

export type InsertBuild = z.infer<typeof insertBuildSchema>;

export interface PreBuiltPC {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  useCase: "Gaming" | "Workstation" | "Budget" | "Creator" | "Enthusiast";
  components: {
    cpu: string;
    gpu: string;
    ram: string;
    motherboard: string;
    psu: string;
    storage: string;
    case: string;
    cooling: string;
  };
  rating: number;
}

export interface CompatibilityIssue {
  severity: "error" | "warning" | "info";
  message: string;
  affectedComponents: ComponentCategory[];
}

export interface BuildGuideSection {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  order: number;
}
