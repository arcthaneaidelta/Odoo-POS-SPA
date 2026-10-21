import { Route, Routes, Navigate } from 'react-router-dom';
import { PortalEntryProvider, IntroLoader, ScrollManager } from './components/Transitions';
import { PublicLayout } from './components/public/PublicLayout';
import Landing from './pages/Landing';
import { ContactPage, HowItWorksPage, NotFoundPage, ServicesPage } from './pages/PublicPages';

// Portal & Admin Views
import { PortalLayout } from './components/portal/PortalLayout';
import Login from './pages/portal/Login';
import Dashboard from './pages/portal/Dashboard';
import Onboarding from './pages/portal/Onboarding';
import Forms from './pages/portal/Forms';
import Agreements from './pages/portal/Agreements';
import Payments from './pages/portal/Payments';
import Schedule from './pages/portal/Schedule';
import Messages from './pages/portal/Messages';
import Roadmap from './pages/portal/Roadmap';
import Tasks from './pages/portal/Tasks';
import Documents from './pages/portal/Documents';
import Admin from './pages/portal/Admin';

export default function App() {
  return (
    <PortalEntryProvider>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollManager />
      <IntroLoader />
      <Routes>
        {/* Public Website */}
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Demo Authentication */}
        <Route path="portal/login" element={<Login />} />

        {/* Client Portal Shell & Subroutes */}
        <Route path="portal" element={<PortalLayout />}>
          <Route index element={<Navigate to="/portal/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="forms" element={<Forms />} />
          <Route path="agreements" element={<Agreements />} />
          <Route path="payments" element={<Payments />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="messages" element={<Messages />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="documents" element={<Documents />} />
        </Route>

        {/* Operations Dashboard */}
        <Route path="admin" element={<Admin />} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PortalEntryProvider>
  );
}
