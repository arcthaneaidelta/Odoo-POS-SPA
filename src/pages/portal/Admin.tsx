import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarDays,
  CreditCard,
  CheckCircle2,
  Circle,
  Plus,
  Search,
  Clock
} from 'lucide-react';
import { useDemo } from '../../state/DemoProvider';
import { getAdminClients } from '../../state/selectors';
import type { AdminClient } from '../../state/types';
import { StatusBadge } from '../../components/ui/Feedback';
import { Button } from '../../components/ui/Button';
import { Drawer, Modal } from '../../components/ui/Dialog';
import { TextField } from '../../components/ui/Fields';
import { formatShortDate, toISODate, addDays } from '../../lib/dates';
import { useToast } from '../../components/ui/Toast';

export default function Admin() {
  const { state, dispatch } = useDemo();
  const { toast } = useToast();

  const clients = getAdminClients(state);
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(null);
  const [search, setSearch] = useState('');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState(toISODate(addDays(new Date(), 3)));

  const handleToggleOpsTask = (id: string) => {
    dispatch({ type: 'OPS_TOGGLE', id });
  };

  const handleToggleClientTask = (clientId: string, taskId: string) => {
    dispatch({ type: 'ADMIN_TOGGLE_TASK', clientId, taskId });
    toast({ tone: 'info', title: 'Task Updated', message: 'Client task status modified.' });
    if (selectedClient && selectedClient.id === clientId) {
      // Refresh drawer client object
      const updated = getAdminClients(state).find((c) => c.id === clientId);
      if (updated) setSelectedClient(updated);
    }
  };

  const handleAddClientTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newTaskTitle.trim()) return;

    dispatch({
      type: 'ADMIN_ADD_TASK',
      clientId: selectedClient.id,
      title: newTaskTitle.trim(),
      due: newTaskDue
    });

    toast({ tone: 'success', title: 'Task Added', message: `Added to ${selectedClient.name}'s task list.` });
    setNewTaskTitle('');
    setTaskModalOpen(false);

    // Refresh drawer
    setTimeout(() => {
      const updated = getAdminClients(state).find((c) => c.id === selectedClient.id);
      if (updated) setSelectedClient(updated);
    }, 100);
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="portal-page-container">
      <div className="admin-header-row row row--between row--wrap" style={{ gap: '16px', marginBottom: '24px' }}>
        <div>
          <p className="eyebrow">Business Coordination View</p>
          <h1 className="display" style={{ fontSize: '36px' }}>Operations Dashboard</h1>
          <p className="page-desc">
            Demonstration of how Havenwell oversees active clients, pending onboarding, consultations, and tasks.
          </p>
        </div>

        <div className="admin-header-actions row">
          <Link to="/portal/dashboard" className="btn btn--secondary btn--sm">
            ← Switch to Client Portal
          </Link>
          <Link to="/" className="btn btn--ghost btn--sm">
            Public Website
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-metrics-grid">
        <div className="card">
          <div className="row row--between">
            <span className="small muted">Active Clients</span>
            <Users size={18} className="muted" />
          </div>
          <div className="admin-metric-value">24</div>
          <span className="small muted">4 in active onboarding</span>
        </div>

        <div className="card">
          <div className="row row--between">
            <span className="small muted">Pending Onboarding</span>
            <Clock size={18} className="muted" />
          </div>
          <div className="admin-metric-value">7</div>
          <span className="small muted">Intake & agreements pending</span>
        </div>

        <div className="card">
          <div className="row row--between">
            <span className="small muted">Upcoming Consultations</span>
            <CalendarDays size={18} className="muted" />
          </div>
          <div className="admin-metric-value">12</div>
          <span className="small muted">Next 7 business days</span>
        </div>

        <div className="card">
          <div className="row row--between">
            <span className="small muted">Outstanding Invoices</span>
            <CreditCard size={18} className="muted" />
          </div>
          <div className="admin-metric-value">5</div>
          <span className="small muted">$1,450 total balance</span>
        </div>
      </div>

      {/* Two Column Section: Client Roster & Ops Tasks */}
      <div className="admin-main-grid" style={{ marginTop: '28px' }}>
        {/* Left: Client Table */}
        <div className="admin-roster card">
          <div className="card__head row row--between">
            <div>
              <h2 className="card__title">Client Roster</h2>
              <p className="small muted">Click any client to view their detailed care profile.</p>
            </div>
            <div className="admin-search-wrap">
              <Search size={15} />
              <input
                type="text"
                className="input admin-search-input"
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Onboarding</th>
                  <th>Next Session</th>
                  <th>Agreement</th>
                  <th>Billing</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((c) => (
                  <tr key={c.id} onClick={() => setSelectedClient(c)} className="admin-row-clickable">
                    <td>
                      <div className="row" style={{ gap: '10px' }}>
                        <div className="portal-avatar portal-avatar--sm">{c.initials}</div>
                        <div>
                          <strong>{c.name}</strong>
                          <span className="small muted" style={{ display: 'block' }}>{c.stage}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="small">{c.progress}%</span>
                    </td>
                    <td>
                      {c.nextAppointment ? (
                        <span className="small">
                          {formatShortDate(c.nextAppointment.date)} ({c.nextAppointment.start})
                        </span>
                      ) : (
                        <span className="small muted">None</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge tone={c.agreement === 'completed' ? 'sage' : 'sand'}>
                        {c.agreement === 'completed' ? 'Signed' : 'Pending'}
                      </StatusBadge>
                    </td>
                    <td>
                      <StatusBadge tone={c.payment === 'paid' ? 'sage' : c.payment === 'outstanding' ? 'sand' : 'neutral'}>
                        {c.payment === 'paid' ? 'Paid' : c.payment === 'outstanding' ? 'Due' : 'None'}
                      </StatusBadge>
                    </td>
                    <td>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedClient(c)}>
                        Profile →
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Operational Task Board */}
        <div className="admin-ops-tasks card">
          <div className="card__head">
            <h2 className="card__title">Operational Checklist</h2>
            <span className="small muted">Care Team Tasks</span>
          </div>

          <div className="ops-task-list stack" style={{ gap: '10px' }}>
            {state.opsTasks.map((t) => (
              <label key={t.id} className={`ops-task-item row ${t.done ? 'is-done' : ''}`}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => handleToggleOpsTask(t.id)}
                />
                <div style={{ flex: 1 }}>
                  <strong className={t.done ? 'is-struck' : ''}>{t.title}</strong>
                  <span className="small muted" style={{ display: 'block' }}>{t.detail}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Client Detail Drawer */}
      {selectedClient && (
        <Drawer
          open={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          title={selectedClient.name}
          description={`${selectedClient.email} · ${selectedClient.stage}`}
          size="md"
          footer={
            <>
              {selectedClient.id === 'alex' && (
                <Link to="/portal/dashboard" className="btn btn--secondary">
                  Open Client Portal
                </Link>
              )}
              <Button onClick={() => setTaskModalOpen(true)} icon={<Plus size={15} />}>
                Add Task for Client
              </Button>
            </>
          }
        >
          <div className="client-drawer-body stack" style={{ gap: '24px' }}>
            {/* Onboarding Checklist Status */}
            <div>
              <h4 style={{ fontSize: '15px', marginBottom: '10px' }}>Onboarding Progress ({selectedClient.progress}%)</h4>
              <div className="drawer-checklist stack" style={{ gap: '8px' }}>
                {selectedClient.checklist.map((item) => (
                  <div key={item.label} className="row small" style={{ gap: '8px' }}>
                    {item.done ? (
                      <CheckCircle2 size={16} className="text-olive" />
                    ) : (
                      <Circle size={16} className="muted" />
                    )}
                    <span className={item.done ? 'is-struck' : ''}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Action Items */}
            <div>
              <div className="row row--between" style={{ marginBottom: '10px' }}>
                <h4 style={{ fontSize: '15px' }}>Assigned Tasks</h4>
                <button
                  type="button"
                  className="link-btn small"
                  onClick={() => setTaskModalOpen(true)}
                >
                  + Add
                </button>
              </div>

              <div className="drawer-tasks stack" style={{ gap: '8px' }}>
                {selectedClient.tasks.map((task) => (
                  <div key={task.id} className="row row--between small" style={{ padding: '6px 0', borderBottom: '1px solid var(--mist)' }}>
                    <label className="row" style={{ gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => handleToggleClientTask(selectedClient.id, task.id)}
                      />
                      <span className={task.done ? 'is-struck' : ''}>{task.title}</span>
                    </label>
                    <span className="muted">{formatShortDate(task.due)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Messages from Client */}
            <div>
              <h4 style={{ fontSize: '15px', marginBottom: '8px' }}>Latest Client Message</h4>
              <p className="card card--sage small" style={{ padding: '12px' }}>
                "{selectedClient.lastMessage || 'No recent messages from client.'}"
              </p>
            </div>
          </div>
        </Drawer>
      )}

      {/* Add Task for Client Modal */}
      {taskModalOpen && (
        <Modal
          open={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          title={`Add Task for ${selectedClient?.name}`}
          size="sm"
          footer={
            <>
              <Button variant="ghost" onClick={() => setTaskModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClientTask}>
                Assign Task
              </Button>
            </>
          }
        >
          <form onSubmit={handleAddClientTask} className="stack" style={{ gap: '16px' }}>
            <TextField
              label="Task Title"
              required
              value={newTaskTitle}
              onChange={setNewTaskTitle}
              placeholder="e.g. Confirm transportation schedule"
            />
            <div className="field">
              <label className="field__label">Due Date</label>
              <input
                type="date"
                className="input"
                value={newTaskDue}
                onChange={(e) => setNewTaskDue(e.target.value)}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
