import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  UtensilsCrossed,
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Split,
  CreditCard,
  Building,
  Coins,
  CheckCircle2,
  ChefHat,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product } from '../../types';
import { CheckoutModal } from '../../components/pos/CheckoutModal';
import { SplitBillModal } from '../../components/pos/SplitBillModal';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import { KitchenOrderQueue } from '../../components/pos/KitchenOrderQueue';

export const POSPage: React.FC = () => {
  const {
    outlets,
    products,
    currentOutletId,
    setCurrentOutletId,
    currentOrderLines,
    addToCurrentOrder,
    updateOrderLineQuantity,
    removeFromCurrentOrder,
    clearCurrentOrder,
    tipPercent,
    setTipPercent,
    customTipAmount,
    setCustomTipAmount,
    formatPrice,
    displayCurrency,
    setDisplayCurrency,
    settings,
    activeModalOrder,
    setActiveModalOrder,
    t
  } = useApp();
  const navigate = useNavigate();
  const isEs = settings.language === 'es';

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [isCustomTipInput, setIsCustomTipInput] = useState(false);

  const activeOutlet = outlets.find(o => o.id === currentOutletId) || outlets[0];

  // Filter products by outlet and category and search query
  const filteredProducts = products.filter(p => {
    // Outlet filter: If boutique outlet selected, show spa_retail & boutique.
    // If restaurant, show food, desserts, cocktails, wine.
    // If bar, show cocktails, wine, food.
    // If beach, show all beach applicable.
    if (activeOutlet.id === 'out_boutique' && p.category !== 'boutique' && p.category !== 'spa_retail') return false;
    if (activeOutlet.id === 'out_bar' && p.category === 'spa_retail') return false;

    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.nameEs && p.nameEs.toLowerCase().includes(q));
    }
    return true;
  });

  // Totals calculations
  const subtotal = currentOrderLines.reduce((acc, l) => acc + l.subtotalMxn, 0);
  const tax = Number((subtotal * (settings.taxRatePercent / 100)).toFixed(2));
  const serviceCharge = Number((subtotal * (settings.serviceChargePercent / 100)).toFixed(2));
  const tip = customTipAmount > 0 ? customTipAmount : Number((subtotal * (tipPercent / 100)).toFixed(2));
  const total = Number((subtotal + tax + serviceCharge + tip).toFixed(2));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Outlet Selector Ribbon */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-3)'
        }}
      >
        {outlets.map(outlet => {
          const isSelected = outlet.id === currentOutletId;
          return (
            <button
              key={outlet.id}
              onClick={() => setCurrentOutletId(outlet.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: isSelected ? 'var(--accent-primary-light)' : '#FFFFFF',
                border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                  {isEs ? outlet.nameEs : outlet.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {outlet.terminalName}
                </div>
              </div>
              <span className="badge badge-teal">{outlet.activeOrdersCount} {t('activeOrders')}</span>
            </button>
          );
        })}
      </div>

      {/* POS Workspace Layout: Categories + Products + Cart Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-6)',
          alignItems: 'start'
        }}
        className="pos-grid-container"
      >
        {/* Left / Center: Category navigation + Search + Product Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Controls Bar: Search + Category Pills + Currency Toggle */}
          <div
            className="card"
            style={{
              padding: '14px 16px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12
            }}
          >
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
              <Search size={15} color="var(--text-secondary)" style={{ position: 'absolute', left: 10, top: 11 }} />
              <input
                type="text"
                placeholder={t('searchProducts')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: 32, fontSize: '0.8125rem' }}
              />
            </div>

            {/* Currency Selector Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {t('currencyDisplay')}:
              </span>
              <button
                onClick={() => setDisplayCurrency(displayCurrency === 'MXN' ? 'USD' : 'MXN')}
                className="btn btn-secondary btn-sm"
                style={{ fontWeight: 700 }}
              >
                <Coins size={14} color="var(--accent-primary)" />
                <span>{displayCurrency} (Rate: {settings.exchangeRateUsdMxn})</span>
              </button>
            </div>
          </div>

          {/* Categories Tab Strip */}
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: 8,
              paddingBottom: 4
            }}
          >
            {[
              { id: 'all', label: t('categoryAll') },
              { id: 'food', label: t('categoryFood') },
              { id: 'cocktails', label: t('categoryCocktails') },
              { id: 'wine_beverages', label: t('categoryWine') },
              { id: 'desserts', label: t('categoryDesserts') },
              { id: 'spa_retail', label: t('categorySpaRetail') },
              { id: 'boutique', label: t('categoryBoutique') }
            ].map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8125rem',
                    fontWeight: isSelected ? 600 : 500,
                    backgroundColor: isSelected ? 'var(--accent-primary)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 'var(--space-4)'
            }}
          >
            {filteredProducts.map(product => {
              const cartItem = currentOrderLines.find(l => l.productId === product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => addToCurrentOrder(product)}
                  className="card"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {cartItem && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-primary)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      {cartItem.quantity}
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                        {product.category}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                      {isEs ? product.nameEs : product.name}
                    </h4>

                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 12 }}>
                      {isEs ? product.descriptionEs : product.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                    <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {formatPrice(product.priceMxn)}
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order Summary Check & Checkout Controls */}
        <div className="card pos-summary-card" style={{ padding: 'var(--space-6)', position: 'sticky', top: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{t('orderSummary')}</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {activeOutlet.name} · Check #4510
              </div>
            </div>
            {currentOrderLines.length > 0 && (
              <button onClick={clearCurrentOrder} className="btn-icon" title={t('clearOrder')}>
                <Trash2 size={16} color="var(--state-error)" />
              </button>
            )}
          </div>

          {/* Lines list */}
          {currentOrderLines.length === 0 ? (
            <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
              {t('emptyOrder')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '280px', overflowY: 'auto', marginBottom: 16 }}>
              {currentOrderLines.map(line => (
                <div
                  key={line.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ flex: 1, paddingRight: 8 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{line.productName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {formatPrice(line.unitPriceMxn)} each
                    </div>
                  </div>

                  {/* Quantity adjustment */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => updateOrderLineQuantity(line.id, line.quantity - 1)}
                      className="btn-icon"
                      style={{ padding: 3, border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, minWidth: 18, textAlign: 'center' }}>
                      {line.quantity}
                    </span>
                    <button
                      onClick={() => updateOrderLineQuantity(line.id, line.quantity + 1)}
                      className="btn-icon"
                      style={{ padding: 3, border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div style={{ fontSize: '0.875rem', fontWeight: 700, minWidth: 64, textAlign: 'right', color: 'var(--accent-primary)' }}>
                    {formatPrice(line.subtotalMxn)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Gratuity & Tip Selector (PRD Section 8.8) */}
          <div style={{ marginBottom: 16, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {t('tip')}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                {formatPrice(tip)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 10, 15, 20].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    setTipPercent(pct);
                    setCustomTipAmount(0);
                    setIsCustomTipInput(false);
                  }}
                  className={`btn btn-sm ${tipPercent === pct && customTipAmount === 0 ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '4px 0', fontSize: '0.75rem' }}
                >
                  {pct === 0 ? t('noTip') : `${pct}%`}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomTipInput(!isCustomTipInput)}
                className={`btn btn-sm ${isCustomTipInput || customTipAmount > 0 ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '4px 0', fontSize: '0.75rem' }}
              >
                Custom
              </button>
            </div>
            {isCustomTipInput && (
              <div style={{ marginTop: 8 }}>
                <input
                  type="number"
                  placeholder="Custom tip amount (MXN)"
                  value={customTipAmount || ''}
                  onChange={e => setCustomTipAmount(Number(e.target.value))}
                  style={{ width: '100%', fontSize: '0.8125rem', padding: '6px 10px' }}
                />
              </div>
            )}
          </div>

          {/* Breakdown summary */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('subtotal')}:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('tax')}:</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('serviceCharge')} (10%):</span>
              <span>{formatPrice(serviceCharge)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: 6,
                paddingTop: 8
              }}
            >
              <span>{t('total')}:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Checkout & Split Bill Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="btn btn-primary"
              disabled={currentOrderLines.length === 0}
              style={{ width: '100%', padding: '12px', fontSize: '0.9375rem', fontWeight: 600 }}
            >
              {t('checkout')} ({formatPrice(total)})
            </button>

            <button
              onClick={() => setIsSplitBillOpen(true)}
              className="btn btn-outline btn-sm"
              disabled={currentOrderLines.length === 0}
              style={{ width: '100%' }}
            >
              <Split size={14} />
              <span>{t('splitBill')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kitchen & Bar Station Expediter Queue (PRD Section 8.12) */}
      <KitchenOrderQueue />

      {/* Modals */}
      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => setIsCheckoutOpen(false)}
        />
      )}

      {isSplitBillOpen && (
        <SplitBillModal onClose={() => setIsSplitBillOpen(false)} />
      )}

      {activeModalOrder && (
        <ReceiptModal
          order={activeModalOrder}
          onClose={() => setActiveModalOrder(null)}
          onNewOrder={() => {
            setActiveModalOrder(null);
            clearCurrentOrder();
          }}
        />
      )}

      <style>{`
        @media (min-width: 992px) {
          .pos-grid-container {
            grid-template-columns: 1fr 340px !important;
          }
        }
      `}</style>
    </div>
  );
};
