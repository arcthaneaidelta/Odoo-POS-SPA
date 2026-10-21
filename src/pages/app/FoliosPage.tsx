import React, { useState } from 'react';
import {
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  ExternalLink,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FolioPosting, FolioPostingStatus } from '../../types';

export const FoliosPage: React.FC = () => {
  const {
    folioPostings,
    formatPrice,
    simulatePmsFailure,
    retryFolioPosting,
    t,
    settings,
    addToast
  } = useApp();
  const isEs = settings.language === 'es';

  const [selectedPosting, setSelectedPosting] = useState<FolioPosting | null>(
    folioPostings.find(f => f.status === 'failed') || folioPostings[0] || null
  );
  const [isRetrying, setIsRetrying] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const pendingCount = folioPostings.filter(f => f.status === 'queued').length;
  const postedCount = folioPostings.filter(f => f.status === 'posted').length;
  const failedCount = folioPostings.filter(f => f.status === 'failed').length;
  const totalAmount = folioPostings.reduce((acc, f) => acc + f.amountMxn, 0);

  const filteredPostings = folioPostings.filter(f => {
    if (filterStatus !== 'all' && f.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: FolioPostingStatus) => {
    switch (status) {
      case 'posted':
        return <span className="badge badge-success">{t('postingStatusPosted')}</span>;
      case 'queued':
        return <span className="badge badge-warning">{t('postingStatusQueued')}</span>;
      case 'posting':
        return <span className="badge badge-teal">{t('postingStatusPosting')}</span>;
      case 'failed':
        return <span className="badge badge-error">{t('postingStatusFailed')}</span>;
      case 'requires_review':
        return <span className="badge badge-terracotta">{t('postingStatusReview')}</span>;
    }
  };

  const handleSimulateFailure = (postingId: string) => {
    simulatePmsFailure(postingId);
    const updated = folioPostings.find(f => f.id === postingId);
    if (updated) setSelectedPosting({ ...updated, status: 'failed' });
  };

  const handleRetry = async (postingId: string) => {
    setIsRetrying(true);
    await retryFolioPosting(postingId);
    setIsRetrying(false);
    const updated = folioPostings.find(f => f.id === postingId);
    if (updated) setSelectedPosting({ ...updated, status: 'posted' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{t('foliosTitle')}</h2>
            <span className="badge badge-teal">Scenario C Simulator</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: 2 }}>
            {t('foliosSubtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              const queued = folioPostings.find(f => f.status === 'queued') || folioPostings[0];
              if (queued) handleSimulateFailure(queued.id);
            }}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--state-error)', borderColor: 'rgba(172, 98, 90, 0.3)' }}
          >
            <AlertTriangle size={15} />
            <span>{t('simulateFailure')}</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon (PRD Section 11.1) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            {t('successfulPostings')}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--state-success)' }}>
            {postedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Synchronized cleanly</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            {t('failedPostings')} (Scenario C)
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: failedCount > 0 ? 'var(--state-error)' : 'var(--text-primary)' }}>
            {failedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: failedCount > 0 ? 'var(--state-error)' : 'var(--text-secondary)' }}>
            Awaiting idempotent retry
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            {t('pendingCharges')}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--state-warning)' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>In background queue</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            Total Room Charges
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
            {formatPrice(totalAmount)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Posted across resort outlets</div>
        </div>
      </div>

      {/* Filter Strip */}
      <div style={{ display: 'flex', gap: 6 }}>
        {['all', 'posted', 'failed', 'queued'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {st === 'all' ? 'All Transactions' : st}
          </button>
        ))}
      </div>

      {/* Main Grid: Postings Table vs Detailed Inspector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-6)',
          alignItems: 'start'
        }}
        className="folios-layout-grid"
      >
        {/* Folios Table (PRD Section 11.2) */}
        <div className="table-container">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Posting Ref</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Outlet</th>
                <th>Tx Reference</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Last Attempt</th>
              </tr>
            </thead>
            <tbody>
              {filteredPostings.map(post => {
                const isSelected = selectedPosting?.id === post.id;
                return (
                  <tr
                    key={post.id}
                    onClick={() => setSelectedPosting(post)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--accent-primary-light)' : 'transparent'
                    }}
                  >
                    <td>
                      <strong style={{ fontFamily: 'monospace' }}>{post.postingRef}</strong>
                    </td>
                    <td>{post.guestName}</td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
                        Rm {post.roomNumber}
                      </span>
                    </td>
                    <td>{post.sourceOutlet}</td>
                    <td>
                      <code style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                        {post.transactionRef}
                      </code>
                    </td>
                    <td>
                      <strong>{formatPrice(post.amountMxn)}</strong>
                    </td>
                    <td>{getStatusBadge(post.status)}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {post.lastAttempt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Folio Inspection & Idempotency Inspector (PRD Section 11.4 & 11.5) */}
        {selectedPosting && (
          <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Folio Posting Inspector</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace' }}>
                  {selectedPosting.postingRef}
                </h3>
              </div>
              {getStatusBadge(selectedPosting.status)}
            </div>

            {/* Error Banner if Failed (Scenario C) */}
            {selectedPosting.status === 'failed' && (
              <div
                style={{
                  backgroundColor: 'var(--state-error-bg)',
                  border: '1px solid rgba(172, 98, 90, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  marginBottom: 16
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.8125rem', color: 'var(--state-error)', marginBottom: 4 }}>
                  <AlertTriangle size={16} />
                  <span>PMS Handshake Exception (Demonstration)</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--state-error)', lineHeight: 1.4, margin: 0 }}>
                  {selectedPosting.simulatedFailureReason || 'PMS gateway timeout. Safe retry available without risk of duplication.'}
                </p>
              </div>
            )}

            {/* Payload Metadata Box */}
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: '0.8125rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Guest Target</span>
                  <div style={{ fontWeight: 600 }}>{selectedPosting.guestName}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Room Folio</span>
                  <div style={{ fontWeight: 600 }}>Room {selectedPosting.roomNumber}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Source Outlet</span>
                  <div>{selectedPosting.sourceOutlet}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Tx Origin Ref</span>
                  <div>{selectedPosting.transactionRef}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, marginBottom: 10 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{t('idempotencyKey')}:</span>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--accent-primary)', wordBreak: 'break-all' }}>
                  {selectedPosting.idempotencyKey}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Amount Charged:</span>
                <strong style={{ fontSize: '1.125rem', color: 'var(--accent-primary)' }}>
                  {formatPrice(selectedPosting.amountMxn)}
                </strong>
              </div>
            </div>

            {/* Actions: Retry or Trigger failure */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedPosting.status === 'failed' ? (
                <button
                  onClick={() => handleRetry(selectedPosting.id)}
                  className="btn btn-primary"
                  disabled={isRetrying}
                  style={{ width: '100%', padding: '12px' }}
                >
                  <RotateCcw size={16} className={isRetrying ? 'animate-spin' : ''} />
                  <span>{isRetrying ? 'Retrying Idempotent Posting...' : t('retryPosting')}</span>
                </button>
              ) : selectedPosting.status === 'queued' ? (
                <button
                  onClick={() => handleSimulateFailure(selectedPosting.id)}
                  className="btn btn-secondary"
                  style={{ width: '100%', color: 'var(--state-error)' }}
                >
                  <AlertTriangle size={16} />
                  <span>Trigger Simulated Failure (Scenario C)</span>
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontSize: '0.8125rem', color: 'var(--state-success)', padding: '10px' }}>
                  <CheckCircle2 size={16} />
                  <span>Charge posted & verified on PMS Folio</span>
                </div>
              )}

              <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 4 }}>
                * Local simulation: Production integration would connect to Oracle Opera Cloud / Cloudbeds via verified Odoo webhook middleware.
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 992px) {
          .folios-layout-grid {
            grid-template-columns: 1fr 340px !important;
          }
        }
      `}</style>
    </div>
  );
};
