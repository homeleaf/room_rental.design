// HouseLeaf — Form controls: Icon, FieldShell, Select, MultiSelect, Autocomplete.
// Loaded as type="text/babel" — exports to window for subsequent scripts.

const { useState, useRef, useEffect, useCallback } = React;

/* ---------------- Icon (inline SVG — avoids icon-font ligature race) ---------------- */
function Icon({ name, size = 18, stroke = 2 }) {
  const P = {
    chevron:  <path d="M6 9l6 6 6-6" />,
    left:     <path d="M15 18l-6-6 6-6" />,
    right:    <path d="M9 18l6-6-6-6" />,
    check:    <path d="M20 6L9 17l-5-5" />,
    x:        <path d="M18 6L6 18M6 6l12 12" />,
    search:   <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></>,
    calendar: <><rect x="3" y="4.5" width="18" height="17" rx="2.5" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></>,
    clock:    <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    upload:   <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" /></>,
    file:     <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      {P[name]}
    </svg>
  );
}

/* close-on-outside-click hook */
function useOutside(onClose) {
  const ref = useRef(null);
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  return ref;
}

function FieldShell({ label, required, help, error, children }) {
  return (
    <div className={`field ${error ? 'err' : ''}`}>
      {label && <label className="lbl">{label}{required && <span className="req">*</span>}</label>}
      {children}
      {(error || help) && <span className="help">{error || help}</span>}
    </div>
  );
}

/* ---------------- Select (single) ---------------- */
function Select({ label, required, help, error, options, value, onChange, placeholder = 'Chọn...' }) {
  const [open, setOpen] = useState(false);
  const ref = useOutside(useCallback(() => setOpen(false), []));
  const sel = options.find((o) => o.value === value);
  return (
    <FieldShell label={label} required={required} help={help} error={error}>
      <div ref={ref} style={{ position: 'relative' }}>
        <button type="button" className={`control ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
          <span className="val">{sel ? sel.label : <span className="ph">{placeholder}</span>}</span>
          <span className="chev"><Icon name="chevron" size={18} /></span>
        </button>
        {open && (
          <div className="menu">
            {options.map((o) => (
              <button type="button" key={o.value}
                className={`opt ${o.value === value ? 'sel' : ''}`}
                onClick={() => { onChange(o.value); setOpen(false); }}>
                <span>{o.label}</span>
                <span className="tick"><Icon name="check" size={16} /></span>
              </button>
            ))}
          </div>
        )}
      </div>
    </FieldShell>
  );
}

/* ---------------- MultiSelect with chips ---------------- */
function MultiSelect({ label, required, help, error, options, value = [], onChange, placeholder = 'Chọn một hoặc nhiều...' }) {
  const [open, setOpen] = useState(false);
  const ref = useOutside(useCallback(() => setOpen(false), []));
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  const remove = (e, v) => { e.stopPropagation(); onChange(value.filter((x) => x !== v)); };
  return (
    <FieldShell label={label} required={required} help={help} error={error}>
      <div ref={ref} style={{ position: 'relative' }}>
        <div className={`control multi ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
          {value.length === 0 && <span className="ph">{placeholder}</span>}
          {value.map((v) => {
            const o = options.find((x) => x.value === v);
            return (
              <span className="tagchip" key={v}>
                {o ? o.label : v}
                <button type="button" className="x" onClick={(e) => remove(e, v)} aria-label="Bỏ chọn">
                  <Icon name="x" size={11} stroke={2.6} />
                </button>
              </span>
            );
          })}
          <span className="chev"><Icon name="chevron" size={18} /></span>
        </div>
        {open && (
          <div className="menu">
            {options.map((o) => {
              const on = value.includes(o.value);
              return (
                <button type="button" key={o.value} className={`opt ${on ? 'sel' : ''}`} onClick={() => toggle(o.value)}>
                  <span className="box"><Icon name="check" size={13} stroke={3} /></span>
                  <span>{o.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </FieldShell>
  );
}

/* ---------------- Autocomplete / suggestion ---------------- */
function Autocomplete({ label, required, help, error, options, value, onChange, placeholder = 'Nhập để tìm...' }) {
  const [q, setQ] = useState(value || '');
  const [open, setOpen] = useState(false);
  const [hl, setHl] = useState(0);
  const ref = useOutside(useCallback(() => setOpen(false), []));
  useEffect(() => { setQ(value || ''); }, [value]);

  const matches = options.filter((o) => o.toLowerCase().includes(q.trim().toLowerCase()));
  const pick = (o) => { onChange(o); setQ(o); setOpen(false); };

  const renderMatch = (o) => {
    const i = o.toLowerCase().indexOf(q.trim().toLowerCase());
    if (q.trim() === '' || i < 0) return o;
    return <>{o.slice(0, i)}<b>{o.slice(i, i + q.trim().length)}</b>{o.slice(i + q.trim().length)}</>;
  };

  return (
    <FieldShell label={label} required={required} help={help} error={error}>
      <div ref={ref} style={{ position: 'relative' }}>
        <div className="input-wrap">
          <span className="lead"><Icon name="search" size={16} /></span>
          <input className="control" type="text" value={q} placeholder={placeholder}
            onChange={(e) => { setQ(e.target.value); setOpen(true); setHl(0); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setHl((h) => Math.min(h + 1, matches.length - 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setHl((h) => Math.max(h - 1, 0)); }
              else if (e.key === 'Enter' && open && matches[hl]) { e.preventDefault(); pick(matches[hl]); }
              else if (e.key === 'Escape') setOpen(false);
            }} />
        </div>
        {open && (
          <div className="menu">
            {matches.length === 0
              ? <div className="empty">Không có kết quả phù hợp.</div>
              : matches.map((o, i) => (
                <button type="button" key={o} className={`opt ${i === hl ? 'hl' : ''}`}
                  onMouseEnter={() => setHl(i)} onClick={() => pick(o)}>
                  <span>{renderMatch(o)}</span>
                </button>
              ))}
          </div>
        )}
      </div>
    </FieldShell>
  );
}

Object.assign(window, { Icon, useOutside, FieldShell, Select, MultiSelect, Autocomplete });
