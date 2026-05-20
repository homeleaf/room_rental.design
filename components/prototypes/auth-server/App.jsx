// AuthServer.UI Kit — recreation of HouseLeaf's Blazor auth surface.
// Vietnamese copy. Tokens from ../colors_and_type.css.

const { useState, useEffect } = React;

// ---------------- Tweaks ----------------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showGoogle": true,
  "showFacebook": true,
  "showPasskey": false,
  "ssoLayout": "stacked",
  "ssoStyle": "outlined",
  "showRemember": true
}/*EDITMODE-END*/;

// ---------------- SSO buttons ----------------

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.20c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.96 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z"/>
    </svg>
  );
}

function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#1877F2" d="M18 9a9 9 0 1 0-10.41 8.89V11.6H5.31V9h2.28V7.02c0-2.26 1.34-3.5 3.4-3.5.98 0 2.02.17 2.02.17v2.22h-1.14c-1.12 0-1.47.7-1.47 1.41V9h2.5l-.4 2.6h-2.1v6.29A9 9 0 0 0 18 9z"/>
    </svg>
  );
}

function SsoButton({ provider, style }) {
  const label = provider === "google" ? "Đăng nhập bằng Google" : "Đăng nhập bằng Facebook";
  const icon = provider === "google" ? <GoogleIcon /> : <FacebookIcon />;

  if (style === "brand") {
    const bg = provider === "google" ? "#fff"     : "#1877F2";
    const fg = provider === "google" ? "#1F1F1F"  : "#fff";
    const bd = provider === "google" ? "1px solid #DADCE0" : "0";
    return (
      <button className="btn full" style={{ background: bg, color: fg, border: bd, padding: provider === "google" ? "9px 16px" : "10px 16px" }}>
        {icon}{label}
      </button>
    );
  }
  // outlined (default) — neutral chrome, brand color only in the icon
  return (
    <button className="btn secondary full">
      {icon}{label}
    </button>
  );
}

function SsoBlock({ t }) {
  const providers = [
    t.showGoogle   && "google",
    t.showFacebook && "facebook",
  ].filter(Boolean);
  if (providers.length === 0 && !t.showPasskey) return null;

  return (
    <>
      <DividerOr>hoặc đăng nhập với</DividerOr>
      <div style={{
        display: t.ssoLayout === "inline" && providers.length === 2 ? "grid" : "flex",
        gridTemplateColumns: t.ssoLayout === "inline" && providers.length === 2 ? "1fr 1fr" : undefined,
        flexDirection: "column",
        gap: 8
      }}>
        {providers.map((p) => <SsoButton key={p} provider={p} style={t.ssoStyle} />)}
        {t.showPasskey && (
          <button className="btn secondary full"><span className="ico" style={{fontFamily:'Material Symbols Outlined', fontSize:18}}>passkey</span>Đăng nhập bằng passkey</button>
        )}
      </div>
    </>
  );
}

// ---------------- Atoms ----------------

function Logo({ size = 56 }) {
  return (
    <img src="../assets/logo-mark.png" width={size} height={size} alt="HouseLeaf" style={{ objectFit: 'contain' }} />
  );
}

function Field({ label, type = "text", value, onChange, placeholder, help, error, name, autoComplete }) {
  return (
    <div className={`field ${error ? "err" : ""}`}>
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

function Btn({ variant = "primary", full, children, onClick, type = "button", disabled, icon }) {
  return (
    <button type={type} className={`btn ${variant} ${full ? "full" : ""}`} onClick={onClick} disabled={disabled}>
      {icon && <span className="ico">{icon}</span>}
      {children}
    </button>
  );
}

function Checkbox({ checked, onChange, children }) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange?.(e.target.checked)} />
      <span>{children}</span>
    </label>
  );
}

function Alert({ kind = "info", icon, children }) {
  return (
    <div className={`alert ${kind}`}>
      <span className="ico">{icon || (kind === "err" ? "error" : "info")}</span>
      <span>{children}</span>
    </div>
  );
}

