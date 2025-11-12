import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToBuild?: (product: Product) => void;
  onAddToCompare?: (product: Product) => void;
  compact?: boolean;
}

export function ProductCard({ product, onAddToBuild, onAddToCompare, compact = false }: ProductCardProps) {
  const renderStars = (rating: number) => {
    return (
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
  };

  const getKeySpecs = () => {
    const specEntries = Object.entries(product.specs).slice(0, 3);
    return specEntries.map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: value
    }));
  };

  return (
    <Card className={`hover-elevate h-full flex flex-col ${compact ? '' : 'min-h-[400px]'}`} data-testid={`card-product-${product.id}`}>
      <CardHeader className="space-y-2 pb-4">
        <div className="aspect-square relative bg-muted rounded-md overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isBestPick && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
              Best Pick
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3">
        <div>
          <Badge variant="secondary" className="mb-2 text-xs">
            {product.category}
          </Badge>
          <h3 className="font-medium text-base line-clamp-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
        </div>

        <div className="space-y-1">
          {getKeySpecs().map((spec, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{spec.label}:</span>
              <span className="font-mono font-medium">{spec.value}</span>
            </div>
          ))}
        </div>

        {renderStars(product.rating)}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-4">
        <div className="w-full flex items-center justify-between">
          <span className="text-2xl font-semibold font-mono" data-testid={`text-price-${product.id}`}>
            ${product.price.toFixed(2)}
          </span>
          <Badge variant={product.inStock ? "default" : "secondary"}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        
        <div className="w-full flex gap-2">
          {onAddToBuild && (
            <Button 
              onClick={() => onAddToBuild(product)} 
              className="flex-1"
              disabled={!product.inStock}
              data-testid={`button-add-to-build-${product.id}`}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add to Build
            </Button>
          )}
          {onAddToCompare && (
            <Button 
              onClick={() => onAddToCompare(product)} 
              variant="outline"
              className="flex-1"
              data-testid={`button-add-to-compare-${product.id}`}
            >
              Compare
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
