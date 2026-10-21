import { useState } from 'react';
import {
  CreditCard,
  Download,
  Receipt,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useDemo } from '../../state/DemoProvider';
import type { Invoice } from '../../state/types';
import { PageHeader, StatusBadge } from '../../components/ui/Feedback';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Dialog';
import { RadioCards } from '../../components/ui/Fields';
import { formatCurrency, formatShortDate } from '../../lib/dates';
import { buildPdf, downloadBlob } from '../../lib/pdf';
import { useToast } from '../../components/ui/Toast';

export default function Payments() {
  const { state, dispatch } = useDemo();
  const { toast } = useToast();

  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('Demo Card ending in 4242');
  const [processing, setProcessing] = useState(false);
  const [testDecline, setTestDecline] = useState(false);

  const outstanding = state.invoices
    .filter((i) => i.status === 'outstanding')
    .reduce((sum, i) => sum + i.amount, 0);

  const handleSimulatePayment = () => {
    if (!payingInvoice) return;
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      if (testDecline) {
        dispatch({
          type: 'PAY_DECLINED',
          id: payingInvoice.id,
          method: selectedMethod
        });
        toast({
          tone: 'error',
          title: 'Simulated Payment Declined',
          message: 'The card issuer declined the test transaction.'
        });
      } else {
        dispatch({
          type: 'PAY',
          id: payingInvoice.id,
          method: selectedMethod
        });
        toast({
          tone: 'success',
          title: 'Payment Successful',
          message: `Invoice ${payingInvoice.id} is now marked as Paid.`
        });
        setPayingInvoice(null);
      }
    }, 900);
  };

  const handleDownloadInvoice = (inv: Invoice) => {
    const blob = buildPdf(`Invoice ${inv.id}`, [
      { kind: 'h', text: `Invoice: ${inv.id}` },
      { kind: 'p', text: `Description: ${inv.description}` },
      { kind: 'p', text: `Amount: $${inv.amount}.00 USD` },
      { kind: 'p', text: `Issued Date: ${inv.issued}` },
      { kind: 'p', text: `Due Date: ${inv.due}` },
      { kind: 'p', text: `Status: ${inv.status.toUpperCase()}` },
      { kind: 'h', text: 'Notice' },
      { kind: 'p', text: 'This invoice is an illustrative demonstration prototype. No real payment processing or financial transaction has occurred.' }
    ]);
    downloadBlob(blob, `Invoice-${inv.id}.pdf`);
    toast({
      tone: 'info',
      title: 'Invoice Downloaded',
      message: `Generated local PDF for ${inv.id}.`
    });
  };

  return (
    <div className="portal-page-container">
      <PageHeader
        eyebrow="Billing & Invoices"
        title="Payment & Invoices"
        description="Review care coordination packages, past receipts, and simulated payment transactions."
      />

      {/* Financial Summary Cards */}
      <div className="billing-summary-grid">
        <div className="card card--sand">
          <span className="small muted">Outstanding Balance</span>
          <h2 className="display" style={{ fontSize: '36px', marginTop: '4px' }}>
            {formatCurrency(outstanding)}
          </h2>
          <span className="small muted">
            {outstanding > 0 ? 'Due across pending invoices' : 'All accounts are current'}
          </span>
        </div>

        <div className="card">
          <span className="small muted">Total Invoices</span>
          <h2 className="display" style={{ fontSize: '36px', marginTop: '4px' }}>
            {state.invoices.length}
          </h2>
          <span className="small muted">
            {state.invoices.filter((i) => i.status === 'paid').length} Paid in full
          </span>
        </div>

        <div className="card card--sage">
          <span className="small muted">Payment Environment</span>
          <div className="row" style={{ marginTop: '8px', color: 'var(--olive)', fontWeight: 600 }}>
            <ShieldAlert size={18} />
            <span>Interactive Demo Sandbox</span>
          </div>
          <span className="small muted">No actual payment credentials collected</span>
        </div>
      </div>

      {/* Invoices List */}
      <section className="card" style={{ marginTop: '28px' }}>
        <div className="card__head">
          <h2 className="card__title">Invoices</h2>
        </div>

        <div className="invoices-list stack" style={{ gap: '16px' }}>
          {state.invoices.map((inv) => {
            const isPaid = inv.status === 'paid';

            return (
              <div key={inv.id} className="invoice-row row row--between">
                <div className="invoice-meta">
                  <div className="row" style={{ gap: '10px' }}>
                    <Receipt size={18} className="muted" />
                    <strong>{inv.id}</strong>
                    <span className="small muted">· {inv.title}</span>
                  </div>
                  <div className="small muted" style={{ marginTop: '4px' }}>
                    Issued {formatShortDate(inv.issued)} · Due {formatShortDate(inv.due)}
                    {inv.paidAt && ` · Paid ${formatShortDate(inv.paidAt.slice(0, 10))}`}
                  </div>
                </div>

                <div className="invoice-actions row" style={{ gap: '14px' }}>
                  <div className="invoice-amount" style={{ textAlign: 'right' }}>
                    <strong>{formatCurrency(inv.amount)}</strong>
                    <div>
                      <StatusBadge tone={isPaid ? 'sage' : 'sand'}>
                        {isPaid ? 'Paid' : 'Outstanding'}
                      </StatusBadge>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Download size={14} />}
                    onClick={() => handleDownloadInvoice(inv)}
                    title="Download PDF"
                  >
                    PDF
                  </Button>

                  {!isPaid && (
                    <Button
                      size="sm"
                      onClick={() => setPayingInvoice(inv)}
                      iconAfter={<ArrowRight size={14} />}
                    >
                      Pay Demo Invoice
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Transaction History */}
      <section className="card" style={{ marginTop: '24px' }}>
        <div className="card__head">
          <h2 className="card__title">Recent Transactions</h2>
        </div>
        <div className="tx-list stack" style={{ gap: '12px' }}>
          {state.transactions.map((tx) => (
            <div key={tx.id} className="row row--between small" style={{ padding: '8px 0', borderBottom: '1px solid var(--mist)' }}>
              <div>
                <strong>Payment for {tx.invoiceId}</strong>
                <span className="muted"> via {tx.method}</span>
              </div>
              <div className="row" style={{ gap: '12px' }}>
                <span>{formatCurrency(tx.amount)}</span>
                <StatusBadge tone={tx.status === 'succeeded' ? 'sage' : 'alert'}>
                  {tx.status === 'succeeded' ? 'Succeeded' : 'Declined'}
                </StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Checkout Modal */}
      {payingInvoice && (
        <Modal
          open={!!payingInvoice}
          onClose={() => setPayingInvoice(null)}
          title={`Pay Invoice ${payingInvoice.id}`}
          description={`Amount due: ${formatCurrency(payingInvoice.amount)} for ${payingInvoice.title}`}
          size="md"
          footer={
            <>
              <Button variant="ghost" onClick={() => setPayingInvoice(null)} disabled={processing}>
                Cancel
              </Button>
              <Button onClick={handleSimulatePayment} loading={processing} icon={<CreditCard size={15} />}>
                Simulate Successful Payment
              </Button>
            </>
          }
        >
          <div className="checkout-body stack" style={{ gap: '20px' }}>
            <div className="callout callout--privacy">
              <ShieldAlert size={18} />
              <span>
                <strong>Simulated Checkout:</strong> This sandbox does not connect to any live payment gateway. No real credit card information is collected or processed.
              </span>
            </div>

            <RadioCards
              legend="Select Demo Payment Method"
              required
              options={[
                'Demo Card ending in 4242',
                'Simulated Bank Account (ACH)',
                'Demo Corporate Retainer'
              ]}
              value={selectedMethod}
              onChange={setSelectedMethod}
            />

            <div className="test-toggle card" style={{ padding: '12px 16px', background: '#f8f8f6' }}>
              <label className="row small" style={{ cursor: 'pointer', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={testDecline}
                  onChange={(e) => setTestDecline(e.target.checked)}
                />
                <span>Simulate a <strong>declined payment</strong> to test error handling</span>
              </label>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
