# ADR-002 — UI Language: Vietnamese for Users, English for Code

| | |
|---|---|
| **Date** | 2026-05-20 |
| **Status** | Accepted |
| **Deciders** | Product owner, design system lead |

---

## Context

The Room Rental Management System is built for Vietnamese landlords and tenants. All users interact in Vietnamese. The development team writes code in English (international standard).

We needed a clear rule for which language goes where.

---

## Decision

**Strict split: Vietnamese for everything a user sees, English for everything a developer writes.**

| Layer | Language | Examples |
|---|---|---|
| UI labels | Vietnamese | "Đăng nhập", "Danh sách phòng", "Hợp đồng" |
| Button text | Vietnamese | "Xác nhận", "Hủy", "Lưu thay đổi" |
| Placeholder text | Vietnamese | "Nhập email của bạn", "VD: 0912 345 678" |
| Error messages | Vietnamese | "Email không hợp lệ. Vui lòng kiểm tra lại." |
| Empty states | Vietnamese | "Chưa có phòng nào. Bắt đầu thêm phòng mới." |
| Code identifiers | English | `LoginScreen`, `roomId`, `tenantName` |
| `data-testid` attributes | English | `data-testid="submit-login"` |
| API field names | English | `{ "email": "...", "contractStartDate": "..." }` |
| Component specs | English | This document, all spec files in `components/specs/` |
| Guidelines | English | All files in `guidelines/` |
| CLAUDE.md / ADRs | English | Agent context must be in English for consistency |
| Comments in code | English | Unless explaining a domain-specific Vietnamese concept |

---

## Alternatives Considered

| Alternative | Rejected because |
|---|---|
| **English UI** | Product is for Vietnamese market — creates friction, feels foreign |
| **Both languages in UI** | Creates inconsistency; bilingual labels are longer and harder to design around |
| **Vietnamese in code** | Breaks ASCII assumptions in many tools; harder for future international contributors |

---

## Consequences

**Good**:
- Users see a natural, local-language product
- Code is universally readable by any developer
- Specs and guidelines can be shared with international designers/developers

**Accepted trade-offs**:
- Developers must be Vietnamese-literate enough to understand UI copy in context (or use a dictionary)
- Translation is not in scope — if the product goes international, a proper i18n pass is needed

---

## Writing Style Reference

See `guidelines/writing-style.md` for:
- Tone rules per context (nav, buttons, empty states, errors)
- Number and date formatting (`DD/MM/YYYY`, `2.500.000đ`)
- Vietnamese sentence capitalization rules
