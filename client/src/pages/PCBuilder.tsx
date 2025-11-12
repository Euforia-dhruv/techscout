import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { BuildSummary } from "@/components/BuildSummary";
import { CompatibilityAlert, CompatibilitySuccess } from "@/components/CompatibilityAlert";
import { Cpu, Monitor, HardDrive, Fan, Box, Zap, MemoryStick, Layers, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product, ComponentCategory, CompatibilityIssue } from "@shared/schema";

const componentCategories = [
  { key: "cpu", label: "CPU", icon: Cpu },
  { key: "gpu", label: "GPU", icon: Monitor },
  { key: "ram", label: "RAM", icon: MemoryStick },
  { key: "motherboard", label: "Motherboard", icon: Layers },
  { key: "psu", label: "PSU", icon: Zap },
  { key: "storage", label: "Storage", icon: HardDrive },
  { key: "case", label: "Case", icon: Box },
  { key: "cooling", label: "Cooling", icon: Fan },
];

export default function PCBuilder() {
  const [selectedCategory, setSelectedCategory] = useState<string>("cpu");
  const [selectedComponents, setSelectedComponents] = useState<Record<string, Product | undefined>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const categoryProducts = useMemo(() => {
    const category = componentCategories.find(c => c.key === selectedCategory);
    if (!category) return [];

    const filtered = products.filter(p => 
      p.category === category.label &&
      (searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const { compatibilityIssues, totalPrice, estimatedPower } = useMemo(() => {
    const issues: CompatibilityIssue[] = [];
    let price = 0;
    let power = 0;

    Object.values(selectedComponents).forEach(component => {
      if (component) {
        price += component.price;
        if ('powerConsumption' in component.specs) {
          power += Number(component.specs.powerConsumption) || 0;
        } else if ('tdp' in component.specs) {
          power += Number(component.specs.tdp) || 0;
        }
      }
    });

    const cpu = selectedComponents.cpu as any;
    const motherboard = selectedComponents.motherboard as any;
    const ram = selectedComponents.ram as any;
    const psu = selectedComponents.psu as any;

    if (cpu && motherboard) {
      if (cpu.specs.socket !== motherboard.specs.socket) {
        issues.push({
          severity: "error",
          message: `CPU socket ${cpu.specs.socket} is not compatible with motherboard socket ${motherboard.specs.socket}`,
          affectedComponents: ["CPU", "Motherboard"]
        });
      }
    }

    if (motherboard && ram) {
      if (motherboard.specs.ramType !== ram.specs.type) {
        issues.push({
          severity: "error",
          message: `RAM type ${ram.specs.type} is not compatible with motherboard (requires ${motherboard.specs.ramType})`,
          affectedComponents: ["RAM", "Motherboard"]
        });
      }
    }

    if (psu && power > 0) {
      const psuWattage = Number(psu.specs.wattage) || 0;
      const powerMargin = (psuWattage - power) / psuWattage;
      
      if (power > psuWattage) {
        issues.push({
          severity: "error",
          message: `Total power consumption (${power}W) exceeds PSU capacity (${psuWattage}W)`,
          affectedComponents: ["PSU"]
        });
      } else if (powerMargin < 0.2) {
        issues.push({
          severity: "warning",
          message: `PSU has limited headroom. Consider a higher wattage PSU for better efficiency.`,
          affectedComponents: ["PSU"]
        });
      }
    }

    const gpu = selectedComponents.gpu as any;
    const caseComp = selectedComponents.case as any;
    const cooling = selectedComponents.cooling as any;
    const storage = selectedComponents.storage as any;

    if (motherboard && caseComp) {
      const moboFormFactor = motherboard.specs.formFactor;
      const caseFormFactor = caseComp.specs.formFactor;
      
      const compatibleFormFactors: Record<string, string[]> = {
        "Mid-Tower": ["ATX", "Micro-ATX", "Mini-ITX"],
        "Full-Tower": ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"],
        "Mini-Tower": ["Micro-ATX", "Mini-ITX"]
      };
      
      const allowedFormFactors = compatibleFormFactors[caseFormFactor] || [];
      if (!allowedFormFactors.includes(moboFormFactor)) {
        issues.push({
          severity: "error",
          message: `Motherboard form factor (${moboFormFactor}) is not compatible with case (${caseFormFactor})`,
          affectedComponents: ["Motherboard", "Case"]
        });
      }
    }

    if (gpu && caseComp) {
      const gpuLength = Number(gpu.specs.length) || 0;
      if (gpuLength > 350) {
        issues.push({
          severity: "warning",
          message: `GPU is ${gpuLength}mm long. Verify your case can accommodate this length.`,
          affectedComponents: ["GPU", "Case"]
        });
      }
    }

    if (motherboard && ram) {
      const ramCapacity = Number(ram.specs.capacity) || 0;
      const maxRam = Number(motherboard.specs.maxRam) || 0;
      
      if (ramCapacity > maxRam) {
        issues.push({
          severity: "error",
          message: `RAM capacity (${ramCapacity}GB) exceeds motherboard maximum (${maxRam}GB)`,
          affectedComponents: ["RAM", "Motherboard"]
        });
      }
    }

    if (cpu && cooling) {
      const coolerHeight = Number(cooling.specs.height) || 0;
      if (coolerHeight > 200) {
        issues.push({
          severity: "warning",
          message: `CPU cooler height is ${coolerHeight}mm. Ensure your case has adequate clearance.`,
          affectedComponents: ["Cooling", "Case"]
        });
      }
    }

    if (motherboard && storage) {
      if (storage.specs.type === "NVMe") {
        const m2Slots = Number(motherboard.specs.m2Slots) || 0;
        if (m2Slots === 0) {
          issues.push({
            severity: "error",
            message: "NVMe storage requires M.2 slots, but motherboard has none",
            affectedComponents: ["Storage", "Motherboard"]
          });
        }
      }
    }

    if (cpu && !selectedComponents.cooling) {
      issues.push({
        severity: "warning",
        message: "No cooling solution selected. CPU requires adequate cooling.",
        affectedComponents: ["CPU", "Cooling"]
      });
    }

    if (motherboard && !selectedComponents.psu) {
      issues.push({
        severity: "warning",
        message: "No PSU selected. System requires a power supply.",
        affectedComponents: ["PSU"]
      });
    }

    if (!selectedComponents.storage && (cpu || gpu)) {
      issues.push({
        severity: "warning",
        message: "No storage device selected. System needs storage to boot.",
        affectedComponents: ["Storage"]
      });
    }

    if (Object.keys(selectedComponents).length >= 3 && issues.filter(i => i.severity === "error").length === 0 && cpu && motherboard) {
      issues.push({
        severity: "info",
        message: "All selected components appear compatible. Continue building your PC!",
        affectedComponents: []
      });
    }

    return { compatibilityIssues: issues, totalPrice: price, estimatedPower: power };
  }, [selectedComponents]);

  const handleAddToBuild = (product: Product) => {
    const categoryKey = componentCategories.find(c => c.label === product.category)?.key;
    if (categoryKey) {
      setSelectedComponents(prev => ({ ...prev, [categoryKey]: product }));
      toast({
        title: "Component Added",
        description: `${product.name} has been added to your build.`,
      });
    }
  };

  const handleSave = async () => {
    try {
      const componentIds: Record<string, string> = {};
      Object.entries(selectedComponents).forEach(([key, component]) => {
        if (component) {
          componentIds[key] = component.id;
        }
      });

      const buildData = {
        name: `My Build ${new Date().toLocaleDateString()}`,
        components: componentIds,
        totalPrice,
        estimatedPower,
        isPublic: false,
      };

      const response = await fetch('/api/builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildData),
      });

      if (!response.ok) throw new Error('Failed to save build');

      const savedBuild = await response.json();
      
      toast({
        title: "Build Saved",
        description: `Your build has been saved successfully with ID: ${savedBuild.id}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save build. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      const componentIds: Record<string, string> = {};
      Object.entries(selectedComponents).forEach(([key, component]) => {
        if (component) {
          componentIds[key] = component.id;
        }
      });

      const buildData = {
        name: `Shared Build ${new Date().toLocaleDateString()}`,
        components: componentIds,
        totalPrice,
        estimatedPower,
        isPublic: true,
      };

      const response = await fetch('/api/builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildData),
      });

      if (!response.ok) throw new Error('Failed to create share link');

      const savedBuild = await response.json();
      const shareUrl = `${window.location.origin}/build/${savedBuild.id}`;
      
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Share Link Copied",
        description: "Build link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">Custom PC Builder</h1>
        <p className="text-muted-foreground">
          Build your perfect PC with real-time compatibility checking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {compatibilityIssues.length > 0 ? (
            <div className="space-y-2">
              {compatibilityIssues.map((issue, idx) => (
                <CompatibilityAlert key={idx} issue={issue} />
              ))}
            </div>
          ) : Object.keys(selectedComponents).filter(k => selectedComponents[k]).length >= 2 ? (
            <CompatibilitySuccess />
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Select Components</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-2">
                  {componentCategories.map(category => {
                    const Icon = category.icon;
                    const isSelected = selectedComponents[category.key];
                    return (
                      <TabsTrigger 
                        key={category.key} 
                        value={category.key}
                        className="flex flex-col items-center gap-1 py-3 relative"
                        data-testid={`tab-${category.key}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs">{category.label}</span>
                        {isSelected && (
                          <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500" />
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <div className="mt-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search components..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-components"
                    />
                  </div>

                  {componentCategories.map(category => (
                    <TabsContent key={category.key} value={category.key} className="mt-0">
                      {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                          ))}
                        </div>
                      ) : categoryProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categoryProducts.map(product => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              onAddToBuild={handleAddToBuild}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          No {category.label} components found
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <BuildSummary
            selectedComponents={selectedComponents}
            totalPrice={totalPrice}
            estimatedPower={estimatedPower}
            onSave={handleSave}
            onShare={handleShare}
          />
        </div>
      </div>
    </div>
  );
}
