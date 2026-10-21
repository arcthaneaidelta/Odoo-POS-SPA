import { Route, Routes } from 'react-router-dom';
import { PortalEntryProvider, IntroLoader, ScrollManager } from './components/Transitions';
import { PublicLayout } from './components/public/PublicLayout';
import Landing from './pages/Landing';
import { ContactPage, HowItWorksPage, NotFoundPage, ServicesPage } from './pages/PublicPages';

export default function App() {
  return (
    <PortalEntryProvider>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollManager />
      <IntroLoader />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PortalEntryProvider>
  );
}
