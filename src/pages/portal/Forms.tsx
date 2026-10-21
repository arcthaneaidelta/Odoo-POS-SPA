import { useState } from 'react';
import {
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useDemo } from '../../state/DemoProvider';
import { FORM_DEFS, type FormDef } from '../../content/forms';
import type { FormValue } from '../../state/types';
import { PageHeader, StatusBadge } from '../../components/ui/Feedback';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Dialog';
import { TextField, SelectField, TextAreaField, RadioCards, CheckboxCards, CheckboxField } from '../../components/ui/Fields';
import { useToast } from '../../components/ui/Toast';
import { formatShortDate } from '../../lib/dates';

export default function Forms() {
  const { state, dispatch } = useDemo();
  const { toast } = useToast();

  const [activeFilter, setActiveFilter] = useState<'all' | 'todo' | 'completed'>('all');
  const [activeFormDef, setActiveFormDef] = useState<FormDef | null>(null);
  const [formData, setFormData] = useState<Record<string, FormValue>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenForm = (def: FormDef) => {
    setActiveFormDef(def);
    const existing = state.forms[def.id]?.values || {};
    setFormData(existing);
    setFormErrors({});
  };

  const handleSaveDraft = () => {
    if (!activeFormDef) return;
    dispatch({
      type: 'FORM_SAVE',
      id: activeFormDef.id,
      values: formData,
      submit: false
    });
    toast({ tone: 'info', title: 'Draft Saved', message: `${activeFormDef.title} progress saved.` });
    setActiveFormDef(null);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFormDef) return;

    // Validate required fields
    const errs: Record<string, string> = {};
    activeFormDef.fields.forEach((field) => {
      if (field.required) {
        const val = formData[field.name];
        if (field.type === 'checkbox' && !val) {
          errs[field.name] = 'This acknowledgment is required.';
        } else if (field.type === 'checkboxes' && (!Array.isArray(val) || val.length === 0)) {
          errs[field.name] = 'Please select at least one option.';
        } else if (!val || (typeof val === 'string' && !val.trim())) {
          errs[field.name] = `${field.label} is required.`;
        }
      }
    });

    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    dispatch({
      type: 'FORM_SAVE',
      id: activeFormDef.id,
      values: formData,
      submit: true
    });
    toast({ tone: 'success', title: 'Form Submitted', message: `${activeFormDef.title} is now completed.` });
    setActiveFormDef(null);
  };

  const filteredForms = FORM_DEFS.filter((def) => {
    const record = state.forms[def.id];
    const status = record?.status || 'todo';
    if (activeFilter === 'todo') return status !== 'completed';
    if (activeFilter === 'completed') return status === 'completed';
    return true;
  });

  return (
    <div className="portal-page-container">
      <PageHeader
        eyebrow="Forms Center"
        title="Intake & Questionnaires"
        description="Complete and review your coordination preferences, communication instructions, and acknowledgments."
      />

      {/* Filter Tabs */}
      <div className="row row--between row--wrap" style={{ marginBottom: '24px' }}>
        <div className="seg" role="tablist" aria-label="Forms Filter">
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          >
            All Forms <span className="count">({FORM_DEFS.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'todo'}
            onClick={() => setActiveFilter('todo')}
          >
            To Complete
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'completed'}
            onClick={() => setActiveFilter('completed')}
          >
            Completed
          </button>
        </div>

        <span className="small muted">
          Demo data stored in local session
        </span>
      </div>

      {/* Forms Grid */}
      <div className="forms-grid">
        {filteredForms.map((def) => {
          const record = state.forms[def.id];
          const status = record?.status || 'todo';
          const isDone = status === 'completed';
          const isDraft = status === 'draft';

          return (
            <div key={def.id} className="card form-item-card">
              <div className="card__head">
                <span className="form-item-icon">
                  <FileText size={20} />
                </span>
                <StatusBadge
                  tone={isDone ? 'sage' : isDraft ? 'sand' : 'neutral'}
                >
                  {isDone ? 'Completed' : isDraft ? 'In Progress' : 'To Complete'}
                </StatusBadge>
              </div>

              <h2 className="form-item-title">{def.title}</h2>
              <p className="small muted form-item-desc">{def.description}</p>

              <div className="form-item-meta row row--between">
                <span className="small muted row">
                  <Clock size={13} />
                  <span>Est. {def.minutes} mins</span>
                </span>
                {record?.updatedAt && (
                  <span className="small muted">
                    Updated {formatShortDate(record.updatedAt.slice(0, 10))}
                  </span>
                )}
              </div>

              <div style={{ marginTop: '20px' }}>
                <Button
                  variant={isDone ? 'secondary' : 'primary'}
                  block
                  onClick={() => handleOpenForm(def)}
                  iconAfter={<ArrowRight size={15} />}
                >
                  {isDone ? 'Review Submission' : isDraft ? 'Resume Form' : 'Start Form'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Completion Modal */}
      {activeFormDef && (
        <Modal
          open={!!activeFormDef}
          onClose={() => setActiveFormDef(null)}
          title={activeFormDef.title}
          description={`Estimated time: ~${activeFormDef.minutes} minutes. You can save your draft at any point.`}
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={handleSaveDraft}>
                Save Draft
              </Button>
              <Button onClick={handleSubmitForm}>
                Submit Demo Form
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmitForm} className="form-modal-body stack" style={{ gap: '20px' }}>
            {activeFormDef.fields.map((field) => {
              const val = formData[field.name];
              const err = formErrors[field.name];

              if (field.type === 'text' || field.type === 'email' || field.type === 'tel') {
                return (
                  <TextField
                    key={field.name}
                    label={field.label}
                    required={field.required}
                    type={field.type}
                    value={(val as string) || ''}
                    onChange={(v) => setFormData({ ...formData, [field.name]: v })}
                    error={err}
                    placeholder={field.placeholder}
                    help={field.help}
                  />
                );
              }

              if (field.type === 'select' && field.options) {
                return (
                  <SelectField
                    key={field.name}
                    label={field.label}
                    required={field.required}
                    value={(val as string) || ''}
                    onChange={(v) => setFormData({ ...formData, [field.name]: v })}
                    options={field.options}
                    error={err}
                    help={field.help}
                  />
                );
              }

              if (field.type === 'textarea') {
                return (
                  <TextAreaField
                    key={field.name}
                    label={field.label}
                    required={field.required}
                    value={(val as string) || ''}
                    onChange={(v) => setFormData({ ...formData, [field.name]: v })}
                    error={err}
                    placeholder={field.placeholder}
                    help={field.help}
                  />
                );
              }

              if (field.type === 'radio' && field.options) {
                return (
                  <RadioCards
                    key={field.name}
                    legend={field.label}
                    required={field.required}
                    options={field.options}
                    value={(val as string) || ''}
                    onChange={(v) => setFormData({ ...formData, [field.name]: v })}
                    error={err}
                    help={field.help}
                  />
                );
              }

              if (field.type === 'checkboxes' && field.options) {
                return (
                  <CheckboxCards
                    key={field.name}
                    legend={field.label}
                    required={field.required}
                    options={field.options}
                    value={(val as string[]) || []}
                    onChange={(v) => setFormData({ ...formData, [field.name]: v })}
                    error={err}
                    help={field.help}
                  />
                );
              }

              if (field.type === 'checkbox') {
                return (
                  <CheckboxField
                    key={field.name}
                    label={field.label}
                    checked={!!val}
                    onChange={(v) => setFormData({ ...formData, [field.name]: v })}
                    error={err}
                  />
                );
              }

              return null;
            })}
          </form>
        </Modal>
      )}
    </div>
  );
}
