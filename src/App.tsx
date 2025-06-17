import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StripeProvider } from './contexts/StripeContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { ComingSoonSection } from './components/ComingSoonSection';
import { Footer } from './components/Footer';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { ProductsPage } from './pages/dashboard/ProductsPage';
import { SubscriptionsPage } from './pages/dashboard/SubscriptionsPage';
import { ContactPage } from './pages/dashboard/ContactPage';
import { AccountPage } from './pages/dashboard/AccountPage';
import { DocumentationPage } from './pages/dashboard/DocumentationPage';

function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CapabilitiesSection />
      <ComingSoonSection />
      <Footer />
    </>
  );
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Enhanced callback handler for auth redirects from external sites
function AuthCallback() {
  const { user, isLoading } = useAuth();
  const [waitCount, setWaitCount] = React.useState(0);
  
  // Force redirect after timeout even if loading doesn't complete
  React.useEffect(() => {
    console.log('Auth callback mounted, redirecting soon...');
    
    // Increment counter to force a redirect after some time
    const timer = setInterval(() => {
      setWaitCount(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Force redirect after 3 seconds regardless of loading state
  React.useEffect(() => {
    if (waitCount >= 3) {
      console.log('Forcing dashboard redirect after timeout');
      return;
    }
  }, [waitCount]);
  
  if (isLoading && waitCount < 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
        <p className="text-sm text-gray-500 mt-2">Redirecting in {3 - waitCount} seconds</p>
      </div>
    );
  }

  console.log('Auth callback redirecting to dashboard');
  return <Navigate to="/dashboard" replace />;
}

// Component to handle stuck authentication states
function AuthStateRecovery() {
  const { user, isLoading } = useAuth();
  
  React.useEffect(() => {
    // Check URL parameters for signs of returning from an external site
    const params = new URLSearchParams(window.location.search);
    const fromExternal = params.has('success') || params.has('canceled') ||
                         params.has('checkout') || params.has('stripe');
    
    if (fromExternal) {
      console.log('Detected return from external site, ensuring auth state is recovered');
      // Force a page refresh if needed to recover auth state
      if (isLoading && !user) {
        console.log('Refreshing page to recover auth state');
        // You could force reload here if needed:
        // window.location.reload();
      }
    }
  }, [user, isLoading]);
  
  return null; // This is just a background effect component
}

export function App() {
  return (
    <AuthProvider>
      <StripeProvider>
        <BrowserRouter>
          <div className="min-h-screen font-sans text-gray-900">
            <AuthStateRecovery />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/products"
                element={
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/subscriptions"
                element={
                  <ProtectedRoute>
                    <SubscriptionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/contact"
                element={
                  <ProtectedRoute>
                    <ContactPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/documentation"
                element={
                  <ProtectedRoute>
                    <DocumentationPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </StripeProvider>
    </AuthProvider>
  );
}