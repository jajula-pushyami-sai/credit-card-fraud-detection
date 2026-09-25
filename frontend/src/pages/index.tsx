import React, { lazy } from 'react';

// Wrap imports in React.lazy to enforce strict code-splitting per route
export const CustomerDashboard = lazy(() => import('./CustomerDashboard').then(m => ({ default: m.CustomerDashboard })));
export const FraudAnalystWorkspace = lazy(() => import('./FraudAnalystWorkspace').then(m => ({ default: m.FraudAnalystWorkspace })));
export const ExplainabilityStudio = lazy(() => import('./ExplainabilityStudio').then(m => ({ default: m.ExplainabilityStudio })));
export const ModelRegistry = lazy(() => import('./ModelRegistry').then(m => ({ default: m.ModelRegistry })));
export const AnalyticsCenter = lazy(() => import('./AnalyticsCenter').then(m => ({ default: m.AnalyticsCenter })));
export const AlertsCenter = lazy(() => import('./AlertsCenter').then(m => ({ default: m.AlertsCenter })));

export const RiskScoreCalculator = lazy(() => import('./RiskScoreCalculator').then(m => ({ default: m.RiskScoreCalculator })));

// Public Pages
export const PlatformPage = lazy(() => import('./PlatformPage').then(m => ({ default: m.PlatformPage })));
export const PricingPage = lazy(() => import('./PricingPage').then(m => ({ default: m.PricingPage })));
export const AboutPage = lazy(() => import('./AboutPage').then(m => ({ default: m.AboutPage })));
export const ContactPage = lazy(() => import('./ContactPage').then(m => ({ default: m.ContactPage })));
export const LoginPage = lazy(() => import('./LoginPage').then(m => ({ default: m.LoginPage })));


export const Settings = lazy(() => import('./SettingsPage').then(m => ({ default: m.SettingsPage })));
export const UnauthorizedPage = lazy(() => import('./UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })));

export const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
    <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
    <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
    <p className="text-muted-foreground">The module you are looking for does not exist.</p>
  </div>
);

