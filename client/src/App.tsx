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
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
