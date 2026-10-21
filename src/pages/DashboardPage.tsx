import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { RevenueLineChart } from '../components/charts/RevenueLineChart';
import { PlatformDonutChart } from '../components/charts/PlatformDonutChart';
import { TimelineCalendar } from '../components/charts/TimelineCalendar';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useDemo } from '../context/DemoContext';
import {
  TrendingUp,
  KeyRound,
  DollarSign,
  Clock,
  Plus,
  CheckSquare,
  Square,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { state, dispatch, addToast, navigate } = useDemo();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskRoom, setNewTaskRoom] = useState('Room 305 · Penthouse');
  const [newTaskAssignee, setNewTaskAssignee] = useState('John Henderson');

  const { metrics, tasks } = state;

  const handleToggleTask = (taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
    const targetTask = tasks.find((t) => t.id === taskId);
    if (targetTask) {
      addToast(
        targetTask.completed ? 'Task Re-opened' : 'Task Completed',
        `"${targetTask.title}" updated.`,
        'info'
      );
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    dispatch({
      type: 'ADD_TASK',
      payload: {
        title: newTaskTitle,
        dueDate: 'Today · Jan 23, 2026',
        roomUnit: newTaskRoom,
        assignee: newTaskAssignee,
        completed: false,
        priority: 'medium',
      },
    });

    addToast('Task Created', `Assigned to ${newTaskAssignee}`, 'success');
    setNewTaskTitle('');
    setIsAddTaskModalOpen(false);
  };

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Monitor your key performance indicators and autonomous workflows"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Metric Cards Row (matching CheckinOs Reference Image 1) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {/* Card 1: Occupancy Rate (Dark Forest Green Card) */}
          <div
            style={{
              backgroundColor: '#0D4E43',
              borderRadius: '12px',
              padding: '1.25rem',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(13, 78, 67, 0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
                Occupancy Rate
              </span>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUp size={16} color="#34D399" />
              </div>
            </div>

            <div style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              {metrics.occupancyRate}%
            </div>

            <div style={{ fontSize: '0.78rem', color: '#6EE7B7', fontWeight: 600, marginTop: '0.35rem' }}>
              {metrics.occupancyRateDelta}
            </div>
          </div>

          {/* Card 2: Check-ins Today */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                Check-ins Today
              </span>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <KeyRound size={16} color="#0D4E43" />
              </div>
            </div>

            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>
              {metrics.checkInsToday}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500, marginTop: '0.35rem' }}>
              {metrics.checkInsProcessed} Processed · {metrics.checkInsPending} Pending
            </div>
          </div>

          {/* Card 3: Revenue Today */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                Revenue Today
              </span>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DollarSign size={16} color="#0D4E43" />
              </div>
            </div>

            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>
              ${metrics.revenueToday.toLocaleString()}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 600, marginTop: '0.35rem' }}>
              {metrics.revenueTodayDelta}
            </div>
          </div>

          {/* Card 4: Tasks */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                Tasks
              </span>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Clock size={16} color="#0D4E43" />
              </div>
            </div>

            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>
              {tasks.length}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500, marginTop: '0.35rem' }}>
              <span style={{ color: '#DC2626', fontWeight: 600 }}>
                {tasks.filter((t) => !t.completed && t.priority === 'high').length} Overdue
              </span>
              {' · '}
              <span style={{ color: '#16A34A', fontWeight: 600 }}>
                {tasks.filter((t) => t.completed).length} Completed
              </span>
            </div>
          </div>
        </div>

        {/* Middle Charts Grid (Total Revenue line chart + Platform donut chart) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <RevenueLineChart />
          <PlatformDonutChart />
        </div>

        {/* Bottom Section: Booking Schedule + Tasks Checklist (matching CheckinOs) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* Booking Calendar Schedule Component */}
          <TimelineCalendar />

          {/* Operational Tasks Card matching CheckinOs */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                Operational Tasks
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddTaskModalOpen(true)}
                iconLeft={<Plus size={14} />}
                style={{ fontSize: '0.78rem' }}
              >
                Add Task
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {tasks.map((task) => {
                const isFeatured = task.id === 'task-1' && task.completed;

                return (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    style={{
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      cursor: 'pointer',
                      backgroundColor: isFeatured ? '#0D4E43' : '#F8FAFC',
                      color: isFeatured ? '#FFFFFF' : '#0F172A',
                      border: isFeatured ? '1px solid #0B3F36' : '1px solid #E2E8F0',
                      transition: 'all 150ms ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isFeatured) {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#CBD5E1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isFeatured) {
                        e.currentTarget.style.backgroundColor = '#F8FAFC';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                      }
                    }}
                  >
                    <div style={{ marginTop: '2px', flexShrink: 0 }}>
                      {task.completed ? (
                        <CheckSquare size={18} color={isFeatured ? '#34D399' : '#10B981'} />
                      ) : (
                        <Square size={18} color={isFeatured ? '#FFFFFF' : '#94A3B8'} />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: isFeatured ? 'rgba(255,255,255,0.75)' : '#64748B',
                          fontWeight: 500,
                        }}
                      >
                        {task.dueDate}
                      </div>

                      <div
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: isFeatured ? '#FFFFFF' : '#0F172A',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          marginTop: '0.15rem',
                        }}
                      >
                        {task.roomUnit} · {task.title}
                      </div>

                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: isFeatured ? '#A7F3D0' : '#475569',
                          marginTop: '0.35rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: isFeatured ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
                            fontSize: '0.62rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                          }}
                        >
                          {task.assignee.charAt(0)}
                        </span>
                        {task.assignee}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        title="Add Operational Task"
        subtitle="Schedule housekeeping, maintenance, or concierge preparations"
        maxWidth="480px"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsAddTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateTask}>
              Save Task
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Task Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Inspect Smart Lock and Keypad Battery"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Target Room / Unit
            </label>
            <input
              type="text"
              value={newTaskRoom}
              onChange={(e) => setNewTaskRoom(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Assignee
            </label>
            <input
              type="text"
              value={newTaskAssignee}
              onChange={(e) => setNewTaskAssignee(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                outline: 'none',
              }}
            />
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
