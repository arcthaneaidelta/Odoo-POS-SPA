import { useState } from 'react';
import { FileCheck, CheckCircle2, Eye, PenLine } from 'lucide-react';
import { useDemo } from '../../state/DemoProvider';
import type { Agreement } from '../../state/types';
import { PageHeader, StatusBadge } from '../../components/ui/Feedback';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Dialog';
import { TextField, CheckboxField } from '../../components/ui/Fields';
import { AGREEMENT_SECTIONS } from '../../content/site';
import { formatShortDate } from '../../lib/dates';
import { useToast } from '../../components/ui/Toast';

export default function Agreements() {
  const { state, dispatch } = useDemo();
  const { toast } = useToast();

  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [typedSignature, setTypedSignature] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);
  const [error, setError] = useState('');

  const handleOpenAgreement = (ag: Agreement) => {
    setSelectedAgreement(ag);
    setTypedSignature(ag.acknowledgedBy || '');
    setHasReviewed(ag.status === 'completed');
    setError('');
  };

  const handleAcknowledge = () => {
    if (!selectedAgreement) return;
    if (!hasReviewed) {
      setError('Please review and check the acknowledgment statement.');
      return;
    }
    if (!typedSignature.trim()) {
      setError('Please type your full legal name to acknowledge.');
      return;
    }

    dispatch({
      type: 'AGREEMENT_ACK',
      id: selectedAgreement.id,
      name: typedSignature.trim()
    });

    toast({
      tone: 'success',
      title: 'Agreement Acknowledged',
      message: `${selectedAgreement.title} recorded in demo state.`
    });
    setSelectedAgreement(null);
  };

  return (
    <div className="portal-page-container">
      <PageHeader
        eyebrow="Service Agreements"
        title="Client Service Agreements"
        description="Review proposed care navigation arrangements, responsibilities, and non-clinical acknowledgments."
      />

      <div className="agreements-list stack" style={{ gap: '16px' }}>
        {state.agreements.map((ag) => {
          const isDone = ag.status === 'completed';
          const isReady = ag.status === 'ready';

          return (
            <div key={ag.id} className="card agreement-card row row--between">
              <div className="agreement-main">
                <div className="row" style={{ gap: '10px', marginBottom: '6px' }}>
                  <FileCheck size={20} className="muted" />
                  <h2 className="agreement-card-title">{ag.title}</h2>
                  <span className="small muted">({ag.version})</span>
                </div>
                <p className="small muted agreement-card-summary">{ag.summary}</p>
                <div className="agreement-meta row small muted">
                  <span>Issued: {formatShortDate(ag.issued)}</span>
                  {ag.acknowledgedAt && (
                    <span>· Acknowledged by {ag.acknowledgedBy}</span>
                  )}
                </div>
              </div>

              <div className="agreement-action row" style={{ gap: '16px' }}>
                <StatusBadge tone={isDone ? 'sage' : isReady ? 'sand' : 'neutral'}>
                  {isDone ? 'Completed' : isReady ? 'Needs Review' : 'Awaiting Review'}
                </StatusBadge>
                <Button
                  variant={isDone ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => handleOpenAgreement(ag)}
                  icon={isDone ? <Eye size={14} /> : <PenLine size={14} />}
                >
                  {isDone ? 'View Agreement' : 'Review & Acknowledge'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agreement Document Modal */}
      {selectedAgreement && (
        <Modal
          open={!!selectedAgreement}
          onClose={() => setSelectedAgreement(null)}
          title={selectedAgreement.title}
          description={`Version ${selectedAgreement.version} · Issued ${formatShortDate(selectedAgreement.issued)}`}
          size="lg"
          footer={
            selectedAgreement.status === 'completed' ? (
              <Button onClick={() => setSelectedAgreement(null)}>
                Close
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setSelectedAgreement(null)}>
                  Review Later
                </Button>
                <Button onClick={handleAcknowledge}>
                  Acknowledge Demo Agreement
                </Button>
              </>
            )
          }
        >
          <div className="agreement-doc-view stack" style={{ gap: '24px' }}>
            <div className="agreement-doc-paper">
              <div className="doc-watermark">Havenwell Demo</div>

              {AGREEMENT_SECTIONS.map((sec) => (
                <div key={sec.heading} className="doc-section">
                  <h3 className="doc-sec-heading">{sec.heading}</h3>
                  <p className="doc-sec-body">{sec.body}</p>
                </div>
              ))}
            </div>

            {/* Acknowledgment Box */}
            <div className="acknowledgment-box card card--sage">
              <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>
                Simulated Client Acknowledgment
              </h4>
              <p className="small muted" style={{ marginBottom: '16px' }}>
                This is an illustrative demonstration and not a legally binding electronic signature.
              </p>

              {selectedAgreement.status === 'completed' ? (
                <div className="row" style={{ color: 'var(--olive)', fontWeight: 550 }}>
                  <CheckCircle2 size={18} />
                  <span>Acknowledged by {selectedAgreement.acknowledgedBy}</span>
                </div>
              ) : (
                <div className="stack" style={{ gap: '14px' }}>
                  <CheckboxField
                    label={
                      <span>
                        I have read and agree to the sample service terms and non-clinical scope described above.
                      </span>
                    }
                    checked={hasReviewed}
                    onChange={setHasReviewed}
                  />

                  <TextField
                    label="Type your full name to acknowledge"
                    value={typedSignature}
                    onChange={setTypedSignature}
                    placeholder="e.g. Alex Morgan"
                    error={error}
                  />
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
