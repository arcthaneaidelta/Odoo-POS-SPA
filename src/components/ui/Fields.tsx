import { useId, type ReactNode } from 'react';
import { Check } from 'lucide-react';

interface FieldShell {
  label: string;
  error?: string;
  help?: string;
  required?: boolean;
}

function Shell({ id, label, error, help, required, children }: FieldShell & { id: string; children: ReactNode }) {
  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {required && (
          <span className="req" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {help && !error && (
        <p className="field__help" id={`${id}-help`}>
          {help}
        </p>
      )}
      {error && (
        <p className="field__error" id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  );
}

const describe = (id: string, error?: string, help?: string) => (error ? `${id}-err` : help ? `${id}-help` : undefined);

interface TextProps extends FieldShell {
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'email' | 'tel' | 'password';
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  autoFocus?: boolean;
  suffix?: ReactNode;
}

export function TextField({ label, error, help, required, value, onChange, type = 'text', placeholder, autoComplete, name, autoFocus, suffix }: TextProps) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} help={help} required={required}>
      <div className="input-wrap">
        <input
          id={id}
          name={name}
          className="input"
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describe(id, error, help)}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix}
      </div>
    </Shell>
  );
}

interface SelectProps extends FieldShell {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}

export function SelectField({ label, error, help, required, value, onChange, options, placeholder = 'Select an option' }: SelectProps) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} help={help} required={required}>
      <select id={id} className="input select" value={value} aria-required={required} aria-invalid={!!error} aria-describedby={describe(id, error, help)} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Shell>
  );
}

interface AreaProps extends FieldShell {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({ label, error, help, required, value, onChange, placeholder, rows = 4 }: AreaProps) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} help={help} required={required}>
      <textarea id={id} className="input textarea" rows={rows} value={value} placeholder={placeholder} aria-required={required} aria-invalid={!!error} aria-describedby={describe(id, error, help)} onChange={(e) => onChange(e.target.value)} />
    </Shell>
  );
}

interface GroupProps {
  legend: string;
  options: string[];
  error?: string;
  required?: boolean;
  help?: string;
}

/** Selection cards (single choice). Native radios underneath for keyboard and screen-reader support. */
export function RadioCards({ legend, options, value, onChange, error, required, help, descriptions }: GroupProps & { value: string; onChange: (v: string) => void; descriptions?: Record<string, string> }) {
  const name = useId();
  return (
    <fieldset className={`group ${error ? 'field--error' : ''}`}>
      <legend className="field__label">
        {legend}
        {required && <span className="req" aria-hidden="true"> *</span>}
      </legend>
      <div className="choice-grid">
        {options.map((o) => (
          <label key={o} className={`choice ${value === o ? 'is-selected' : ''}`}>
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
            <span className="choice__mark" aria-hidden="true">
              {value === o && <Check size={12} strokeWidth={3} />}
            </span>
            <span className="choice__text">
              <strong>{o}</strong>
              {descriptions?.[o] && <small>{descriptions[o]}</small>}
            </span>
          </label>
        ))}
      </div>
      {help && !error && <p className="field__help">{help}</p>}
      {error && <p className="field__error">{error}</p>}
    </fieldset>
  );
}

export function CheckboxCards({ legend, options, value, onChange, error, required, help }: GroupProps & { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <fieldset className={`group ${error ? 'field--error' : ''}`}>
      <legend className="field__label">
        {legend}
        {required && <span className="req" aria-hidden="true"> *</span>}
      </legend>
      <div className="choice-grid">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <label key={o} className={`choice choice--check ${on ? 'is-selected' : ''}`}>
              <input type="checkbox" checked={on} onChange={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])} />
              <span className="choice__mark choice__mark--square" aria-hidden="true">
                {on && <Check size={12} strokeWidth={3} />}
              </span>
              <span className="choice__text">
                <strong>{o}</strong>
              </span>
            </label>
          );
        })}
      </div>
      {help && !error && <p className="field__help">{help}</p>}
      {error && <p className="field__error">{error}</p>}
    </fieldset>
  );
}

export function CheckboxField({ label, checked, onChange, error }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  const id = useId();
  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label className="check-row" htmlFor={id}>
        <input id={id} type="checkbox" checked={checked} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} onChange={(e) => onChange(e.target.checked)} />
        <span className="check-row__box" aria-hidden="true">
          {checked && <Check size={13} strokeWidth={3} />}
        </span>
        <span>{label}</span>
      </label>
      {error && (
        <p className="field__error" id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  );
}

export function Stepper({ steps, current, onStep }: { steps: string[]; current: number; onStep?: (i: number) => void }) {
  return (
    <nav className="stepper" aria-label="Progress">
      <p className="stepper__compact">
        Step {current + 1} of {steps.length}
        <strong>{steps[current]}</strong>
      </p>
      <div className="stepper__compactbar" aria-hidden="true">
        <span style={{ transform: `scaleX(${(current + 1) / steps.length})` }} />
      </div>
      <ol className="stepper__list">
        {steps.map((s, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'todo';
          const clickable = !!onStep && i < current;
          return (
            <li key={s} className={`stepper__item is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
              <button type="button" className="stepper__btn" disabled={!clickable} onClick={() => onStep?.(i)}>
                <span className="stepper__dot" aria-hidden="true">
                  {state === 'done' ? <Check size={13} strokeWidth={3} /> : i + 1}
                </span>
                <span className="stepper__label">{s}</span>
                {state === 'done' && <span className="sr-only"> (completed)</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
