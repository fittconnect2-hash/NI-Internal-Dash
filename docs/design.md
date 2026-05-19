# DineNet Admin Dashboard - 100% Comprehensive Design Specification

## 1. Design System & Brand Identity

### 1.1 Color Palette (Strict HSL & Hex)
All colors are implemented using CSS variables in `globals.css`.
- **Primary (Brand Blue)**: `hsl(204 100% 35%)` / `#0069B1`
- **Secondary**: `hsl(210 40% 96.1%)`
- **Background (Canvas)**: `#f8f9fc` (Main app workspace)
- **Foreground (Text)**: `hsl(222 47% 11%)`
- **Muted Foreground**: `hsl(215.4 16.3% 46.9%)`
- **Surface**: `hsl(0 0% 100%)` (Used for Cards, Sheets, and Popovers)
- **Status Colors (Semantic)**:
  - **Active/Success**: `bg-[#e1f9ef]`, `text-[#22c55e]` (Success green)
  - **Pending/Warning**: `bg-amber-100`, `text-amber-700` (Amber)
  - **Suspended/Error**: `bg-rose-100`, `text-rose-500` (Rose)
  - **Neutral**: `bg-slate-100`, `text-slate-500` (Slate)

### 1.2 Typography (Inter Font Family)
- **Font Stack**: `'Inter', sans-serif`
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold), 900 (Black)
- **Hierarchy**:
  - **Page Titles**: `text-3xl font-black text-slate-900 tracking-tight` (30px)
  - **Section Headers**: `text-lg font-extrabold text-[#1e293b]` (18px)
  - **Sub-headers**: `text-[15px] font-bold` (15px)
  - **Meta Labels**: `text-[10px] font-bold uppercase tracking-widest text-slate-400`
  - **Body Copy**: `text-sm font-medium text-slate-500` (14px)

### 1.3 Layout & Spacing Tokens
- **Container**: `max-w-7xl` (1280px) centered for management views.
- **Global Padding**: `p-6` (mobile) to `p-8/p-10` (desktop).
- **Component Spacing**:
  - Grid Gap: `gap-4` or `gap-6`.
  - Form Gap: `gap-8` for vertical sections, `gap-12` for horizontal pairs.
- **Border Radius**: 
  - `var(--radius)`: `0.75rem` (12px) - Default for buttons/inputs.
  - `rounded-2xl`: `1rem` (16px) - Standard card container.
  - `rounded-3xl`: `1.5rem` (24px) - Form containers and side drawers.
  - `rounded-full`: Status badges and action icons.

### 1.4 Shadows & Depth
- **Card Base**: `shadow-sm` (Subtle 1px border feel).
- **Interactive Elements**: `shadow-lg shadow-primary/20` (Buttons).
- **Overlays**: `shadow-2xl` (Popovers and Sheets).

## 2. Core UI Component Specs

### 2.1 Sidebar (Proactive Navigation)
- **Widths**: `w-64` (expanded) / `w-20` (collapsed).
- **Styling**: `bg-[#f8f9fc] border-r border-slate-200`.
- **Active State**: `bg-white text-primary shadow-sm ring-1 ring-slate-200 font-bold`.
- **Interactive Element**: `[data-active="true"]::after` vertical indicator (4px width, rounded).

### 2.2 Side Management Sheets
- **Widths**:
  - **Standard (Forms)**: `sm:max-w-[750px]`.
  - **Extended (Management)**: `sm:max-w-[1200px]`.
- **Header**: Sticky `p-8 border-b bg-white`.
- **Content**: `ScrollArea` with `p-6` or `p-8` depending on context.
- **Footer**: Sticky `p-8 border-t bg-white flex justify-end gap-4`.

### 2.3 Management Tables
- **Row Height**: `py-5` (approx 80px total height).
- **Header**: `bg-slate-50/50 h-12 uppercase text-[10px] font-bold text-slate-400`.
- **Cell Styling**: `px-8` for start/end, `px-4` for middle.
- **Hover**: `hover:bg-slate-50/50`.

## 3. Advanced Implementation Logic

### 3.1 Multi-Selection (Payment Gateway)
- **Architecture**: `Popover` with `modal={false}` to prevent focus theft.
- **Interactive Row**: `button type="button"` or `div` with `onClick` and `e.stopPropagation()`.
- **Circular Checkmark**:
  - **Default**: `h-6 w-6 rounded-full border-2 border-slate-300 bg-white`.
  - **Selected**: `bg-primary border-primary shadow-sm`, displaying a `white stroke-[4px]` check icon.
- **Persistence**: Toggles `gatewayIds` array via `useCallback` hook.

### 3.2 Searchable Popover Filters
- **Standard Width**: `w-[480px]` (standardized for both Organization and Outlet filters).
- **Header**: `Input` search integrated into `PopoverContent`.
- **Formatting**:
  - **Organization**: `Name` (Plain).
  - **Outlet**: `BrandName-BranchName (X Staffs)` format.
- **Staff Count Logic**: Dynamically derived from `allUsers.filter(u => u.outletId === outlet.id).length`.

### 3.3 Windowed Pagination
- **Capacity**: Maximum of 5 numeric buttons shown at once.
- **Window Logic**:
  - If `totalPages <= 5`: Show all.
  - If `currentPage > 3`: Shift window to `currentPage - 2` to `currentPage + 2`.
  - Handles edge cases at start and end of total page range.
- **Visuals**: `h-8 w-8 text-[11px] font-black`. Active: `bg-primary text-white`.

### 3.4 Summary Badges (New Pattern)
- **Header Info**: `bg-primary/5 text-primary` and `bg-slate-100 text-slate-500`.
- **Styling**: `font-black text-[10px] uppercase px-3 py-1 border-none`.
- **Usage**: Displayed next to titles in Outlet and User management to show "Total Network" vs "Organization specific" metrics.

## 4. CSS Globals & Utility Classes
```css
/* Custom variables exported to theme */
--background: 0 0% 100%;
--primary: 204 100% 35%;
--sidebar-background: 210 40% 99%;
--radius: 0.75rem;

/* Interaction states */
.active-status { @apply bg-[#e1f9ef] text-[#22c55e]; }
.pending-status { @apply bg-amber-100 text-amber-700; }
```

## 5. Technical Stack Map
- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS 3.4+.
- **Components**: Radix UI (Sheet, Popover, Select, Dialog) with ShadCN UI patterns.
- **Icons**: Lucide React.
- **AI**: Genkit (Status Assistant).
- **State**: React `useState` + `useMemo` for filtering + `localStorage` for persistence.
```