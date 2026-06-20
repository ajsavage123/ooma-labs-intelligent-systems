import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// new workspace/auth pages
import LoginPage from "./pages/Login";
import PartnershipPage from "./pages/Partnership";
import WorkspaceAccess from "./pages/WorkspaceAccess";
import WorkspaceRoutes from "./pages/workspace/WorkspaceRoutes";
import ProductsPage from "./pages/Products";
import FreelancerApplication from "./pages/FreelancerApplication";

// new pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import About from "./pages/About";
import Blog from "./pages/Blog";

import CookieConsent from "./components/CookieConsent";
import ExitIntentModal from "./components/ExitIntentModal";

import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* auth provider wraps entire app so pages can access user state */}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/partnership" element={<PartnershipPage />} />
            <Route path="/workspace-access" element={<WorkspaceAccess />} />
            <Route path="/workspace/*" element={<WorkspaceRoutes />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/freelance" element={<FreelancerApplication />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
          <ExitIntentModal />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
