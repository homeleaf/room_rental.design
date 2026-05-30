// HouseLeaf — Form standards showcase.
// Depends on: controls-select.jsx, controls-input.jsx, controls-datetime.jsx

const { useState: useStateD } = React;

const ROOM_TYPES = [
  { value: 'single', label: 'Phòng đơn' },
  { value: 'double', label: 'Phòng đôi' },
  { value: 'studio', label: 'Phòng studio' },
  { value: 'shared', label: 'Phòng ghép' },
];
const AMENITIES = [
  { value: 'ac',      label: 'Máy lạnh' },
  { value: 'heater',  label: 'Bình nóng lạnh' },
  { value: 'wifi',    label: 'Wifi' },
  { value: 'parking', label: 'Chỗ để xe' },
  { value: 'kitchen', label: 'Bếp riêng' },
  { value: 'balcony', label: 'Ban công' },
];
const DISTRICTS = [
  'Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 7', 'Quận 10',
  'Quận Bình Thạnh', 'Quận Phú Nhuận', 'Quận Gò Vấp', 'Quận Tân Bình', 'Thành phố Thủ Đức',
];

function Demo({ title, k, children, note, span2 }) {
  return (
    <section className={`demo ${span2 ? 'span2' : ''}`}>
      <div className="dh"><span className="t">{title}</span><span className="k">{k}</span></div>
      {children}
      {note && <div className="note">{note}</div>}
    </section>
  );
}

