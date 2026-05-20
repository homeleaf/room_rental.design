// Manager Portal — chrome: AppBar + Drawer + Shell

function AppBar({ onSearch }) {
  return (
    <header className="appbar">
      <div className="brand">
        <img src="../assets/logo-mark.png" width="32" height="32" alt="" style={{ objectFit: 'contain' }} />
        <div>
          <div className="brand-text">HouseLeaf</div>
          <div className="brand-sub">Simple Rental Management</div>
        </div>
      </div>
      <div className="search">
        <Icon name="search" size={20} />
        <input placeholder="Tìm phòng, người thuê, hợp đồng..." onChange={(e) => onSearch?.(e.target.value)} />
      </div>
      <div className="right">
        <button className="appbar-btn" title="Trợ giúp"><Icon name="help" /></button>
        <button className="appbar-btn" title="Thông báo">
          <Icon name="notifications" />
          <span className="badge">3</span>
        </button>
        <button className="appbar-btn" title="Cài đặt"><Icon name="settings" /></button>
        <div style={{ width: 8 }} />
        <Avatar initials="HM" />
      </div>
    </header>
  );
}

const NAV = [
  { id: "dashboard", label: "Tổng quan",   icon: "dashboard",      group: "Hoạt động" },
  { id: "rooms",     label: "Quản lý phòng", icon: "bedroom_parent", group: "Hoạt động" },
  { id: "room",      label: "Chi tiết phòng 101", icon: "meeting_room", group: "Hoạt động", indent: true },
  { id: "tenants",   label: "Người thuê",  icon: "person",         group: "Hoạt động" },
  { id: "contracts", label: "Hợp đồng",    icon: "description",    group: "Hoạt động" },
  { id: "payments",  label: "Thanh toán",  icon: "payments",       group: "Tài chính" },
  { id: "invoices",  label: "Hóa đơn",     icon: "receipt_long",   group: "Tài chính" },
  { id: "maint",     label: "Bảo trì",     icon: "build",          group: "Khác" },
  { id: "settings",  label: "Cài đặt",     icon: "settings",       group: "Khác" },
];

function Drawer({ current, onNavigate }) {
  const groups = NAV.reduce((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});
  return (
    <aside className="drawer">
      {Object.entries(groups).map(([group, items], gi) => (
        <React.Fragment key={group}>
          <div className="group-label">{group}</div>
          {items.map((item) => (
            <div
              key={item.id}
              className={`drawer-item ${current === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
              style={item.indent ? { marginLeft: 24, fontSize: 13 } : null}
            >
              <Icon name={item.icon} size={item.indent ? 18 : 22} />
              {item.label}
            </div>
          ))}
        </React.Fragment>
      ))}
      <div className="drawer-footer">
        <Icon name="logout" size={18} />
        <span>Đăng xuất</span>
      </div>
    </aside>
  );
}

function AppShell({ children, current, onNavigate }) {
  return (
    <div className="shell">
      <AppBar />
      <Drawer current={current} onNavigate={onNavigate} />
      <main className="content">{children}</main>
    </div>
  );
}

Object.assign(window, { AppBar, Drawer, AppShell, NAV });
