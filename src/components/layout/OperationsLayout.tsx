import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { OperationsSidebar } from './OperationsSidebar';
import { OperationsHeader } from './OperationsHeader';

export const OperationsLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Sidebar */}
      <OperationsSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        <OperationsHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1, padding: 'var(--space-6)' }}>
          <div style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
