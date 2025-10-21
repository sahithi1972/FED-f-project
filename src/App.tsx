import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./contexts/auth-context";
import { AuthModalProvider } from "./contexts/auth-modal-context";
import { Toaster } from "./components/ui/toaster";
import { ChatbotWidget } from "./components/ChatbotWidget";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PageTransition } from "./components/PageTransition";
import { Spinner } from "./components/ui/spinner";
import Index from "./pages/index";
import NotFound from "./pages/Notfound";
import HowItWorks from "./pages/how-it-works";

// Lazy loaded routes
const LazyDashboard = React.lazy(() => import("./pages/dashboard"));
const LazyProfile = React.lazy(() => import("./pages/profile"));
const LazyRecipes = React.lazy(() => import("./pages/recipes"));

const queryClient = new QueryClient();

function LoadingFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center p-4">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <pre className="text-sm bg-red-100 p-4 rounded">
              {this.state.error?.message}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route 
          path="/recipes" 
          element={
            <PageTransition>
              <React.Suspense fallback={<LoadingFallback />}>
                <LazyRecipes />
              </React.Suspense>
            </PageTransition>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PageTransition>
                <React.Suspense fallback={<LoadingFallback />}>
                  <LazyDashboard />
                </React.Suspense>
              </PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <PageTransition>
                <React.Suspense fallback={<LoadingFallback />}>
                  <LazyProfile />
                </React.Suspense>
              </PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/how-it-works" 
          element={
            <PageTransition>
              <HowItWorks />
            </PageTransition>
          } 
        />
        <Route 
          path="*" 
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AuthModalProvider>
              <AnimatedRoutes />
              <ChatbotWidget />
              <Toaster />
            </AuthModalProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
