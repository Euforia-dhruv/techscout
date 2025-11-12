import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Cpu, Monitor, MemoryStick, Layers, Zap, HardDrive, Box, Fan, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Build, Product } from "@shared/schema";

const componentIcons = {
  cpu: Cpu,
  gpu: Monitor,
  ram: MemoryStick,
  motherboard: Layers,
  psu: Zap,
  storage: HardDrive,
  case: Box,
  cooling: Fan,
};

export default function SharedBuild() {
  const [, params] = useRoute("/build/:id");
  const { toast } = useToast();

  const { data: buildData, isLoading: buildLoading } = useQuery<any>({
    queryKey: ["/api/builds", params?.id],
    enabled: !!params?.id,
  });

  const build = buildData as Build | undefined;
  const resolvedComponents = buildData?.resolvedComponents || {};

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied",
      description: "Build link has been copied to clipboard.",
    });
  };

  if (buildLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold mb-2">Build Not Found</h3>
          <p className="text-muted-foreground mb-6">
            This build doesn't exist or has been deleted.
          </p>
          <Button onClick={() => window.location.href = "/builder"}>
            Create Your Own Build
          </Button>
        </div>
      </div>
    );
  }

  const componentEntries = Object.entries(build.components);
  const componentsWithDetails = componentEntries.map(([key, id]) => ({
    key,
    id,
    product: resolvedComponents[key] as Product | undefined,
  }));

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold" data-testid="text-build-name">{build.name}</h1>
          <Button onClick={handleShare} variant="outline" data-testid="button-share-build">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>Created: {new Date(build.createdAt).toLocaleDateString()}</span>
          <Badge variant={build.isPublic ? "default" : "secondary"}>
            {build.isPublic ? "Public" : "Private"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 mb-8">
        {componentsWithDetails.map(({ key, product }) => {
          const Icon = componentIcons[key as keyof typeof componentIcons];
          
          return (
            <Card key={key} data-testid={`card-component-${key}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    {Icon && <Icon className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg capitalize">{key}</CardTitle>
                    {product && (
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    )}
                  </div>
                  {product && (
                    <span className="text-xl font-bold font-mono">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </CardHeader>
              {product && (
                <CardContent>
                  <div className="flex items-center gap-4">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium mb-2">{product.name}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        {Object.entries(product.specs).slice(0, 4).map(([specKey, value]) => (
                          <div key={specKey}>
                            <span className="capitalize">{specKey}: </span>
                            <span className="font-mono">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Price</p>
              <p className="text-3xl font-bold font-mono" data-testid="text-total-price">
                ${build.totalPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estimated Power</p>
              <p className="text-3xl font-bold font-mono" data-testid="text-estimated-power">
                {build.estimatedPower}W
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
