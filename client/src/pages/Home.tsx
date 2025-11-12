import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Cpu, Search, GitCompare, Package, BookOpen, Zap, Shield, Users } from "lucide-react";

export default function Home() {
  const categories = [
    { icon: Cpu, label: "PC Builder", path: "/builder", description: "Build custom PCs with compatibility checking" },
    { icon: Search, label: "Product Finder", path: "/products", description: "Browse and filter thousands of components" },
    { icon: GitCompare, label: "Compare Products", path: "/compare", description: "Side-by-side product comparison" },
    { icon: Package, label: "Pre-Built PCs", path: "/pre-built", description: "Curated ready-to-buy configurations" },
  ];

  const featuredBuilds = [
    {
      id: "1",
      name: "Ultimate Gaming Beast",
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=300&fit=crop",
      price: 2499.99,
      specs: "RTX 4080 • i9-13900K • 32GB DDR5",
      useCase: "Gaming"
    },
    {
      id: "2",
      name: "Creator Workstation",
      imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop",
      price: 3299.99,
      specs: "RTX 4090 • Ryzen 9 7950X • 64GB DDR5",
      useCase: "Creator"
    },
    {
      id: "3",
      name: "Budget Champion",
      imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop",
      price: 899.99,
      specs: "RX 6600 • Ryzen 5 5600 • 16GB DDR4",
      useCase: "Budget"
    },
  ];

  const features = [
    { icon: Shield, title: "Compatibility Check", description: "Real-time validation ensures all parts work together" },
    { icon: Zap, title: "Power Estimation", description: "Accurate power consumption calculations for PSU selection" },
    { icon: Users, title: "Share Builds", description: "Generate links to share your builds with friends" },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LThtMCAwYzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="container relative max-w-screen-2xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-1">
              The Ultimate PC Building Platform
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight" data-testid="text-hero-title">
              Build Your Perfect PC
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              TechScout makes custom PC building easy with real-time compatibility checking, 
              expert recommendations, and thousands of verified components.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link href="/builder">
                <Button size="lg" className="gap-2" data-testid="button-start-building">
                  <Cpu className="h-5 w-5" />
                  Start Building
                </Button>
              </Link>
              <Link href="/guide">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-learn-more">
                  <BookOpen className="h-5 w-5" />
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-screen-2xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.path} href={category.path}>
                <Card className="hover-elevate cursor-pointer h-full" data-testid={`card-category-${category.label.toLowerCase().replace(' ', '-')}`}>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{category.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container max-w-screen-2xl mx-auto px-4 py-16">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Builds</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated PC builds optimized for different use cases and budgets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBuilds.map((build) => (
              <Card key={build.id} className="hover-elevate overflow-hidden" data-testid={`card-featured-build-${build.id}`}>
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={build.imageUrl} 
                    alt={build.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4">
                    {build.useCase}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle>{build.name}</CardTitle>
                  <p className="text-sm text-muted-foreground font-mono">
                    {build.specs}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold font-mono">
                      ${build.price.toLocaleString()}
                    </span>
                    <Link href="/builder">
                      <Button variant="outline">View Build</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container max-w-screen-2xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex gap-4" data-testid={`feature-${idx}`}>
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-md bg-primary flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
