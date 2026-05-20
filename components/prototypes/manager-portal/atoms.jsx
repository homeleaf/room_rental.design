// Manager Portal — shared atoms.
// All components published to window for Babel multi-file scope.

const { useState, useMemo } = React;

// ---------- formatters ----------
function formatVND(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}
function Money({ value }) { return <span className="money">{formatVND(value)}</span>; }
function DateVN({ value }) { return <span className="money">{value}</span>; } // value already DD/MM/YYYY in mocks
function Phone({ value }) { return <span className="money">{value}</span>; }

// ---------- atoms ----------
function Icon({ name, size = 20, filled = false, color }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: size,
        fontVariationSettings: filled ? "'FILL' 1" : undefined,
        color,
        verticalAlign: "middle",
      }}
    >
      {name}
    </span>
  );
}

function Btn({ variant = "primary", size, children, onClick, icon, type = "button", disabled }) {
  return (
    <button type={type} className={`btn ${variant} ${size === "sm" ? "sm" : ""}`} onClick={onClick} disabled={disabled}>
      {icon && <Icon name={icon} size={size === "sm" ? 16 : 18} />}
      {children}
    </button>
  );
}

function IconBtn({ icon, onClick, title }) {
  return (
    <button className="icon-btn" onClick={onClick} title={title} aria-label={title}>
      <Icon name={icon} size={20} />
    </button>
  );
}

function Chip({ status, children }) {
  return <span className={`chip ${status}`}><span className="dot"/>{children}</span>;
}

function Card({ children, dense, style, className = "" }) {
  return <div className={`card ${dense ? "dense" : ""} ${className}`} style={style}>{children}</div>;
}

function Kpi({ label, value, delta, deltaDir = "up", icon }) {
  return (
    <div className="kpi">
      <div className="row between">
        <span className="lbl">{label}</span>
        {icon && <Icon name={icon} size={18} color="var(--color-primary)" />}
      </div>
      <div className="num">{value}</div>
      {delta && (
        <span className={`delta ${deltaDir}`}>
          <Icon name={deltaDir === "up" ? "trending_up" : "trending_down"} size={14} />
          {delta}
        </span>
      )}
    </div>
  );
}

function PageHeader({ crumbs, title, action }) {
  return (
    <div className="page-header">
      <div>
        {crumbs && (
          <div className="crumbs">
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span>›</span>}
                {c.href ? <a href="#" onClick={(e) => e.preventDefault()}>{c.label}</a> : <span style={{ color: "var(--fg-1)" }}>{c.label}</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        <h1>{title}</h1>
      </div>
      {action}
    </div>
  );
}

function FilterChip({ children, on, onClick, icon }) {
  return (
    <button className={`filter-chip ${on ? "on" : ""}`} onClick={onClick}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  );
}

function Avatar({ initials, size = 36, color = "tertiary" }) {
  const bg = color === "primary" ? "var(--color-primary-container)" : "var(--color-tertiary)";
  const fg = color === "primary" ? "var(--color-primary-on-container)" : "var(--color-tertiary-on)";
  return (
    <span className="avatar" style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}>
      {initials}
    </span>
  );
}

Object.assign(window, { Icon, Btn, IconBtn, Chip, Card, Kpi, PageHeader, FilterChip, Avatar, Money, DateVN, Phone, formatVND });