function DividerOr({ children = "hoặc" }) {
  return <div className="divider-or">{children}</div>;
}

// ---------------- Shell ----------------

function AuthShell({ title, sub, children, footer, alert }) {
  return (
    <div className="auth-card">
      <div className="auth-header">
        <Logo />
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {alert}
      {children}
      {footer && <div className="auth-footer">{footer}</div>}
    </div>
  );
}

// ---------------- Screens ----------------

function LoginScreen({ go, t }) {
  const [email, setEmail] = useState("hoang@example.vn");
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const showError = submitted && !pw;

  return (
    <AuthShell
      title="Đăng nhập"
      sub="Quản lý phòng trọ của bạn ở mọi nơi."
      alert={showError ? <Alert kind="err" icon="error">Vui lòng nhập mật khẩu.</Alert> : null}
      footer={<>Chưa có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); go("register"); }}>Đăng ký</a></>}
    >
      <Field label="Email" name="email" type="email" autoComplete="email" value={email} onChange={setEmail} placeholder="Nhập email của bạn" />
      <Field
        label="Mật khẩu"
        name="password"
        type="password"
        autoComplete="current-password"
        value={pw}
        onChange={setPw}
        placeholder="Nhập mật khẩu"
        error={showError ? "Vui lòng nhập mật khẩu." : null}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {t.showRemember
          ? <Checkbox checked={remember} onChange={setRemember}>Ghi nhớ đăng nhập</Checkbox>
          : <span />}
        <a href="#" onClick={(e) => { e.preventDefault(); go("forgot"); }} style={{ fontSize: 13, color: "var(--color-primary)", fontWeight: 500, textDecoration: "none" }}>Quên mật khẩu?</a>
      </div>
      <Btn variant="primary" full onClick={() => setSubmitted(true)}>Đăng nhập</Btn>
      <SsoBlock t={t} />
    </AuthShell>
  );
}

function RegisterScreen({ go }) {
  const [v, setV] = useState({ name: "", email: "", phone: "", pw: "", pw2: "" });
  const set = (k) => (val) => setV({ ...v, [k]: val });
  const [terms, setTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const phoneError = submitted && v.phone && !/^0\d{9,10}$/.test(v.phone.replace(/\s/g, ""))
    ? "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại."
    : null;

  return (
    <AuthShell
      title="Đăng ký tài khoản"
      sub="Bắt đầu quản lý phòng trọ của bạn — miễn phí."
      footer={<>Đã có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); go("login"); }}>Đăng nhập</a></>}
    >
      <Field label="Họ và tên" name="name" value={v.name} onChange={set("name")} placeholder="VD: Nguyễn Văn An" />
      <Field label="Email" name="email" type="email" value={v.email} onChange={set("email")} placeholder="Nhập email của bạn" />
      <Field label="Số điện thoại" name="phone" value={v.phone} onChange={set("phone")} placeholder="VD: 0912 345 678" error={phoneError} />
      <Field label="Mật khẩu" name="pw" type="password" value={v.pw} onChange={set("pw")} placeholder="Tối thiểu 8 ký tự" />
      <Field label="Nhập lại mật khẩu" name="pw2" type="password" value={v.pw2} onChange={set("pw2")} />
      <Checkbox checked={terms} onChange={setTerms}>
        <span>Tôi đồng ý với <a href="#" style={{ color: "var(--color-primary)" }}>Điều khoản sử dụng</a> và <a href="#" style={{ color: "var(--color-primary)" }}>Chính sách bảo mật</a>.</span>
      </Checkbox>
      <Btn variant="primary" full disabled={!terms} onClick={() => setSubmitted(true)}>Tạo tài khoản</Btn>
    </AuthShell>
  );
}

