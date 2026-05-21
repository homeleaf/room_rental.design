# Design System — Integration Guide

> Hướng dẫn này dành cho dev của từng app cần tích hợp design system.
> Prototype chạy local dùng để **tham chiếu khi code** — không cần deploy riêng.

---

## Tổng quan

```
room_rental.design/          ← repo này (design system)
  tokens/tokens.json         ← nguồn sự thật duy nhất
  generated/
    web/tokens.css           → Vue 3, React, Angular dùng
    blazor/RoomRentalTheme.cs → Blazor WASM + MudBlazor 9 dùng
    mobile/tokens.json       → React Native / Flutter dùng
    prototype/base.css       → prototype HTML dùng (không dùng trong production)
  components/
    prototypes/              → chạy local để xem UI khi code
    specs/                   → spec markdown cho từng màn hình
```

---

## Bước 1 — Thêm design system vào app repo (git submodule)

Chạy trong thư mục root của **mỗi app repo**:

```bash
git submodule add https://github.com/<org>/room_rental.design design
git submodule update --init
```

Sau đó `.gitmodules` sẽ có:

```ini
[submodule "design"]
    path = design
    url = https://github.com/<org>/room_rental.design
```

Khi pull lần đầu hoặc clone app repo về máy mới:

```bash
git clone --recurse-submodules <app-repo-url>
# hoặc nếu đã clone rồi:
git submodule update --init --recursive
```

Khi design system có version mới:

```bash
cd design
git pull origin main
cd ..
git add design
git commit -m "chore: bump design system to vX.X.X"
```

---

## Bước 2 — Tích hợp tokens theo từng stack

### Blazor WASM + MudBlazor 9 (`room_rental.auth`)

**File cần dùng:** `design/generated/blazor/RoomRentalTheme.cs`

Copy file vào project (hoặc reference trực tiếp từ submodule):

```csharp
// Program.cs
builder.Services.AddMudServices();
builder.RootComponents.Add<App>("#app");

// Đăng ký theme từ design system
var theme = RoomRentalTheme.Create();
```

```razor
<!-- MainLayout.razor -->
<MudThemeProvider Theme="@_theme" />

@code {
    private MudTheme _theme = RoomRentalTheme.Create();
}
```

Khi design system update:
```bash
# Từ root app repo
cd design && git pull && cd ..
cp design/generated/blazor/RoomRentalTheme.cs src/Shared/RoomRentalTheme.cs
git add -A && git commit -m "chore: sync design tokens v$(cat design/tokens/tokens.json | jq -r '.\"$metadata\".version')"
```

---

### Vue 3

**File cần dùng:** `design/generated/web/tokens.css`

**Cách 1 — Import trực tiếp từ submodule (recommended)**

```js
// src/main.js
import '../design/generated/web/tokens.css'
import './assets/main.css'
```

```js
// vite.config.js — không cần config thêm gì, Vite xử lý được
```

**Cách 2 — Copy vào src/assets (nếu không dùng submodule)**

```bash
cp design/generated/web/tokens.css src/assets/tokens.css
```

```js
// src/main.js
import './assets/tokens.css'
```

**Dùng token trong component:**

```vue
<template>
  <button class="btn-primary">Lưu</button>
</template>

<style scoped>
.btn-primary {
  background: var(--color-primary-DEFAULT);     /* #67C090 */
  color: var(--color-primary-on);               /* navy text trên nền xanh */
  border-radius: var(--border-radius-md);       /* 8px */
  padding: var(--spacing-3) var(--spacing-6);   /* 12px 24px */
  font-weight: var(--font-weight-medium);       /* 500 */
}
</style>
```

> ⚠️ Prototype dùng `--color-primary`, production CSS dùng `--color-primary-DEFAULT`.
> Trong Vue/React **luôn dùng tên verbose** từ `generated/web/tokens.css`.

**Sync khi design update:**

```bash
cd design && git pull && cd ..
# Nếu dùng cách copy thủ công:
cp design/generated/web/tokens.css src/assets/tokens.css
```

---

### React / Next.js

**File cần dùng:** `design/generated/web/tokens.css`

```js
// src/index.js hoặc app/layout.tsx (Next.js)
import '../design/generated/web/tokens.css'
// hoặc nếu copy vào app:
import './styles/tokens.css'
```

**Dùng trong component (CSS Modules):**

```css
/* Button.module.css */
.primary {
  background: var(--color-primary-DEFAULT);
  color: var(--color-primary-on);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-3) var(--spacing-6);
}
```

**Dùng với Tailwind CSS (nếu dùng):**

```js
// tailwind.config.js — map Tailwind với design tokens
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary-DEFAULT)',
        secondary: 'var(--color-secondary-DEFAULT)',
        error: 'var(--color-semantic-error)',
        success: 'var(--color-semantic-success)',
      },
      borderRadius: {
        md: 'var(--border-radius-md)',
        lg: 'var(--border-radius-lg)',
      },
    },
  },
}
```

---

## Bước 3 — Xem prototype khi code

Prototype chạy local, dùng làm **tham chiếu trực quan** khi implement một màn hình.

**Yêu cầu:** Node.js đã cài. Clone repo `room_rental.design` về máy (hoặc vào submodule).

```bash
# Từ thư mục root của room_rental.design (hoặc design/ trong app repo):
/prototype auth-server      # mở Auth UI trên http://localhost:3131
/prototype manager-portal   # mở Manager Portal
```

Prototype tự phục vụ qua HTTP (cần thiết cho Babel + XHR). Không cần build, không cần npm install.

**Workflow thực tế khi code 1 màn hình:**

1. Mở prototype: `/prototype auth-server`
2. Đọc spec: `components/specs/auth-server/login.md`
3. Code component trong app, tham chiếu prototype để so màu / layout / state
4. Dùng CSS vars từ `generated/web/tokens.css` — không hardcode hex/px

---

## Token Reference nhanh

| Khái niệm | CSS var (production) | Giá trị |
|-----------|---------------------|---------|
| Nút chính (xanh lá) | `--color-primary-DEFAULT` | `#67C090` |
| Appbar / Navy | `--color-secondary-DEFAULT` | `#124170` |
| Lỗi / Overdue | `--color-semantic-error` | `#C62828` |
| Cảnh báo | `--color-semantic-warning` | `#E65100` |
| Text chính | `--color-text-primary` | `#0F1E2D` |
| Text phụ | `--color-text-secondary` | `#3D5970` |
| Nền trang | `--color-surface-background` | `#DDF4E7` |
| Card / Surface | `--color-surface-surface` | `#FFFFFF` |
| Spacing 4 (1 unit) | `--spacing-4` | `16px` |
| Radius thường | `--border-radius-md` | `8px` |

Danh sách đầy đủ trong `generated/web/tokens.css`.

---

## Khi design system có breaking change

Breaking change = major version tăng (ví dụ `2.x.x` → `3.0.0`).

1. Xem CHANGELOG.md để biết token nào đổi tên/xóa
2. Chạy global search trong app repo: `grep -r "color-primary" src/`
3. Cập nhật từng chỗ dùng token cũ sang tên mới
4. Build + test lại

> Major version được bump khi token bị đổi tên hoặc xóa. Patch/minor không làm vỡ app.
