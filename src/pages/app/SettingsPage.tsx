import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  RotateCcw,
  ShieldAlert,
  Coins,
  Sparkles,
  Building,
  CheckCircle2,
  Save,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData, setLanguage, t } = useApp();
  const isEs = settings.language === 'es';

  const [rate, setRate] = useState<number>(settings.exchangeRateUsdMxn);
  const [servicePct, setServicePct] = useState<number>(settings.serviceChargePercent);
  const [taxPct, setTaxPct] = useState<number>(settings.taxRatePercent);
  const [spaBuffer, setSpaBuffer] = useState<number>(settings.spaCleanupBufferMinutes);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = () => {
    updateSettings({
      exchangeRateUsdMxn: rate,
      serviceChargePercent: servicePct,
      taxRatePercent: taxPct,
      spaCleanupBufferMinutes: spaBuffer
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '820px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{t('menuSettings')}</h2>
          <span className="badge badge-teal">Configuration Parameters</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: 2 }}>
          Operational rules, exchange rates, service charges, and demo environment control.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="card" style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Section 1: Resort Identity */}
        <div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: 6 }}>Resort Information</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Property profile representation for Baja California Sur operations.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Property Name</label>
              <input type="text" value="CASA MAREA Resort & Residences" readOnly style={{ width: '100%', backgroundColor: 'var(--bg-main)' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Location</label>
              <input type="text" value="San José del Cabo, Baja California Sur, México" readOnly style={{ width: '100%', backgroundColor: 'var(--bg-main)' }} />
            </div>
          </div>
        </div>

        {/* Section 2: Currency & Exchange Rate (PRD Section 8.9) */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: 6 }}>Currency & Valuation</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Illustrative exchange rate applied for guest display conversions between Mexican Pesos (MXN) and US Dollars (USD).
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Exchange Rate: 1 USD to MXN
              </label>
              <input
                type="number"
                step="0.1"
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Primary Operating Currency
              </label>
              <input type="text" value="MXN (Mexican Peso) — Base Ledger" readOnly style={{ width: '100%', backgroundColor: 'var(--bg-main)' }} />
            </div>
          </div>
        </div>

        {/* Section 3: POS Charges & Taxes */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: 6 }}>Taxes & Service Charges</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Configured percentage rates applied at POS checkout and Mexican invoice generation.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                IVA Tax Rate (%):
              </label>
              <input
                type="number"
                value={taxPct}
                onChange={e => setTaxPct(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Configured Service Charge (%):
              </label>
              <input
                type="number"
                value={servicePct}
                onChange={e => setServicePct(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Spa Resource Scheduling Engine (PRD Section 9.4) */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: 6 }}>Spa Resource Allocation Engine</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Mandatory sanitation and turn-down buffer applied between consecutive guest treatments to prevent therapist/cabin overlap.
          </p>
          <div style={{ maxWidth: '320px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Cleanup & Reset Buffer (Minutes):
            </label>
            <input
              type="number"
              step="5"
              value={spaBuffer}
              onChange={e => setSpaBuffer(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
          <button onClick={handleSave} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Save size={16} />
            <span>{t('save')}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Demo Data (PRD Section 15) */}
      <div className="card" style={{ padding: 'var(--space-6)', borderColor: 'rgba(172, 98, 90, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', color: 'var(--state-error)', marginBottom: 4 }}>
              Reset Demonstration Environment
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Restores initial baseline guests, POS orders, spa bookings, and PMS folio postings.
            </p>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="btn btn-outline"
            style={{ color: 'var(--state-error)', borderColor: 'var(--state-error)' }}
          >
            <RotateCcw size={15} />
            <span>{t('resetDemo')}</span>
          </button>
        </div>

        {/* Confirmation Modal */}
        {showResetConfirm && (
          <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Reset Demo Records?</h3>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  This action will clear all local changes made in the POS, room charges, spa bookings, and invoices, restoring the clean demonstration dataset.
                </p>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowResetConfirm(false)} className="btn btn-ghost">
                  {t('cancel')}
                </button>
                <button
                  onClick={() => {
                    resetDemoData();
                    setShowResetConfirm(false);
                  }}
                  className="btn btn-primary"
                  style={{ backgroundColor: 'var(--state-error)', borderColor: 'var(--state-error)' }}
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
