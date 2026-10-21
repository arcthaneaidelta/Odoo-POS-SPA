import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { ToastContainer } from '../common/Toast';
import { BookingDetailDrawer } from '../modals/BookingDetailDrawer';
import { ResetConfirmModal } from '../modals/ResetConfirmModal';
import { useDemo } from '../../context/DemoContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const { state } = useDemo();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F4F6F8',
      }}
    >
      {/* Navigation Sidebar */}
      <Sidebar onOpenResetModal={() => setIsResetModalOpen(true)} />

      {/* Main Workspace Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflowX: 'hidden',
        }}
      >
        <TopHeader title={title} subtitle={subtitle} />

        <main
          style={{
            flex: 1,
            padding: '1.5rem',
            maxWidth: '1600px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          {children}
        </main>
      </div>

      {/* Slide-over Booking Detail Drawer */}
      <BookingDetailDrawer />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
};
