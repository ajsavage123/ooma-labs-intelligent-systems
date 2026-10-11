import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Client Portal Pages
const ClientPortal = lazy(() => import("./pages/portal/ClientPortal"));
const ClientPortalLogin = lazy(() => import("./pages/portal/ClientPortalLogin"));
const PortalAdminManager = lazy(() => import("./pages/portal/PortalAdminManager"));
const FreeQuotationPage = lazy(() =>
  import("./pages/FreeQuotationPage").then((module) => ({ default: module.FreeQuotationPage }))
);

import CookieConsent from "./components/CookieConsent";
import QuoteChatWidget from "./components/QuoteChatWidget";

import { AuthProvider } from "./context/AuthContext";
import { ClientPortalProvider } from "./context/ClientPortalContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* auth provider wraps entire app so pages can access user state */}
      <AuthProvider>
        <ClientPortalProvider>
          <BrowserRouter>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/portal" element={<ClientPortal />} />
                <Route path="/portal/login" element={<ClientPortalLogin />} />
                <Route path="/portal/admin" element={<PortalAdminManager />} />
                <Route path="/free-quotation" element={<FreeQuotationPage />} />
                <Route path="/quotation" element={<Navigate to="/free-quotation" replace />} />
                <Route path="/client-portal" element={<Navigate to="/portal" replace />} />
                <Route path="/partnership" element={<Navigate to="/" replace />} />
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
        </ClientPortalProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
