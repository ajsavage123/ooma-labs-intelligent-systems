import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";

// new workspace/auth pages
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
const ClientOnboarding = lazy(() => import("./pages/portal/ClientOnboarding"));
const PortalAdminManager = lazy(() => import("./pages/portal/PortalAdminManager"));
const FreeQuotationPage = lazy(() =>
  import("./pages/FreeQuotationPage").then((module) => ({ default: module.FreeQuotationPage }))
);

import CookieConsent from "./components/CookieConsent";
import QuoteChatWidget from "./components/QuoteChatWidget";
import PageLoadingFallback from "./components/PageLoadingFallback";
import AuthRedirectHandler from "./components/AuthRedirectHandler";
import ErrorBoundary from "./components/ErrorBoundary";

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
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthRedirectHandler />
            <ErrorBoundary>
              <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Navigate to="/portal/login" replace />} />
                <Route path="/portal" element={<ClientPortal />} />
                <Route path="/portal/login" element={<ClientPortalLogin />} />
                <Route path="/portal/onboarding" element={<ClientOnboarding />} />
                <Route path="/portal/admin" element={<PortalAdminManager />} />
                <Route path="/admin" element={<Navigate to="/portal/admin" replace />} />
                <Route path="/free-quotation" element={<FreeQuotationPage />} />
                <Route path="/quotation" element={<Navigate to="/free-quotation" replace />} />
                <Route path="/client-portal" element={<Navigate to="/portal" replace />} />
                <Route path="/workspace" element={<Navigate to="/portal" replace />} />
                <Route path="/workspace/*" element={<Navigate to="/portal" replace />} />
                <Route path="/workspace-access" element={<Navigate to="/portal/login" replace />} />
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
          </ErrorBoundary>
          <CookieConsent />
          <QuoteChatWidget />
        </BrowserRouter>
        </ClientPortalProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
