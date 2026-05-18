
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
import { initialTenants, initialOutlets, initialUsers } from "@/lib/mock-data"
import { Tenant, User, Outlet } from "@/lib/types"
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
import { useToast } from "@/hooks/use-toast"

const ITEMS_PER_PAGE = 8
const STORAGE_KEYS = {
  TENANTS: 'network-dine-tenants-v1',
  OUTLETS: 'network-dine-outlets-v1',
  USERS: 'network-dine-users-v1',
}

export default function DashboardPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = React.useState("dashboard")
  const [tenants, setTenants] = React.useState<Tenant[]>([])
  const [outlets, setOutlets] = React.useState<Outlet[]>([])
  const [users, setUsers] = React.useState<User[]>([])
  const [isLoaded, setIsLoaded] = React.useState(false)

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
  const [isAddingNewUser, setIsAddingNewUser] = React.useState(false)

  // Robust Global Interaction Safeguard
  // This effect runs whenever a drawer or major UI state changes to ensure the body is interactive
  React.useEffect(() => {
    const isAnyOverlayOpen = isFormOpen || isConfigOpen || isDetailOpen || isOutletsDrawerOpen || isUsersDrawerOpen;
    if (!isAnyOverlayOpen) {
      // Small delay to allow Radix exit animations to settle before force-clearing body locks
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        // Remove any residual class names that might be locking the UI
        document.documentElement.style.pointerEvents = 'auto';
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isFormOpen, isConfigOpen, isDetailOpen, isOutletsDrawerOpen, isUsersDrawerOpen]);

  // Persistence Logic
  React.useEffect(() => {
    const t = localStorage.getItem(STORAGE_KEYS.TENANTS)
    const o = localStorage.getItem(STORAGE_KEYS.OUTLETS)
    const u = localStorage.getItem(STORAGE_KEYS.USERS)

    setTenants(t ? JSON.parse(t) : initialTenants)
    setOutlets(o ? JSON.parse(o) : initialOutlets)
    setUsers(u ? JSON.parse(u) : initialUsers)
    setIsLoaded(true)
  }, [])

  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants))
      localStorage.setItem(STORAGE_KEYS.OUTLETS, JSON.stringify(outlets))
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    }
  }, [tenants, outlets, users, isLoaded])

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
      toast({ title: "Tenant Updated", description: `${data.tenantName} has been successfully modified.` })
    } else {
      const newTenant: Tenant = {
        ...data,
        id: `t-${Math.random().toString(36).substr(2, 9)}`,
        configurationStatus: 'Configuration pending',
        isPaymentGatewayConfigured: false,
        numberOfOutlets: 0,
        numberOfUsers: 0,
      } as Tenant
      setTenants(prev => [newTenant, ...prev])
      toast({ title: "New Tenant Added", description: `${data.tenantName} is now registered on the platform.` })
    }
    setIsFormOpen(false)
    setEditingTenant(null)
  }

  const handleDeleteTenant = (id: string) => {
    setTenants(prev => prev.filter(t => t.id !== id))
    setOutlets(prev => prev.filter(o => o.tenantId !== id))
    setUsers(prev => prev.filter(u => u.tenantId !== id))
    toast({ title: "Tenant Removed", description: "The organization and all associated data have been deleted." })
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
    setIsAddingNewUser(false)
  }

  const handleAddUserGlobal = () => {
    setSelectedTenant(null)
    setEditingUser(null)
    setIsAddingNewUser(true)
    setIsUsersDrawerOpen(true)
  }

  const handleUserSaved = () => {
    // Close drawer
    setIsUsersDrawerOpen(false)
    setSelectedTenant(null)
    setEditingUser(null)
    setIsAddingNewUser(false)
    
    // Switch to main users page
    setActiveTab('users')
    
    // Explicitly restore interactivity
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = 'auto';
  }

  const updateTenantCounts = (tid: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === tid) {
        const uCount = users.filter(u => u.tenantId === tid).length
        const oCount = outlets.filter(o => o.tenantId === tid).length
        return { ...t, numberOfUsers: uCount, numberOfOutlets: oCount }
      }
      return t
    }))
  }

  // Effect to keep counts in sync when lists change
  React.useEffect(() => {
    if (isLoaded) {
      const tenantIds = tenants.map(t => t.id)
      setTenants(prev => prev.map(t => {
        const uCount = users.filter(u => u.tenantId === t.id).length
        const oCount = outlets.filter(o => o.tenantId === t.id).length
        return { ...t, numberOfUsers: uCount, numberOfOutlets: oCount }
      }))
    }
  }, [users.length, outlets.length, isLoaded])

  const renderContent = () => {
    if (!isLoaded) return <div className="flex-1 flex items-center justify-center"><p className="text-sm font-bold text-slate-400 animate-pulse">Initializing Data...</p></div>

    if (activeTab === 'dashboard') {
      return <DashboardOverview />
    }

    if (activeTab === 'outlets') {
      return (
        <OutletListView 
          allOutlets={outlets}
          setAllOutlets={setOutlets}
          allTenants={tenants}
          onViewUsers={(outlet) => {
            const owner = tenants.find(t => t.id === outlet.tenantId)
            setSelectedTenant(owner || null)
            setIsUsersDrawerOpen(true)
            setIsAddingNewUser(false)
          }}
        />
      )
    }

    if (activeTab === 'users') {
      return (
        <UserListView 
          allUsers={users}
          setAllUsers={setUsers}
          allTenants={tenants}
          allOutlets={outlets}
          onAddUser={handleAddUserGlobal}
          onEditUser={(user) => {
            setEditingUser(user)
            setIsAddingNewUser(false)
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
          setIsAddingNewUser(false)
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
        allOutlets={outlets}
        setAllOutlets={setOutlets}
        allTenants={tenants}
        isOpen={isOutletsDrawerOpen}
        onClose={() => {setIsOutletsDrawerOpen(false); setSelectedTenant(null)}}
        onViewUsers={(outlet) => {
          setIsOutletsDrawerOpen(false)
          setIsUsersDrawerOpen(true)
          setIsAddingNewUser(false)
        }}
      />
      <UserManagement
        tenant={selectedTenant}
        editingUser={editingUser}
        allUsers={users}
        setAllUsers={setUsers}
        allTenants={tenants}
        allOutlets={outlets}
        isOpen={isUsersDrawerOpen}
        defaultAdding={isAddingNewUser}
        onClose={() => {
          setIsUsersDrawerOpen(false); 
          setSelectedTenant(null); 
          setEditingUser(null);
          setIsAddingNewUser(false);
        }}
        onSaved={handleUserSaved}
      />
    </SidebarProvider>
  )
}
