# Writing Style Guide — Room Rental Design System

## Language

- **UI language**: Vietnamese (all labels, messages, placeholder text visible to end users)
- **Code identifiers**: English (`data-testid`, variable names, API fields)
- **Documentation**: English (specs, guidelines, CLAUDE.md files)

---

## Tone

| Context | Tone | Example |
|---------|------|---------|
| Navigation & labels | Short, noun-based | "Quản lý phòng", "Hợp đồng" |
| Button actions | Verb-first | "Thêm phòng", "Xác nhận", "Hủy" |
| Empty states | Friendly, helpful | "Chưa có phòng nào. Bắt đầu thêm phòng mới." |
| Error messages | Clear, actionable | "Email không hợp lệ. Vui lòng kiểm tra lại." |
| Success messages | Concise, positive | "Đã lưu thay đổi thành công." |
| Confirmation dialogs | Direct, specific | "Bạn có chắc muốn xóa phòng 101 không?" |

---

## Capitalization

- Vietnamese UI copy: follow Vietnamese sentence case (capitalize first word only)
- Do not ALL-CAPS body text or labels — use CSS `text-transform` only for Button and Overline tokens
- Proper nouns (app name, company name) are capitalized normally

---

## Numbers & Dates

| Type | Format | Example |
|------|--------|---------|
| Currency (VND) | `#.###đ` | `2.500.000đ` |
| Date | `DD/MM/YYYY` | `20/05/2026` |
| Date + Time | `DD/MM/YYYY HH:mm` | `20/05/2026 14:30` |
| Relative time | Natural language | "3 ngày trước", "Hôm nay" |
| Phone | `0xxx xxx xxx` | `0912 345 678` |

---

## Error Messages

- Never say "Lỗi 500" or expose technical error codes to users
- Always provide a next action: "Vui lòng thử lại" or "Liên hệ hỗ trợ nếu lỗi tiếp tục"
- Field validation errors appear inline below the field, not in a toast
- System-level errors (network, server) appear in a MudSnackbar or MudAlert

---

## Button Labels

- Primary action: short verb phrase — "Lưu", "Xác nhận", "Đăng nhập"
- Cancel/dismiss: "Hủy" (not "Không", "Quay lại")
- Destructive confirm: "Xóa", "Xóa vĩnh viễn" (make the consequence clear)
- Loading state: add ellipsis — "Đang lưu...", "Đang xử lý..."

---

## Placeholder Text

- Describe the expected input, not the field name
- ✓ "Nhập email của bạn"
- ✗ "Email" (that's the label's job)
- ✓ "VD: 0912 345 678"
- ✗ "Số điện thoại"
