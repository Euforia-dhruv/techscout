import { 
  type User, 
  type InsertUser,
  type Product,
  type Build,
  type InsertBuild,
  type PreBuiltPC
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  
  createBuild(build: InsertBuild): Promise<Build>;
  getBuild(id: string): Promise<Build | undefined>;
  getAllBuilds(): Promise<Build[]>;
  
  getAllPreBuiltPCs(): Promise<PreBuiltPC[]>;
  getPreBuiltPC(id: string): Promise<PreBuiltPC | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private builds: Map<string, Build>;
  private preBuiltPCs: Map<string, PreBuiltPC>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.builds = new Map();
    this.preBuiltPCs = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleProducts: Product[] = [
      {
        id: "cpu-1",
        name: "AMD Ryzen 9 7950X",
        category: "CPU",
        brand: "AMD",
        price: 599.99,
        imageUrl: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=400&fit=crop",
        rating: 4.8,
        specs: { socket: "AM5", cores: 16, threads: 32, baseClock: "4.5GHz", boostClock: "5.7GHz", tdp: 170 },
        features: ["High Performance", "Overclockable", "PCIe 5.0"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "cpu-2",
        name: "Intel Core i9-13900K",
        category: "CPU",
        brand: "Intel",
        price: 589.99,
        imageUrl: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=400&fit=crop",
        rating: 4.7,
        specs: { socket: "LGA1700", cores: 24, threads: 32, baseClock: "3.0GHz", boostClock: "5.8GHz", tdp: 125 },
        features: ["Hybrid Architecture", "Overclockable", "DDR5 Support"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "cpu-3",
        name: "AMD Ryzen 5 5600",
        category: "CPU",
        brand: "AMD",
        price: 149.99,
        imageUrl: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=400&fit=crop",
        rating: 4.6,
        specs: { socket: "AM4", cores: 6, threads: 12, baseClock: "3.5GHz", boostClock: "4.4GHz", tdp: 65 },
        features: ["Budget Friendly", "Good Performance", "Low TDP"],
        isBestPick: false,
        inStock: true
      },
      {
        id: "gpu-1",
        name: "NVIDIA RTX 4090",
        category: "GPU",
        brand: "NVIDIA",
        price: 1599.99,
        imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop",
        rating: 4.9,
        specs: { vram: 24, coreClock: "2520MHz", powerConsumption: 450, length: 304 },
        features: ["Ray Tracing", "DLSS 3.0", "4K Gaming"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "gpu-2",
        name: "AMD Radeon RX 7900 XTX",
        category: "GPU",
        brand: "AMD",
        price: 999.99,
        imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop",
        rating: 4.7,
        specs: { vram: 24, coreClock: "2500MHz", powerConsumption: 355, length: 287 },
        features: ["High VRAM", "FSR 3.0", "Great Value"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "gpu-3",
        name: "NVIDIA RTX 4070",
        category: "GPU",
        brand: "NVIDIA",
        price: 599.99,
        imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop",
        rating: 4.6,
        specs: { vram: 12, coreClock: "2475MHz", powerConsumption: 200, length: 242 },
        features: ["Efficient", "1440p Gaming", "DLSS 3.0"],
        isBestPick: false,
        inStock: true
      },
      {
        id: "ram-1",
        name: "Corsair Vengeance DDR5 32GB",
        category: "RAM",
        brand: "Corsair",
        price: 139.99,
        imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop",
        rating: 4.7,
        specs: { type: "DDR5", capacity: 32, speed: 6000, modules: 2, latency: "CL36" },
        features: ["High Speed", "RGB", "Low Profile"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "ram-2",
        name: "G.Skill Trident Z5 DDR5 64GB",
        category: "RAM",
        brand: "G.Skill",
        price: 259.99,
        imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop",
        rating: 4.8,
        specs: { type: "DDR5", capacity: 64, speed: 6400, modules: 2, latency: "CL32" },
        features: ["Premium", "RGB", "High Capacity"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "ram-3",
        name: "Corsair Vengeance LPX DDR4 16GB",
        category: "RAM",
        brand: "Corsair",
        price: 54.99,
        imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop",
        rating: 4.6,
        specs: { type: "DDR4", capacity: 16, speed: 3200, modules: 2, latency: "CL16" },
        features: ["Budget", "Reliable", "Low Profile"],
        isBestPick: false,
        inStock: true
      },
      {
        id: "mobo-1",
        name: "ASUS ROG Strix X670E-E",
        category: "Motherboard",
        brand: "ASUS",
        price: 449.99,
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
        rating: 4.8,
        specs: { socket: "AM5", chipset: "X670", ramType: "DDR5", maxRam: 128, formFactor: "ATX", m2Slots: 4 },
        features: ["PCIe 5.0", "Wi-Fi 6E", "Premium VRM"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "mobo-2",
        name: "MSI MPG Z790 EDGE",
        category: "Motherboard",
        brand: "MSI",
        price: 369.99,
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
        rating: 4.7,
        specs: { socket: "LGA1700", chipset: "Z790", ramType: "DDR5", maxRam: 128, formFactor: "ATX", m2Slots: 5 },
        features: ["PCIe 5.0", "Wi-Fi 6E", "Great I/O"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "mobo-3",
        name: "ASRock B550M Pro4",
        category: "Motherboard",
        brand: "ASRock",
        price: 114.99,
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
        rating: 4.5,
        specs: { socket: "AM4", chipset: "B550", ramType: "DDR4", maxRam: 128, formFactor: "Micro-ATX", m2Slots: 2 },
        features: ["Budget", "PCIe 4.0", "Micro-ATX"],
        isBestPick: false,
        inStock: true
      },
      {
        id: "psu-1",
        name: "Corsair RM1000x",
        category: "PSU",
        brand: "Corsair",
        price: 189.99,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
        rating: 4.8,
        specs: { wattage: 1000, efficiency: "80+ Gold", modular: true },
        features: ["Fully Modular", "Silent", "10 Year Warranty"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "psu-2",
        name: "EVGA SuperNOVA 850 G6",
        category: "PSU",
        brand: "EVGA",
        price: 139.99,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
        rating: 4.7,
        specs: { wattage: 850, efficiency: "80+ Gold", modular: true },
        features: ["Fully Modular", "Compact", "Efficient"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "storage-1",
        name: "Samsung 980 Pro 2TB",
        category: "Storage",
        brand: "Samsung",
        price: 199.99,
        imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop",
        rating: 4.9,
        specs: { capacity: 2000, type: "NVMe", readSpeed: 7000, writeSpeed: 5000, formFactor: "M.2" },
        features: ["PCIe 4.0", "Fast", "Reliable"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "storage-2",
        name: "WD Black SN850X 1TB",
        category: "Storage",
        brand: "Western Digital",
        price: 119.99,
        imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop",
        rating: 4.8,
        specs: { capacity: 1000, type: "NVMe", readSpeed: 7300, writeSpeed: 6300, formFactor: "M.2" },
        features: ["Gaming Optimized", "Fast", "Heatsink"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "case-1",
        name: "Lian Li O11 Dynamic EVO",
        category: "Case",
        brand: "Lian Li",
        price: 159.99,
        imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=400&fit=crop",
        rating: 4.9,
        specs: { formFactor: "Mid-Tower", color: "Black", fans: 3 },
        features: ["Tempered Glass", "Excellent Airflow", "Cable Management"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "case-2",
        name: "Fractal Design Meshify 2",
        category: "Case",
        brand: "Fractal Design",
        price: 139.99,
        imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=400&fit=crop",
        rating: 4.7,
        specs: { formFactor: "Mid-Tower", color: "Black", fans: 2 },
        features: ["Mesh Front", "Modular", "Silent"],
        isBestPick: false,
        inStock: true
      },
      {
        id: "cooling-1",
        name: "Noctua NH-D15",
        category: "Cooling",
        brand: "Noctua",
        price: 109.99,
        imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop",
        rating: 4.9,
        specs: { type: "Air", fans: 2, height: 165 },
        features: ["Premium", "Silent", "Excellent Performance"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "cooling-2",
        name: "Corsair iCUE H150i Elite",
        category: "Cooling",
        brand: "Corsair",
        price: 189.99,
        imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop",
        rating: 4.8,
        specs: { type: "AIO", fans: 3, radiator: 360 },
        features: ["RGB", "Liquid Cooling", "Quiet"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "monitor-1",
        name: "LG 27GP850-B",
        category: "Monitor",
        brand: "LG",
        price: 399.99,
        imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
        rating: 4.7,
        specs: { size: 27, resolution: "2560x1440", refreshRate: 165, panelType: "IPS" },
        features: ["1440p", "165Hz", "G-Sync Compatible"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "keyboard-1",
        name: "Keychron Q1 Pro",
        category: "Keyboard",
        brand: "Keychron",
        price: 189.99,
        imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop",
        rating: 4.8,
        specs: { switchType: "Mechanical", layout: "75%", connection: "Wireless" },
        features: ["Hot-Swappable", "RGB", "QMK/VIA"],
        isBestPick: true,
        inStock: true
      },
      {
        id: "mouse-1",
        name: "Logitech G Pro X Superlight",
        category: "Mouse",
        brand: "Logitech",
        price: 159.99,
        imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
        rating: 4.9,
        specs: { dpi: 25600, weight: 63, connection: "Wireless" },
        features: ["Lightweight", "Pro Grade", "Long Battery"],
        isBestPick: true,
        inStock: true
      },
    ];

    const samplePreBuiltPCs: PreBuiltPC[] = [
      {
        id: "prebuilt-1",
        name: "Ultimate Gaming Beast",
        description: "Top-tier gaming PC with RTX 4090 for 4K gaming at maximum settings",
        imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&h=600&fit=crop",
        price: 3499.99,
        useCase: "Gaming",
        components: {
          cpu: "Intel Core i9-13900K",
          gpu: "NVIDIA RTX 4090",
          ram: "G.Skill Trident Z5 DDR5 64GB",
          motherboard: "MSI MPG Z790 EDGE",
          psu: "Corsair RM1000x",
          storage: "Samsung 980 Pro 2TB",
          case: "Lian Li O11 Dynamic EVO",
          cooling: "Corsair iCUE H150i Elite"
        },
        rating: 4.9
      },
      {
        id: "prebuilt-2",
        name: "Creator Workstation Pro",
        description: "Powerful workstation for content creation, 3D rendering, and video editing",
        imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
        price: 3299.99,
        useCase: "Creator",
        components: {
          cpu: "AMD Ryzen 9 7950X",
          gpu: "AMD Radeon RX 7900 XTX",
          ram: "G.Skill Trident Z5 DDR5 64GB",
          motherboard: "ASUS ROG Strix X670E-E",
          psu: "Corsair RM1000x",
          storage: "Samsung 980 Pro 2TB",
          case: "Fractal Design Meshify 2",
          cooling: "Noctua NH-D15"
        },
        rating: 4.8
      },
      {
        id: "prebuilt-3",
        name: "Budget Champion",
        description: "Excellent 1080p gaming performance without breaking the bank",
        imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&h=600&fit=crop",
        price: 899.99,
        useCase: "Budget",
        components: {
          cpu: "AMD Ryzen 5 5600",
          gpu: "NVIDIA RTX 4070",
          ram: "Corsair Vengeance LPX DDR4 16GB",
          motherboard: "ASRock B550M Pro4",
          psu: "EVGA SuperNOVA 850 G6",
          storage: "WD Black SN850X 1TB",
          case: "Fractal Design Meshify 2",
          cooling: "Noctua NH-D15"
        },
        rating: 4.7
      },
      {
        id: "prebuilt-4",
        name: "1440p Gaming Rig",
        description: "Balanced build for smooth 1440p gaming with high settings",
        imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&h=600&fit=crop",
        price: 1799.99,
        useCase: "Gaming",
        components: {
          cpu: "AMD Ryzen 9 7950X",
          gpu: "AMD Radeon RX 7900 XTX",
          ram: "Corsair Vengeance DDR5 32GB",
          motherboard: "ASUS ROG Strix X670E-E",
          psu: "EVGA SuperNOVA 850 G6",
          storage: "Samsung 980 Pro 2TB",
          case: "Lian Li O11 Dynamic EVO",
          cooling: "Corsair iCUE H150i Elite"
        },
        rating: 4.8
      },
      {
        id: "prebuilt-5",
        name: "Workstation Lite",
        description: "Entry-level workstation for productivity and light content creation",
        imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
        price: 1299.99,
        useCase: "Workstation",
        components: {
          cpu: "Intel Core i9-13900K",
          gpu: "NVIDIA RTX 4070",
          ram: "Corsair Vengeance DDR5 32GB",
          motherboard: "MSI MPG Z790 EDGE",
          psu: "EVGA SuperNOVA 850 G6",
          storage: "WD Black SN850X 1TB",
          case: "Fractal Design Meshify 2",
          cooling: "Noctua NH-D15"
        },
        rating: 4.6
      },
      {
        id: "prebuilt-6",
        name: "Enthusiast Special",
        description: "High-performance build for enthusiasts who demand the best",
        imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&h=600&fit=crop",
        price: 4299.99,
        useCase: "Enthusiast",
        components: {
          cpu: "AMD Ryzen 9 7950X",
          gpu: "NVIDIA RTX 4090",
          ram: "G.Skill Trident Z5 DDR5 64GB",
          motherboard: "ASUS ROG Strix X670E-E",
          psu: "Corsair RM1000x",
          storage: "Samsung 980 Pro 2TB",
          case: "Lian Li O11 Dynamic EVO",
          cooling: "Corsair iCUE H150i Elite"
        },
        rating: 4.9
      },
    ];

    sampleProducts.forEach(product => this.products.set(product.id, product));
    samplePreBuiltPCs.forEach(pc => this.preBuiltPCs.set(pc.id, pc));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createBuild(insertBuild: InsertBuild): Promise<Build> {
    const id = randomUUID();
    const build: Build = {
      ...insertBuild,
      id,
      createdAt: new Date().toISOString(),
    };
    this.builds.set(id, build);
    return build;
  }

  async getBuild(id: string): Promise<Build | undefined> {
    return this.builds.get(id);
  }

  async getAllBuilds(): Promise<Build[]> {
    return Array.from(this.builds.values());
  }

  async getAllPreBuiltPCs(): Promise<PreBuiltPC[]> {
    return Array.from(this.preBuiltPCs.values());
  }

  async getPreBuiltPC(id: string): Promise<PreBuiltPC | undefined> {
    return this.preBuiltPCs.get(id);
  }
}

export const storage = new MemStorage();
