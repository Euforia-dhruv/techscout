import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Cpu, Search, GitCompare, Package, BookOpen, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: null },
    { path: "/builder", label: "PC Builder", icon: Cpu },
    { path: "/products", label: "Products", icon: Search },
    { path: "/compare", label: "Compare", icon: GitCompare },
    { path: "/pre-built", label: "Pre-Built PCs", icon: Package },
    { path: "/guide", label: "Build Guide", icon: BookOpen },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const isActive = location === item.path;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.path} 
            href={item.path}
            onClick={() => mobile && setOpen(false)}
          >
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={`${mobile ? 'w-full justify-start' : ''} gap-2`}
              data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.label}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-screen-2xl mx-auto px-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate rounded-md px-3 py-2" data-testid="link-home">
            <Cpu className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">TechScout</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <NavLinks />
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" data-testid="button-menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <nav className="flex flex-col gap-2 mt-8">
              <NavLinks mobile />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
