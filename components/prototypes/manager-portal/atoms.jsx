// Manager Portal — portal-specific atoms.
// Shared atoms (Icon, Btn, IconBtn, Chip, Card, Avatar, formatVND, Money, DateVN, Phone)
// come from shared/atoms.jsx (loaded by index.html before this file).

// -------- KPI card --------

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

// -------- Page header with breadcrumbs --------

function PageHeader({ crumbs, title, action }) {
  return (
    <div className="page-header">
      <div>
        {crumbs && (
          <div className="crumbs">
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span>›</span>}
                {c.href
                  ? <a href="#" onClick={(e) => e.preventDefault()}>{c.label}</a>
                  : <span style={{ color: "var(--fg-1)" }}>{c.label}</span>}
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

// -------- Filter chip (portal toolbar variant) --------

function FilterChip({ children, on, onClick, icon }) {
  return (
    <button className={`filter-chip${on ? " on" : ""}`} onClick={onClick}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  );
}

// -------- Publish --------

Object.assign(window, { Kpi, PageHeader, FilterChip });
