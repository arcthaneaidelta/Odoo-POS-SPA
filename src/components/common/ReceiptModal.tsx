import React from 'react';
import { Printer, Download, X, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Order } from '../../types';
import { useApp } from '../../context/AppContext';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
  onNewOrder: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose, onNewOrder }) => {
  const { formatPrice, t, settings } = useApp();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `
========================================
             CASA MAREA
  Luxury Resort & Spa - Baja Sur
========================================
Terminal: ${order.outletName}
Order Ref: ${order.orderNumber}
Date: ${order.createdAt}
Server: ${order.serverName}
${order.roomNumber ? `Room Number: ${order.roomNumber} (${order.guestName})` : ''}
----------------------------------------
${order.lines.map(l => `${l.quantity}x ${l.productName.padEnd(24)} ${formatPrice(l.subtotalMxn)}`).join('\n')}
----------------------------------------
Subtotal:              ${formatPrice(order.subtotalMxn)}
IVA (16%):             ${formatPrice(order.taxMxn)}
Service Charge (10%):  ${formatPrice(order.serviceChargeMxn)}
Voluntary Gratuity:    ${formatPrice(order.tipMxn)}
========================================
TOTAL:                 ${formatPrice(order.totalMxn)}
Method:                ${order.paymentMethod?.toUpperCase()}
========================================
* DEMO FISCAL RECEIPT - NOT A TAX CFDI *
  IoT Hardware & Epson ESC/POS simulated
========================================
    `;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${order.orderNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={18} color="var(--state-success)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{t('receiptTitle')}</h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Printable Receipt Paper Body */}
        <div className="modal-body" style={{ backgroundColor: 'var(--bg-main)', padding: '20px' }}>
          <div
            className="printable-receipt"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              fontFamily: 'monospace',
              fontSize: '0.8125rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '0.12em', fontFamily: 'var(--font-heading)' }}>
                CASA MAREA
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#777A73', textTransform: 'uppercase' }}>
                Baja California Sur · México
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#777A73', marginTop: 2 }}>
                {order.outletName}
              </div>
            </div>

            {/* Meta */}
            <div style={{ borderTop: '1px dashed #D5CFBD', borderBottom: '1px dashed #D5CFBD', padding: '8px 0', margin: '12px 0', fontSize: '0.75rem', lineHeight: 1.5 }}>
              <div><strong>{t('orderNumber')}:</strong> {order.orderNumber}</div>
              <div><strong>{t('date')}:</strong> {order.createdAt}</div>
              {order.tableNumber && <div><strong>Table:</strong> {order.tableNumber}</div>}
              <div><strong>{t('server')}:</strong> {order.serverName}</div>
              {order.roomNumber && (
                <div style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                  <strong>Folio Target:</strong> Room {order.roomNumber} ({order.guestName})
                </div>
              )}
            </div>

            {/* Items */}
            <div style={{ marginBottom: 12 }}>
              {order.lines.map(line => (
                <div key={line.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>{line.quantity}x {line.productName}</span>
                  <span>{formatPrice(line.subtotalMxn)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ borderTop: '1px dashed #D5CFBD', paddingTop: 8, fontSize: '0.75rem', lineHeight: 1.6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t('subtotal')}:</span>
                <span>{formatPrice(order.subtotalMxn)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t('tax')}:</span>
                <span>{formatPrice(order.taxMxn)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t('serviceCharge')}:</span>
                <span>{formatPrice(order.serviceChargeMxn)}</span>
              </div>
              {order.tipMxn > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t('tip')}:</span>
                  <span>{formatPrice(order.tipMxn)}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  borderTop: '1px solid #292D2C',
                  marginTop: 6,
                  paddingTop: 6
                }}
              >
                <span>{t('total')}:</span>
                <span>{formatPrice(order.totalMxn)}</span>
              </div>
            </div>

            {/* Payment Method & Hardware Note */}
            <div style={{ textAlign: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px dashed #D5CFBD', fontSize: '0.6875rem', color: '#777A73' }}>
              <div>Settlement: {order.paymentMethod?.toUpperCase()}</div>
              <div className="demo-watermark" style={{ marginTop: 8, fontSize: '0.625rem' }}>
                DEMO RECEIPT · IOT PRINTER SIMULATED
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handlePrint} className="btn btn-secondary btn-sm" title="Print POS receipt">
              <Printer size={14} />
              <span>{t('printReceipt')}</span>
            </button>
            <button onClick={handleDownload} className="btn btn-secondary btn-sm" title="Download text slip">
              <Download size={14} />
              <span>TXT</span>
            </button>
          </div>

          <button onClick={onNewOrder} className="btn btn-primary btn-sm">
            <PlusCircle size={14} />
            <span>{t('newOrder')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
