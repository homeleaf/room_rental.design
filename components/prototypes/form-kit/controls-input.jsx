// HouseLeaf — Form controls: Radio, RadioCards, Toggle, Checkbox, Stepper.
// Depends on: controls-select.jsx (Icon, FieldShell)

const { useState: useStateB } = React;

/* ---------------- Radio group ---------------- */
function RadioGroup({ label, options, value, onChange, row, name }) {
  const nm = name || 'r' + Math.random().toString(36).slice(2);
  return (
    <FieldShell label={label}>
      <div className={`radio-group ${row ? 'row' : ''}`}>
        {options.map((o) => {
          const disabled = o.disabled;
          return (
            <label key={o.value} className={`radio ${disabled ? 'disabled' : ''}`} style={{ position: 'relative' }}>
              <input type="radio" name={nm} checked={value === o.value} disabled={disabled}
                onChange={() => !disabled && onChange(o.value)} />
              <span className="dot"></span>
              <span>{o.label}</span>
            </label>
          );
        })}
      </div>
    </FieldShell>
  );
}

/* ---------------- Radio cards ---------------- */
function RadioCards({ label, options, value, onChange }) {
  return (
    <FieldShell label={label}>
      <div className="radio-cards">
        {options.map((o) => (
          <div key={o.value} className={`radio-card ${value === o.value ? 'sel' : ''}`} onClick={() => onChange(o.value)}>
            <span className="dot"></span>
            <span className="ct">
              <span className="ti">{o.label}</span>
              {o.desc && <span className="de">{o.desc}</span>}
            </span>
          </div>
        ))}
      </div>
    </FieldShell>
  );
}

/* ---------------- Toggle / switch ---------------- */
function Toggle({ title, desc, checked, onChange, disabled }) {
  return (
    <div className="toggle-row">
      <span className="tl">
        <span className="ti">{title}</span>
        {desc && <span className="de">{desc}</span>}
      </span>
      <label className={`switch ${disabled ? 'disabled' : ''}`}>
        <input type="checkbox" checked={checked} disabled={disabled}
          onChange={(e) => !disabled && onChange(e.target.checked)} />
        <span className="track"></span>
        <span className="thumb"></span>
      </label>
    </div>
  );
}

/* ---------------- Checkbox ---------------- */
function Checkbox({ label, checked, onChange }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="box"><Icon name="check" size={13} stroke={3} /></span>
      <span>{label}</span>
    </label>
  );
}

/* ---------------- Stepper / number ---------------- */
function Stepper({ label, value, onChange, min = 0, max = 99, step = 1, suffix }) {
  const set = (n) => onChange(Math.max(min, Math.min(max, n)));
  return (
    <FieldShell label={label}>
      <div className="stepper">
        <button type="button" onClick={() => set(value - step)} disabled={value <= min} aria-label="Giảm">−</button>
        <input type="text" inputMode="numeric" value={suffix ? `${value}${suffix}` : value}
          onChange={(e) => { const n = parseInt(e.target.value.replace(/\D/g, ''), 10); if (!isNaN(n)) set(n); }} />
        <button type="button" onClick={() => set(value + step)} disabled={value >= max} aria-label="Tăng">+</button>
      </div>
    </FieldShell>
  );
}

Object.assign(window, { RadioGroup, RadioCards, Toggle, Checkbox, Stepper });
