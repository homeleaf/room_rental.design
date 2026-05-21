// Manager Portal — screens

const { useState } = React;

// ---------------- Mock data ----------------
const ROOMS = [
  { code: "101", floor: 1, area: 25, price: 2500000, status: "rented",    tenant: "Nguyễn Văn An",  end: "30/06/2026" },
  { code: "102", floor: 1, area: 22, price: 2200000, status: "available", tenant: "—",              end: "—" },
  { code: "103", floor: 1, area: 22, price: 2200000, status: "rented",    tenant: "Trần Thị Mai",   end: "15/11/2026" },
  { code: "201", floor: 2, area: 28, price: 2800000, status: "expiring",  tenant: "Lê Quốc Bảo",    end: "30/05/2026" },
  { code: "202", floor: 2, area: 28, price: 2800000, status: "rented",    tenant: "Phạm Hồng Hạnh", end: "01/12/2026" },
  { code: "203", floor: 2, area: 30, price: 3000000, status: "maint",     tenant: "—",              end: "—" },
  { code: "204", floor: 2, area: 32, price: 3200000, status: "rented",    tenant: "Đỗ Minh Quân",   end: "20/09/2026" },
  { code: "301", floor: 3, area: 35, price: 3500000, status: "overdue",   tenant: "Hoàng Anh Tuấn", end: "28/02/2026" },
  { code: "302", floor: 3, area: 35, price: 3500000, status: "rented",    tenant: "Vũ Thị Lan",     end: "10/10/2026" },
  { code: "303", floor: 3, area: 28, price: 2900000, status: "available", tenant: "—",              end: "—" },
];

const STATUS_LABEL = {
  available: "Còn trống",
  rented:    "Đã thuê",
  pending:   "Đang chờ",
  expiring:  "Sắp hết hạn",
  overdue:   "Quá hạn",
  maint:     "Đang sửa chữa",
  paid:      "Đã thanh toán",
};

