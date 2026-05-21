// Shared Atoms — Phase 2
// Single source for all reusable UI primitives consumed by every prototype app.
// Published to `window` for Babel multi-file scope (no bundler).
// Path-relative img/asset src is resolved from each app's index.html, so
// "../assets/logo-mark.png" works for every app in prototypes/<app>/.

// -------- Formatters --------

function formatVND(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}
function Money({ value }) { return <span className="money">{formatVND(value)}</span>; }
function DateVN({ value }) { return <span>{value}</span>; }
function Phone({ value }) { return <span>{value}</span>; }

// -------- Logo --------

function Logo({ size = 56 }) {
  return (
    <img
      src="../assets/logo-mark.png"
      width={size}
      height={size}
      alt="HouseLeaf"
      style={{ objectFit: "contain" }}
    />
  );
}

// -------- Icon --------

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

// -------- Btn --------
// Unified API merging auth-server and manager-portal variants.
// variant: "primary" | "secondary" | "tertiary" | "text" | "danger"
// size:    undefined (default) | "sm"
// full:    boolean — width: 100%
// icon:    Material Symbols name string (rendered via <Icon>)

function Btn({ variant = "primary", full, size, children, onClick, type = "button", disabled, icon }) {
  const cls = ["btn", variant, full ? "full" : "", size === "sm" ? "sm" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {icon && <Icon name={icon} size={size === "sm" ? 16 : 18} />}
      {children}
    </button>
  );
}

// -------- IconBtn --------

function IconBtn({ icon, onClick, title }) {
  return (
    <button className="icon-btn" onClick={onClick} title={title} aria-label={title}>
      <Icon name={icon} size={20} />
    </button>
  );
}

// -------- Field --------

function Field({ label, type = "text", value, onChange, placeholder, help, error, name, autoComplete }) {
  return (
    <div className={`field${error ? " err" : ""}`}>
      <label className="lbl" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        className="inp"
        type={type}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        autoComplete={autoComplete}
      />
      {(error || help) && <span className="help">{error || help}</span>}
    </div>
  );
}

// -------- Checkbox --------

function Checkbox({ checked, onChange, children }) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange?.(e.target.checked)} />
      <span>{children}</span>
    </label>
  );
}

// -------- Alert --------

function Alert({ kind = "info", icon, children }) {
  return (
    <div className={`alert ${kind}`}>
      <span className="material-symbols-outlined" style={{ fontSize: 18, flexShrink: 0 }}>
        {icon || (kind === "err" ? "error" : "info")}
      </span>
      <span>{children}</span>
    </div>
  );
}

// -------- DividerOr --------

function DividerOr({ children = "hoặc" }) {
  return <div className="divider-or">{children}</div>;
}

// -------- Chip --------

function Chip({ status, children }) {
  return (
    <span className={`chip ${status}`}>
      <span className="dot" />
      {children}
    </span>
  );
}

// -------- Avatar --------

function Avatar({ initials, size = 36, color = "tertiary" }) {
  const bg = color === "primary" ? "var(--color-primary-container)" : "var(--color-tertiary)";
  const fg = color === "primary" ? "var(--color-primary-on-container)" : "var(--color-tertiary-on)";
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

// -------- Card --------

function Card({ children, dense, style, className = "" }) {
  return (
    <div className={`card${dense ? " dense" : ""}${className ? " " + className : ""}`} style={style}>
      {children}
    </div>
  );
}

// -------- Publish --------

Object.assign(window, {
  Logo, Icon, Btn, IconBtn,
  Field, Checkbox, Alert, DividerOr,
  Chip, Avatar, Card,
  formatVND, Money, DateVN, Phone,
});
