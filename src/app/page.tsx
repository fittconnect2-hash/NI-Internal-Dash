"use client"

import * as React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { OrganizationCard } from "@/components/organization-card"
import { OrganizationForm } from "@/components/organization-form"
import { OrganizationConfiguration } from "@/components/organization-configuration"
import { OrganizationDetail } from "@/components/organization-detail"
import { OutletManagement } from "@/components/outlet-management"
import { UserManagement } from "@/components/user-management"
import { DashboardOverview } from "@/components/dashboard-overview"
import { OutletListView } from "@/components/outlet-list-view"
import { UserListView } from "@/components/user-list-view"
import { GatewayManagement } from "@/components/gateway-management"
import { initialOrganizations, initialOutlets, initialUsers, initialGateways } from "@/lib/mock-data"
import { Organization, User, Outlet, Gateway } from "@/lib/types"
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
  ORGANIZATIONS: 'dine-net-organizations-v6',
  OUTLETS: 'dine-net-outlets-v6',
  USERS: 'dine-net-users-v6',
  GATEWAYS: 'dine-net-gateways-v6',
}

export default function DashboardPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = React.useState("dashboard")
  const [organizations, setOrganizations] = React.useState<Organization[]>([])
  const [outlets, setOutlets] = React.useState<Outlet[]>([])
  const [users, setUsers] = React.useState<User[]>([])
  const [gateways, setGateways] = React.useState<Gateway[]>([])
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
  
  const [editingOrganization, setEditingOrganization] = React.useState<Organization | null>(null)
  const [configuringOrganization, setConfiguringOrganization] = React.useState<Organization | null>(null)
  const [viewingOrganization, setViewingOrganization] = React.useState<Organization | null>(null)
  const [selectedOrganization, setSelectedOrganization] = React.useState<Organization | null>(null)
  const [editingUser, setEditingUser] = React.useState<User | null>(null)
  const [isAddingNewUser, setIsAddingNewUser] = React.useState(false)

  // Interaction Safeguard
  React.useEffect(() => {
    const isAnyOverlayOpen = isFormOpen || isConfigOpen || isDetailOpen || isOutletsDrawerOpen || isUsersDrawerOpen;
    if (!isAnyOverlayOpen) {
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isFormOpen, isConfigOpen, isDetailOpen, isOutletsDrawerOpen, isUsersDrawerOpen]);

  // Persistence Logic
  React.useEffect(() => {
    const o = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS)
    const out = localStorage.getItem(STORAGE_KEYS.OUTLETS)
    const u = localStorage.getItem(STORAGE_KEYS.USERS)
    const g = localStorage.getItem(STORAGE_KEYS.GATEWAYS)

    setOrganizations(o ? JSON.parse(o) : initialOrganizations)
    setOutlets(out ? JSON.parse(out) : initialOutlets)
    setUsers(u ? JSON.parse(u) : initialUsers)
    setGateways(g ? JSON.parse(g) : initialGateways)
    setIsLoaded(true)
  }, [])

  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(organizations))
      localStorage.setItem(STORAGE_KEYS.OUTLETS, JSON.stringify(outlets))
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
      localStorage.setItem(STORAGE_KEYS.GATEWAYS, JSON.stringify(gateways))
    }
  }, [organizations, outlets, users, gateways, isLoaded])

  // Filter logic
  const filteredOrganizations = React.useMemo(() => {
    return organizations.filter(o => {
      const matchesSearch = 
        o.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = !filterStatus || o.configurationStatus === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [organizations, searchQuery, filterStatus])

  const totalPages = Math.ceil(filteredOrganizations.length / ITEMS_PER_PAGE)
  const paginatedOrganizations = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredOrganizations.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredOrganizations, currentPage])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatus])

  const handleAddOrganization = (data: Partial<Organization>) => {
    if (editingOrganization) {
      setOrganizations(prev => prev.map(o => o.id === editingOrganization.id ? { ...o, ...data } as Organization : o))
      toast({ title: "Organization Updated", description: `${data.organizationName} has been successfully modified.` })
    } else {
      const newOrg: Organization = {
        ...data,
        id: `org-${Math.random().toString(36).substr(2, 9)}`,
        configurationStatus: 'Configuration pending',
        isPaymentGatewayConfigured: false,
        globalGatewayIds: [],
        numberOfOutlets: 0,
        numberOfUsers: 0,
      } as Organization
      setOrganizations(prev => [newOrg, ...prev])
      toast({ title: "New Organization Added", description: `${data.organizationName} is now registered on the platform.` })
    }
    setIsFormOpen(false)
    setEditingOrganization(null)
  }

  const handleDeleteOrganization = (id: string) => {
    setOrganizations(prev => prev.filter(o => o.id !== id))
    setOutlets(prev => prev.filter(out => out.organizationId !== id))
    setUsers(prev => prev.filter(u => u.organizationId !== id))
    toast({ title: "Organization Removed", description: "The organization and all associated data have been deleted." })
  }

  const handleConfigureOrganization = (org: Organization) => {
    setConfiguringOrganization(org)
    setIsConfigOpen(true)
  }

  const handleSaveConfiguration = (orgId: string, updates: Partial<Organization>, outletUpdates?: Record<string, string[]>) => {
    setOrganizations(prev => prev.map(o => o.id === orgId ? { ...o, ...updates } : o))
    
    if (outletUpdates) {
      setOutlets(prev => prev.map(out => {
        if (out.organizationId === orgId && outletUpdates[out.id] !== undefined) {
          return { ...out, gatewayIds: outletUpdates[out.id] }
        }
        return out
      }))
    }

    toast({ title: "Configuration Applied", description: "All settings and gateway assignments have been updated." })
    setIsConfigOpen(false)
    setConfiguringOrganization(null)
  }

  const handleViewOrganization = (org: Organization) => {
    setViewingOrganization(org)
    setIsDetailOpen(true)
  }

  const handleOutletsNavigation = (org: Organization) => {
    setSelectedOrganization(org)
    setIsOutletsDrawerOpen(true)
  }

  const handleUsersNavigation = (org: Organization) => {
    setSelectedOrganization(org)
    setIsUsersDrawerOpen(true)
    setIsAddingNewUser(false)
  }

  const handleAddUserGlobal = () => {
    setSelectedOrganization(null)
    setEditingUser(null)
    setIsAddingNewUser(true)
    setIsUsersDrawerOpen(true)
  }

  const handleUserSaved = () => {
    if (activeTab === 'users') {
      setIsUsersDrawerOpen(false)
      setSelectedOrganization(null)
      setEditingUser(null)
      setIsAddingNewUser(false)
    } 
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = 'auto';
  }

  // Sync counts
  React.useEffect(() => {
    if (isLoaded) {
      setOrganizations(prev => prev.map(o => {
        const uCount = users.filter(u => u.organizationId === o.id).length
        const oCount = outlets.filter(out => out.organizationId === o.id).length
        return { ...o, numberOfUsers: uCount, numberOfOutlets: oCount }
      }))
    }
  }, [users.length, outlets.length, isLoaded])

  const renderContent = () => {
    if (!isLoaded) return <div className="flex-1 flex items-center justify-center"><p className="text-sm font-bold text-slate-400 animate-pulse">Initializing Data...</p></div>

    if (activeTab === 'dashboard') return <DashboardOverview />
    
    if (activeTab === 'outlets') return (
      <OutletListView 
        allOutlets={outlets}
        setAllOutlets={setOutlets}
        allOrganizations={organizations}
        allUsers={users}
        onViewUsers={(outlet) => {
          const owner = organizations.find(o => o.id === outlet.organizationId)
          setSelectedOrganization(owner || null)
          setIsUsersDrawerOpen(true)
          setIsAddingNewUser(false)
        }}
      />
    )

    if (activeTab === 'users') return (
      <UserListView 
        allUsers={users}
        setAllUsers={setUsers}
        allOrganizations={organizations}
        allOutlets={outlets}
        onAddUser={handleAddUserGlobal}
        onEditUser={(user) => {
          setEditingUser(user)
          setIsAddingNewUser(false)
          setIsUsersDrawerOpen(true)
        }}
      />
    )

    if (activeTab === 'gateways') return (
      <GatewayManagement 
        allGateways={gateways}
        setAllGateways={setGateways}
      />
    )

    if (activeTab === 'organizations') {
      return (
        <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden bg-[#f8f9fc]">
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Organization Management</h1>
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
                <Button size="sm" className="h-10 px-6 font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> New Organization
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
                {paginatedOrganizations.map((org) => (
                  <OrganizationCard 
                    key={org.id} 
                    organization={org} 
                    viewMode={viewMode} 
                    onEdit={(o) => {
                      setEditingOrganization(o)
                      setIsFormOpen(true)
                    }}
                    onView={handleViewOrganization}
                    onConfigure={handleConfigureOrganization}
                    onDelete={handleDeleteOrganization}
                    onOutletsClick={handleOutletsNavigation}
                    onUsersClick={handleUsersNavigation}
                  />
                ))}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="mt-auto py-6 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  Showing <span className="text-primary">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-primary">{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrganizations.length)}</span> of <span className="text-primary">{filteredOrganizations.length}</span> results
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-8 px-2 border-slate-200" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" className="h-8 px-2 border-slate-200" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <DashboardSidebar activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab)
          setSelectedOrganization(null)
          setEditingUser(null)
          setIsAddingNewUser(false)
        }} />
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <DashboardHeader />
          <div className="flex-1 overflow-hidden flex flex-col">
            {renderContent()}
          </div>
        </main>
      </div>
      <OrganizationForm isOpen={isFormOpen} onClose={() => {setIsFormOpen(false); setEditingOrganization(null)}} organization={editingOrganization} onSubmit={handleAddOrganization} />
      <OrganizationConfiguration isOpen={isConfigOpen} onClose={() => {setIsConfigOpen(false); setConfiguringOrganization(null)}} organization={configuringOrganization} allGateways={gateways} allOutlets={outlets} onSave={handleSaveConfiguration} />
      <OrganizationDetail isOpen={isDetailOpen} onClose={() => {setIsDetailOpen(false); setViewingOrganization(null)}} organization={viewingOrganization} />
      <OutletManagement organization={selectedOrganization} allOutlets={outlets} setAllOutlets={setOutlets} allOrganizations={organizations} allUsers={users} isOpen={isOutletsDrawerOpen} onClose={() => {setIsOutletsDrawerOpen(false); setSelectedOrganization(null)}} onViewUsers={(outlet) => { setIsOutletsDrawerOpen(false); setIsUsersDrawerOpen(true); setIsAddingNewUser(false); }} />
      <UserManagement organization={selectedOrganization} propEditingUser={editingUser} allUsers={users} setAllUsers={setUsers} allOrganizations={organizations} allOutlets={outlets} isOpen={isUsersDrawerOpen} defaultAdding={isAddingNewUser} onClose={() => { setIsUsersDrawerOpen(false); setSelectedOrganization(null); setEditingUser(null); setIsAddingNewUser(false); }} onSaved={handleUserSaved} />
    </SidebarProvider>
  )
}
