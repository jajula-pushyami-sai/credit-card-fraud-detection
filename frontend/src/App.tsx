import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';
import React, { Suspense, lazy, useEffect } from 'react';
import { GlobalLoader } from '@/components/layout/GlobalLoader';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useThemeStore } from '@/store/themeStore';

const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const LandingPage = lazy(() => import('@/pages/LandingPage').then(m => ({ default: m.LandingPage })));
import { 
  CustomerDashboard,
  NotFound,
  Settings,
  PlatformPage,
  PricingPage,
  AboutPage,
  ContactPage,
  LoginPage,
  RiskScoreCalculator,
  UnauthorizedPage
} from '@/pages/index';

import { AcademicModeProvider } from '@/core/context/AcademicModeContext';

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.25 }}
    className="w-full min-h-screen"
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  const { isDarkMode } = useThemeStore();

  // Sync themeStore state to document root on mount & updates
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <AcademicModeProvider>
      <Suspense fallback={<GlobalLoader />}>
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname.split('/')[1] || '/'}>
              {/* Public Routes */}
              <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
              <Route path="/platform" element={<PageTransition><PlatformPage /></PageTransition>} />
              <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
              <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
              <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
              <Route path="/register" element={<PageTransition><LoginPage /></PageTransition>} />
              
              {/* Authenticated Dashboard Routes */}
              <Route element={<ProtectedRoute><PageTransition><DashboardLayout /></PageTransition></ProtectedRoute>}>
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/calculate" element={<RiskScoreCalculator />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                <Route path="*" element={<CustomerDashboard />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </ErrorBoundary>
      </Suspense>
    </AcademicModeProvider>
  );
}

export default App;
