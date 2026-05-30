// AuthServer.UI Kit — recreation of HouseLeaf's Blazor auth surface.
// Vietnamese copy. Tokens from generated/prototype/base.css (loaded by index.html).
// Shared atoms (Logo, Btn, Field, Checkbox, Alert, DividerOr) come from shared/atoms.jsx.

const { useState, useRef, useEffect } = React;

// ---------------- Tweaks ----------------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showGoogle": true,
  "showFacebook": true,
  "showPasskey": false,
  "ssoLayout": "stacked",
  "ssoStyle": "outlined",
  "showRemember": true
}/*EDITMODE-END*/;

// ---------------- Phone field — country selector ----------------

const F = {
  VN: <svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#DA251D"/><path fill="#FF0" d="M15 5l1.18 3.63h3.82l-3.09 2.24 1.18 3.63L15 12.26l-3.09 2.24 1.18-3.63L10 8.63h3.82z"/></svg>,
  US: <svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><g fill="#B22234"><rect width="30" height="1.54" y="0"/><rect width="30" height="1.54" y="3.08"/><rect width="30" height="1.54" y="6.15"/><rect width="30" height="1.54" y="9.23"/><rect width="30" height="1.54" y="12.31"/><rect width="30" height="1.54" y="15.38"/><rect width="30" height="1.54" y="18.46"/></g><rect width="13" height="10.77" fill="#3C3B6E"/></svg>,
  GB: <svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#012169"/><path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="3"/><path d="M0 0l30 20M30 0L0 20" stroke="#C8102E" strokeWidth="1.5"/><path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="5"/><path d="M15 0v20M0 10h30" stroke="#C8102E" strokeWidth="3"/></svg>,
  JP: <svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#BC002D"/></svg>,
  KR: <svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="5" fill="#CD2E3A"/><path d="M15 5a5 5 0 0 0 0 10 2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 0 0-5z" fill="#0047A0"/></svg>,
  CN: <svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#DE2910"/><path fill="#FFDE00" d="M6 4l1 2.6 2.7-.7-1.9 2 1.9 2-2.7-.7L6 14l-.4-2.8L3 12l2.3-1.7L4.1 8l2.5 1z"/></svg>,
  SG: <svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect width="30" height="10" fill="#ED2939"/><path d="M9 5a4 4 0 1 0 0 8 4.5 4.5 0 1 1 0-8z" fill="#fff"/></svg>,
  AU: <svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#00247D"/><rect width="15" height="10" fill="#00247D"/><path d="M0 0l15 10M15 0L0 10" stroke="#fff" strokeWidth="1.6"/><path d="M7.5 0v10M0 5h15" stroke="#fff" strokeWidth="2.5"/><path d="M7.5 0v10M0 5h15" stroke="#C8102E" strokeWidth="1.4"/><circle cx="22" cy="13" r="1.4" fill="#fff"/><circle cx="25" cy="7" r="1.1" fill="#fff"/></svg>,
  FR: <svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect width="10" height="20" fill="#002654"/><rect width="10" height="20" x="20" fill="#CE1126"/></svg>,
  DE: <svg viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#000"/><rect width="30" height="6.67" y="6.67" fill="#DD0000"/><rect width="30" height="6.67" y="13.33" fill="#FFCE00"/></svg>,
  TH: <svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#A51931"/><rect width="30" height="13.3" y="3.3" fill="#fff"/><rect width="30" height="6.7" y="6.7" fill="#2D2A4A"/></svg>,
  MY: <svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#cc0001"/><g fill="#fff"><rect width="30" height="1.43" y="1.43"/><rect width="30" height="1.43" y="4.29"/><rect width="30" height="1.43" y="7.14"/><rect width="30" height="1.43" y="10"/><rect width="30" height="1.43" y="12.86"/><rect width="30" height="1.43" y="15.71"/><rect width="30" height="1.43" y="18.57"/></g><rect width="15" height="11.43" fill="#010066"/></svg>,
};

