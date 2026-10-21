import React, { useState } from 'react';
import {
  FileText,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Download,
  Building,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceStatus } from '../../types';

export const InvoicingPage: React.FC = () => {
  const {
    invoices,
    orders,
    formatPrice,
    validateCfdi,
    createInvoice,
    simulateTimbrado,
    settings,
    t,
    addToast
  } = useApp();
  const isEs = settings.language === 'es';

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoices[0] || null);
  const [isCreating, setIsCreating] = useState(false);
  const [isTimbrando, setIsTimbrando] = useState(false);

  // Form state for creating a new invoice (Scenario E)
  const [selectedOrderRef, setSelectedOrderRef] = useState<string>(orders[0]?.orderNumber || '');
  const [guestName, setGuestName] = useState('Elena Rostova');
  const [rfc, setRfc] = useState('ROSE851120HR1');
  const [legalName, setLegalName] = useState('ELENA ROSTOVA SERVICIOS INTERNACIONALES SA DE CV');
  const [postalCode, setPostalCode] = useState('23405');
  const [taxRegime, setTaxRegime] = useState('601 - General de Ley Personas Morales');
  const [cfdiUse, setCfdiUse] = useState('G03 - Gastos en general');
  const [paymentMethod, setPaymentMethod] = useState<'PUE' | 'PPD'>('PUE');
  const [paymentForm, setPaymentForm] = useState<'01' | '04' | '28'>('04');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const handleValidateAndCreate = async () => {
    const check = validateCfdi(rfc, legalName, postalCode, taxRegime);
    if (!check.valid) {
      setFormErrors(check.errors);
      return;
    }
    setFormErrors([]);

    const matchedOrder = orders.find(o => o.orderNumber === selectedOrderRef) || orders[0];
    const subtotal = matchedOrder ? matchedOrder.subtotalMxn : 1500;
    const iva = Number((subtotal * 0.16).toFixed(2));
    const total = Number((subtotal + iva).toFixed(2));

    const newInv = await createInvoice({
      sourceRef: matchedOrder?.orderNumber || 'ORD-DEMO',
      guestName,
      rfc: rfc.toUpperCase(),
      legalName: legalName.toUpperCase(),
      postalCode,
      taxRegime,
      cfdiUse,
      paymentMethod,
      paymentForm,
      subtotalMxn: subtotal,
      ivaMxn: iva,
      totalMxn: total,
      currency: 'MXN'
    });

    setSelectedInvoice(newInv);
    setIsCreating(false);
  };

  const handleTimbrar = async (invoiceId: string) => {
    setIsTimbrando(true);
    const stamped = await simulateTimbrado(invoiceId);
    setSelectedInvoice(stamped);
    setIsTimbrando(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{t('invoicingTitle')}</h2>
            <span className="badge badge-success">CFDI 4.0 / SAT Ready</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: 2 }}>
            {t('invoicingSubtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="btn btn-primary btn-sm"
          >
            <FileText size={15} />
            <span>{isCreating ? 'View Invoices' : t('createInvoice')}</span>
          </button>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div
        style={{
          backgroundColor: 'rgba(172, 98, 90, 0.08)',
          border: '1px solid rgba(172, 98, 90, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}
      >
        <ShieldAlert size={20} color="var(--state-error)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
          <strong>Mexican Fiscal Compliance Architecture:</strong> Front-end prototype demonstrating SAT CFDI 4.0 catalog validation, RFC integrity checks, and IVA 16% separation. Stamping (timbrado) is simulated for workflow demonstration.
        </div>
      </div>

      {/* If Creating: Form Wizard (Scenario E) */}
      {isCreating ? (
        <div className="card" style={{ padding: 'var(--space-8)', maxWidth: '780px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 6 }}>
            {isEs ? 'Emisión de Factura Fiscal CFDI 4.0' : 'Issue CFDI 4.0 Mexican Electronic Invoice'}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
            Enter customer tax credentials. All fields follow Mexican Tax Authority (SAT) Anexo 20 rules.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Eligible Order Select */}
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                {t('selectTransaction')}
              </label>
              <select
                value={selectedOrderRef}
                onChange={e => setSelectedOrderRef(e.target.value)}
                style={{ width: '100%' }}
              >
                {orders.map(o => (
                  <option key={o.id} value={o.orderNumber}>
                    {o.orderNumber} ({o.outletName}) — {formatPrice(o.totalMxn)} ({o.guestName || 'Walk-in'})
                  </option>
                ))}
              </select>
            </div>

            {/* RFC and Legal Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  RFC del Receptor *
                </label>
                <input
                  type="text"
                  value={rfc}
                  onChange={e => setRfc(e.target.value.toUpperCase())}
                  placeholder="XAXX010101000"
                  style={{ width: '100%', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Razón Social (Legal Name as on Constancia) *
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={e => setLegalName(e.target.value.toUpperCase())}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Postal Code & Tax Regime */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Código Postal Fiscal (5 Digits) *
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  style={{ width: '100%', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  {t('taxRegime')} *
                </label>
                <select
                  value={taxRegime}
                  onChange={e => setTaxRegime(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="601 - General de Ley Personas Morales">601 - General de Ley Personas Morales</option>
                  <option value="605 - Sueldos y Salarios e Ingresos Asimilados">605 - Sueldos y Salarios</option>
                  <option value="612 - Personas Físicas con Actividades Empresariales">612 - Personas Físicas Actividades Empresariales</option>
                  <option value="616 - Sin obligaciones fiscales">616 - Sin obligaciones fiscales</option>
                  <option value="626 - Régimen Simplificado de Confianza (RESICO)">626 - RESICO</option>
                </select>
              </div>
            </div>

            {/* CFDI Use & Payment Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  {t('cfdiUse')}
                </label>
                <select value={cfdiUse} onChange={e => setCfdiUse(e.target.value)} style={{ width: '100%' }}>
                  <option value="G03 - Gastos en general">G03 - Gastos en general</option>
                  <option value="S01 - Sin efectos fiscales">S01 - Sin efectos fiscales</option>
                  <option value="CP01 - Pagos">CP01 - Pagos</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Método de Pago
                </label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} style={{ width: '100%' }}>
                  <option value="PUE">PUE - Pago en una sola exhibición</option>
                  <option value="PPD">PPD - Pago en parcialidades o diferido</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  {t('paymentForm')}
                </label>
                <select value={paymentForm} onChange={e => setPaymentForm(e.target.value as any)} style={{ width: '100%' }}>
                  <option value="04">04 - Tarjeta de Crédito</option>
                  <option value="28">28 - Tarjeta de Débito</option>
                  <option value="01">01 - Efectivo</option>
                </select>
              </div>
            </div>

            {/* Validation Errors */}
            {formErrors.length > 0 && (
              <div style={{ backgroundColor: 'var(--state-error-bg)', color: 'var(--state-error)', padding: '12px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem' }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Errores de Validación SAT:</div>
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {formErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <button onClick={() => setIsCreating(false)} className="btn btn-ghost">
                {t('cancel')}
              </button>
              <button onClick={handleValidateAndCreate} className="btn btn-primary">
                <FileCheck2 size={16} />
                <span>{t('validateInvoice')}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Regular View: Invoices Table + Document Preview (PRD Section 13.3 & Scenario E) */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--space-6)',
            alignItems: 'start'
          }}
          className="invoicing-layout-grid"
        >
          {/* Table */}
          <div className="table-container">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Source Ref</th>
                  <th>Receptor / RFC</th>
                  <th>Subtotal</th>
                  <th>IVA (16%)</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => {
                  const isSelected = selectedInvoice?.id === inv.id;
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--accent-primary-light)' : 'transparent'
                      }}
                    >
                      <td><strong style={{ fontFamily: 'monospace' }}>{inv.invoiceNumber}</strong></td>
                      <td><code>{inv.sourceRef}</code></td>
                      <td>
                        <strong>{inv.legalName.substring(0, 24)}...</strong>
                        <div style={{ fontSize: '0.6875rem', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                          {inv.rfc}
                        </div>
                      </td>
                      <td>{formatPrice(inv.subtotalMxn)}</td>
                      <td>{formatPrice(inv.ivaMxn)}</td>
                      <td><strong>{formatPrice(inv.totalMxn)}</strong></td>
                      <td>
                        <span className={`badge ${inv.status === 'issued' ? 'badge-success' : inv.status === 'simulated_timbrado' ? 'badge-teal' : 'badge-warning'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{inv.createdAt.split(' ')[0]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* CFDI 4.0 Document Preview with Watermark (PRD Section 13.3) */}
          {selectedInvoice && (
            <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div className="demo-watermark" style={{ marginBottom: 6 }}>
                    {t('demoWatermark')}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace' }}>
                    {selectedInvoice.invoiceNumber}
                  </h3>
                </div>
                <span className={`badge ${selectedInvoice.status === 'issued' ? 'badge-success' : 'badge-warning'}`}>
                  {selectedInvoice.status}
                </span>
              </div>

              {/* Fiscal Document Preview */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  fontSize: '0.75rem',
                  lineHeight: 1.5,
                  marginBottom: 16
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)', marginBottom: 10 }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>EMISOR (RESORT):</span>
                    <div style={{ fontWeight: 700 }}>OPERADORA TURISTICA CASA MAREA BCS SA DE CV</div>
                    <div style={{ fontFamily: 'monospace' }}>RFC: OTC261021MA0</div>
                    <div>Régimen: 601 - General de Ley Personas Morales</div>
                    <div>Lugar de Expedición: 23405</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>RECEPTOR (CLIENTE):</span>
                    <div style={{ fontWeight: 700 }}>{selectedInvoice.legalName}</div>
                    <div style={{ fontFamily: 'monospace' }}>RFC: {selectedInvoice.rfc}</div>
                    <div>Régimen: {selectedInvoice.taxRegime}</div>
                    <div>CP Fiscal: {selectedInvoice.postalCode} · Uso: {selectedInvoice.cfdiUse}</div>
                  </div>
                </div>

                <div style={{ paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Servicio de Hospitalidad y Alimentos (Clave SAT: 90101501)</span>
                    <strong>{formatPrice(selectedInvoice.subtotalMxn)}</strong>
                  </div>
                </div>

                {/* Fiscal breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedInvoice.subtotalMxn)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>IVA Trasladado (16.00%):</span>
                    <span>{formatPrice(selectedInvoice.ivaMxn)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.875rem', color: 'var(--accent-primary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 4 }}>
                    <span>Total CFDI 4.0:</span>
                    <span>{formatPrice(selectedInvoice.totalMxn)}</span>
                  </div>
                </div>

                {/* Digital Stamp / Timbre SAT */}
                <div style={{ marginTop: 12, borderTop: '1px dashed var(--border-subtle)', paddingTop: 10 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Folio Fiscal Digital (UUID Simulado):</span>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.6875rem', color: 'var(--accent-primary)', wordBreak: 'break-all' }}>
                    {selectedInvoice.simulatedUuid || 'Awaiting SAT Pac Timbrado Stamp'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedInvoice.status !== 'issued' && (
                  <button
                    onClick={() => handleTimbrar(selectedInvoice.id)}
                    className="btn btn-primary"
                    disabled={isTimbrando}
                    style={{ width: '100%' }}
                  >
                    <FileCheck2 size={16} />
                    <span>{isTimbrando ? 'Certificando CFDI...' : t('issueInvoice')}</span>
                  </button>
                )}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => window.print()} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    <Printer size={14} />
                    <span>Print PDF Preview</span>
                  </button>
                  <button onClick={() => addToast('info', 'XML Export', 'CFDI 4.0 XML structure generated for testing.')} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    <Download size={14} />
                    <span>Download XML</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .invoicing-layout-grid {
            grid-template-columns: 1fr 360px !important;
          }
        }
      `}</style>
    </div>
  );
};
