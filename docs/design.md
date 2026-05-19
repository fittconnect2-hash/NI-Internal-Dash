# DineNet Admin Dashboard Design Document

## 1. Overview
DineNet is a proactive restaurant property management platform designed for multi-unit hospitality brands. The platform centralizes management for organizations, individual outlets, staff access, and financial configurations, providing system administrators with high-level analytical insights and granular operational control.

## 2. Design System

### 2.1 Color Palette
DineNet uses a high-contrast, professional palette designed for long-session productivity.
- **Primary (Brand)**: `hsl(204 100% 35%)` - A deep, trust-inspiring blue used for primary actions, sidebar highlights, and navigation.
- **Background**: `hsl(0 0% 100%)` for components; `#f8f9fc` for the main canvas to provide depth.
- **Surface**: Card-based architecture with `bg-white`, `border-slate-200`, and `shadow-sm`.
- **Status Colors**:
  - **Active**: `bg-[#e1f9ef]`, `text-[#22c55e]` (Success)
  - **Pending**: `bg-amber-100`, `text-amber-700` (Warning/Action Required)
  - **Inactive/Suspended**: `bg-rose-100`, `text-rose-500` (Error/Restricted)
  - **Neutral**: `bg-slate-100`, `text-slate-500` (Secondary Info)

### 2.2 Typography
- **Font Family**: `Inter` (Sans-serif)
- **Scale**:
  - **H1**: 30px / Black (900) - Main view titles.
  - **H3**: 18px / Extrabold (800) - Card titles and section headers.
  - **Labels**: 10px / Bold (700) / Uppercase / Tracking-widest - Metadata and filter labels.
  - **Body**: 14px / Medium (500) - Standard readable text.

### 2.3 Iconography & Interaction
- **Icons**: `Lucide React` (Stroke width: 2).
- **Radius**: `0.75rem` (12px) for cards and inputs; `full` for status badges and circular checkmarks.
- **Shadows**: Soft `shadow-sm` for standard cards; `shadow-xl` for interactive Sheets and Drawers.
- **Transitions**: 300ms ease-in-out for all hover states and drawer entries.

## 3. Core Architecture

### 3.1 Tech Stack
- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS with HSL variable mapping.
- **Components**: ShadCN UI (Radix UI primitives).
- **AI**: Genkit with Google Gemini 1.5 Flash.
- **State/Persistence**: React State with Local Storage synchronization (versioned).

### 3.2 Layout Strategy
- **Sidebar-Centric**: A collapsible sidebar manages primary navigation groups (Overview, Management, Payment).
- **Contextual Management**: Heavy reliance on **Side Sheets** for editing and creation, ensuring the user never loses their place in a list.
- **Searchable Filtering**: Multi-layered filters using Popovers and searchable Inputs for high-density datasets.

## 4. Key Modules

### 4.1 Dashboard Overview
- **Analytical Cards**: Real-time sales, order volume, and efficiency metrics.
- **Dynamic Charting**: Recharts-powered Area and Bar charts for revenue trends and serving performance.
- **Live Feed**: Monitoring of recent network orders.

### 4.2 Organization Management
- **Directory**: Supports both Grid (profile focus) and List (data focus) views.
- **Enrollment**: Comprehensive form for business identity, contact details, and location.
- **Detail View**: Deep-dive into organization profiles and admin enrollment.

### 4.3 Outlet Management
- **Property Profiling**: Management of branch-specific data (Timezone, Phone, Mapping).
- **Quick-Stats**: Displays total outlets and total staff counts in real-time.
- **Slug Control**: Automatic slug generation for unique URL identification.

### 4.4 User Management
- **RBAC**: Support for Organization Admins, Managers, and Partner Admins.
- **Intelligent Filtering**: 
  - **Outlet Filter**: Searchable popover with `Organization-Outlet (X Staffs)` format.
  - **Status Control**: Quick actions for Suspension, Reactivation, and Password Resets.
- **Windowed Pagination**: Clean navigation showing max 5 pages to avoid UI clutter.

### 4.5 Payment Gateway Configuration
- **Interaction Model**: A non-modal selection layer using high-contrast circular checkmarks.
- **Configuration Modes**:
  - **Global (Same for Everyone)**: Apply a set of providers to the entire brand.
  - **Granular (Unique by Outlet)**: Individual gateway mapping for specific branches.

## 5. AI Features
- **AI Status Assistant**: Powered by Genkit, this assistant analyzes configuration completion, identifies missing data (like Merchant IDs), and suggests proactive improvements for organization profiles.

## 6. Data Model
- **Organization**: Business identity, status, location, and global payment settings.
- **Outlet**: Physical branch details, linked to an Organization, with branch-specific gateway overrides.
- **User**: Authentication profile, role assignment, and mapping to specific outlets.
- **Gateway**: Provider type (DPO/NGenius), currency support, and environment status.