const COUNTRIES = [
  { iso: "VN", name: "Việt Nam",   dial: "+84", min: 9,  max: 9  },
  { iso: "US", name: "Hoa Kỳ",    dial: "+1",  min: 10, max: 10 },
  { iso: "GB", name: "Anh",       dial: "+44", min: 10, max: 10 },
  { iso: "JP", name: "Nhật Bản",  dial: "+81", min: 10, max: 10 },
  { iso: "KR", name: "Hàn Quốc",  dial: "+82", min: 9,  max: 10 },
  { iso: "CN", name: "Trung Quốc",dial: "+86", min: 11, max: 11 },
  { iso: "SG", name: "Singapore", dial: "+65", min: 8,  max: 8  },
  { iso: "MY", name: "Malaysia",  dial: "+60", min: 9,  max: 10 },
  { iso: "TH", name: "Thái Lan",  dial: "+66", min: 9,  max: 9  },
  { iso: "AU", name: "Úc",        dial: "+61", min: 9,  max: 9  },
  { iso: "FR", name: "Pháp",      dial: "+33", min: 9,  max: 9  },
  { iso: "DE", name: "Đức",       dial: "+49", min: 10, max: 11 },
];

function validatePhone(raw, country) {
  let digits = (raw || "").replace(/\D/g, "");
  if (!digits) return { error: "Vui lòng nhập số điện thoại." };
  if (digits.length > country.max && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
  if (digits.length < country.min || digits.length > country.max) {
    return { error: "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại." };
  }
  return { ok: true };
}

function PhoneField({ country, setCountry, value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function onDoc(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  useEffect(() => { if (open && searchRef.current) searchRef.current.focus(); }, [open]);

  const filtered = COUNTRIES.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase().includes(q);
  });

  const phoneCheck = validatePhone(value, country);
  const valid = !!phoneCheck.ok && !!value;

  return (
    <div className={`field${error ? " err" : ""}${error && focused ? " err-focused" : ""}`}>
      <label className="lbl" htmlFor="phone">Số điện thoại</label>
      <div className={`phone-group${focused ? " focused" : ""}`} ref={wrapRef}>
        <button type="button" className="cc-btn" onClick={() => setOpen(!open)}
          aria-label="Chọn mã quốc gia" aria-expanded={open}>
          <span className="flag">{F[country.iso]}</span>
          <span className="dial">{country.dial}</span>
          <span className="chev">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </span>
        </button>
        <input
          id="phone" name="phone" className="inp" type="tel" inputMode="numeric"
          value={value || ""} placeholder="912 345 678" autoComplete="tel-national"
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onChange={(e) => onChange?.(e.target.value)}
        />
        {valid && (
          <span className="valid-tick">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </span>
        )}
        {open && (
          <div className="cc-menu" onMouseDown={(e) => e.stopPropagation()}>
            <input ref={searchRef} className="cc-search" placeholder="Tìm quốc gia..."
              value={query} onChange={(e) => setQuery(e.target.value)} />
            {filtered.length === 0 && <div className="cc-empty">Không tìm thấy quốc gia.</div>}
            {filtered.map((c) => (
              <button type="button" key={c.iso}
                className={`cc-item${c.iso === country.iso ? " active" : ""}`}
                onClick={() => { setCountry(c); setOpen(false); setQuery(""); }}>
                <span className="flag">{F[c.iso]}</span>
                <span className="nm">{c.name}</span>
                <span className="dial">{c.dial}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <span className="help">{error}</span>}
    </div>
  );
}

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

// ---------------- Loading states screen ----------------

function LoadingScreen() {
  return (
    <div className="loading-page">
      <div className="loading-grid">

        {/* 1 · Circular spinner */}
        <div className="loading-tile">
          <div className="head">
            <span className="ttl">Vòng tròn xoay</span>
            <span className="sub">spinner / 0.9s</span>
          </div>
          <div className="demo">
            <div className="rl-spinner"></div>
            <div className="rl-spinner sm"></div>
          </div>
        </div>

        {/* 2 · Indeterminate linear */}
        <div className="loading-tile">
          <div className="head">
            <span className="ttl">Thanh tiến trình</span>
            <span className="sub">linear / 2.1s</span>
          </div>
          <div className="demo" style={{ flexDirection: "column", alignItems: "stretch", gap: 10 }}>
            <div className="rl-linear"></div>
            <span style={{ textAlign: "center", fontSize: 12, color: "var(--fg-2)" }}>Đang tải dữ liệu...</span>
          </div>
        </div>

        {/* 3 · Skeleton shimmer */}
        <div className="loading-tile">
          <div className="head">
            <span className="ttl">Khung chờ</span>
            <span className="sub">skeleton / 1.4s</span>
          </div>
          <div className="demo" style={{ alignItems: "stretch" }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="rl-sk title"></div>
              <div className="rl-sk line"></div>
              <div className="rl-sk line"></div>
              <div className="rl-sk short"></div>
            </div>
          </div>
        </div>

        {/* 4 · Page-level loader (logo + ring) */}
        <div className="loading-tile mint">
          <div className="head">
            <span className="ttl">Trang đang tải</span>
            <span className="sub">page / 0.9s</span>
          </div>
          <div className="demo" style={{ flexDirection: "column", gap: 10 }}>
            <div className="rl-logo-ring">
              <div className="ring"></div>
              <img src="../assets/logo-mark.png" alt="HouseLeaf" />
            </div>
            <span style={{ fontSize: 12, color: "var(--fg-2)" }}>Đang tải...</span>
          </div>
        </div>

        {/* 5 · Button with inline spinner */}
        <div className="loading-tile">
          <div className="head">
            <span className="ttl">Nút đang xử lý</span>
            <span className="sub">btn / inline</span>
          </div>
          <div className="demo">
            <button
              className="btn primary"
              disabled
              style={{ cursor: "not-allowed", gap: 8 }}
            >
              <div
                className="rl-spinner sm"
                style={{
                  borderColor: "rgba(18,65,112,0.25)",
                  borderTopColor: "var(--rr-navy)",
                }}
              ></div>
              Đang lưu...
            </button>
          </div>
        </div>

        {/* 6 · Three-dot pulse */}
        <div className="loading-tile">
          <div className="head">
            <span className="ttl">Chấm nhịp</span>
            <span className="sub">dots / 1.2s</span>
          </div>
          <div className="demo" style={{ flexDirection: "column", gap: 8 }}>
            <div className="rl-dots">
              <span className="d"></span>
              <span className="d"></span>
              <span className="d"></span>
            </div>
            <span style={{ fontSize: 12, color: "var(--fg-2)" }}>Đang đồng bộ</span>
          </div>
        </div>

      </div>

      <p className="loading-note">
        Material-aligned, no spring physics. Primary spinner: <code>#67C090</code> on 12% navy track.
        {" "}Circular cho thao tác ≤ 3s · linear cho tiến trình xác định · skeleton thay nội dung chưa tải · dots cho đồng bộ liên tục.
      </p>
    </div>
  );
}

// ---------------- Brand-404 Not Found ----------------

function NotFoundScreen({ go }) {
  return (
    <div className="error-page">
      <div className="glyph">
        <div className="num">
          4
          <span className="zero zero-404">
            <span className="ico">search_off</span>
          </span>
          4
        </div>
      </div>
      <h2>Không tìm thấy trang</h2>
      <p className="msg">
        Đường dẫn bạn đang truy cập không tồn tại hoặc đã được di chuyển.
        Hãy quay lại trang chủ hoặc kiểm tra lại đường dẫn.
      </p>
      <div className="actions">
        <button className="err-btn primary" onClick={() => go("login")}>
          <span className="ico">home</span>Về trang chủ
        </button>
        <button className="err-btn ghost">
          <span className="ico">bug_report</span>Báo lỗi
        </button>
      </div>
      <span className="ref">/quan-ly/phong/9b4c-not-here</span>
    </div>
  );
}

// ---------------- Brand-403 Unauthorized ----------------

function UnauthorizedScreen({ go }) {
  return (
    <div className="error-page">
      <div className="glyph">
        <div className="num">
          4
          <span className="zero zero-403">
            <span className="ico">lock</span>
          </span>
          3
        </div>
      </div>
      <h2>Không có quyền truy cập</h2>
      <p className="msg">
        Tài khoản của bạn không có quyền xem nội dung này.
        Vui lòng liên hệ quản trị viên nếu bạn cần được cấp quyền.
      </p>
      <div className="actions">
        <button className="err-btn primary" onClick={() => go("login")}>
          <span className="ico">arrow_back</span>Quay lại
        </button>
        <button className="err-btn ghost">
          <span className="ico">support_agent</span>Liên hệ quản trị viên
        </button>
      </div>
      <span className="meta">
        <span className="dot" style={{ background: "var(--color-warning)" }}></span>
        Đăng nhập với{" "}
        <span className="acc">an.nguyen@houseleaf.vn</span>
        {" "}· Vai trò: Nhân viên
      </span>
    </div>
  );
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
  const [v, setV] = useState({ ho: "", ten: "", email: "", phone: "", pw: "", pw2: "" });
  const set = (k) => (val) => setV((s) => ({ ...s, [k]: val }));
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [terms, setTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const phoneCheck = validatePhone(v.phone, country);
  const showPhoneError = (submitted || phoneTouched) && v.phone !== "" && phoneCheck.error;
  const emailError = submitted && v.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)
    ? "Email không hợp lệ. Vui lòng kiểm tra lại." : null;
  const pw2Error = submitted && v.pw2 && v.pw !== v.pw2
    ? "Mật khẩu nhập lại không khớp." : null;

  return (
    <AuthShell
      title="Đăng ký tài khoản"
      sub="Bắt đầu quản lý phòng trọ của bạn — miễn phí."
      footer={<>Đã có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); go("login"); }}>Đăng nhập</a></>}
    >
      <div className="name-row">
        <Field label="Họ" name="ho" value={v.ho} onChange={set("ho")} placeholder="Nhập họ" autoComplete="family-name" />
        <Field label="Tên" name="ten" value={v.ten} onChange={set("ten")} placeholder="Nhập tên" autoComplete="given-name" />
      </div>
      <Field label="Email" name="email" type="email" value={v.email} onChange={set("email")} placeholder="Nhập email của bạn" autoComplete="email" error={emailError} />
      <PhoneField
        country={country} setCountry={setCountry}
        value={v.phone}
        onChange={(val) => { set("phone")(val); setPhoneTouched(true); }}
        error={showPhoneError ? phoneCheck.error : null}
      />
      <Field label="Mật khẩu" name="pw" type="password" value={v.pw} onChange={set("pw")} placeholder="Tối thiểu 8 ký tự" autoComplete="new-password" />
      <Field label="Nhập lại mật khẩu" name="pw2" type="password" value={v.pw2} onChange={set("pw2")} autoComplete="new-password" error={pw2Error} />
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
    login:         <LoginScreen go={setScreen} t={t} />,
    register:      <RegisterScreen go={setScreen} />,
    forgot:        <ForgotScreen go={setScreen} />,
    consent:       <ConsentScreen go={setScreen} />,
    loading:       <LoadingScreen />,
    "not-found":   <NotFoundScreen go={setScreen} />,
    unauthorized:  <UnauthorizedScreen go={setScreen} />,
  };

  const tabs = [
    ["login",        "Đăng nhập"],
    ["register",     "Đăng ký"],
    ["forgot",       "Quên MK"],
    ["consent",      "OAuth"],
    ["loading",      "Loading"],
    ["not-found",    "404"],
    ["unauthorized", "403"],
  ];

  return (
    <div className="auth-page">
      {screens[screen]}
      <div className="auth-tabs">
        {tabs.map(([k, lbl]) => (
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
