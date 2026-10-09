import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import Home from "@/pages/Home";
import PCBuilder from "@/pages/PCBuilder";
import ProductFinder from "@/pages/ProductFinder";
import ProductComparison from "@/pages/ProductComparison";
import PreBuiltPCs from "@/pages/PreBuiltPCs";
import BuildGuide from "@/pages/BuildGuide";
import SharedBuild from "@/pages/SharedBuild";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/builder" component={PCBuilder} />
      <Route path="/products" component={ProductFinder} />
      <Route path="/compare" component={ProductComparison} />
      <Route path="/pre-built" component={PreBuiltPCs} />
      <Route path="/guide" component={BuildGuide} />
      <Route path="/build/:id" component={SharedBuild} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          <footer className="border-t border-white/10 py-4">
            <div className="mx-auto flex max-w-7xl justify-center px-4">
              <a
                href="https://ventriee.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Designed and developed by Ventriee"
              >
                Designed &amp; Developed by
                <img src="/ventriee-emblem.png" alt="VENTRIEE" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
              </a>
            </div>
          </footer>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