// ---------------- Dashboard ----------------
function DashboardScreen({ go }) {
  const rented   = ROOMS.filter(r => r.status === "rented" || r.status === "expiring" || r.status === "overdue").length;
  const total    = ROOMS.length;
  const occupancy = Math.round(rented / total * 100);
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Tổng quan" }]}
        title="Tổng quan"
        action={<Btn variant="primary" icon="add_home" onClick={() => go("rooms")}>Thêm phòng</Btn>}
      />
      <div className="stack">
        <div className="grid-4">
          <Kpi label="Doanh thu tháng 5" value={formatVND(28400000)} delta="+12,4% so với tháng 4" deltaDir="up" icon="payments" />
          <Kpi label="Tỷ lệ lấp đầy" value={`${occupancy}%`} delta="+3 phòng" deltaDir="up" icon="trending_up" />
          <Kpi label="Hợp đồng sắp hết hạn" value="2" delta="trong 30 ngày" deltaDir="down" icon="event_busy" />
          <Kpi label="Khoản phải thu" value={formatVND(3500000)} delta="1 phòng quá hạn" deltaDir="down" icon="error" />
        </div>

        <div className="grid-2-1">
          <Card>
            <h3 className="section-title"><Icon name="bar_chart" size={18}/> Tình trạng phòng</h3>
            <div className="row" style={{ gap: 28, alignItems: "center" }}>
              <div className="pie" style={{ "--rented": "60%", "--avail": "28%" }}></div>
              <div className="pie-legend" style={{ flex: 1 }}>
                <div className="row between"><span className="row"><span className="sw" style={{background:"#67C090"}}/> Đã thuê</span> <span className="money">7</span></div>
                <div className="row between"><span className="row"><span className="sw" style={{background:"#DDF4E7", border:"1px solid rgba(18,65,112,.18)"}}/> Còn trống</span> <span className="money">2</span></div>
                <div className="row between"><span className="row"><span className="sw" style={{background:"#E65100"}}/> Đang sửa chữa</span> <span className="money">1</span></div>
                <div style={{ height: 1, background: "var(--divider)", margin: "4px 0" }}/>
                <div className="row between"><span style={{ color: "var(--fg-2)" }}>Tổng số phòng</span> <span className="money" style={{fontWeight:600}}>{total}</span></div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="section-title"><Icon name="event" size={18}/> Sắp đến hạn</h3>
            <div className="legend-list">
              <div className="row between">
                <div>
                  <div style={{ fontWeight: 500 }}>Phòng 301 · Hoàng Anh Tuấn</div>
                  <div className="caption">Quá hạn 7 ngày</div>
                </div>
                <Chip status="overdue">Quá hạn</Chip>
              </div>
              <div className="row between">
                <div>
                  <div style={{ fontWeight: 500 }}>Phòng 201 · Lê Quốc Bảo</div>
                  <div className="caption">Hết hạn 30/05/2026</div>
                </div>
                <Chip status="expiring">10 ngày</Chip>
              </div>
              <div className="row between">
                <div>
                  <div style={{ fontWeight: 500 }}>Phòng 204 · Đỗ Minh Quân</div>
                  <div className="caption">Hết hạn 20/09/2026</div>
                </div>
                <Chip status="pending">123 ngày</Chip>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="section-title"><Icon name="history" size={18}/> Hoạt động gần đây</h3>
          <div>
            <div className="activity-row">
              <span className="ico">payments</span>
              <div className="body">
                <div className="title">Nguyễn Văn An đã thanh toán tiền phòng tháng 5 — <Money value={2500000}/></div>
                <div className="meta">Phòng 101 · Hôm nay 09:42</div>
              </div>
            </div>
            <div className="activity-row">
              <span className="ico">description</span>
              <div className="body">
                <div className="title">Tạo hợp đồng mới HD-2026-0144 cho Vũ Thị Lan</div>
                <div className="meta">Phòng 302 · Hôm nay 08:15</div>
              </div>
            </div>
            <div className="activity-row">
              <span className="ico">build</span>
              <div className="body">
                <div className="title">Mở yêu cầu sửa chữa: thay vòi nước phòng 203</div>
                <div className="meta">Hôm qua 16:20</div>
              </div>
            </div>
            <div className="activity-row">
              <span className="ico">person_add</span>
              <div className="body">
                <div className="title">Thêm người thuê mới: Đỗ Minh Quân</div>
                <div className="meta">19/05/2026 14:08</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

// ---------------- Rooms list ----------------
function RoomsScreen({ go }) {
  const [filter, setFilter] = useState("all");
  const filtered = ROOMS.filter(r => filter === "all" ? true : r.status === filter);
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Quản lý phòng" }]}
        title="Quản lý phòng"
        action={<Btn variant="primary" icon="add_home">Thêm phòng</Btn>}
      />
      <div className="toolbar">
        <div className="search">
          <Icon name="search" />
          <input placeholder="Tìm theo mã phòng hoặc người thuê..." />
        </div>
        <FilterChip on={filter === "all"}      onClick={() => setFilter("all")}>Tất cả</FilterChip>
        <FilterChip on={filter === "rented"}   onClick={() => setFilter("rented")}>Đã thuê</FilterChip>
        <FilterChip on={filter === "available"}onClick={() => setFilter("available")}>Còn trống</FilterChip>
        <FilterChip on={filter === "expiring"} onClick={() => setFilter("expiring")}>Sắp hết hạn</FilterChip>
        <FilterChip on={filter === "overdue"}  onClick={() => setFilter("overdue")}>Quá hạn</FilterChip>
        <span className="spacer"/>
        <Btn variant="secondary" size="sm" icon="filter_list">Lọc nâng cao</Btn>
        <Btn variant="text" size="sm" icon="file_download">Xuất CSV</Btn>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th style={{ width: 96 }}>Mã phòng</th>
            <th>Tầng / Diện tích</th>
            <th>Người thuê</th>
            <th>Hết hạn HĐ</th>
            <th>Giá thuê</th>
            <th>Trạng thái</th>
            <th className="actions">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.code} onClick={() => r.code === "101" && go("room")} style={{ cursor: r.code === "101" ? "pointer" : "default" }}>
              <td><strong style={{ color: "var(--color-primary)" }}>Phòng {r.code}</strong></td>
              <td>Tầng {r.floor} · {r.area}m²</td>
              <td>{r.tenant}</td>
              <td className="num">{r.end}</td>
              <td className="num"><Money value={r.price}/></td>
              <td><Chip status={r.status}>{STATUS_LABEL[r.status]}</Chip></td>
              <td className="actions">
                <IconBtn icon="visibility" title="Xem" />
                <IconBtn icon="edit"       title="Sửa" />
                <IconBtn icon="more_vert"  title="Thêm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// ---------------- Room detail ----------------
function RoomDetailScreen({ go }) {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Quản lý phòng", href: "#" }, { label: "Phòng 101" }]}
        title="Phòng 101"
        action={
          <div className="row">
            <Btn variant="secondary" icon="edit">Sửa</Btn>
            <Btn variant="primary" icon="receipt_long">Tạo hóa đơn</Btn>
          </div>
        }
      />
      <div className="grid-2-1">
        <div className="stack">
          <div className="photo-tile">
            <Icon name="bedroom_parent" size={64} />
            <span className="placeholder">Ảnh phòng (kéo & thả để tải lên)</span>
          </div>

          <Card>
            <h3 className="section-title"><Icon name="person" size={18}/> Người thuê hiện tại</h3>
            <div className="person-row">
              <Avatar initials="NA" size={44} color="primary" />
              <div style={{ flex: 1 }}>
                <div className="name">Nguyễn Văn An</div>
                <div className="meta">CMND 0123 4567 8910 · <Phone value="0912 345 678"/></div>
              </div>
              <Chip status="rented">Đang thuê</Chip>
            </div>
            <div style={{ height: 14 }}/>
            <dl className="dl">
              <dt>Mã hợp đồng</dt><dd className="money">HD-2026-0142</dd>
              <dt>Thời hạn</dt><dd>01/01/2026 — 30/06/2026</dd>
              <dt>Tiền cọc</dt><dd><Money value={5000000}/></dd>
              <dt>Tiền thuê</dt><dd><Money value={2500000}/> / tháng</dd>
            </dl>
          </Card>

          <Card>
            <h3 className="section-title"><Icon name="history" size={18}/> Lịch sử thanh toán</h3>
            <table className="tbl" style={{ boxShadow: "none" }}>
              <thead>
                <tr><th>Kỳ</th><th>Ngày trả</th><th>Số tiền</th><th>Trạng thái</th></tr>
              </thead>
              <tbody>
                <tr><td className="num">05/2026</td><td className="num">02/05/2026</td><td className="num"><Money value={2500000}/></td><td><Chip status="paid">Đã trả</Chip></td></tr>
                <tr><td className="num">04/2026</td><td className="num">03/04/2026</td><td className="num"><Money value={2500000}/></td><td><Chip status="paid">Đã trả</Chip></td></tr>
                <tr><td className="num">03/2026</td><td className="num">05/03/2026</td><td className="num"><Money value={2500000}/></td><td><Chip status="paid">Đã trả</Chip></td></tr>
              </tbody>
            </table>
          </Card>
        </div>

        <div className="stack">
          <Card>
            <h3 className="section-title"><Icon name="info" size={18}/> Thông tin phòng</h3>
            <dl className="dl">
              <dt>Tầng</dt><dd>1</dd>
              <dt>Diện tích</dt><dd>25m²</dd>
              <dt>Hướng</dt><dd>Đông Nam</dd>
              <dt>Tiện nghi</dt><dd>Điều hòa · Nóng lạnh · WiFi</dd>
              <dt>Ghi chú</dt><dd>Phòng góc, thoáng mát</dd>
            </dl>
          </Card>
          <Card>
            <h3 className="section-title"><Icon name="bolt" size={18}/> Đồng hồ tháng này</h3>
            <dl className="dl">
              <dt>Điện</dt><dd><Money value={420000}/> (140 kWh)</dd>
              <dt>Nước</dt><dd><Money value={85000}/> (8m³)</dd>
              <dt>Internet</dt><dd><Money value={100000}/> (định mức)</dd>
              <dt>Vệ sinh</dt><dd><Money value={30000}/></dd>
            </dl>
            <div style={{ height: 1, background: "var(--divider)", margin: "10px 0" }}/>
            <div className="row between" style={{ fontWeight: 600 }}>
              <span>Tạm tính</span><Money value={3135000}/>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// ---------------- Tenants ----------------
const TENANTS = [
  { name: "Nguyễn Văn An",  room: "101", phone: "0912 345 678", since: "01/01/2026", balance: 0,        status: "rented" },
  { name: "Trần Thị Mai",   room: "103", phone: "0903 222 111", since: "15/11/2025", balance: 0,        status: "rented" },
  { name: "Lê Quốc Bảo",    room: "201", phone: "0976 555 222", since: "30/11/2025", balance: 0,        status: "expiring" },
  { name: "Phạm Hồng Hạnh", room: "202", phone: "0938 444 778", since: "01/12/2025", balance: 0,        status: "rented" },
  { name: "Đỗ Minh Quân",   room: "204", phone: "0907 888 123", since: "20/03/2026", balance: 0,        status: "rented" },
  { name: "Hoàng Anh Tuấn", room: "301", phone: "0935 222 999", since: "28/02/2025", balance: 3500000,  status: "overdue" },
  { name: "Vũ Thị Lan",     room: "302", phone: "0962 111 555", since: "10/04/2026", balance: 0,        status: "rented" },
];

function initials(name) {
  return name.split(" ").map(s => s[0]).slice(-2).join("");
}

function TenantsScreen() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Người thuê" }]}
        title="Người thuê"
        action={<Btn variant="primary" icon="person_add">Thêm người thuê</Btn>}
      />
      <div className="toolbar">
        <div className="search">
          <Icon name="search" />
          <input placeholder="Tìm theo tên, số điện thoại, mã phòng..." />
        </div>
        <FilterChip on>Tất cả</FilterChip>
        <FilterChip>Đang thuê</FilterChip>
        <FilterChip>Còn nợ</FilterChip>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Người thuê</th>
            <th>Phòng</th>
            <th>Số điện thoại</th>
            <th>Bắt đầu thuê</th>
            <th>Công nợ</th>
            <th>Trạng thái</th>
            <th className="actions"></th>
          </tr>
        </thead>
        <tbody>
          {TENANTS.map((t) => (
            <tr key={t.name}>
              <td>
                <div className="person-row">
                  <Avatar initials={initials(t.name)} size={32} color="primary" />
                  <div className="name">{t.name}</div>
                </div>
              </td>
              <td>Phòng {t.room}</td>
              <td className="num">{t.phone}</td>
              <td className="num">{t.since}</td>
              <td className="num">
                {t.balance > 0
                  ? <span style={{ color: "var(--color-error)", fontWeight: 600 }}><Money value={t.balance}/></span>
                  : <span style={{ color: "var(--fg-2)" }}>—</span>
                }
              </td>
              <td><Chip status={t.status}>{STATUS_LABEL[t.status]}</Chip></td>
              <td className="actions">
                <IconBtn icon="visibility" title="Xem" />
                <IconBtn icon="phone" title="Gọi" />
                <IconBtn icon="more_vert" title="Thêm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// ---------------- Contracts ----------------
function ContractsScreen() {
  const rows = [
    { id: "HD-2026-0142", tenant: "Nguyễn Văn An",  room: "101", start: "01/01/2026", end: "30/06/2026", price: 2500000, status: "rented" },
    { id: "HD-2025-0098", tenant: "Trần Thị Mai",   room: "103", start: "15/11/2025", end: "15/11/2026", price: 2200000, status: "rented" },
    { id: "HD-2025-0094", tenant: "Lê Quốc Bảo",    room: "201", start: "30/11/2025", end: "30/05/2026", price: 2800000, status: "expiring" },
    { id: "HD-2025-0102", tenant: "Phạm Hồng Hạnh", room: "202", start: "01/12/2025", end: "01/12/2026", price: 2800000, status: "rented" },
    { id: "HD-2026-0140", tenant: "Đỗ Minh Quân",   room: "204", start: "20/03/2026", end: "20/09/2026", price: 3200000, status: "rented" },
    { id: "HD-2025-0040", tenant: "Hoàng Anh Tuấn", room: "301", start: "28/02/2025", end: "28/02/2026", price: 3500000, status: "overdue" },
    { id: "HD-2026-0144", tenant: "Vũ Thị Lan",     room: "302", start: "10/04/2026", end: "10/10/2026", price: 2900000, status: "rented" },
  ];
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Hợp đồng" }]}
        title="Hợp đồng"
        action={<Btn variant="primary" icon="description">Tạo hợp đồng</Btn>}
      />
      <div className="toolbar">
        <div className="search">
          <Icon name="search" />
          <input placeholder="Tìm theo mã hợp đồng, tên hoặc phòng..." />
        </div>
        <FilterChip on>Tất cả</FilterChip>
        <FilterChip>Đang hiệu lực</FilterChip>
        <FilterChip>Sắp hết hạn</FilterChip>
        <FilterChip>Đã hết hạn</FilterChip>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Mã HĐ</th>
            <th>Người thuê</th>
            <th>Phòng</th>
            <th>Bắt đầu</th>
            <th>Kết thúc</th>
            <th>Giá thuê</th>
            <th>Trạng thái</th>
            <th className="actions"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="num"><strong style={{ color: "var(--color-primary)" }}>{r.id}</strong></td>
              <td>{r.tenant}</td>
              <td>Phòng {r.room}</td>
              <td className="num">{r.start}</td>
              <td className="num">{r.end}</td>
              <td className="num"><Money value={r.price}/></td>
              <td><Chip status={r.status}>{STATUS_LABEL[r.status]}</Chip></td>
              <td className="actions">
                {r.status === "expiring"
                  ? <Btn variant="tertiary" size="sm" icon="autorenew">Gia hạn</Btn>
                  : <IconBtn icon="visibility" title="Xem" />
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// ---------------- Payments + receipt drawer ----------------
function PaymentsScreen() {
  const [open, setOpen] = useState(false);
  const rows = [
    { id: "TT-26052001", tenant: "Nguyễn Văn An",  room: "101", date: "20/05/2026 09:42", amount: 2500000, method: "Chuyển khoản",  status: "paid" },
    { id: "TT-26052002", tenant: "Trần Thị Mai",   room: "103", date: "18/05/2026 14:11", amount: 2200000, method: "Tiền mặt",      status: "paid" },
    { id: "TT-26051501", tenant: "Phạm Hồng Hạnh", room: "202", date: "15/05/2026 10:00", amount: 2800000, method: "Chuyển khoản",  status: "paid" },
    { id: "TT-26051002", tenant: "Đỗ Minh Quân",   room: "204", date: "10/05/2026 08:55", amount: 3200000, method: "Ví điện tử",    status: "paid" },
    { id: "TT-26050501", tenant: "Lê Quốc Bảo",    room: "201", date: "05/05/2026 16:32", amount: 2800000, method: "Chuyển khoản",  status: "paid" },
    { id: "—",           tenant: "Hoàng Anh Tuấn", room: "301", date: "Hạn 01/05/2026",   amount: 3500000, method: "—",             status: "overdue" },
  ];
  const total = rows.filter(r => r.status === "paid").reduce((a, r) => a + r.amount, 0);
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Thanh toán" }]}
        title="Thanh toán"
        action={
          <div className="row">
            <Btn variant="secondary" icon="file_download">Xuất CSV</Btn>
            <Btn variant="primary" icon="payments">Ghi nhận thanh toán</Btn>
          </div>
        }
      />
      <div className="grid-4" style={{ marginBottom: 16 }}>
        <Kpi label="Đã thu tháng 5" value={formatVND(total)} delta="5 giao dịch" deltaDir="up" icon="payments" />
        <Kpi label="Phải thu"        value={formatVND(3500000)} delta="1 quá hạn" deltaDir="down" icon="schedule" />
        <Kpi label="Trung bình / phòng" value={formatVND(Math.round(total/5))} icon="bar_chart" />
        <Kpi label="Phương thức phổ biến" value="Chuyển khoản" delta="60% giao dịch" deltaDir="up" icon="account_balance" />
      </div>
      <div className="toolbar">
        <div className="search">
          <Icon name="search" />
          <input placeholder="Tìm theo mã giao dịch hoặc tên người thuê..." />
        </div>
        <FilterChip on>Tháng này</FilterChip>
        <FilterChip>Quý này</FilterChip>
        <FilterChip>Tùy chỉnh</FilterChip>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Mã GD</th>
            <th>Người thuê</th>
            <th>Phòng</th>
            <th>Thời gian</th>
            <th>Phương thức</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
            <th className="actions"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id + r.tenant} onClick={() => r.status === "paid" && setOpen(true)} style={{ cursor: r.status === "paid" ? "pointer" : "default" }}>
              <td className="num">{r.id}</td>
              <td>{r.tenant}</td>
              <td>Phòng {r.room}</td>
              <td className="num">{r.date}</td>
              <td>{r.method}</td>
              <td className="num"><Money value={r.amount}/></td>
              <td><Chip status={r.status}>{STATUS_LABEL[r.status]}</Chip></td>
              <td className="actions">
                {r.status === "paid"
                  ? <IconBtn icon="receipt_long" title="Xem biên lai" />
                  : <Btn variant="primary" size="sm" icon="payments">Ghi nhận</Btn>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Receipt drawer */}
      <div className={`scrim ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`drawer-right ${open ? "open" : ""}`}>
        <div className="head">
          <Icon name="receipt_long" size={24} color="var(--color-secondary)" />
          <h3>Biên lai TT-26052001</h3>
          <IconBtn icon="close" onClick={() => setOpen(false)} title="Đóng"/>
        </div>
        <div className="body">
          <dl className="dl" style={{ gap: "10px 18px" }}>
            <dt>Người thuê</dt><dd>Nguyễn Văn An</dd>
            <dt>Phòng</dt><dd>Phòng 101 · Tầng 1</dd>
            <dt>Kỳ thanh toán</dt><dd>05/2026</dd>
            <dt>Thời gian</dt><dd className="money">20/05/2026 09:42</dd>
            <dt>Phương thức</dt><dd>Chuyển khoản (MB Bank)</dd>
            <dt>Mã tham chiếu</dt><dd className="money">MB.20260520.A91X</dd>
          </dl>
          <div style={{ height: 14 }}/>
          <Card dense style={{ background: "var(--color-surface-dim)", boxShadow: "none" }}>
            <div className="row between" style={{ fontSize: 13 }}><span>Tiền thuê</span> <Money value={2500000}/></div>
            <div className="row between" style={{ fontSize: 13, marginTop: 6 }}><span>Điện · 140 kWh</span> <Money value={420000}/></div>
            <div className="row between" style={{ fontSize: 13, marginTop: 6 }}><span>Nước · 8 m³</span> <Money value={85000}/></div>
            <div className="row between" style={{ fontSize: 13, marginTop: 6 }}><span>Internet</span> <Money value={100000}/></div>
            <div style={{ height: 1, background: "var(--divider)", margin: "10px 0" }}/>
            <div className="row between" style={{ fontWeight: 600, color: "var(--color-secondary)" }}><span>Tổng cộng</span> <Money value={3105000}/></div>
          </Card>
        </div>
        <div className="foot">
          <Btn variant="secondary" icon="print">In</Btn>
          <Btn variant="primary" icon="share">Gửi cho người thuê</Btn>
        </div>
      </aside>
    </>
  );
}

// Generic placeholder
function PlaceholderScreen({ title, icon }) {
  return (
    <>
      <PageHeader crumbs={[{ label: title }]} title={title} />
      <Card>
        <div style={{ textAlign: "center", padding: "48px 12px" }}>
          <Icon name={icon} size={64} color="var(--color-primary)" />
          <div style={{ marginTop: 12, color: "var(--fg-2)" }}>Màn hình này chưa được thiết kế trong UI kit demo.</div>
        </div>
      </Card>
    </>
  );
}

Object.assign(window, { DashboardScreen, RoomsScreen, RoomDetailScreen, TenantsScreen, ContractsScreen, PaymentsScreen, PlaceholderScreen });
