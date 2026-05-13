
"use client"

import * as React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TenantCard } from "@/components/tenant-card"
import { TenantForm } from "@/components/tenant-form"
import { OutletManagement } from "@/components/outlet-management"
import { UserManagement } from "@/components/user-management"
import { initialTenants } from "@/lib/mock-data"
import { Tenant, Outlet } from "@/lib/types"
import { SidebarProvider } from "@/components/ui/sidebar"
import { 
  Search, 
  Plus, 
  Grid2X2, 
  List, 
  ChevronDown,
  ArrowLeft,
  LayoutDashboard
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState("tenants")
  const [tenants, setTenants] = React.useState<Tenant[]>(initialTenants)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null)
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  
  // Drill-down Context State
  const [selectedTenant, setSelectedTenant] = React.useState<Tenant | null>(null)
  const [selectedOutlet, setSelectedOutlet] = React.useState<Outlet | null>(null)
  
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingTenant, setEditingTenant] = React.useState<Tenant | null>(null)

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = 
      t.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.contactPhone.includes(searchQuery)
    
    const matchesFilter = !filterStatus || t.configurationStatus === filterStatus

    return matchesSearch && matchesFilter
  })

  const handleAddTenant = (data: Partial<Tenant>) => {
    if (editingTenant) {
      setTenants(prev => prev.map(t => t.id === editingTenant.id ? { ...t, ...data } as Tenant : t))
    } else {
      const newTenant: Tenant = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      } as Tenant
      setTenants(prev => [newTenant, ...prev])
    }
    setIsFormOpen(false)
    setEditingTenant(null)
  }

  const openEditForm = (tenant: Tenant) => {
    setEditingTenant(tenant)
    setIsFormOpen(true)
  }

  // Intuitive Navigation Handlers
  const handleTenantClick = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setActiveTab('outlets')
  }

  const handleOutletClick = (outlet: Outlet) => {
    setSelectedOutlet(outlet)
    setActiveTab('users')
  }

  const resetSelection = () => {
    setSelectedTenant(null)
    setSelectedOutlet(null)
    setActiveTab('tenants')
  }

  const renderContent = () => {
    // 1. Dashboard Placeholder
    if (activeTab === 'dashboard') {
      return (
        <div className="p-12 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="h-20 w-20 bg-[#E3F2FD] rounded-3xl flex items-center justify-center mb-6">
            <LayoutDashboard className="h-10 w-10 text-[#0071BC]" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome to DineNet</h2>
          <p className="text-slate-500 max-w-md">Your command center for proactive restaurant management is ready. Select a category from the sidebar to begin.</p>
        </div>
      )
    }

    // 2. User Level (Drill-down from Outlet)
    if (activeTab === 'users' || selectedOutlet) {
      return (
        <UserManagement 
          tenant={selectedTenant} 
          outlet={selectedOutlet} 
          onBack={() => {
            if (selectedOutlet) {
              setSelectedOutlet(null)
              setActiveTab('outlets')
            } else {
              resetSelection()
            }
          }} 
        />
      )
    }

    // 3. Outlet Level (Drill-down from Tenant or Global)
    if (activeTab === 'outlets' || selectedTenant) {
      return (
        <OutletManagement 
          tenant={selectedTenant} 
          onBack={() => {
            if (selectedTenant) {
              setSelectedTenant(null)
              setActiveTab('tenants')
            } else {
              resetSelection()
            }
          }} 
          onViewUsers={handleOutletClick}
        />
      )
    }

    // 4. Default Tenant Level
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar with Profile Initial */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm">
              <div className="h-6 w-6 rounded-full bg-[#0071BC] text-white flex items-center justify-center text-[10px] font-black">S</div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Sys Admin</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Status:</span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-green-600 uppercase">Live</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-[42px] font-black tracking-tight text-[#121A26] leading-none mb-3">
                Tenant Hub
              </h1>
              <p className="text-slate-500 font-medium text-lg">
                Orchestrate your global restaurant network.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center shadow-sm">
                <Button 
                  variant="ghost"
                  size="sm" 
                  className={cn(
                    "h-10 px-4 gap-2 rounded-lg font-bold text-xs transition-all", 
                    viewMode === 'list' ? "bg-[#E3F2FD] text-[#0071BC]" : "text-slate-400 hover:text-slate-600"
                  )}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                  LIST
                </Button>
                <Button 
                  variant="ghost"
                  size="sm" 
                  className={cn(
                    "h-10 px-4 gap-2 rounded-lg font-bold text-xs transition-all", 
                    viewMode === 'grid' ? "bg-[#0071BC] text-white" : "text-slate-400 hover:text-slate-600"
                  )}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid2X2 className="h-4 w-4" />
                  GRID
                </Button>
              </div>
              <Button 
                className="h-12 rounded-xl px-8 bg-[#0071BC] hover:bg-[#005a96] text-white font-black gap-3 text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                onClick={() => {
                  setEditingTenant(null)
                  setIsFormOpen(true)
                }}
              >
                <Plus className="h-5 w-5" />
                CREATE TENANT
              </Button>
            </div>
          </div>

          {/* Search and Filter Experience */}
          <div className="bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-2 mb-10">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#0071BC] transition-colors" />
              <Input 
                placeholder="Find tenants by brand, email or contact..." 
                className="pl-14 h-16 bg-white border-transparent rounded-[20px] w-full text-lg font-medium placeholder:text-slate-300 focus-visible:ring-0 focus-visible:bg-slate-50/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="h-16 w-px bg-slate-100 hidden md:block" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-16 px-8 rounded-[20px] text-slate-500 hover:bg-slate-50 justify-between min-w-[240px] text-base font-bold">
                  <span className={cn(filterStatus ? "text-[#0071BC]" : "text-slate-400")}>
                    {filterStatus || "All Statuses"}
                  </span>
                  <ChevronDown className={cn("h-5 w-5 ml-4 transition-transform", filterStatus ? "text-[#0071BC]" : "opacity-20")} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] rounded-2xl p-2 border-slate-100 shadow-2xl">
                <DropdownMenuItem className="rounded-xl py-3 font-bold text-slate-500" onClick={() => setFilterStatus(null)}>Show All</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl py-3 font-bold text-green-600" onClick={() => setFilterStatus('Active')}>Active Brands</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl py-3 font-bold text-[#827717]" onClick={() => setFilterStatus('Configuration pending')}>Pending Setup</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl py-3 font-bold text-slate-400" onClick={() => setFilterStatus('Inactive')}>Inactive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Grid/List Content */}
          {filteredTenants.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'}>
              {filteredTenants.map((tenant) => (
                <TenantCard 
                  key={tenant.id} 
                  tenant={tenant} 
                  viewMode={viewMode} 
                  onEdit={openEditForm}
                  onViewOutlets={() => handleTenantClick(tenant)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[40px] p-32 text-center border-2 border-dashed border-slate-100">
              <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search className="h-12 w-12 text-slate-200" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">No Matches Found</h3>
              <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium text-lg">We couldn't find any tenants matching your current filters. Try resetting them.</p>
              <Button 
                variant="outline" 
                className="rounded-2xl h-14 px-10 font-black text-slate-600 border-slate-200 hover:bg-slate-50 transition-all"
                onClick={() => {setSearchQuery(""); setFilterStatus(null)}}
              >
                RESET ALL FILTERS
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F8F9FA]">
        <DashboardSidebar activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab)
          setSelectedTenant(null)
          setSelectedOutlet(null)
        }} />
        
        <main className="flex-1 flex flex-col min-w-0">
          {renderContent()}
        </main>
      </div>

      <TenantForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        tenant={editingTenant}
        onSubmit={handleAddTenant}
      />
    </SidebarProvider>
  )
}
