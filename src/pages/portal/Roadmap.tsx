import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { useDemo } from '../../state/DemoProvider';
import { getStages, roadmapProgress } from '../../state/selectors';
import { PageHeader, StatusBadge, ProgressBar } from '../../components/ui/Feedback';
import { dueLabel } from '../../lib/dates';
import { useToast } from '../../components/ui/Toast';

export default function Roadmap() {
  const { state, dispatch } = useDemo();
  const { toast } = useToast();

  const stages = getStages(state);
  const overallProgress = roadmapProgress(state);

  // Allow expanding/collapsing stages
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    consult: true,
    info: true,
    planning: true,
    support: true
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleTask = (taskId: string, currentDone: boolean) => {
    dispatch({
      type: 'TASK_SET',
      id: taskId,
      status: currentDone ? 'todo' : 'done'
    });
    toast({
      tone: currentDone ? 'info' : 'success',
      title: currentDone ? 'Task Reopened' : 'Task Completed',
      message: 'Roadmap progress and milestone tracking updated.'
    });
  };

  return (
    <div className="portal-page-container">
      <PageHeader
        eyebrow="Personalized Recovery Roadmap"
        title="Your Roadmap"
        description="An organized view of the next steps we've identified together. Non-clinical planning and logistical navigation."
      />

      {/* Roadmap Progress Card */}
      <section className="card card--sage" style={{ marginBottom: '32px' }}>
        <div className="row row--between row--wrap" style={{ gap: '16px', marginBottom: '14px' }}>
          <div>
            <h2 className="card__title">Overall Roadmap Progress</h2>
            <p className="small muted">
              {state.tasks.filter((t) => t.status === 'done').length} of {state.tasks.length} coordination milestones completed.
            </p>
          </div>
          <StatusBadge tone="sage">{overallProgress}% Completed</StatusBadge>
        </div>
        <ProgressBar value={overallProgress} label="Overall Roadmap Progress" size="md" />
      </section>

      {/* Refined Vertical Timeline */}
      <div className="roadmap-timeline">
        {stages.map((stage, idx) => {
          const isOpen = !!expanded[stage.def.id];
          const isDone = stage.status === 'completed';
          const isCurrent = stage.status === 'current';

          return (
            <div
              key={stage.def.id}
              className={`roadmap-stage-block is-${stage.status} ${isOpen ? 'is-open' : ''}`}
            >
              {/* Stage Header */}
              <div
                className="roadmap-stage-head"
                onClick={() => toggleExpand(stage.def.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
              >
                <div className="roadmap-marker">
                  {isDone ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <span>0{idx + 1}</span>
                  )}
                </div>

                <div className="roadmap-stage-title-wrap">
                  <div className="row" style={{ gap: '10px' }}>
                    <h3 className="roadmap-stage-name">{stage.def.title}</h3>
                    <StatusBadge
                      tone={isDone ? 'sage' : isCurrent ? 'sand' : 'neutral'}
                    >
                      {isDone ? 'Stage Completed' : isCurrent ? 'Active Stage' : 'Upcoming Stage'}
                    </StatusBadge>
                  </div>
                  <p className="small muted roadmap-stage-desc">{stage.def.description}</p>
                </div>

                <div className="roadmap-stage-toggle-icon">
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Stage Associated Tasks */}
              {isOpen && (
                <div className="roadmap-stage-body">
                  <div className="roadmap-tasks-list stack" style={{ gap: '10px' }}>
                    {stage.tasks.map((task) => {
                      const taskDone = task.status === 'done';
                      return (
                        <div
                          key={task.id}
                          className={`roadmap-task-row row row--between ${taskDone ? 'is-done' : ''}`}
                        >
                          <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
                            <button
                              type="button"
                              className="dash-task-toggle"
                              onClick={() => handleToggleTask(task.id, taskDone)}
                              aria-label={`Toggle task "${task.title}"`}
                            >
                              {taskDone ? (
                                <CheckCircle2 size={18} className="text-olive" />
                              ) : (
                                <Circle size={18} />
                              )}
                            </button>

                            <div>
                              <strong className={`roadmap-task-title ${taskDone ? 'is-struck' : ''}`}>
                                {task.title}
                              </strong>
                              <span className="small muted" style={{ display: 'block' }}>
                                {task.description}
                              </span>
                            </div>
                          </div>

                          <div className="roadmap-task-meta row" style={{ gap: '12px' }}>
                            <span className="small muted">{dueLabel(task.due)}</span>
                            <Link to={task.link} className="link-btn small">
                              {task.linkLabel} <ArrowRight size={13} />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
