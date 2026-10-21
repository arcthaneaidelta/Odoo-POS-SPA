import React, { useEffect } from 'react';
import { useDemo } from './context/DemoContext';
import { LoadingScreen } from './components/common/LoadingScreen';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { BookingsPage } from './pages/BookingsPage';
import { SessionsPage } from './pages/SessionsPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { ActivityPage } from './pages/ActivityPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const { state, dispatch, navigate } = useDemo();

  // Listen to browser navigation popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path && path !== state.currentRoute) {
        dispatch({ type: 'NAVIGATE', payload: path });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [state.currentRoute, dispatch]);

  // Update browser URL on internal navigate
  useEffect(() => {
    if (window.location.pathname !== state.currentRoute) {
      window.history.pushState(null, '', state.currentRoute);
    }
  }, [state.currentRoute]);

  // Render initial loading screen once per session
  if (!state.hasSeenLoadingScreen) {
    return <LoadingScreen onFinish={() => dispatch({ type: 'DISMISS_LOADING_SCREEN' })} />;
  }

  // Route switcher
  const renderRoute = () => {
    switch (state.currentRoute) {
      case '/dashboard':
        return <DashboardPage />;
      case '/workflows':
        return <WorkflowsPage />;
      case '/bookings':
        return <BookingsPage />;
      case '/sessions':
        return <SessionsPage />;
      case '/simulator':
        return <SimulatorPage />;
      case '/activity':
        return <ActivityPage />;
      case '/settings':
        return <SettingsPage />;
      case '/':
      default:
        return <LandingPage />;
    }
  };

  return <>{renderRoute()}</>;
};
