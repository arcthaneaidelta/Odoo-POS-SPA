import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Payment } from '../../types';

export const PaymentsPage: React.FC = () => {
  const {
    payments,
    formatPrice,
    generatePaymentLink,
    simulatePaymentStatusChange,
    runDemoReconciliation,
    spaBookings,
    settings,
    t,
    addToast
  } = useApp();
  const isEs = settings.language === 'es';

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
    payments.find(p => p.reconciliationStatus === 'mismatch') || payments[0] || null
  );
  const [filterSource, setFilterSource] = useState<string>('all');
  const [createdLinkUrl, setCreatedLinkUrl] = useState<string | null>(null);

  const successfulCount = payments.filter(p => p.status === 'succeeded').length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const mismatchCount = payments.filter(p => p.reconciliationStatus === 'mismatch').length;
  const totalVolume = payments.filter(p => p.status === 'succeeded').reduce((acc, p) => acc + p.amountMxn, 0);

  const filteredPayments = payments.filter(p => {
    if (filterSource !== 'all' && p.source !== filterSource) return false;
    return true;
  });

  const handleGenerateLink = () => {
    const booking = spaBookings[0];
    const { linkUrl } = generatePaymentLink(booking.id, 1500);
    setCreatedLinkUrl(linkUrl);
  };

  const handleCopyLink = () => {
    if (createdLinkUrl) {
      navigator.clipboard.writeText(createdLinkUrl);
      addToast('success', 'Demo Link Copied', 'Payment link copied to clipboard.');
    }
  };

  const handleSimulateSettlement = (paymentId: string) => {
    simulatePaymentStatusChange(paymentId, 'succeeded');
    const updated = payments.find(p => p.id === paymentId);
    if (updated) setSelectedPayment({ ...updated, status: 'succeeded', reconciliationStatus: 'matched' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{t('paymentsTitle')}</h2>
            <span className="badge badge-teal">Stripe Terminal & Deposits</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: 2 }}>
            Digital payment capture, online deposit links, and automated settlement audit reconciliation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => runDemoReconciliation()} className="btn btn-primary btn-sm">
            <RefreshCw size={14} />
            <span>{t('runReconciliation')}</span>
          </button>
          <button onClick={handleGenerateLink} className="btn btn-secondary btn-sm">
            <LinkIcon size={14} />
            <span>{t('generatePaymentLink')}</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon (PRD Section 12.1) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            Settled Digital Volume
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatPrice(totalVolume)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--state-success)' }}>{successfulCount} succeeded charges</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            Pending Settlements
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--state-warning)' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Awaiting bank capture</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            Reconciliation Flags (Scenario D)
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: mismatchCount > 0 ? 'var(--state-error)' : 'var(--state-success)' }}>
            {mismatchCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: mismatchCount > 0 ? 'var(--state-error)' : 'var(--state-success)' }}>
            Fee discrepancy audit ready
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            Gateway Security
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--state-success)' }}>
            PCI-DSS L1
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Zero credential footprint</div>
        </div>
      </div>

      {/* Generated Demo Link Banner if created */}
      {createdLinkUrl && (
        <div className="card" style={{ padding: '16px', backgroundColor: 'var(--accent-primary-light)', border: '1px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <strong style={{ fontSize: '0.875rem', color: 'var(--accent-primary)' }}>
              Generated Demo Payment Link (Simulated)
            </strong>
            <button onClick={() => setCreatedLinkUrl(null)} className="btn-icon">×</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="text"
              readOnly
              value={createdLinkUrl}
              style={{ flex: 1, backgroundColor: '#FFFFFF', fontSize: '0.8125rem' }}
            />
            <button onClick={handleCopyLink} className="btn btn-primary btn-sm">
              <Copy size={14} />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Payments Table + Detail Inspector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-6)',
          alignItems: 'start'
        }}
        className="payments-layout-grid"
      >
        {/* Payments Table */}
        <div className="table-container">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Payment Ref</th>
                <th>Guest</th>
                <th>Source</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Audit State</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(pay => {
                const isSelected = selectedPayment?.id === pay.id;
                return (
                  <tr
                    key={pay.id}
                    onClick={() => setSelectedPayment(pay)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--accent-primary-light)' : 'transparent'
                    }}
                  >
                    <td>
                      <strong style={{ fontFamily: 'monospace' }}>{pay.paymentRef}</strong>
                    </td>
                    <td>{pay.guestName}</td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                        {pay.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{pay.paymentMethod.toUpperCase()}</td>
                    <td>
                      <strong>{formatPrice(pay.amountMxn)}</strong>
                    </td>
                    <td>
                      <span className={`badge ${pay.status === 'succeeded' ? 'badge-success' : 'badge-warning'}`}>
                        {pay.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${pay.reconciliationStatus === 'matched' ? 'badge-success' : pay.reconciliationStatus === 'mismatch' ? 'badge-error' : 'badge-neutral'}`}>
                        {pay.reconciliationStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {pay.createdAt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Payment Detail Modal / Inspector (PRD Section 12.3 & Scenario D) */}
        {selectedPayment && (
          <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Digital Payment Record</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace' }}>
                  {selectedPayment.paymentRef}
                </h3>
              </div>
              <span className={`badge ${selectedPayment.status === 'succeeded' ? 'badge-success' : 'badge-warning'}`}>
                {selectedPayment.status}
              </span>
            </div>

            {/* Mismatch explanation (Scenario D) */}
            {selectedPayment.reconciliationStatus === 'mismatch' && (
              <div style={{ backgroundColor: 'var(--state-error-bg)', border: '1px solid rgba(172, 98, 90, 0.3)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--state-error)', fontWeight: 700, fontSize: '0.8125rem', marginBottom: 4 }}>
                  <AlertTriangle size={16} />
                  <span>Settlement Discrepancy Flag (Scenario D)</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--state-error)', margin: 0, lineHeight: 1.4 }}>
                  {selectedPayment.mismatchReason || 'Settlement variance between bank processor and internal folio.'}
                </p>
              </div>
            )}

            {/* Metadata breakdown */}
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: '0.8125rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Guest</span>
                  <div style={{ fontWeight: 600 }}>{selectedPayment.guestName}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Source Flow</span>
                  <div style={{ textTransform: 'capitalize' }}>{selectedPayment.source.replace('_', ' ')}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Method</span>
                  <div>{selectedPayment.paymentMethod.toUpperCase()}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Audit Status</span>
                  <div style={{ fontWeight: 600, color: selectedPayment.reconciliationStatus === 'matched' ? 'var(--state-success)' : 'var(--state-error)' }}>
                    {selectedPayment.reconciliationStatus.toUpperCase()}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, marginBottom: 10 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Stripe Charge ID (Simulated):</span>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                  {selectedPayment.providerRef}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Amount Captured:</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--accent-primary)' }}>
                  {formatPrice(selectedPayment.amountMxn)}
                </strong>
              </div>
            </div>

            {/* Actions */}
            {selectedPayment.status === 'pending' && (
              <button
                onClick={() => handleSimulateSettlement(selectedPayment.id)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Simulate Successful Settlement
              </button>
            )}

            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 10 }}>
              * Stripe Webhook events and automated ledger matching simulated locally for client demonstration.
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 992px) {
          .payments-layout-grid {
            grid-template-columns: 1fr 340px !important;
          }
        }
      `}</style>
    </div>
  );
};
