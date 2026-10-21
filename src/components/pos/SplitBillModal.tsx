import React, { useState } from 'react';
import { X, Users, Split, Check, ArrowRight } from 'lucide-react';
import { OrderLine } from '../../types';
import { useApp } from '../../context/AppContext';

interface SplitBillModalProps {
  onClose: () => void;
}

export const SplitBillModal: React.FC<SplitBillModalProps> = ({ onClose }) => {
  const { currentOrderLines, formatPrice, t, addToast } = useApp();

  const [splitMode, setSplitMode] = useState<'equal' | 'items'>('equal');
  const [equalWays, setEqualWays] = useState<number>(2);

  // For items split: mapping lineId -> bill index (0 or 1)
  const [itemAllocations, setItemAllocations] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    currentOrderLines.forEach((l, idx) => {
      initial[l.id] = idx % 2; // assign half to bill 1, half to bill 2
    });
    return initial;
  });

  const totalMxn = currentOrderLines.reduce((acc, l) => acc + l.subtotalMxn, 0);

  const handleApplySplit = () => {
    if (splitMode === 'equal') {
      const perPerson = totalMxn / equalWays;
      addToast(
        'success',
        'Bill Split Calculated',
        `Check split equally ${equalWays} ways: ${formatPrice(perPerson)} per check.`
      );
    } else {
      const bill1Total = currentOrderLines
        .filter(l => itemAllocations[l.id] === 0)
        .reduce((acc, l) => acc + l.subtotalMxn, 0);
      const bill2Total = totalMxn - bill1Total;
      addToast(
        'success',
        'Itemized Checks Prepared',
        `Check 1: ${formatPrice(bill1Total)} · Check 2: ${formatPrice(bill2Total)}.`
      );
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Split size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{t('splitBill')}</h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Mode Switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              onClick={() => setSplitMode('equal')}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: splitMode === 'equal' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                backgroundColor: splitMode === 'equal' ? 'var(--accent-primary-light)' : '#FFFFFF',
                color: splitMode === 'equal' ? 'var(--accent-primary)' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              Split Equally
            </button>
            <button
              onClick={() => setSplitMode('items')}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: splitMode === 'items' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                backgroundColor: splitMode === 'items' ? 'var(--accent-primary-light)' : '#FFFFFF',
                color: splitMode === 'items' ? 'var(--accent-primary)' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              Split by Items
            </button>
          </div>

          {/* Equal split mode */}
          {splitMode === 'equal' ? (
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                Number of Guests Sharing:
              </label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[2, 3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    onClick={() => setEqualWays(num)}
                    className={`btn ${equalWays === num ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, padding: '8px 0' }}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Full Check Total:</span>
                  <strong>{formatPrice(totalMxn)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)', paddingTop: 6, borderTop: '1px dashed var(--border-subtle)' }}>
                  <span>Each Guest Pays ({equalWays} ways):</span>
                  <span>{formatPrice(totalMxn / equalWays)}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Items split mode */
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                Assign individual items to Check 1 or Check 2:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '220px', overflowY: 'auto' }}>
                {currentOrderLines.map(line => {
                  const billIdx = itemAllocations[line.id] || 0;
                  return (
                    <div
                      key={line.id}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{line.quantity}x {line.productName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatPrice(line.subtotalMxn)}</div>
                      </div>

                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => setItemAllocations(prev => ({ ...prev, [line.id]: 0 }))}
                          className={`btn btn-sm ${billIdx === 0 ? 'btn-primary' : 'btn-secondary'}`}
                        >
                          Check 1
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemAllocations(prev => ({ ...prev, [line.id]: 1 }))}
                          className={`btn btn-sm ${billIdx === 1 ? 'btn-primary' : 'btn-secondary'}`}
                        >
                          Check 2
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                <div style={{ padding: '10px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Check 1 Total</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {formatPrice(
                      currentOrderLines
                        .filter(l => itemAllocations[l.id] === 0)
                        .reduce((acc, l) => acc + l.subtotalMxn, 0)
                    )}
                  </div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Check 2 Total</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {formatPrice(
                      currentOrderLines
                        .filter(l => itemAllocations[l.id] === 1)
                        .reduce((acc, l) => acc + l.subtotalMxn, 0)
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-ghost">
            {t('cancel')}
          </button>
          <button onClick={handleApplySplit} className="btn btn-primary">
            Apply Split & Generate Checks
          </button>
        </div>
      </div>
    </div>
  );
};
