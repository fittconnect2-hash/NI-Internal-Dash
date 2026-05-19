# DineNet Admin Dashboard Design Document

## 1. Overview
DineNet is a proactive restaurant property management platform designed for multi-unit hospitality brands. The platform allows system administrators to manage a global network of organizations, their individual outlets, staff access, and financial configurations.

## 2. Core Architecture
The application is built using the **Next.js 15 App Router** (React 19) and follows a single-page dashboard architecture with centralized state management for mock data persistence (Local Storage).

### 2.1 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Components**: ShadCN UI (Radix UI primitives)
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI Integration**: Genkit (Google Gemini 1.5 Flash)
- **Forms**: React Hook Form + Zod

## 3. Key Modules

### 3.1 Dashboard Overview
- **Analytical Cards**: Real-time stats for Total Sales, Order Volume, Total Restaurants, and Average Service Time.
- **Data Visualization**: 
  - Revenue Trend (Area/Line Chart)
  - Revenue Source Distribution (Progress bars)
  - Network Distribution by City (Vertical Bar Chart)
  - Kitchen Efficiency & Service Performance (Bar Charts)
- **Live Monitoring**: A real-time feed of orders across the network.

### 3.2 Organization Management
- **Centralized Brand Directory**: Grid and List views for all hospitality partners.
- **Profile Detail**: Deep-dive into brand information, including primary contact details and administrator enrollment.
- **Windowed Pagination**: Clean navigation for large datasets (max 5 pages shown at once).

### 3.3 Outlet Management
- **Property Profiling**: Management of branch-specific data (Timezone, Location, Contact).
- **Searchable Filters**: Deep-filtering by Organization and Status.
- **Quick-Stats**: Displays total outlets and total staff counts in the header.

### 3.4 User Management
- **Role-Based Access**: Support for Organization Admins, Managers, and Partner Admins.
- **Searchable Selectors**: 
  - **Organization Filter**: Search brands.
  - **Outlet Filter**: Searchable popover showing `Brand-Branch (X Staffs)` format for high-density networks.
- **Account Actions**: Suspend, Reactivate, Password Reset, and Permanent Deletion via secure confirmation dialogs.

### 3.5 Payment Gateway Configuration
- **Configuration Modes**:
  - **Global**: Apply a set of gateways to every outlet in the organization.
  - **Unique by Outlet**: Granular control to pick different payment systems for individual branches.
- **MultiGatewaySelector**: A specialized, non-modal Popover component that ensures stable selection of multiple providers (e.g., DPO, NGenius UAE, NGenius KSA) with high-contrast circular checkmarks.

## 4. AI Features
- **AI Status Assistant**: Powered by Genkit, this assistant analyzes an organization's profile and configuration to proactively identify "Configuration pending" statuses, missing merchant IDs, or operational inefficiencies.

## 5. UI/UX Principles
- **Modern Aesthetic**: High-contrast typography, soft shadows (`shadow-xl`), and generous spacing.
- **Feedback Loops**: Immediate toast notifications for all data mutations (Add/Edit/Delete).
- **Interactive Layers**: Heavy use of "Sheets" (Drawers) for complex management tasks to keep the user in the context of the main list.
- **Empty States**: All configuration modules default to zero selection for a clean starting experience.

## 6. Data Model (Mock)
- **Organizations**: IDs, Names, Status, Gateway Config, Stats.
- **Outlets**: Linked to Organizations, Location Data, Mapping to Gateways.
- **Users**: Linked to Organizations and optional specific Outlets.
- **Gateways**: Provider type (DPO/NGenius), Currency support, and Status.