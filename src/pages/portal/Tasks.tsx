import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus
} from 'lucide-react';
import { useDemo } from '../../state/DemoProvider';
import type { Task, TaskStatus } from '../../state/types';
import { PageHeader, StatusBadge } from '../../components/ui/Feedback';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Dialog';
import { TextField } from '../../components/ui/Fields';
import { dueLabel, toISODate, addDays } from '../../lib/dates';
import { useToast } from '../../components/ui/Toast';

export default function Tasks() {
  const { state, dispatch } = useDemo();
  const { toast } = useToast();

  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDue, setNewDue] = useState(toISODate(addDays(new Date(), 4)));
  const [error, setError] = useState('');

  const handleToggleTask = (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    dispatch({ type: 'TASK_SET', id: task.id, status: nextStatus });
    toast({
      tone: nextStatus === 'done' ? 'success' : 'info',
      title: nextStatus === 'done' ? 'Task Completed' : 'Task Reopened',
      message: `${task.title} has been updated.`
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setError('Please provide a task description.');
      return;
    }

    dispatch({
      type: 'ADMIN_ADD_TASK',
      clientId: 'alex',
      title: newTitle.trim(),
      due: newDue
    });

    toast({
      tone: 'success',
      title: 'Task Created',
      message: `"${newTitle.trim()}" added to your task list.`
    });
    setNewTitle('');
    setAddOpen(false);
  };

  const filteredTasks = state.tasks.filter((t) => {
    if (filter === 'todo') return t.status !== 'done';
    if (filter === 'done') return t.status === 'done';
    return true;
  });

  return (
    <div className="portal-page-container">
      <PageHeader
        eyebrow="Action Items"
        title="Tasks & Priorities"
        description="Check off completed action items or coordinate next priorities with your concierge."
        actions={
          <Button onClick={() => setAddOpen(true)} icon={<Plus size={16} />}>
            Add Action Item
          </Button>
        }
      />

      {/* Filter Tabs */}
      <div className="row row--between row--wrap" style={{ marginBottom: '24px' }}>
        <div className="seg" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All Tasks ({state.tasks.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'todo'}
            onClick={() => setFilter('todo')}
          >
            To Do ({state.tasks.filter((t) => t.status !== 'done').length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'done'}
            onClick={() => setFilter('done')}
          >
            Completed ({state.tasks.filter((t) => t.status === 'done').length})
          </button>
        </div>

        <span className="small muted">
          Changes sync across roadmap and dashboard
        </span>
      </div>

      {/* Tasks List */}
      <div className="card tasks-card">
        <div className="tasks-list stack" style={{ gap: '12px' }}>
          {filteredTasks.length === 0 ? (
            <p className="small muted" style={{ padding: '24px 0', textAlign: 'center' }}>
              No tasks matching this filter.
            </p>
          ) : (
            filteredTasks.map((task) => {
              const isDone = task.status === 'done';

              return (
                <div
                  key={task.id}
                  className={`task-item-row row row--between ${isDone ? 'is-done' : ''}`}
                >
                  <div className="row" style={{ gap: '14px', alignItems: 'flex-start' }}>
                    <button
                      type="button"
                      className="dash-task-toggle"
                      onClick={() => handleToggleTask(task)}
                      aria-label={`Mark task ${task.title}`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={20} className="text-olive" />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>

                    <div className="task-item-info">
                      <strong className={`task-title ${isDone ? 'is-struck' : ''}`}>
                        {task.title}
                      </strong>
                      <span className="small muted" style={{ display: 'block' }}>
                        {task.description}
                      </span>
                    </div>
                  </div>

                  <div className="task-item-meta row" style={{ gap: '14px' }}>
                    <span className="small muted row" style={{ gap: '6px' }}>
                      <Clock size={13} />
                      {dueLabel(task.due)}
                    </span>

                    <StatusBadge
                      tone={isDone ? 'sage' : task.priority === 'high' ? 'sand' : 'neutral'}
                    >
                      {isDone ? 'Done' : `${task.priority} priority`}
                    </StatusBadge>

                    <Link to={task.link} className="btn btn--sm btn--secondary">
                      {task.linkLabel}
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {addOpen && (
        <Modal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          title="Add Action Item"
          description="Create a personalized coordination item in your client space."
          size="sm"
          footer={
            <>
              <Button variant="ghost" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>
                Create Task
              </Button>
            </>
          }
        >
          <form onSubmit={handleAddTask} className="stack" style={{ gap: '16px' }}>
            <TextField
              label="Action item title"
              required
              value={newTitle}
              onChange={setNewTitle}
              placeholder="e.g. Gather provider recommendations"
              error={error}
            />

            <div className="field">
              <label className="field__label">Target Due Date</label>
              <input
                type="date"
                className="input"
                value={newDue}
                min={toISODate(new Date())}
                onChange={(e) => setNewDue(e.target.value)}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
