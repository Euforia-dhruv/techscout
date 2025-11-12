import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStock: boolean;
  bestPicksOnly: boolean;
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availableCategories: string[];
  availableBrands: string[];
  maxPrice: number;
}

export function FilterPanel({ 
  filters, 
  onFilterChange, 
  availableCategories,
  availableBrands,
  maxPrice 
}: FilterPanelProps) {
  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handleReset = () => {
    onFilterChange({
      categories: [],
      brands: [],
      priceRange: [0, maxPrice],
      inStock: false,
      bestPicksOnly: false,
    });
  };

  const activeFilterCount = 
    filters.categories.length + 
    filters.brands.length + 
    (filters.inStock ? 1 : 0) + 
    (filters.bestPicksOnly ? 1 : 0);

  return (
    <Card data-testid="card-filters">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              data-testid="button-clear-filters"
            >
              <X className="h-4 w-4 mr-1" />
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Category</h3>
          <div className="space-y-2">
            {availableCategories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                  data-testid={`checkbox-category-${category}`}
                />
                <Label 
                  htmlFor={`category-${category}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="font-medium text-sm">Brand</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableBrands.map(brand => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => handleBrandToggle(brand)}
                  data-testid={`checkbox-brand-${brand}`}
                />
                <Label 
                  htmlFor={`brand-${brand}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Price Range</h3>
            <span className="text-xs font-mono text-muted-foreground">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </span>
          </div>
          <Slider
            min={0}
            max={maxPrice}
            step={50}
            value={filters.priceRange}
            onValueChange={(value) => onFilterChange({ ...filters, priceRange: value as [number, number] })}
            className="w-full"
            data-testid="slider-price-range"
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={(checked) => onFilterChange({ ...filters, inStock: checked as boolean })}
              data-testid="checkbox-in-stock"
            />
            <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
              In Stock Only
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="best-picks"
              checked={filters.bestPicksOnly}
              onCheckedChange={(checked) => onFilterChange({ ...filters, bestPicksOnly: checked as boolean })}
              data-testid="checkbox-best-picks"
            />
            <Label htmlFor="best-picks" className="text-sm font-normal cursor-pointer">
              Best Picks Only
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
