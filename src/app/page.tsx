"use client"

import * as React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TenantCard } from "@/components/tenant-card"
import { TenantForm } from "@/components/tenant-form"
import { TenantConfiguration } from "@/components/tenant-configuration"
import { TenantDetail } from "@/components/tenant-detail"
import { OutletManagement } from "@/components/outlet-management"
import { UserManagement } from "@/components/user-management"
import { DashboardOverview } from "@/components/dashboard-overview"
import { OutletListView } from "@/components/outlet-list-view"
import { UserListView } from "@/components/user-list-view"
import { initialTenants } from "@/lib/mock-data"
import { Tenant, User } from "@/lib/types"
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
  const [activeTab, setActiveTab] = React.useState("dashboard")
  const [tenants, setTenants] = React.useState<Tenant[]>(initialTenants)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null)
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = React.useState(1)
  
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isConfigOpen, setIsConfigOpen] = React.useState(false)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isOutletsDrawerOpen, setIsOutletsDrawerOpen] = React.useState(false)
  const [isUsersDrawerOpen, setIsUsersDrawerOpen] = React.useState(false)
  
  const [editingTenant, setEditingTenant] = React.useState<Tenant | null>(null)
  const [configuringTenant, setConfiguringTenant] = React.useState<Tenant | null>(null)
  const [viewingTenant, setViewingTenant] = React.useState<Tenant | null>(null)
  const [selectedTenant, setSelectedTenant] = React.useState<Tenant | null>(null)
  const [editingUser, setEditingUser] = React.useState<User | null>(null)

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

  const handleOutletsNavigation = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setIsOutletsDrawerOpen(true)
  }

  const handleUsersNavigation = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setIsUsersDrawerOpen(true)
  }

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return <DashboardOverview />
    }

    if (activeTab === 'outlets') {
      return (
        <OutletListView 
          onViewUsers={(outlet) => {
            const owner = tenants.find(t => t.id === outlet.tenantId)
            setSelectedTenant(owner || null)
            setIsUsersDrawerOpen(true)
          }}
        />
      )
    }

    if (activeTab === 'users') {
      return (
        <UserListView 
          onEditUser={(user) => {
            setEditingUser(user)
            setIsUsersDrawerOpen(true)
          }}
        />
      )
    }

    if (activeTab === 'tenants') {
      return (
        <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden bg-[#f8f9fc]">
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tenant Management</h1>
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
                <Button size="sm" className="h-10 px-6 font-black bg-[#1a73e8] hover:bg-[#1557b0] shadow-lg shadow-[#1a73e8]/20" onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> New Tenant
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search by brand or email..." 
                  className="pl-10 h-11 text-sm bg-white border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-11 px-5 text-sm font-bold border-slate-200 text-slate-600">
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
                    onUsersClick={handleUsersNavigation}
                  />
                ))}
                {filteredTenants.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">No tenants match your search criteria.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-auto py-6 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  Showing <span className="text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredTenants.length)}</span> of <span className="text-slate-900">{filteredTenants.length}</span> results
                </p>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 border-slate-200"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                      if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className={cn("h-8 w-8 p-0 text-[11px] font-black border-slate-200", currentPage === pageNum ? "bg-slate-900 border-slate-900" : "text-slate-500")}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 border-slate-200"
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <LayoutDashboard className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Access Restricted</h2>
        <p className="text-sm text-slate-500">This feature is currently under active development.</p>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <DashboardSidebar activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab)
          setSelectedTenant(null)
          setEditingUser(null)
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
      <OutletManagement
        tenant={selectedTenant}
        isOpen={isOutletsDrawerOpen}
        onClose={() => {setIsOutletsDrawerOpen(false); setSelectedTenant(null)}}
        onViewUsers={(outlet) => {
          setIsOutletsDrawerOpen(false)
          setIsUsersDrawerOpen(true)
        }}
      />
      <UserManagement
        tenant={selectedTenant}
        editingUser={editingUser}
        isOpen={isUsersDrawerOpen}
        onClose={() => {setIsUsersDrawerOpen(false); setSelectedTenant(null); setEditingUser(null)}}
      />
    </SidebarProvider>
  )
}
