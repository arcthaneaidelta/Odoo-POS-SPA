import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map(toast => {
        let icon = <Info size={18} color="var(--accent-primary)" />;
        let className = 'toast toast-info';

        if (toast.type === 'success') {
          icon = <CheckCircle2 size={18} color="var(--state-success)" />;
          className = 'toast toast-success';
        } else if (toast.type === 'error') {
          icon = <AlertCircle size={18} color="var(--state-error)" />;
          className = 'toast toast-error';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle size={18} color="var(--state-warning)" />;
          className = 'toast toast-warning';
        }

        return (
          <div key={toast.id} className={className}>
            <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn-icon"
              style={{ padding: 4, marginTop: -4, marginRight: -4 }}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
