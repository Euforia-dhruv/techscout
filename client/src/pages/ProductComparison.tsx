import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Star, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Product } from "@shared/schema";

export default function ProductComparison() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const searchResults = products.filter(p => 
    searchQuery !== "" && 
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 10);

  const handleAddProduct = (product: Product) => {
    if (selectedProducts.length < 3 && !selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
      setSearchQuery("");
      setDialogOpen(false);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const allSpecs = Array.from(new Set(
    selectedProducts.flatMap(p => Object.keys(p.specs))
  ));

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
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">Product Comparison</h1>
        <p className="text-muted-foreground">
          Compare up to 3 products side-by-side
        </p>
      </div>

      {selectedProducts.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">⚖️</div>
          <h3 className="text-2xl font-semibold mb-2">No products to compare</h3>
          <p className="text-muted-foreground mb-6">
            Add up to 3 products to start comparing
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" data-testid="button-add-first-product">
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Select Product to Compare</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-comparison"
                  />
                </div>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {searchResults.map(product => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-3 hover-elevate rounded-md cursor-pointer border"
                        onClick={() => handleAddProduct(product)}
                        data-testid={`product-search-result-${product.id}`}
                      >
                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                        <span className="font-mono font-semibold">${product.price}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...selectedProducts, ...Array(3 - selectedProducts.length)].map((product, idx) => (
              <Card key={idx} className={product ? "" : "border-dashed"}>
                {product ? (
                  <>
                    <CardHeader className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => handleRemoveProduct(product.id)}
                        data-testid={`button-remove-product-${product.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="aspect-square bg-muted rounded-md overflow-hidden mb-4">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Price</span>
                          <span className="text-xl font-bold font-mono">${product.price}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Rating</span>
                          {renderStars(product.rating)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Stock</span>
                          <Badge variant={product.inStock ? "default" : "secondary"}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center p-8">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="h-full w-full" data-testid={`button-add-product-slot-${idx}`}>
                          <Plus className="h-8 w-8 text-muted-foreground" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Select Product to Compare</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search products..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                              data-testid="input-search-comparison"
                            />
                          </div>
                          <ScrollArea className="h-96">
                            <div className="space-y-2">
                              {searchResults.map(product => (
                                <div
                                  key={product.id}
                                  className="flex items-center gap-4 p-3 hover-elevate rounded-md cursor-pointer border"
                                  onClick={() => handleAddProduct(product)}
                                  data-testid={`product-search-result-${product.id}`}
                                >
                                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                  <div className="flex-1">
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                                  </div>
                                  <span className="font-mono font-semibold">${product.price}</span>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {selectedProducts.length >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Specification</th>
                        {selectedProducts.map(product => (
                          <th key={product.id} className="text-left p-3 font-medium min-w-48">
                            {product.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allSpecs.map((spec, idx) => {
                        const values = selectedProducts.map(p => p.specs[spec]);
                        const isDifferent = new Set(values.filter(v => v !== undefined)).size > 1;
                        
                        return (
                          <tr key={spec} className={`border-b ${isDifferent ? 'bg-yellow-500/10' : ''}`}>
                            <td className="p-3 text-sm font-medium capitalize">
                              {spec.replace(/([A-Z])/g, ' $1').trim()}
                            </td>
                            {selectedProducts.map(product => (
                              <td key={product.id} className="p-3 font-mono text-sm">
                                {product.specs[spec] ?? '-'}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
