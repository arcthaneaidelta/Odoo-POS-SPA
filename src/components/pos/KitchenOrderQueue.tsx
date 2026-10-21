import React from 'react';
import { Clock, ChefHat, GlassWater } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const KitchenOrderQueue: React.FC = () => {
  const { orders, addToast } = useApp();

  // Find active kitchen/bar orders
  const activeOrders = orders.filter(o => o.status !== 'paid');

  const updateStatus = (_orderId: string, nextStatus: OrderStatus) => {
    addToast('info', 'Station Status Updated', `Order transitioned to ${nextStatus.replace('_', ' ')}.`);
  };

  return (
    <div className="card" style={{ marginTop: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ChefHat size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>Kitchen & Bar Station Expediter</h3>
        </div>
        <span className="badge badge-teal">Live Station Tickets</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        {activeOrders.map(order => {
          const isBar = order.outletId === 'out_bar';
          return (
            <div
              key={order.id}
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{order.orderNumber}</span>
                  <span className={`badge ${order.status === 'ready' ? 'badge-success' : order.status === 'in_preparation' ? 'badge-warning' : 'badge-neutral'}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                  {isBar ? <GlassWater size={14} color="var(--accent-warm)" /> : <ChefHat size={14} color="var(--accent-primary)" />}
                  <span>{order.outletName} · {order.tableNumber || 'To Go'} · Server: {order.serverName}</span>
                </div>

                {order.elapsedMinutes !== undefined && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: order.elapsedMinutes > 15 ? 'var(--state-error)' : 'var(--text-secondary)', marginBottom: 12 }}>
                    <Clock size={13} />
                    <span>Elapsed: {order.elapsedMinutes} mins</span>
                  </div>
                )}

                <div style={{ borderTop: '1px dashed var(--border-subtle)', borderBottom: '1px dashed var(--border-subtle)', padding: '8px 0', margin: '8px 0', fontSize: '0.8125rem' }}>
                  {order.lines.map(line => (
                    <div key={line.id} style={{ marginBottom: 4 }}>
                      <strong>{line.quantity}x</strong> {line.productName}
                      {line.notes && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-warm)', fontStyle: 'italic', paddingLeft: 14 }}>
                          ↳ "{line.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {order.kitchenNotes && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                    Note: {order.kitchenNotes}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                {order.status === 'new' && (
                  <button
                    onClick={() => updateStatus(order.id, 'in_preparation')}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    Start Prep
                  </button>
                )}
                {order.status === 'in_preparation' && (
                  <button
                    onClick={() => updateStatus(order.id, 'ready')}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    Mark Ready for Runner
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => updateStatus(order.id, 'served')}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    Mark Served
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
