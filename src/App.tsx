import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { AccessibilityProvider } from "@/hooks/useAccessibility";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";

// Lazy loading for pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Cart = lazy(() => import("./pages/Cart"));
const Profile = lazy(() => import("./pages/Profile"));
const Dishes = lazy(() => import("./pages/Dishes"));
const DeliveryTracking = lazy(() => import("./pages/DeliveryTracking"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const LegalNotice = lazy(() => import("./pages/LegalNotice"));
const FAQ = lazy(() => import("./pages/FAQ"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (!['/login', '/register'].includes(location.pathname)) {
      localStorage.setItem('lastVisitedPage', location.pathname);
    }
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AccessibilityProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <PageTracker />
              <Navbar />
              <main className="flex-grow pt-16">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route
                    path="/login"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Login />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Register />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Cart />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Profile />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/dishes"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Dishes />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/delivery-tracking"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <DeliveryTracking />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/terms"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <TermsOfService />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <AboutUs />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/legal"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <LegalNotice />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/faq"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <FAQ />
                      </Suspense>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </AccessibilityProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
