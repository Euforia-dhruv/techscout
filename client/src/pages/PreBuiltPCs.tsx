import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Cpu, Monitor } from "lucide-react";
import type { PreBuiltPC } from "@shared/schema";

export default function PreBuiltPCs() {
  const [filterUseCase, setFilterUseCase] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "rating">("rating");

  const { data: preBuiltPCs = [], isLoading } = useQuery<PreBuiltPC[]>({
    queryKey: ["/api/pre-built-pcs"],
  });

  const useCases = ["Gaming", "Workstation", "Budget", "Creator", "Enthusiast"];

  const filteredPCs = useMemo(() => {
    let filtered = preBuiltPCs.filter(pc => 
      filterUseCase === "all" || pc.useCase === filterUseCase
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [preBuiltPCs, filterUseCase, sortBy]);

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">Pre-Built PCs</h1>
        <p className="text-muted-foreground">
          Curated ready-to-buy PC configurations for every need
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Tabs value={filterUseCase} onValueChange={setFilterUseCase} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto">
              <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
              {useCases.map(useCase => (
                <TabsTrigger key={useCase} value={useCase} data-testid={`tab-${useCase.toLowerCase()}`}>
                  {useCase}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-48" data-testid="select-sort-by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredPCs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPCs.map(pc => (
              <Card key={pc.id} className="hover-elevate overflow-hidden flex flex-col" data-testid={`card-prebuilt-${pc.id}`}>
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img 
                    src={pc.imageUrl} 
                    alt={pc.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4">
                    {pc.useCase}
                  </Badge>
                </div>
                
                <CardHeader className="flex-1">
                  <CardTitle className="text-xl mb-2">{pc.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">
                    {pc.description}
                  </p>
                  {renderStars(pc.rating)}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-xs">{pc.components.cpu}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-xs">{pc.components.gpu}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pc.components.ram} • {pc.components.storage}
                    </div>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between">
                    <span className="text-2xl font-bold font-mono">
                      ${pc.price.toLocaleString()}
                    </span>
                    <Button data-testid={`button-view-details-${pc.id}`}>View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🖥️</div>
            <h3 className="text-2xl font-semibold mb-2">No pre-built PCs found</h3>
            <p className="text-muted-foreground mb-6">
              Try selecting a different category
            </p>
            <Button onClick={() => setFilterUseCase("all")} data-testid="button-show-all">
              Show All PCs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
