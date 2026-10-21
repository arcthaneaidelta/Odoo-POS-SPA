import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useDemo } from '../../context/DemoContext';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ isOpen, onClose }) => {
  const { resetAllData } = useDemo();

  const handleConfirm = () => {
    resetAllData();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Demo State & Restore Seed Data"
      subtitle="Revert all changes to the original prototype configuration"
      maxWidth="500px"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleConfirm}
            iconLeft={<RotateCcw size={14} />}
          >
            Confirm & Reset State
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div
          style={{
            backgroundColor: '#FEF2F2',
            borderRadius: '10px',
            padding: '1rem',
            border: '1px solid #FEE2E2',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}
        >
          <AlertTriangle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.84rem', color: '#991B1B', lineHeight: 1.45 }}>
            <strong>This action will clear your browser’s localStorage cache:</strong>
            <ul style={{ marginTop: '0.4rem', paddingLeft: '1.2rem', listStyle: 'disc' }}>
              <li>Reset all 4 deterministic simulation metrics to baseline</li>
              <li>Restore the 574 seed bookings and status classifications</li>
              <li>Restore default browser worker nodes & proxy assignments</li>
              <li>Reset operational tasks and clear simulated audit logs</li>
            </ul>
          </div>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5 }}>
          This is recommended if you wish to rehearse a fresh, deterministic presentation from scratch with prospective clients.
        </p>
      </div>
    </Modal>
  );
};