function ForgotScreen({ go }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <AuthShell
      title="Quên mật khẩu"
      sub="Nhập email để nhận liên kết đặt lại mật khẩu."
      alert={sent ? <Alert kind="info" icon="mark_email_read">Đã gửi liên kết đặt lại đến {email}. Vui lòng kiểm tra hộp thư.</Alert> : null}
      footer={<><a href="#" onClick={(e) => { e.preventDefault(); go("login"); }}>← Quay về đăng nhập</a></>}
    >
      <Field label="Email" name="email" type="email" value={email} onChange={setEmail} placeholder="Nhập email của bạn" />
      <Btn variant="primary" full onClick={() => setSent(true)} disabled={!email}>Gửi liên kết đặt lại</Btn>
    </AuthShell>
  );
}

function ConsentScreen({ go }) {
  const scopes = [
    { ico: "person", title: "Hồ sơ cá nhân", desc: "Tên, ảnh đại diện và email của bạn." },
    { ico: "bedroom_parent", title: "Danh sách phòng", desc: "Xem các phòng bạn đang quản lý (chỉ đọc)." },
    { ico: "payments", title: "Lịch sử thanh toán", desc: "Xem các giao dịch trong 90 ngày gần nhất." }
  ];
  return (
    <div className="auth-card" style={{ maxWidth: 460 }}>
      <div className="auth-header">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Logo size={48} />
          <span className="material-symbols-outlined" style={{ color: "var(--fg-2)", fontSize: 22 }}>sync_alt</span>
          <div className="app-avatar"><span>storefront</span></div>
        </div>
        <h1 style={{ marginTop: 4 }}>Cho phép truy cập?</h1>
        <div className="sub">
          <strong style={{ color: "var(--fg-1)" }}>Chợ Phòng Trọ</strong> muốn truy cập tài khoản HouseLeaf của bạn (hoang@example.vn).
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {scopes.map((s) => (
          <div className="oauth-scope" key={s.ico}>
            <span className="ico">{s.ico}</span>
            <div className="copy">
              <div className="title">{s.title}</div>
              <div className="desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.5 }}>
        Bạn có thể thu hồi quyền truy cập bất cứ lúc nào trong phần <a href="#" style={{ color: "var(--color-primary)" }}>Cài đặt → Ứng dụng đã kết nối</a>.
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="secondary" full onClick={() => go("login")}>Hủy</Btn>
        <Btn variant="primary" full onClick={() => go("login")}>Cho phép</Btn>
      </div>
    </div>
  );
}

// ---------------- Router ----------------

function App() {
  const [screen, setScreen] = useState("login");
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const screens = {
    login:    <LoginScreen go={setScreen} t={t} />,
    register: <RegisterScreen go={setScreen} />,
    forgot:   <ForgotScreen go={setScreen} />,
    consent:  <ConsentScreen go={setScreen} />
  };

  return (
    <div className="auth-page">
      {screens[screen]}
      <div className="auth-tabs">
        {[["login", "Đăng nhập"], ["register", "Đăng ký"], ["forgot", "Quên MK"], ["consent", "OAuth consent"]].map(([k, lbl]) => (
          <button key={k} className={screen === k ? "active" : ""} onClick={() => setScreen(k)}>{lbl}</button>
        ))}
      </div>
      <TweaksPanel>
        <TweakSection label="Nhà cung cấp đăng nhập" />
        <TweakToggle label="Google"   value={t.showGoogle}   onChange={(v) => setTweak("showGoogle", v)} />
        <TweakToggle label="Facebook" value={t.showFacebook} onChange={(v) => setTweak("showFacebook", v)} />
        <TweakToggle label="Passkey"  value={t.showPasskey}  onChange={(v) => setTweak("showPasskey", v)} />
        <TweakSection label="Hiển thị" />
        <TweakRadio label="Bố cục SSO" value={t.ssoLayout}
          options={["stacked", "inline"]}
          onChange={(v) => setTweak("ssoLayout", v)} />
        <TweakRadio label="Kiểu nút SSO" value={t.ssoStyle}
          options={["outlined", "brand"]}
          onChange={(v) => setTweak("ssoStyle", v)} />
        <TweakToggle label="Ghi nhớ đăng nhập" value={t.showRemember} onChange={(v) => setTweak("showRemember", v)} />
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
