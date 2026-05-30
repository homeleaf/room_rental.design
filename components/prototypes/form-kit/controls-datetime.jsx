// HouseLeaf — Form controls: Calendar, DatePicker (+ datetime), Uploader.
// Depends on: controls-select.jsx (Icon, useOutside, FieldShell)

const { useState: useStateC, useRef: useRefC, useCallback: useCallbackC } = React;

const WD = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => d ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}` : '';
const fmtDateTime = (d) => d ? `${fmtDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}` : '';
const sameDay = (a, b) => a && b && a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

function Calendar({ value, onPick, withTime }) {
  const today = new Date();
  const [view, setView] = useStateC(value ? new Date(value) : new Date());
  const [h, setH] = useStateC(value ? value.getHours() : 9);
  const [m, setM] = useStateC(value ? value.getMinutes() : 0);

  const year = view.getFullYear(), month = view.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d, h, m));

  const commit = (d) => {
    const nd = new Date(d);
    if (withTime) { nd.setHours(h); nd.setMinutes(m); }
    onPick(nd);
  };

  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" onClick={() => setView(new Date(year, month - 1, 1))} aria-label="Tháng trước">
          <Icon name="left" size={18} />
        </button>
        <span className="mlabel">Tháng {month + 1}, {year}</span>
        <button type="button" onClick={() => setView(new Date(year, month + 1, 1))} aria-label="Tháng sau">
          <Icon name="right" size={18} />
        </button>
      </div>
      <div className="cal-grid">
        {WD.map((w) => <div className="wd" key={w}>{w}</div>)}
        {cells.map((d, i) => d === null
          ? <div key={'e' + i}></div>
          : <button type="button" key={i}
              className={`day ${sameDay(d, today) ? 'today' : ''} ${sameDay(d, value) ? 'sel' : ''}`}
              onClick={() => commit(d)}>{d.getDate()}</button>
        )}
      </div>
      <div className="cal-foot">
        <button type="button" className="today-link"
          onClick={() => { setView(new Date()); commit(new Date()); }}>
          Hôm nay
        </button>
        {withTime && (
          <div className="time-sel">
            <select value={h} onChange={(e) => {
              const v = +e.target.value; setH(v);
              if (value) { const nd = new Date(value); nd.setHours(v); onPick(nd); }
            }}>
              {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{pad(i)}</option>)}
            </select>
            <span style={{ color: 'var(--fg-2)' }}>:</span>
            <select value={m} onChange={(e) => {
              const v = +e.target.value; setM(v);
              if (value) { const nd = new Date(value); nd.setMinutes(v); onPick(nd); }
            }}>
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((i) => (
                <option key={i} value={i}>{pad(i)}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

function DatePicker({ label, required, help, error, value, onChange, withTime, placeholder }) {
  const [open, setOpen] = useStateC(false);
  const ref = useOutside(useCallbackC(() => setOpen(false), []));
  const ph = placeholder || (withTime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY');
  return (
    <FieldShell label={label} required={required} help={help} error={error}>
      <div ref={ref} style={{ position: 'relative' }}>
        <button type="button" className={`control ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
          <span style={{ color: 'var(--fg-2)', display: 'flex' }}>
            <Icon name={withTime ? 'clock' : 'calendar'} size={18} />
          </span>
          <span className="val">
            {value ? (withTime ? fmtDateTime(value) : fmtDate(value)) : <span className="ph">{ph}</span>}
          </span>
          <span className="chev"><Icon name="chevron" size={18} /></span>
        </button>
        {open && (
          <div className="menu" style={{ padding: 0, left: 0, right: 'auto' }}>
            <Calendar value={value} withTime={withTime}
              onPick={(d) => { onChange(d); if (!withTime) setOpen(false); }} />
          </div>
        )}
      </div>
    </FieldShell>
  );
}

/* ---------------- Uploader (drag-drop) ---------------- */
const fmtSize = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`;

function Uploader({ label, help, accept = 'PNG, JPG, PDF · tối đa 10MB', multiple = true }) {
  const [files, setFiles] = useStateC([]);
  const [drag, setDrag] = useStateC(false);
  const inputRef = useRefC(null);

  const add = (list) => {
    const arr = Array.from(list).map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name, size: f.size, pct: 0,
    }));
    setFiles((prev) => (multiple ? [...prev, ...arr] : arr.slice(0, 1)));
    arr.forEach((f) => {
      let p = 0;
      const t = setInterval(() => {
        p += Math.random() * 28 + 8;
        setFiles((prev) => prev.map((x) => x.id === f.id ? { ...x, pct: Math.min(100, p) } : x));
        if (p >= 100) clearInterval(t);
      }, 220);
    });
  };

  return (
    <FieldShell label={label} help={help}>
      <div className={`dropzone ${drag ? 'drag' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}>
        <span className="ic"><Icon name="upload" size={30} stroke={1.6} /></span>
        <span className="t1"><b>Bấm để chọn tệp</b> hoặc kéo thả vào đây</span>
        <span className="t2">{accept}</span>
        <input ref={inputRef} type="file" multiple={multiple} hidden onChange={(e) => add(e.target.files)} />
      </div>
      {files.length > 0 && (
        <div className="filelist" style={{ marginTop: 12 }}>
          {files.map((f) => (
            <div className="fileitem" key={f.id}>
              <span className="fic"><Icon name="file" size={18} /></span>
              <div className="meta">
                <span className="nm">{f.name}</span>
                <span className="sz">{fmtSize(f.size)}{f.pct < 100 ? ` · ${Math.round(f.pct)}%` : ''}</span>
                {f.pct < 100 && <span className="bar"><i style={{ width: `${f.pct}%` }}></i></span>}
              </div>
              {f.pct >= 100 && <span className="done"><Icon name="check" size={18} /></span>}
              <button type="button" className="rm" aria-label="Xóa tệp"
                onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}>
                <Icon name="x" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </FieldShell>
  );
}

Object.assign(window, { Calendar, DatePicker, Uploader, fmtDate, fmtDateTime });
