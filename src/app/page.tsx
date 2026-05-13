"use client"

import * as React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TenantCard } from "@/components/tenant-card"
import { TenantForm } from "@/components/tenant-form"
import { TenantConfiguration } from "@/components/tenant-configuration"
import { TenantDetail } from "@/components/tenant-detail"
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
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
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

const ITEMS_PER_PAGE = 8

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState("tenants")
  const [tenants, setTenants] = React.useState<Tenant[]>(initialTenants)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null)
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = React.useState(1)
  
  const [selectedTenant, setSelectedTenant] = React.useState<Tenant | null>(null)
  const [selectedOutlet, setSelectedOutlet] = React.useState<Outlet | null>(null)
  
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isConfigOpen, setIsConfigOpen] = React.useState(false)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [editingTenant, setEditingTenant] = React.useState<Tenant | null>(null)
  const [configuringTenant, setConfiguringTenant] = React.useState<Tenant | null>(null)
  const [viewingTenant, setViewingTenant] = React.useState<Tenant | null>(null)

  // Filter logic
  const filteredTenants = React.useMemo(() => {
    return tenants.filter(t => {
      const matchesSearch = 
        t.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = !filterStatus || t.configurationStatus === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [tenants, searchQuery, filterStatus])

  // Pagination logic
  const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE)
  const paginatedTenants = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredTenants.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredTenants, currentPage])

  // Reset page when filtering/searching
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatus])

  const handleAddTenant = (data: Partial<Tenant>) => {
    if (editingTenant) {
      setTenants(prev => prev.map(t => t.id === editingTenant.id ? { ...t, ...data } as Tenant : t))
    } else {
      const newTenant: Tenant = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        configurationStatus: 'Configuration pending',
        isPaymentGatewayConfigured: false,
        numberOfOutlets: 0,
        numberOfUsers: 0,
      } as Tenant
      setTenants(prev => [newTenant, ...prev])
    }
    setIsFormOpen(false)
    setEditingTenant(null)
  }

  const handleDeleteTenant = (id: string) => {
    setTenants(prev => prev.filter(t => t.id !== id))
  }

  const handleConfigureTenant = (tenant: Tenant) => {
    setConfiguringTenant(tenant)
    setIsConfigOpen(true)
  }

  const handleViewTenant = (tenant: Tenant) => {
    setViewingTenant(tenant)
    setIsDetailOpen(true)
  }

  const handleOutletClick = (outlet: Outlet) => {
    setSelectedOutlet(outlet)
    setActiveTab('users')
  }

  const handleOutletsNavigation = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setActiveTab('outlets')
  }

  const resetSelection = () => {
    setSelectedTenant(null)
    setSelectedOutlet(null)
    setActiveTab('tenants')
  }

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
          <div className="h-12 w-12 bg-primary/10 rounded flex items-center justify-center mb-4">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Network Dashboard</h2>
          <p className="text-sm text-slate-500">Welcome to the central command center.</p>
        </div>
      )
    }

    if (activeTab === 'users' || selectedOutlet) {
      return <UserManagement tenant={selectedTenant} outlet={selectedOutlet} onBack={() => selectedOutlet ? setSelectedOutlet(null) : resetSelection()} />
    }

    if (activeTab === 'outlets' || selectedTenant) {
      return <OutletManagement tenant={selectedTenant} onBack={() => selectedTenant ? setSelectedTenant(null) : resetSelection()} onViewUsers={handleOutletClick} />
    }

    return (
      <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Tenant Management</h1>
              <p className="text-sm text-slate-500 mt-1">Manage your global brand network and properties.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white border border-slate-200 p-1 rounded flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("h-8 w-8 p-0", viewMode === 'list' && "bg-slate-100")} 
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("h-8 w-8 p-0", viewMode === 'grid' && "bg-slate-100")} 
                  onClick={() => setViewMode('grid')}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
              </div>
              <Button size="sm" className="h-9 px-4 font-semibold bg-[#94b8d7] hover:bg-[#83a7c6]" onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> New Tenant
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by brand or email..." 
                className="pl-10 h-10 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 text-sm font-medium">
                  {filterStatus || "Status: All"}
                  <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setFilterStatus(null)}>All Statuses</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('Active')}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('Configuration pending')}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('Inactive')}>Inactive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
            <div className={cn(viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8' : 'space-y-3 pb-8')}>
              {paginatedTenants.map((tenant) => (
                <TenantCard 
                  key={tenant.id} 
                  tenant={tenant} 
                  viewMode={viewMode} 
                  onEdit={(t) => {
                    setEditingTenant(t)
                    setIsFormOpen(true)
                  }}
                  onView={handleViewTenant}
                  onConfigure={handleConfigureTenant}
                  onDelete={handleDeleteTenant}
                  onOutletsClick={handleOutletsNavigation}
                />
              ))}
              {filteredTenants.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-400 font-medium">No tenants match your search criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-auto py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">
                Showing <span className="text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredTenants.length)}</span> of <span className="text-slate-900">{filteredTenants.length}</span> results
              </p>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  // Show pages around current page if many pages
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 3 + i + 1;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={cn("h-8 w-8 p-0 text-xs font-bold", currentPage === pageNum ? "bg-[#1a73e8]" : "text-slate-600")}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <DashboardSidebar activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab)
          setSelectedTenant(null)
          setSelectedOutlet(null)
        }} />
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {renderContent()}
        </main>
      </div>
      <TenantForm 
        isOpen={isFormOpen} 
        onClose={() => {setIsFormOpen(false); setEditingTenant(null)}} 
        tenant={editingTenant} 
        onSubmit={handleAddTenant} 
      />
      <TenantConfiguration
        isOpen={isConfigOpen}
        onClose={() => {setIsConfigOpen(false); setConfiguringTenant(null)}}
        tenant={configuringTenant}
        onSave={() => setIsConfigOpen(false)}
      />
      <TenantDetail
        isOpen={isDetailOpen}
        onClose={() => {setIsDetailOpen(false); setViewingTenant(null)}}
        tenant={viewingTenant}
      />
    </SidebarProvider>
  )
}
