# DineNet Admin Dashboard - 100% Comprehensive Design Specification

## 1. Design System & Brand Identity

### 1.1 Color Palette (Strict HSL)
All colors must be implemented using CSS variables in `globals.css`.
- **Primary (Brand Blue)**: `hsl(204 100% 35%)`
- **Secondary**: `hsl(210 40% 96.1%)`
- **Background (Canvas)**: `#f8f9fc` (Main app workspace)
- **Foreground (Text)**: `hsl(222 47% 11%)`
- **Muted Foreground**: `hsl(215.4 16.3% 46.9%)`
- **Surface**: `hsl(0 0% 100%)` (Used for Cards, Sheets, and Popovers)
- **Status Colors (System Defaults)**:
  - **Active/Success**: `bg-[#e1f9ef]`, `text-[#22c55e]`
  - **Pending/Warning**: `bg-amber-100`, `text-amber-700`
  - **Suspended/Error**: `bg-rose-100`, `text-rose-500`
  - **Neutral**: `bg-slate-100`, `text-slate-500`

### 1.2 Typography (Inter Stack)
- **Font Family**: `'Inter', sans-serif`
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold), 900 (Black)
- **Hierarchy**:
  - **Main Titles**: 30px / Black (900) / Tracking-tight
  - **Section Headers**: 18px / Extrabold (800)
  - **Sub-headers**: 15px / Bold (700)
  - **Meta Labels**: 10px or 11px / Bold (700) / Uppercase / Tracking-widest
  - **Body Copy**: 14px / Medium (500)

### 1.3 Layout & Spacing
- **Container Width**: `max-w-7xl` (1280px) for management views.
- **Global Padding**: `p-6` (24px) for mobile, `p-8` or `p-10` (32px/40px) for desktop.
- **Grid Gap**: `gap-4` (16px) for cards, `gap-8` (32px) for complex forms.
- **Border Radius**: 
  - `var(--radius)`: `0.75rem` (12px) - Standard for Cards, Inputs, and Buttons.
  - `rounded-2xl`: `1rem` (16px) - Inner Card containers.
  - `rounded-3xl`: `1.5rem` (24px) - Complex management panels.
  - `rounded-full`: Used for Status Badges and Profile Icons.

### 1.4 Shadows & Elevation
- **Card Shadow**: `shadow-sm` (subtle border-like depth).
- **Interactive Shadow**: `shadow-lg shadow-primary/20` (used on primary buttons).
- **Overlay Shadow**: `shadow-2xl` (used on Sheets and Popovers).

## 2. Core UI Components

### 2.1 Side Sidebar (Collapsible)
- **Width**: `16rem` (256px) expanded, `3rem` (48px) collapsed.
- **Background**: `#f8f9fc`.
- **Interaction**: Active items use `bg-white`, `text-primary`, and a `ring-1 ring-slate-200`.
- **Logo Transition**: Smooth SVG scaling between full brand and icon-only modes.

### 2.2 Side Sheets (Management Drawers)
- **Widths**:
  - **Forms (Standard)**: `sm:max-w-[750px]`
  - **Management (Extended)**: `sm:max-w-[1200px]`
- **Header**: Sticky `p-8` with white background and `border-b`.
- **Scroll Behavior**: Inner `ScrollArea` for content with sticky `SheetFooter` buttons.

### 2.3 Management Tables
- **Row Height**: `py-5` (approx 80px per row).
- **Hover State**: `hover:bg-slate-50/50`.
- **Styling**: `border-b border-slate-50`. No vertical borders between columns.

## 3. Sophisticated Patterns

### 3.1 Multi-Selection (Payment Gateways)
- **Architecture**: Non-modal `Popover` to prevent focus-stealing in Sheets.
- **Selection Row**: Full-width clickable `button` with `p-3`.
- **Circular Checkmark**: 
  - Default: `h-6 w-6`, `border-2 border-slate-300`, `bg-white`.
  - Selected: `bg-primary`, `border-primary`, displaying a `white` bold check icon.
- **Persistence**: Selections updated via `useCallback` to ensure high-performance re-renders.

### 3.2 Advanced Searchable Filters (Popovers)
- **Width**: `w-[480px]` (standardized for Org/Outlet filters to prevent truncation).
- **Header**: Integrated `Input` search with `focus-visible:ring-0`.
- **Formatting**:
  - **Organization**: `Name`.
  - **Outlet**: `Organization-Branch (X Staffs)` format.
- **Behavior**: Auto-resets page to 1 on filter change.

### 3.3 Windowed Pagination
- **Capacity**: Maximum of 5 numeric buttons shown at once.
- **Logic**: Windows dynamically move based on current selection (e.g., if on page 10, shows 8, 9, 10, 11, 12).
- **Design**: `h-8 w-8` buttons, `text-[11px] font-black`. Active state is `bg-primary`.

### 3.4 Status Assistant (AI)
- **Trigger**: `rounded-full` button with `Sparkles` icon.
- **UI**: Side-popover with `ScrollArea`.
- **Logic**: Uses Genkit to analyze configuration completeness (Merchant ID, Gateway Count, etc.).

## 4. Interaction Principles
- **Transitions**: `duration-300` or `duration-500` for all Sheet entries and hover effects.
- **Feedback**: Immediate `Toast` notifications for CRUD operations (Create, Update, Delete).
- **Safety**: Multi-step `AlertDialog` for all destructive actions (Delete, Suspend, Decommission).