function App() {
  const [roomType,  setRoomType]  = useStateD('double');
  const [amenities, setAmenities] = useStateD(['ac', 'wifi']);
  const [district,  setDistrict]  = useStateD('');
  const [payCycle,  setPayCycle]  = useStateD('monthly');
  const [plan,      setPlan]      = useStateD('pro');
  const [notify,    setNotify]    = useStateD(true);
  const [autopay,   setAutopay]   = useStateD(false);
  const [maint,     setMaint]     = useStateD(true);
  const [terms,     setTerms]     = useStateD(['contract']);
  const [guests,    setGuests]    = useStateD(2);
  const [moveIn,    setMoveIn]    = useStateD(null);
  const [checkTime, setCheckTime] = useStateD(null);

  const toggleTerm = (v, on) => setTerms((p) => on ? [...p, v] : p.filter((x) => x !== v));

  return (
    <div className="page">
      <div className="page-head">
        <h1>Tiêu chuẩn biểu mẫu</h1>
        <div className="sub">Bộ điều khiển nhập liệu chuẩn của HouseLeaf — tất cả dùng token màu, bo góc 8px, focus ring navy 2px và nhãn tiếng Việt sentence-case. Mỗi điều khiển bên dưới đều hoạt động đầy đủ.</div>
      </div>

      <div className="grid">
        <Demo title="Select — chọn một" k="single-select"
          note={<>Nút điều khiển hiển thị giá trị đã chọn; menu nổi với dấu tích xanh ở mục đang chọn. Đóng khi bấm ra ngoài.</>}>
          <Select label="Loại phòng" required options={ROOM_TYPES} value={roomType} onChange={setRoomType} placeholder="Chọn loại phòng" />
        </Demo>

        <Demo title="Select — nhiều, có chips" k="multi-select"
          note={<>Mỗi lựa chọn hiển thị thành <code>chip</code> capsule có nút <code>×</code> để bỏ. Mục đã chọn trong menu có ô tích đầy.</>}>
          <MultiSelect label="Tiện nghi" options={AMENITIES} value={amenities} onChange={setAmenities} placeholder="Chọn tiện nghi" />
        </Demo>

        <Demo title="Auto suggestion" k="autocomplete"
          note={<>Lọc theo ký tự nhập, in đậm phần khớp. Điều hướng bằng <code>↑ ↓</code>, chọn bằng <code>Enter</code>. Hiện thông báo khi không có kết quả.</>}>
          <Autocomplete label="Khu vực" options={DISTRICTS} value={district} onChange={setDistrict} placeholder="Nhập tên quận..." />
        </Demo>

        <Demo title="Radio — danh sách" k="radio-group"
          note={<>Vòng tròn 20px, chấm xanh khi chọn. Mục vô hiệu hóa làm mờ và không bấm được.</>}>
          <RadioGroup label="Chu kỳ thanh toán" value={payCycle} onChange={setPayCycle}
            options={[
              { value: 'monthly',   label: 'Hàng tháng' },
              { value: 'quarterly', label: 'Hàng quý' },
              { value: 'yearly',    label: 'Hàng năm' },
              { value: 'custom',    label: 'Tùy chỉnh (sắp có)', disabled: true },
            ]} />
        </Demo>

        <Demo title="Radio — dạng thẻ" k="radio-cards" span2
          note={<>Dùng khi mỗi lựa chọn cần mô tả phụ. Thẻ được chọn viền + nền xanh nhạt.</>}>
          <RadioCards label="Gói dịch vụ" value={plan} onChange={setPlan}
            options={[
              { value: 'free', label: 'Miễn phí',        desc: 'Tối đa 5 phòng, 1 tòa nhà.' },
              { value: 'pro',  label: 'Chuyên nghiệp',   desc: 'Không giới hạn phòng, xuất hóa đơn tự động.' },
            ]} />
        </Demo>

        <Demo title="Toggle / Switch" k="switch"
          note={<>Bật = xanh chủ đạo, tắt = xám. Có nhãn chính + mô tả phụ; trạng thái vô hiệu hóa làm mờ.</>}>
          <Toggle title="Thông báo qua email" desc="Gửi nhắc nhở khi đến hạn thu tiền." checked={notify} onChange={setNotify} />
          <Toggle title="Tự động thu tiền" desc="Trừ tiền tự động từ ví người thuê." checked={autopay} onChange={setAutopay} />
          <Toggle title="Bảo trì định kỳ" checked={maint} onChange={setMaint} />
          <Toggle title="Đồng bộ ngân hàng" desc="Cần nâng cấp gói Chuyên nghiệp." checked={false} onChange={() => {}} disabled />
        </Demo>

        <Demo title="Checkbox + Stepper" k="checkbox · stepper"
          note={<>Ô tích vuông bo 4px cho lựa chọn độc lập. Stepper cho số nguyên có nút ± và giới hạn min/max.</>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Checkbox label="Có hợp đồng thuê"      checked={terms.includes('contract')} onChange={(on) => toggleTerm('contract', on)} />
            <Checkbox label="Đã đặt cọc"            checked={terms.includes('deposit')}  onChange={(on) => toggleTerm('deposit', on)} />
            <Checkbox label="Cho phép nuôi thú cưng" checked={terms.includes('pet')}      onChange={(on) => toggleTerm('pet', on)} />
          </div>
          <div style={{ marginTop: 6 }}>
            <Stepper label="Số người ở tối đa" value={guests} onChange={setGuests} min={1} max={10} />
          </div>
        </Demo>

        <Demo title="Date picker" k="datepicker"
          note={<>Lịch Thứ-2 đầu tuần, nhãn <code>Tháng M, YYYY</code>. Ngày hôm nay có viền xanh, ngày chọn nền xanh. Định dạng <code>DD/MM/YYYY</code>.</>}>
          <DatePicker label="Ngày nhận phòng" required value={moveIn} onChange={setMoveIn} />
        </Demo>

        <Demo title="Datetime picker" k="datetime"
          note={<>Như date picker nhưng kèm chọn giờ : phút. Định dạng <code>DD/MM/YYYY HH:mm</code>.</>}>
          <DatePicker label="Hẹn xem phòng" value={checkTime} onChange={setCheckTime} withTime />
        </Demo>

        <Demo title="Uploader — kéo thả" k="file-upload" span2
          note={<>Vùng thả viền đứt nét, đổi nền xanh khi kéo tệp vào. Danh sách tệp hiện tên, dung lượng, thanh tiến trình và nút xóa. Hỗ trợ chọn nhiều tệp.</>}>
          <Uploader label="Hình ảnh & giấy tờ phòng" help="Tải lên ảnh phòng, hợp đồng hoặc giấy tờ liên quan." accept="PNG, JPG, PDF · tối đa 10MB mỗi tệp" />
        </Demo>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
