import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";

// new workspace/auth pages
const LoginPage = lazy(() => import("./pages/Login"));
const PartnershipPage = lazy(() => import("./pages/Partnership"));
const WorkspaceAccess = lazy(() => import("./pages/WorkspaceAccess"));
const WorkspaceRoutes = lazy(() => import("./pages/workspace/WorkspaceRoutes"));
const ProductsPage = lazy(() => import("./pages/Products"));
const FreelancerApplication = lazy(() => import("./pages/FreelancerApplication"));

// new pages
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const NotFound = lazy(() => import("./pages/NotFound"));

import CookieConsent from "./components/CookieConsent";
import QuoteChatWidget from "./components/QuoteChatWidget";

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
          <Suspense fallback={null}>
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
          </Suspense>
          <CookieConsent />
          <QuoteChatWidget />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
