import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Route, Switch } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { store } from "@/store";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Switch>
          <Route path="/" component={Index} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
