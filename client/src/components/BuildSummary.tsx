import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, Share2, Zap } from "lucide-react";
import type { Build, Product } from "@shared/schema";

interface BuildSummaryProps {
  selectedComponents: Record<string, Product | undefined>;
  totalPrice: number;
  estimatedPower: number;
  onSave?: () => void;
  onShare?: () => void;
}

export function BuildSummary({ 
  selectedComponents, 
  totalPrice, 
  estimatedPower,
  onSave,
  onShare 
}: BuildSummaryProps) {
  const componentSlots = [
    { key: "cpu", label: "CPU" },
    { key: "gpu", label: "GPU" },
    { key: "ram", label: "RAM" },
    { key: "motherboard", label: "Motherboard" },
    { key: "psu", label: "PSU" },
    { key: "storage", label: "Storage" },
    { key: "case", label: "Case" },
    { key: "cooling", label: "Cooling" },
  ];

  const completedCount = componentSlots.filter(slot => selectedComponents[slot.key]).length;
  const progress = (completedCount / componentSlots.length) * 100;

  return (
    <Card className="sticky top-20" data-testid="card-build-summary">
      <CardHeader>
        <CardTitle className="text-xl">Your Build</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completedCount}/{componentSlots.length}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {componentSlots.map(slot => {
            const component = selectedComponents[slot.key];
            return (
              <div key={slot.key} className="space-y-1" data-testid={`build-slot-${slot.key}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{slot.label}</span>
                  {component && (
                    <span className="text-xs font-mono text-muted-foreground">
                      ${component.price}
                    </span>
                  )}
                </div>
                {component ? (
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {component.name}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground italic">
                    Not selected
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estimated Power</span>
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              <span className="font-mono">{estimatedPower}W</span>
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-semibold">Total Price</span>
            <span className="text-2xl font-bold font-mono" data-testid="text-total-price">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button onClick={onSave} className="flex-1" data-testid="button-save-build">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button onClick={onShare} variant="outline" className="flex-1" data-testid="button-share-build">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
