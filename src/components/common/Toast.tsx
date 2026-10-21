import React, { useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { state, removeToast } = useDemo();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        maxWidth: '400px',
        width: 'calc(100% - 3rem)',
        pointerEvents: 'none',
      }}
    >
      {state.toasts.map((toast) => (
        <ToastItemCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemCardProps {
  toast: {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
  };
  onDismiss: () => void;
}

const ToastItemCard: React.FC<ToastItemCardProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} color="#16A34A" />;
      case 'warning':
        return <AlertTriangle size={18} color="#D97706" />;
      case 'error':
        return <AlertCircle size={18} color="#DC2626" />;
      case 'info':
      default:
        return <Info size={18} color="#0284C7" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return '#BBF7D0';
      case 'warning':
        return '#FDE68A';
      case 'error':
        return '#FECACA';
      case 'info':
      default:
        return '#BAE6FD';
    }
  };

  return (
    <div
      style={{
        pointerEvents: 'auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        padding: '0.9rem 1.1rem',
        boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.12), 0 4px 6px -4px rgba(15, 23, 42, 0.06)',
        border: `1px solid ${getBorderColor()}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        animation: 'fadeIn 200ms ease-out',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
          {toast.title}
        </h4>
        <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.15rem', lineHeight: 1.4 }}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={onDismiss}
        style={{
          color: '#94A3B8',
          padding: '2px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Dismiss toast"
      >
        <X size={15} />
      </button>
    </div>
  );
};
