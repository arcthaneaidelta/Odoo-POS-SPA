import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { ToastContainer } from './components/layout/ToastContainer';
import { LandingPage } from './pages/public/LandingPage';
import { PublicSpaBookingPage } from './pages/public/PublicSpaBookingPage';
import { BookingConfirmationPage } from './pages/public/BookingConfirmationPage';
import { OperationsLayout } from './components/layout/OperationsLayout';
import { OperationsOverviewPage } from './pages/app/OperationsOverviewPage';
import { POSPage } from './pages/app/POSPage';
import { RestaurantFloorPlanPage } from './pages/app/RestaurantFloorPlanPage';
import { SpaManagementPage } from './pages/app/SpaManagementPage';
import { GuestsPage } from './pages/app/GuestsPage';
import { FoliosPage } from './pages/app/FoliosPage';
import { PaymentsPage } from './pages/app/PaymentsPage';
import { InvoicingPage } from './pages/app/InvoicingPage';
import { ReportsPage } from './pages/app/ReportsPage';
import { SettingsPage } from './pages/app/SettingsPage';

export function App() {
  const [initialLoading, setInitialLoading] = useState(() => {
    // Only play loading screen on the very first page mount in this session
    const hasLoaded = sessionStorage.getItem('casa_marea_session_loaded');
    return !hasLoaded;
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('casa_marea_session_loaded', 'true');
    setInitialLoading(false);
  };

  return (
    <AppProvider>
      {initialLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <BrowserRouter>
        <Routes>
          {/* Public Experience */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/book-spa" element={<PublicSpaBookingPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />

          {/* Operations Experience */}
          <Route path="/app" element={<OperationsLayout />}>
            <Route index element={<OperationsOverviewPage />} />
            <Route path="pos" element={<POSPage />} />
            <Route path="restaurant" element={<RestaurantFloorPlanPage />} />
            <Route path="spa" element={<SpaManagementPage />} />
            <Route path="guests" element={<GuestsPage />} />
            <Route path="folios" element={<FoliosPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="invoicing" element={<InvoicingPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </AppProvider>
  );
}

export default App;
